// app.js

import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Box,
  useMediaQuery,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Link,
} from "@mui/material";
import { GitHub, LinkedIn, Info, History } from "@mui/icons-material";

const App = () => {
  const [query, setQuery] = useState("");
  const [prices, setPrices] = useState(null);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [selectedStoreHistory, setSelectedStoreHistory] = useState(null);
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setPrices(null);

    try {
      const response = await axios.get(
        `https://bargain-bot.onrender.com// Add a loading indicator for the price history dialog
<Dialog
  open={historyDialogOpen}
  onClose={handleHistoryClose}
  maxWidth="md"
  fullWidth
>
  <DialogTitle sx={{ bgcolor: "#1976D2", color: "#fff" }}>
    Price History
  </DialogTitle>
  <DialogContent>
    {selectedStoreHistory ? (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Discounted Price</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Original Price</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Final Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {selectedStoreHistory.map((entry, index) => (
            <TableRow key={index}>
              <TableCell>{entry.date}</TableCell>
              <TableCell>{entry.discountedPrice}</TableCell>
              <TableCell>{entry.originalPrice}</TableCell>
              <TableCell>{entry.finalPrice}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    ) : (
      <CircularProgress />
    )}
  </DialogContent>
</Dialog>

// Add a loading state for the price history dialog
const [historyLoading, setHistoryLoading] = useState(false);

// Update the handleHistoryOpen function to set the loading state
const handleHistoryOpen = (store) => {
  setHistoryLoading(true);
  setSelectedStoreHistory(prices[store].priceHistory);
  setHistoryDialogOpen(true);
  setTimeout(() => {
    setHistoryLoading(false);
  }, 1000);
};

// Update the handleHistoryClose function to reset the loading state
const handleHistoryClose = () => {
  setHistoryDialogOpen(false);
  setSelectedStoreHistory(null);
  setHistoryLoading(false);
};/api/compare?query=${query}`
      );
      setPrices(response.data.prices);
    } catch (error) {
      console.error("Error fetching prices:", error);
    }
    setLoading(false);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleHistoryOpen = (store) => {
    setSelectedStoreHistory(prices[store].priceHistory);
    setHistoryDialogOpen(true);
  };

  const handleHistoryClose = () => {
    setHistoryDialogOpen(false);
    setSelectedStoreHistory(null);
  };

  const getLowestPriceStore = () => {
    if (!prices) return null;
    const stores = Object.keys(prices);
    return stores.reduce((minStore, store) => {
      const currentPrice = parseFloat(prices[store].currentPrice.finalPrice.replace("₹", ""));
      const minPrice = parseFloat(prices[minStore].currentPrice.finalPrice.replace("₹", ""));
      return currentPrice < minPrice ? store : minStore;
    }, stores[0]);
  };

  const lowestPriceStore = prices ? getLowestPriceStore() : null;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 3,
        background: "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)",
      }}
    >
      <IconButton
        sx={{ position: "absolute", top: 10, right: 10 }}
        onClick={handleMenuOpen}
      >
        <Info fontSize="large" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom", // Expand downward
          horizontal: "center", // Anchor to center of the icon
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center", // Open centered below the icon
        }}
        sx={{
          "& .MuiPaper-root": {
            width: "60px",
            bgcolor: "rgba(255, 255, 255, 0.9)",
            borderRadius: "8px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 0,
            zIndex: 1301, // Higher than default (1300) to stay above content
          },
          "& .MuiMenu-list": {
            padding: 0,
          },
        }}
        disableScrollLock // Prevents body scroll locking, which can help with responsiveness
      >
        <MenuItem sx={{ justifyContent: "center", padding: "8px 0", minHeight: "auto" }}>
          <Avatar
            src="/assets/ashish.jpg"
            sx={{ width: 40, height: 40 }}
          />
        </MenuItem>
        <MenuItem
          component="a"
          href="https://github.com/ashish6298"
          target="_blank"
          sx={{ justifyContent: "center", padding: "8px 0", minHeight: "auto" }}
        >
          <GitHub />
        </MenuItem>
        <MenuItem
          component="a"
          href="https://www.linkedin.com/in/ashish-goswami-58797a24a/"
          target="_blank"
          sx={{ justifyContent: "center", padding: "8px 0", minHeight: "auto" }}
        >
          <LinkedIn />
        </MenuItem>
      </Menu>

      <Container
        maxWidth="lg"
        sx={{
          bgcolor: "rgba(255, 255, 255, 0.15)",
          borderRadius: 2,
          padding: 3,
          backdropFilter: "blur(20px)",
          boxShadow: "0px 4px 20px rgba(0,0,0,0.2)",
          position: "relative", // Ensure container doesn’t overlap menu
          zIndex: 1300, // Below menu’s z-index
        }}
      >
        <Typography
          variant={isSmallScreen ? "h5" : "h4"}
          align="center"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "#000",
            textShadow: "0 0 10px rgba(0,0,0,0.3)",
            fontFamily: "'Poppins', sans-serif",
            letterSpacing: "1px",
          }}
        >
          🤖 Bargain Bot !
        </Typography>

        <Box display="flex" flexDirection="column" alignItems="center">
          <TextField
            fullWidth
            label="Search for the Best Price"
            variant="outlined"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{
              mb: 2,
              maxWidth: "600px",
              bgcolor: "rgba(255, 255, 255, 0.7)",
              borderRadius: 2,
              "& input": {
                color: "#000",
                fontFamily: "'Poppins', sans-serif",
                fontWeight: "500",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "rgba(0, 0, 0, 0.4)" },
                "&:hover fieldset": { borderColor: "#2196F3" },
                "&.Mui-focused fieldset": { borderColor: "#1976D2" },
              },
            }}
            InputLabelProps={{
              style: {
                color: "#333",
                fontFamily: "'Poppins', sans-serif",
                fontWeight: "500",
              },
            }}
          />

          <Button
            variant="contained"
            fullWidth
            onClick={handleSearch}
            disabled={loading}
            sx={{
              maxWidth: "600px",
              height: "50px",
              fontSize: "1.1rem",
              fontWeight: "bold",
              fontFamily: "'Poppins', sans-serif",
              bgcolor: "#2196F3",
              color: "#fff",
              borderRadius: 2,
              textTransform: "uppercase",
              transition: "all 0.3s ease-in-out",
              boxShadow: "0px 4px 15px rgba(33, 150, 243, 0.4)",
              "&:hover": {
                bgcolor: "#1976D2",
                transform: "scale(1.05)",
                boxShadow: "0px 6px 20px rgba(25, 118, 210, 0.6)",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "COMPARE PRICES"
            )}
          </Button>
        </Box>

        {loading && (
          <Typography
            align="center"
            sx={{
              color: "black",
              fontSize: "1.2rem",
              mt: 2,
            }}
          >
            🔍 We are searching for the best deals for you...!
          </Typography>
        )}
        {prices && (
          <Grid
            container
            spacing={2}
            sx={{
              mt: 3,
              maxWidth: "100%",
              mx: "auto",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {Object.keys(prices).map((store) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={store}>
                <Card
                  sx={{
                    bgcolor: store === lowestPriceStore ? "rgba(0, 255, 0, 0.1)" : "rgba(255, 255, 255, 0.9)",
                    border: store === lowestPriceStore ? "2px solid #4CAF50" : "none",
                    borderRadius: 3,
                    padding: 2,
                    transition: "all 0.3s ease-in-out",
                    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.4)",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0px 12px 30px rgba(0, 0, 0, 0.6)",
                    },
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#D32F2F",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      {store}
                    </Typography>

                    <Grid container spacing={1} sx={{ mt: 1 }}>
                      <Grid
                        item
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: "bold", color: "#333" }}
                        >
                          Discounted Price:
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: "bold", color: "#D32F2F" }}
                        >
                          {prices[store].currentPrice.discountedPrice}
                        </Typography>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: "bold", color: "#333" }}
                        >
                          Original Price:
                        </Typography>
                        <Typography variant="body1">
                          {prices[store].currentPrice.originalPrice}
                        </Typography>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: "bold", color: "#333" }}
                        >
                          Discount:
                        </Typography>
                        <Typography variant="body1">
                          {prices[store].currentPrice.discount}
                        </Typography>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          mt: 1,
                          p: 1,
                          bgcolor: "rgba(0, 200, 0, 0.3)",
                          borderRadius: 1,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: "bold", color: "#2E7D32" }}
                        >
                          Final Price:
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: "bold", color: "green" }}
                        >
                          {prices[store].currentPrice.finalPrice}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sx={{ textAlign: "center", mt: 2 }}>
                        <Link
                          href={prices[store].currentPrice.productLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            fontFamily: "'Poppins', sans-serif",
                            color: "#1976D2",
                            textDecoration: "none",
                            fontWeight: "bold",
                            "&:hover": {
                              color: "#D32F2F",
                              textDecoration: "underline",
                            },
                          }}
                        >
                          Visit Product Page
                        </Link>
                      </Grid>

                      <Grid item xs={12} sx={{ textAlign: "center", mt: 2 }}>
                        <Button
                          variant="outlined"
                          startIcon={<History />}
                          onClick={() => handleHistoryOpen(store)}
                          sx={{
                            fontFamily: "'Poppins', sans-serif",
                            color: "#1976D2",
                            borderColor: "#1976D2",
                            "&:hover": {
                              bgcolor: "#1976D2",
                              color: "#fff",
                              borderColor: "#1976D2",
                            },
                          }}
                        >
                          Price History
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Dialog
          open={historyDialogOpen}
          onClose={handleHistoryClose}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ bgcolor: "#1976D2", color: "#fff" }}>
            Price History
          </DialogTitle>
          <DialogContent>
            {selectedStoreHistory && (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Discounted Price</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Original Price</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Final Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedStoreHistory.map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell>{entry.date}</TableCell>
                      <TableCell>{entry.discountedPrice}</TableCell>
                      <TableCell>{entry.originalPrice}</TableCell>
                      <TableCell>{entry.finalPrice}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
};

export default App;









