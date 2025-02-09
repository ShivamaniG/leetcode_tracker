import React from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase/config";
import { Button, Box, Typography } from "@mui/material";

const Auth: React.FC<{ setUser: (user: string) => void }> = ({ setUser }) => {
  const navigate = useNavigate();

  const signIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const username = result.user.displayName ?? "User";
      setUser(username);
      navigate("/profile");
    } catch (error) {
      console.error("Error signing in: ", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <Box 
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", color: "#333" }}>
        Welcome to LeetCode Tracker
      </Typography>
      <Button 
        variant="contained"
        onClick={signIn}
        sx={{
          bgcolor: "#1976d2",
          color: "white",
          fontSize: "1.2rem",
          padding: "12px 24px",
          borderRadius: "8px",
          "&:hover": { bgcolor: "#1558b0" }
        }}
      >
        Sign in with Google
      </Button>
    </Box>
  );
};

export default Auth;
