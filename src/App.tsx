import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./components/Auth";
import Profile from "./components/Profile";
import { Container } from "@mui/material";

const App: React.FC = () => {
  const [user, setUser] = useState<string | null>(null);

  return (
    <Router>
      <Container>
        <Routes>
          <Route path="/" element={<Auth setUser={setUser} />} />
          <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
          </Routes>
      </Container>
    </Router>
  );
};

export default App;
