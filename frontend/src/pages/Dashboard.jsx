import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Grid,
  CardContent,
  Typography,
  CardMedia,
  Button,
  Modal,
  Box,
  TextField,
  Badge,
} from "@mui/material";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faPencilAlt, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const Dashboard = () => {
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState(null);
  const [myEvents, setMyEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [eventDetails, setEventDetails] = useState({
    name: "",
    description: "",
    image: null,
  });
  const [deleteEventId, setDeleteEventId] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUserName(storedUser.name);
      setUserId(storedUser._id);
    }

    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:5000/api/events/my", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setMyEvents(response.data))
        .catch((error) => console.error("Error fetching my events:", error));

      axios
        .get("http://localhost:5000/api/events")
        .then((response) => setEvents(response.data))
        .catch((error) => console.error("Error fetching events:", error));
    }
  }, []);

  const handleOpenUpdate = (event) => {
    setCurrentEvent(event);
    setEventDetails({ name: event.name, description: event.description, image: null });
    setOpen(true);
  };

  const handleCloseUpdate = () => {
    setOpen(false);
    setEventDetails({ name: "", description: "", image: null });
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("name", eventDetails.name);
    formData.append("description", eventDetails.description);
    if (eventDetails.image) {
      formData.append("image", eventDetails.image);
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/events/${currentEvent._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setMyEvents((prev) =>
          prev.map((event) =>
            event._id === currentEvent._id ? response.data.event : event
          )
        );
        setEvents((prev) =>
          prev.map((event) =>
            event._id === currentEvent._id ? response.data.event : event
          )
        );
        handleCloseUpdate();
      }
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Failed to update event");
    }
  };

  const handleOpenDelete = (eventId) => {
    setDeleteEventId(eventId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/events/${deleteEventId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setMyEvents((prev) => prev.filter((event) => event._id !== deleteEventId));
        setEvents((prev) => prev.filter((event) => event._id !== deleteEventId));
        setDeleteModalOpen(false);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event");
    }
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setDeleteEventId(null);
  };

  const handleJoinEvent = async (eventId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `http://localhost:5000/api/events/${eventId}/join`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        alert("You have successfully joined the event!");
        const updatedEvents = await axios.get("http://localhost:5000/api/events");
        setEvents(updatedEvents.data);
      }
    } catch (error) {
      console.error("Error joining event:", error);
      alert(error.response?.data?.message || "Failed to join event");
    }
  };

  return (
    <Container sx={{ marginTop: "50px" }}>
      <Typography variant="h4" sx={{ marginBottom: "20px", fontWeight: "bold" }}>
        Welcome, {userName} 👋
      </Typography>

      <Typography variant="h5" sx={{ marginBottom: "10px" }}>
        Your Events
      </Typography>
      <Grid container spacing={3} sx={{ marginBottom: "30px" }}>
        {myEvents.length > 0 ? (
          myEvents.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event._id}>
              <Card sx={{ maxWidth: 345 }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={event.imageUrl || "https://via.placeholder.com/345x140"}
                  alt={event.name}
                />
                <CardContent>
                  <Typography variant="h5">{event.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {event.description}
                  </Typography>
                  <Badge badgeContent={event.attendees?.length || 0} color="primary" sx={{ marginTop: 1 }}>
                    <FontAwesomeIcon icon={faUsers} color="action" />
                  </Badge>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ marginTop: "15px" }}
                    onClick={() => handleOpenUpdate(event)}
                    startIcon={<FontAwesomeIcon icon={faPencilAlt} />}
                  >
                    Update Event
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    sx={{ marginTop: "10px" }}
                    onClick={() => handleOpenDelete(event._id)}
                    startIcon={<FontAwesomeIcon icon={faTrashAlt} />}
                  >
                    Delete Event
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" sx={{ marginLeft: "30px", marginTop: "15px" }}>
            No events created by you yet.
          </Typography>
        )}
      </Grid>

      <Typography variant="h5" sx={{ marginBottom: "10px" }}>
        All Events
      </Typography>
      <Grid container spacing={3} sx={{ marginBottom: "30px" }}>
        {events.length > 0 ? (
          events.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event._id}>
              <Card sx={{ maxWidth: 345 }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={event.imageUrl || "https://via.placeholder.com/345x140"}
                  alt={event.name}
                />
                <CardContent>
                  <Typography variant="h5">{event.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {event.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Date & Time:</strong> {new Date(event.dateTime).toLocaleString()}
                  </Typography>
                  <Badge badgeContent={event.attendees?.length || 0} color="primary" sx={{ marginTop: 1 }}>
                    <FontAwesomeIcon icon={faUsers} color="action" />
                  </Badge>
                  {event.createdBy._id !== userId && (
                    <Button
                      variant="contained"
                      color="secondary"
                      fullWidth
                      sx={{ marginTop: "15px" }}
                      onClick={() => handleJoinEvent(event._id)}
                      disabled={event.attendees?.includes(userId)}
                    >
                      {event.attendees?.includes(userId) ? "Already Joined" : "Join Event"}
                    </Button>
                  )}
                  {event.createdBy._id === userId && (
                    <>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ marginTop: "15px" }}
                        onClick={() => handleOpenUpdate(event)}
                        startIcon={<FontAwesomeIcon icon={faPencilAlt} />}
                      >
                        Update Event
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        fullWidth
                        sx={{ marginTop: "10px" }}
                        onClick={() => handleOpenDelete(event._id)}
                        startIcon={<FontAwesomeIcon icon={faTrashAlt} />}
                      >
                        Delete Event
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" sx={{ marginLeft: "30px", marginTop: "15px" }}>
            No events available yet.
          </Typography>
        )}
      </Grid>

      <Modal open={open} onClose={handleCloseUpdate}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            borderRadius: "8px",
            boxShadow: 24,
            p: 4,
            width: 400,
          }}
        >
          <Typography variant="h6">Update Event</Typography>
          <TextField
            fullWidth
            label="Event Name"
            variant="outlined"
            value={eventDetails.name}
            onChange={(e) => setEventDetails({ ...eventDetails, name: e.target.value })}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            fullWidth
            label="Event Description"
            variant="outlined"
            multiline
            rows={4}
            value={eventDetails.description}
            onChange={(e) => setEventDetails({ ...eventDetails, description: e.target.value })}
            sx={{ marginBottom: 2 }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setEventDetails({ ...eventDetails, image: e.target.files[0] })}
            style={{ marginBottom: "16px" }}
          />
          <Button variant="contained" color="primary" fullWidth onClick={handleUpdate}>
            Save Changes
          </Button>
        </Box>
      </Modal>

      <Modal open={deleteModalOpen} onClose={handleCloseDeleteModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            borderRadius: "8px",
            boxShadow: 24,
            p: 4,
            width: 400,
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: "10px" }}>
            Are you sure you want to delete this event?
          </Typography>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteConfirm}
            fullWidth
            sx={{ marginBottom: "10px" }}
          >
            Yes, Delete
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleCloseDeleteModal}
            fullWidth
          >
            Cancel
          </Button>
        </Box>
      </Modal>
    </Container>
  );
};

export default Dashboard;