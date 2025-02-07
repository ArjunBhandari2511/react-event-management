import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Grid,
  CardContent,
  Typography,
  CardMedia,
  Badge,
} from "@mui/material";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";

const Guest = () => {
  const [events, setEvents] = useState([]);

  // Fetch all public events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/events");
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <Container sx={{ marginTop: "50px" }}>
      {/* Heading */}
      <Typography variant="h4" sx={{ marginBottom: "10px", fontWeight: "bold" }}>
        Public Events
      </Typography>

      {/* Subheading */}
      <Typography variant="body1" sx={{ marginBottom: "20px", color: "text.secondary" }}>
        Please Register / Login to Create Events
      </Typography>

      {/* Events Grid */}
      <Grid container spacing={3}>
        {events.length > 0 ? (
          events.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event._id}>
              <Card sx={{ maxWidth: 345 }}>
                {/* Event Image */}
                <CardMedia
                  component="img"
                  height="140"
                  image={event.imageUrl || "https://via.placeholder.com/345x140"}
                  alt={event.name}
                />
                <CardContent>
                  {/* Event Name */}
                  <Typography variant="h5">{event.name}</Typography>

                  {/* Event Description */}
                  <Typography variant="body2" color="text.secondary">
                    {event.description}
                  </Typography>

                  {/* Event Date & Time */}
                  <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
                    <strong>Date & Time:</strong>{" "}
                    {new Date(event.dateTime).toLocaleString()}
                  </Typography>

                  {/* Event Organizer */}
                  <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
                    <strong>Organizer:</strong> {event.createdBy.name}
                  </Typography>

                  {/* Attendees Count */}
                  <Badge
                    badgeContent={event.attendees?.length || 0}
                    color="primary"
                    sx={{ marginTop: 1 }}
                  >
                    <FontAwesomeIcon icon={faUsers} color="action" />
                  </Badge>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" sx={{ marginLeft: "30px", marginTop: "15px" }}>
            No public events available.
          </Typography>
        )}
      </Grid>
    </Container>
  );
};

export default Guest;