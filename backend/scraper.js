
// scraper.js

require("dotenv").config();
const puppeteer = require("puppeteer");
const { GoogleSearch } = require("google-search-results-nodejs");

const serpapi = new GoogleSearch(process.env.SERPAPI_KEY);

const priceHistory = new Map();

const generateMockPriceHistory = (product, store, currentPriceData) => {
    const history = [];
    const basePrice = parseFloat(currentPriceData.finalPrice.replace("₹", ""));
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const formattedDate = date.toISOString().split('T')[0];
        
        const variation = basePrice * (Math.random() * 0.1 - 0.05);
        const historicalPrice = Math.max(1000, Math.round(basePrice + variation));
        
        history.push({
            date: formattedDate,
            discountedPrice: `₹${historicalPrice}`,
            originalPrice: `₹${historicalPrice}`,
            finalPrice: `₹${historicalPrice}`
        });
    }
    
    const key = `${product}-${store}`;
    priceHistory.set(key, history);
    return history;
};

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
                    let originalPrice = product.previous_price ? `₹${product.previous_price}` : discountedPrice;

                    const discount = product.previous_price
                        ? `${Math.round(((product.previous_price - product.extracted_price) / product.previous_price) * 100)}% off`
                        : "No Discount";

                    resolve({
                        discountedPrice,
                        originalPrice,
                        discount,
                        finalPrice: discountedPrice,
                        productLink: product.link
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

const scrapeWebsite = async (url, selectors) => {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

        await page.waitForTimeout(3000);

        const discountedPrice = await page.$eval(selectors.discountedPrice, el => el.innerText.trim()).catch(() => "N/A");
        let originalPrice = selectors.originalPrice
            ? await page.$eval(selectors.originalPrice, el => el.innerText.trim()).catch(() => discountedPrice)
            : discountedPrice;

        const finalPrice = discountedPrice;

        let productLink;
        if (url.includes("flipkart.com")) {
            productLink = await page.$eval('a._1fQZEK, a.s1Q9rs', el => el.href).catch(() => url);
        } else {
            productLink = await page.$eval('a[href*="/dp/"], a[href*="/product/"], a[href*="/p/"]', el => el.href).catch(() => url);
        }

        await browser.close();
        return { discountedPrice, originalPrice, finalPrice, productLink };
    } catch (error) {
        console.error(`Web Scraper Error for ${url}:`, error.message);
        return { discountedPrice: "Error", originalPrice: "Error", finalPrice: "Error", productLink: url };
    }
};

const getPrices = async (product) => {
    const stores = {
        "Amazon": { 
            url: `https://www.amazon.in/s?k=${encodeURIComponent(product)}`, 
            selectors: { discountedPrice: "span.a-price-whole", originalPrice: "span.a-text-strike" } 
        },
        "Flipkart": { 
            url: `https://www.flipkart.com/search?q=${encodeURIComponent(product)}`, 
            selectors: { discountedPrice: "div._30jeq3", originalPrice: "div._3I9_wc" } 
        },
        "Croma": { 
            url: `https://www.croma.com/search/?q=${encodeURIComponent(product)}`, 
            selectors: { discountedPrice: ".cp-price", originalPrice: ".cp-strike" } 
        },
        "Reliance Digital": { 
            url: `https://www.reliancedigital.in/search?q=${encodeURIComponent(product)}`, 
            selectors: { discountedPrice: ".sp__price", originalPrice: ".Text__strike" } 
        }
    };

    let prices = {};

    for (const store in stores) {
        let currentPrice;
        try {
            console.log(`Fetching ${store} price using SerpAPI...`);
            currentPrice = await fetchPriceWithSerpAPI(`${product} ${store}`);
        } catch (serpError) {
            console.warn(`SerpAPI failed for ${store}. Using web scraper...`);
            currentPrice = await scrapeWebsite(stores[store].url, stores[store].selectors);
        }

        prices[store] = {
            currentPrice: currentPrice,
            priceHistory: generateMockPriceHistory(product, store, currentPrice)
        };
    }

    return prices;
};

module.exports = { getPrices };