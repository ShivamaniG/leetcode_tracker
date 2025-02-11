import React, { useState } from "react";
import { TextField, Button, Typography, Box, Avatar, Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface ProfileApiResponse {
  avatar: string;
  // name: string; // provided but not used
  username: string;
  totalSolved: {
    solved: number;
    total: number;
  };
  breakdown: {
    easy: { solved: number; total: number; };
    medium: { solved: number; total: number; };
    hard: { solved: number; total: number; };
  };
}

interface ProfileProps {
  user: string | null;
  setUser: (user: string | null) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, setUser }) => {
  const [username, setUsername] = useState<string>("");

  const [profileData, setProfileData] = useState<ProfileApiResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate("/"); // Redirect to Auth page
  };

  const fetchData = async () => {
    try {
      if (!username) {
        setErrorMessage("Username is required");
        return;
      }
      // Construct the API URL using the provided username.
      const response = await fetch(`http://localhost:5000/api/profile/${username}`);
      if (!response.ok) {
        // If the user doesn't exist or response is not OK, clear any profile data and show an error.
        setProfileData(null);
        setErrorMessage("User Doesn't Exist");
        return;
      }
      const data: ProfileApiResponse = await response.json();
      setProfileData(data);
      setErrorMessage("");
    } catch (error) {
      console.error("Error fetching data: ", error);
      setProfileData(null);
      setErrorMessage("User Doesn't Exist");
    }
  };
  
  return (
    <Box sx={{ width: "80%", margin: "auto", mt: 4, fontFamily: "Poppins, sans-serif" }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: "center", fontWeight: "bold" }}>
        Welcome, {user || "Guest"}
      </Typography>

      <Card sx={{ p: 3, mb: 3, boxShadow: 3, bgcolor: "#f5f5f5" }}>
        <TextField
          label="LeetCode Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          sx={{ mb: 2, backgroundColor: "white" }}
        />
        <Button variant="contained" fullWidth sx={{ bgcolor: "#1976d2", color: "white", mb: 2 }} onClick={fetchData}>
          Fetch Data
        </Button>
        <Button variant="outlined" fullWidth color="error" onClick={handleLogout}>
          Logout
        </Button>
        {errorMessage && (
          <Typography variant="h6" color="error" sx={{ mt: 2, textAlign: "center" }}>
            {errorMessage}
          </Typography>
        )}
      </Card>

      {profileData && (
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 3, mt: 4 }}>
          {/* Profile Details Card */}
          <Card sx={{ width: "48%", p: 3, boxShadow: 3, bgcolor: "#fff" }}>
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333" }}>
                Profile Details
              </Typography>
              <Box display="flex" justifyContent="center" mt={2}>
                <Avatar
                  src={profileData.avatar || "https://via.placeholder.com/100"}
                  sx={{ width: 120, height: 120 }}
                />
              </Box>
              <Typography
                sx={{
                  mt: 3,
                  fontSize: "1.2rem",
                  textAlign: "center",
                  fontWeight: "bold",
                  color: "#333",
                }}
              >
                {profileData.username}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ width: "48%", p: 3, boxShadow: 3, bgcolor: "#fff" }}>
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333" }}>
                Solved Problems
              </Typography>
              <Typography variant="h6" sx={{ mt: 1 }}>
                Total Solved: {profileData.totalSolved.solved} / {profileData.totalSolved.total}
              </Typography>
              <Box sx={{ mt: 3 }}>
                <Typography sx={{ fontSize: "1.1rem" }}>
                  Easy: {profileData.breakdown.easy.solved} / {profileData.breakdown.easy.total}
                </Typography>
                <Typography sx={{ fontSize: "1.1rem" }}>
                  Medium: {profileData.breakdown.medium.solved} / {profileData.breakdown.medium.total}
                </Typography>
                <Typography sx={{ fontSize: "1.1rem" }}>
                  Hard: {profileData.breakdown.hard.solved} / {profileData.breakdown.hard.total}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default Profile;