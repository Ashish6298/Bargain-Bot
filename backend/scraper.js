require("dotenv").config();
const puppeteer = require("puppeteer");
const { GoogleSearch } = require("google-search-results-nodejs");

const serpapi = new GoogleSearch(process.env.SERPAPI_KEY);

// Function to fetch price using SerpAPI
const fetchPriceWithSerpAPI = async (query) => {
    return new Promise((resolve, reject) => {
        serpapi.json({
            engine: "google_shopping",
            q: query,
            hl: "en",
            gl: "in",
        }, (data) => {
            try {
                const product = data.shopping_results?.[0];
                if (product) {
                    const discountedPrice = product.extracted_price ? `₹${product.extracted_price}` : "N/A";
                    let originalPrice = product.previous_price ? `₹${product.previous_price}` : discountedPrice; // Ensure original price is always set

                    const discount = product.previous_price
                        ? `${Math.round(((product.previous_price - product.extracted_price) / product.previous_price) * 100)}% off`
                        : "No Discount";

                    resolve({
                        discountedPrice,
                        originalPrice,
                        discount,
                        cardDiscount: "N/A",
                        finalPrice: discountedPrice
                    });
                } else {
                    reject("Price not found");
                }
            } catch (error) {
                reject("SerpAPI Error: " + error.message);
            }
        });
    });
};

// Function to fetch real-time prices, including card discounts, using Puppeteer
const scrapeWebsite = async (url, selectors) => {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

        await page.waitForTimeout(3000); // Allow dynamic content to load

        const discountedPrice = await page.$eval(selectors.discountedPrice, el => el.innerText.trim()).catch(() => "N/A");
        let originalPrice = selectors.originalPrice
            ? await page.$eval(selectors.originalPrice, el => el.innerText.trim()).catch(() => discountedPrice) // Ensure original price is set correctly
            : discountedPrice;

        // Extract Card Discounts or Offers
        const cardDiscountText = await page.$eval(selectors.cardDiscount, el => el.innerText.trim()).catch(() => "N/A");

        let cardDiscount = "No Extra Discount";
        let finalPrice = discountedPrice;

        // Extract discount amount if available
        if (cardDiscountText !== "N/A") {
            const discountMatch = cardDiscountText.match(/₹(\d+,?\d+)/);
            if (discountMatch) {
                const discountAmount = parseFloat(discountMatch[1].replace(/,/g, ""));
                const discountedValue = parseFloat(discountedPrice.replace(/[^0-9]/g, ""));

                if (!isNaN(discountAmount) && !isNaN(discountedValue)) {
                    finalPrice = `₹${discountedValue - discountAmount}`;
                    cardDiscount = `Extra ₹${discountAmount} Off`;
                }
            }
        }

        await browser.close();
        return { discountedPrice, originalPrice, cardDiscount, finalPrice };
    } catch (error) {
        console.error(`Web Scraper Error for ${url}:`, error.message);
        return { discountedPrice: "Error", originalPrice: "Error", cardDiscount: "Error", finalPrice: "Error" };
    }
};

// Function to get prices from multiple sources
const getPrices = async (product) => {
    const stores = {
        "Amazon": { 
            url: `https://www.amazon.in/s?k=${encodeURIComponent(product)}`, 
            selectors: { discountedPrice: "span.a-price-whole", originalPrice: "span.a-text-strike", cardDiscount: ".savingsPercentage" } 
        },
        "Flipkart": { 
            url: `https://www.flipkart.com/search?q=${encodeURIComponent(product)}`, 
            selectors: { discountedPrice: "div._30jeq3", originalPrice: "div._3I9_wc", cardDiscount: "._1dPkhG" } 
        },
        "Croma": { 
            url: `https://www.croma.com/search/?q=${encodeURIComponent(product)}`, 
            selectors: { discountedPrice: ".cp-price", originalPrice: ".cp-strike", cardDiscount: ".emi-offer-text" } 
        },
        "Reliance Digital": { 
            url: `https://www.reliancedigital.in/search?q=${encodeURIComponent(product)}`, 
            selectors: { discountedPrice: ".sp__price", originalPrice: ".Text__strike", cardDiscount: ".offer-text" } 
        }
    };

    let prices = {};

    for (const store in stores) {
        try {
            console.log(`Fetching ${store} price using SerpAPI...`);
            prices[store] = await fetchPriceWithSerpAPI(`${product} ${store}`);
        } catch (serpError) {
            console.warn(`SerpAPI failed for ${store}. Using web scraper...`);
            prices[store] = await scrapeWebsite(stores[store].url, stores[store].selectors);
        }
    }

    return prices;
};

module.exports = { getPrices };

