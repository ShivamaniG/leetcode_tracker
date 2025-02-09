import React, { useState } from "react";
import { TextField, Button, Typography, Box, Avatar, Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface ProfileProps {
  user: string | null;
  setUser: (user: string | null) => void; 
}

interface ProfileData {
  name: string;
  birthday: string;
  avatar: string;
}

interface SolvedData {
  solvedProblem: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
}

const Profile: React.FC<ProfileProps> = ({ user, setUser }) => {
  const [username, setUsername] = useState<string>("");
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [solvedData, setSolvedData] = useState<SolvedData | null>(null);
  const navigate = useNavigate(); // Fix: Add useNavigate inside the component

  const handleLogout = () => {
    setUser(null);
    navigate("/"); // Redirects to Auth page
  };
  const fetchData = async () => {
    try {
      const profileResponse = await fetch(`https://alfa-leetcode-api.onrender.com/${username}`);
      const profile: ProfileData = await profileResponse.json();
      setProfileData(profile);

      const solvedResponse = await fetch(`https://alfa-leetcode-api.onrender.com/${username}/solved`);
      const solved: SolvedData = await solvedResponse.json();
      setSolvedData(solved);
    } catch (error) {
      console.error("Error fetching data: ", error);
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
      </Card>

      {profileData && solvedData && (
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 3, mt: 4 }}>
          <Card sx={{ width: "48%", p: 3, boxShadow: 3, bgcolor: "#fff" }}>
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333" }}>Profile Details</Typography>
              <Box display="flex" justifyContent="center" mt={2}>
                <Avatar src={profileData.avatar || "https://via.placeholder.com/100"} sx={{ width: 120, height: 120 }} />
              </Box>
              <Typography sx={{ mt: 3, fontSize: "1.2rem", textAlign: "center", fontWeight: "bold", color: "#333" }}>
                {profileData.name}
              </Typography>
              <Typography sx={{ fontSize: "1.1rem", textAlign: "center", color: "#555" }}>
                {profileData.birthday}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ width: "48%", p: 3, boxShadow: 3, bgcolor: "#fff" }}>
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333" }}>Solved Problems</Typography>
              <Typography variant="h6" sx={{ mt: 1 }}>Total Solved: {solvedData.solvedProblem}</Typography>
              <Box sx={{ mt: 3 }}>
                <Typography sx={{ fontSize: "1.1rem" }}>Easy: {solvedData.easySolved}</Typography>
                <Typography sx={{ fontSize: "1.1rem" }}>Medium: {solvedData.mediumSolved}</Typography>
                <Typography sx={{ fontSize: "1.1rem" }}>Hard: {solvedData.hardSolved}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default Profile;
