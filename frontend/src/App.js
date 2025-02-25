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
} from "@mui/material";
import { GitHub, LinkedIn, Info } from "@mui/icons-material";

const App = () => {
  const [query, setQuery] = useState("");
  const [prices, setPrices] = useState(null);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setPrices(null);

    try {
      const response = await axios.get(
        `http://localhost:5000/api/compare?query=${query}`
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

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 3,
        background: "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)", // Light Indigo Gradient
      }}
    >
      {/* About Button */}
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
        sx={{ mt: 1 }}
      >
        <MenuItem>
          <Avatar
            src="/assets/ashish.jpg" // Replace with your image URL
            sx={{ width: 60, height: 60, margin: "auto" }}
          />
        </MenuItem>
        <MenuItem
          component="a"
          href="https://github.com/ashish6298"
          target="_blank"
        >
          <GitHub sx={{ marginRight: 1 }} /> GitHub
        </MenuItem>
        <MenuItem
          component="a"
          href="https://www.linkedin.com/in/ashish-goswami-58797a24a/"
          target="_blank"
        >
          <LinkedIn sx={{ marginRight: 1 }} /> LinkedIn
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
        }}
      >
        <Typography
          variant={isSmallScreen ? "h5" : "h4"}
          align="center"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "#000", // Black text color
            textShadow: "0 0 10px rgba(0,0,0,0.3)", // Subtle shadow for depth
            fontFamily: "'Poppins', sans-serif", // Stylish font
            letterSpacing: "1px", // Slight spacing for a modern look
          }}
        >
          🤖 Bargain Bot !
        </Typography>

        <Box display="flex" flexDirection="column" alignItems="center">
          {/* Search Input Field */}
          <TextField
            fullWidth
            label="Search for the Best Price"
            variant="outlined"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{
              mb: 2,
              maxWidth: "600px",
              bgcolor: "rgba(255, 255, 255, 0.7)", // Lighter background for better contrast
              borderRadius: 2, // More rounded corners
              "& input": {
                color: "#000", // Black text for better readability
                fontFamily: "'Poppins', sans-serif", // Stylish font
                fontWeight: "500",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "rgba(0, 0, 0, 0.4)", // Subtle black border
                },
                "&:hover fieldset": { borderColor: "#2196F3" }, // Light blue hover effect
                "&.Mui-focused fieldset": { borderColor: "#1976D2" }, // Darker blue when focused
              },
            }}
            InputLabelProps={{
              style: {
                color: "#333",
                fontFamily: "'Poppins', sans-serif",
                fontWeight: "500",
              }, // Stylish black label
            }}
          />

          {/* Search Button */}
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
              bgcolor: "#2196F3", // Light Sky Blue Button
              color: "#fff", // White text
              borderRadius: 2,
              textTransform: "uppercase",
              transition: "all 0.3s ease-in-out",
              boxShadow: "0px 4px 15px rgba(33, 150, 243, 0.4)", // Soft blue glow
              "&:hover": {
                bgcolor: "#1976D2", // Darker blue on hover
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
                // fontStyle: "italic",
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
                    bgcolor: "rgba(255, 255, 255, 0.9)", // More solid background for better visibility
                    borderRadius: 3,
                    padding: 2,
                    transition: "all 0.3s ease-in-out",
                    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.4)", // Darker shadow for depth
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0px 12px 30px rgba(0, 0, 0, 0.6)", // Stronger hover effect
                    },
                  }}
                >
                  <CardContent>
                    {/* Store Name */}
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

                    {/* Price Details with Improved Visibility */}
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
                          {prices[store].discountedPrice}
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
                          {prices[store].originalPrice}
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
                          {prices[store].discount}
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
                          Card Discount:
                        </Typography>
                        <Typography variant="body1">
                          {prices[store].cardDiscount}
                        </Typography>
                      </Grid>

                      {/* Final Price Section */}
                      <Grid
                        item
                        xs={12}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          mt: 1,
                          p: 1,
                          bgcolor: "rgba(0, 200, 0, 0.3)", // More visible green background
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
                          {prices[store].finalPrice}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default App;
