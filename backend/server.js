require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { getPrices } = require("./scraper");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

// **API Endpoint to Get Price Comparison**
app.get("/api/compare", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: "Query is required" });

    const prices = await getPrices(query);

    res.json({
      product: query,
      prices,
    });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// **Start Server**
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
