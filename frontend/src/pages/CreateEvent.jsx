import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import socket from "../../socket.js";

const CreateEvent = () => {
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({
    name: "",
    description: "",
    date: "",
    time: "",
    image: null,
  });

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setEventData({ ...eventData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = sessionStorage.getItem("token"); // Get auth token
      if (!token) {
        alert("Unauthorized! Please login.");
        navigate("/login");
        return;
      }

      const formData = new FormData();
      formData.append("name", eventData.name);
      formData.append("description", eventData.description);
      formData.append("dateTime", `${eventData.date} ${eventData.time}`);
      if (eventData.image) {
        formData.append("image", eventData.image);
      }

      const response = await axios.post("http://localhost:5000/api/events", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        alert("Event Created Successfully!");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event");
    }
  };

  return (
    <Container sx={{ maxWidth: "500px", marginTop: "50px" }}>
      <Typography variant="h4" sx={{ marginBottom: "20px" }}>
        Create Event
      </Typography>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <TextField
          fullWidth
          label="Event Name"
          name="name"
          variant="outlined"
          value={eventData.name}
          onChange={handleChange}
          sx={{ marginBottom: "15px" }}
          required
        />
        <TextField
          fullWidth
          label="Event Description"
          name="description"
          variant="outlined"
          multiline
          rows={3}
          value={eventData.description}
          onChange={handleChange}
          sx={{ marginBottom: "15px" }}
          required
        />
        <TextField
          fullWidth
          type="date"
          name="date"
          variant="outlined"
          value={eventData.date}
          onChange={handleChange}
          sx={{ marginBottom: "15px" }}
          required
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          fullWidth
          type="time"
          name="time"
          variant="outlined"
          value={eventData.time}
          onChange={handleChange}
          sx={{ marginBottom: "15px" }}
          required
          InputLabelProps={{ shrink: true }}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ marginBottom: "15px" }}
        />
        <Box textAlign="center">
          <Button variant="contained" color="primary" type="submit">
            Create Event
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default CreateEvent;
