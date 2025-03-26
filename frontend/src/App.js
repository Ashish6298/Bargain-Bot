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
        `https://bargain-bot.onrender.com/api/compare?query=${query}`
      );
      setPrices(response.data.prices);
    } catch (error) {
      console.error("Error fetching prices:", error);
    }
    setLoading(false);
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
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
        background: "linear-gradient(135deg, #0A0E1A 0%, #1E2A47 100%)", // Deep cyberpunk gradient
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Simplified Background Effect */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "radial-gradient(circle, rgba(0, 255, 255, 0.15) 0%, rgba(0, 0, 0, 0) 70%)",
          animation: "fadePulse 6s infinite ease-in-out",
          zIndex: 0,
        }}
      />

      <IconButton
        sx={{
          position: "absolute",
          top: 20,
          right: 20,
          color: "#00FFFF",
          filter: "drop-shadow(0 0 10px #00FFFF)",
          "&:hover": { color: "#FF00FF", transform: "scale(1.1)", transition: "all 0.3s" },
        }}
        onClick={handleMenuOpen}
      >
        <Info fontSize="large" />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{
          "& .MuiPaper-root": {
            width: "80px",
            bgcolor: "rgba(10, 14, 26, 0.9)",
            borderRadius: "15px",
            border: "2px solid #00FFFF",
            boxShadow: "0 0 25px rgba(0, 255, 255, 0.7)",
            padding: 0,
            zIndex: 1301,
            animation: "slideIn 0.5s ease",
          },
          "& .MuiMenuItem-root": {
            justifyContent: "center",
            color: "#00FFFF",
            "&:hover": { bgcolor: "#FF00FF", color: "#fff" },
          },
        }}
      >
        <MenuItem>
          <Avatar
            src="/assets/ashish.jpg"
            sx={{ width: 50, height: 50, border: "2px solid #00FFFF", filter: "drop-shadow(0 0 5px #00FFFF)" }}
          />
        </MenuItem>
        <MenuItem component="a" href="https://github.com/ashish6298" target="_blank">
          <GitHub />
        </MenuItem>
        <MenuItem component="a" href="https://www.linkedin.com/in/ashish-goswami-58797a24a/" target="_blank">
          <LinkedIn />
        </MenuItem>
      </Menu>

      <Container
        maxWidth="lg"
        sx={{
          bgcolor: "rgba(10, 14, 26, 0.7)",
          borderRadius: "25px",
          padding: 4,
          backdropFilter: "blur(20px)",
          border: "2px solid rgba(0, 255, 255, 0.5)",
          boxShadow: "0 0 40px rgba(0, 255, 255, 0.4)",
          zIndex: 1300,
        }}
      >
        <Typography
          variant={isSmallScreen ? "h5" : "h4"}
          align="center"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "#00FFFF",
            textShadow: "0 0 20px rgba(0, 255, 255, 0.8)",
            fontFamily: "'Exo 2', sans-serif",
            letterSpacing: "3px",
            animation: "glowFade 3s infinite",
          }}
        >
          🤖 BARGAIN BOT
        </Typography>

        <Box display="flex" flexDirection="column" alignItems="center">
          <TextField
            fullWidth
            label="Search for Cosmic Deals"
            variant="outlined"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{
              mb: 3,
              maxWidth: "600px",
              bgcolor: "rgba(0, 255, 255, 0.05)",
              borderRadius: "15px",
              "& input": { color: "#fff", fontFamily: "'Exo 2', sans-serif" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#00FFFF", borderWidth: "2px" },
                "&:hover fieldset": { borderColor: "#FF00FF", boxShadow: "0 0 15px #FF00FF" },
                "&.Mui-focused fieldset": { borderColor: "#00FFFF", boxShadow: "0 0 20px #00FFFF" },
              },
            }}
            InputLabelProps={{
              style: { color: "#00FFFF", fontFamily: "'Exo 2', sans-serif", textShadow: "0 0 5px #00FFFF" },
            }}
          />

          <Button
            variant="contained"
            fullWidth
            onClick={handleSearch}
            disabled={loading}
            sx={{
              maxWidth: "600px",
              height: "55px",
              fontSize: "1.3rem",
              fontWeight: "bold",
              fontFamily: "'Exo 2', sans-serif",
              background: "linear-gradient(45deg, #00FFFF, #FF00FF, #00FFAA)",
              color: "#fff",
              borderRadius: "15px",
              textTransform: "uppercase",
              boxShadow: "0 0 30px rgba(0, 255, 255, 0.7)",
              "&:hover": {
                background: "linear-gradient(45deg, #FF00FF, #00FFFF, #FF00AA)",
                transform: "scale(1.05)",
                boxShadow: "0 0 40px rgba(255, 0, 255, 0.9)",
                transition: "all 0.3s",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "#FF00FF" }} />
            ) : (
              "LAUNCH SEARCH"
            )}
          </Button>
        </Box>

        {loading && (
          <Typography
            align="center"
            sx={{
              color: "#00FFFF",
              fontSize: "1.3rem",
              mt: 2,
              textShadow: "0 0 15px rgba(0, 255, 255, 0.7)",
              fontFamily: "'Exo 2', sans-serif",
              animation: "fadeInOut 2s infinite",
            }}
          >
            🔍 SCANNING THE GRID...
          </Typography>
        )}

        {prices && (
          <Grid container spacing={3} sx={{ mt: 4, justifyContent: "center" }}>
            {Object.keys(prices).map((store) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={store}>
                <Card
                  sx={{
                    bgcolor: store === lowestPriceStore ? "rgba(0, 255, 170, 0.1)" : "rgba(10, 14, 26, 0.8)",
                    border: store === lowestPriceStore ? "3px solid #00FFAA" : "2px solid #00FFFF",
                    borderRadius: "20px",
                    padding: 2,
                    boxShadow: store === lowestPriceStore
                      ? "0 0 30px rgba(0, 255, 170, 0.7)"
                      : "0 0 30px rgba(0, 255, 255, 0.5)",
                    transition: "all 0.4s",
                    animation: store === lowestPriceStore ? "glowPulse 1s infinite" : "none",
                    "&:hover": {
                      transform: "translateY(-10px)",
                      boxShadow: store === lowestPriceStore
                        ? "0 0 50px rgba(0, 255, 170, 0.9)"
                        : "0 0 50px rgba(0, 255, 255, 0.8)",
                    },
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#FF00FF",
                        fontWeight: "bold",
                        textAlign: "center",
                        fontFamily: "'Exo 2', sans-serif",
                        textShadow: "0 0 15px rgba(255, 0, 255, 0.7)",
                      }}
                    >
                      {store}
                    </Typography>

                    <Grid container spacing={1} sx={{ mt: 1 }}>
                      <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography sx={{ fontWeight: "bold", color: "#fff" }}>Discounted:</Typography>
                        <Typography sx={{ fontWeight: "bold", color: "#00FFFF" }}>
                          {prices[store].currentPrice.discountedPrice}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography sx={{ fontWeight: "bold", color: "#fff" }}>Original:</Typography>
                        <Typography sx={{ color: "#fff" }}>{prices[store].currentPrice.originalPrice}</Typography>
                      </Grid>
                      <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography sx={{ fontWeight: "bold", color: "#fff" }}>Discount:</Typography>
                        <Typography sx={{ color: "#fff" }}>{prices[store].currentPrice.discount}</Typography>
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
                          bgcolor: "rgba(0, 255, 170, 0.2)",
                          borderRadius: "10px",
                          boxShadow: "0 0 10px rgba(0, 255, 170, 0.5)",
                        }}
                      >
                        <Typography sx={{ fontWeight: "bold", color: "#fff" }}>Final Price:</Typography>
                        <Typography sx={{ fontWeight: "bold", color: "#00FFAA" }}>
                          {prices[store].currentPrice.finalPrice}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sx={{ textAlign: "center", mt: 2 }}>
                        <Link
                          href={prices[store].currentPrice.productLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            color: "#00FFFF",
                            textDecoration: "none",
                            fontWeight: "bold",
                            fontFamily: "'Exo 2', sans-serif",
                            "&:hover": { color: "#FF00FF", textShadow: "0 0 10px #FF00FF" },
                          }}
                        >
                          ACCESS PORTAL
                        </Link>
                      </Grid>
                      <Grid item xs={12} sx={{ textAlign: "center", mt: 2 }}>
                        <Button
                          variant="outlined"
                          startIcon={<History />}
                          onClick={() => handleHistoryOpen(store)}
                          sx={{
                            color: "#00FFFF",
                            borderColor: "#00FFFF",
                            fontFamily: "'Exo 2', sans-serif",
                            "&:hover": {
                              bgcolor: "#00FFFF",
                              color: "#0A0E1A",
                              borderColor: "#00FFFF",
                              boxShadow: "0 0 15px #00FFFF",
                            },
                          }}
                        >
                          TIME DATA
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
          sx={{
            "& .MuiDialog-paper": {
              bgcolor: "rgba(10, 14, 26, 0.9)",
              border: "2px solid #00FFFF",
              boxShadow: "0 0 40px rgba(0, 255, 255, 0.6)",
              borderRadius: "20px",
              animation: "slideUp 0.6s ease",
            },
          }}
        >
          <DialogTitle
            sx={{
              bgcolor: "linear-gradient(45deg, #00FFFF, #FF00FF)",
              color: "#fff",
              fontFamily: "'Exo 2', sans-serif",
              textShadow: "0 0 15px rgba(0, 255, 255, 0.7)",
            }}
          >
            TIME ARCHIVES
          </DialogTitle>
          <DialogContent>
            {selectedStoreHistory && (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", color: "#00FFFF", textShadow: "0 0 5px #00FFFF" }}>
                      Date
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#00FFFF", textShadow: "0 0 5px #00FFFF" }}>
                      Discounted
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#00FFFF", textShadow: "0 0 5px #00FFFF" }}>
                      Original
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#00FFFF", textShadow: "0 0 5px #00FFFF" }}>
                      Final
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedStoreHistory.map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ color: "#fff" }}>{entry.date}</TableCell>
                      <TableCell sx={{ color: "#fff" }}>{entry.discountedPrice}</TableCell>
                      <TableCell sx={{ color: "#fff" }}>{entry.originalPrice}</TableCell>
                      <TableCell sx={{ color: "#00FFAA", textShadow: "0 0 5px #00FFAA" }}>
                        {entry.finalPrice}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </DialogContent>
        </Dialog>
      </Container>

      {/* Updated Animations */}
      <style>
        {`
          @keyframes fadePulse {
            0% { opacity: 0.15; transform: scale(1); }
            50% { opacity: 0.3; transform: scale(1.1); }
            100% { opacity: 0.15; transform: scale(1); }
          }
          @keyframes glowFade {
            0% { text-shadow: 0 0 20px rgba(0, 255, 255, 0.8); }
            50% { text-shadow: 0 0 30px rgba(0, 255, 255, 1); }
            100% { text-shadow: 0 0 20px rgba(0, 255, 255, 0.8); }
          }
          @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(5px); }
            50% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-5px); }
          }
          @keyframes slideIn {
            0% { transform: translateY(-20px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
          @keyframes slideUp {
            0% { transform: translateY(50px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
          @keyframes glowPulse {
            0% { box-shadow: 0 0 30px rgba(0, 255, 170, 0.7); }
            50% { box-shadow: 0 0 50px rgba(0, 255, 170, 1); }
            100% { box-shadow: 0 0 30px rgba(0, 255, 170, 0.7); }
          }
        `}
      </style>
    </Box>
  );
};

export default App;