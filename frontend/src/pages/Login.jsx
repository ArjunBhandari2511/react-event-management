import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Alert,
  InputAdornment,
  useMediaQuery,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";

const Login = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 600px)"); // Responsive breakpoint

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", formData);

      if (response.status === 200) {
        const { token, user } = response.data;
        sessionStorage.setItem("token", token); // Save token in sessionStorage
        sessionStorage.setItem("user", JSON.stringify(user));
        setIsAuthenticated(true);
        setSuccess(true);
        setTimeout(() => navigate("/dashboard"), 1500); // Redirect after success
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <Container
      sx={{
        maxWidth: isMobile ? "100%" : "400px",
        marginTop: "50px",
        padding: isMobile ? "20px" : "30px",
        boxShadow: isMobile ? "none" : "0px 4px 10px rgba(0,0,0,0.1)",
        borderRadius: "10px",
      }}
    >
      <Typography variant="h4" sx={{ marginBottom: "20px", textAlign: "center" }}>
        Login
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">Login successful! Redirecting...</Alert>}

      <form onSubmit={handleSubmit}>
        {/* Email Field */}
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          variant="outlined"
          value={formData.email}
          onChange={handleInputChange}
          sx={{ marginBottom: "15px" }}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FontAwesomeIcon icon={faEnvelope} />
              </InputAdornment>
            ),
          }}
        />

        {/* Password Field */}
        <TextField
          fullWidth
          label="Password"
          name="password"
          variant="outlined"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          sx={{ marginBottom: "15px" }}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FontAwesomeIcon icon={faLock} />
              </InputAdornment>
            ),
          }}
        />

        {/* Login Button */}
        <Box textAlign="center">
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            sx={{ padding: "10px", fontSize: "16px" }}
          >
            Login
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default Login;
