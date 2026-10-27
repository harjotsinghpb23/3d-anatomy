import { useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Anatomy from "./pages/Anatomy";
import Viewer from "./pages/Viewer";
import About from "./pages/About";
import { ChatbotProvider } from "./components/ChatbotContext";
import Chatbot from "./components/Chatbot";

function App() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("anatomyApp_auth") === "true"
  );

  const handleLogin = (event) => {
    if (event) event.preventDefault();
    localStorage.setItem("anatomyApp_auth", "true");
    setIsLoggedIn(true);
    navigate("/anatomy");
  };

  const handleLogout = () => {
    localStorage.removeItem("anatomyApp_auth");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <ChatbotProvider>
      <div className="site-shell">
        <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <main>
          <Routes>
            <Route
              path="/"
              element={<Home isLoggedIn={isLoggedIn} onLogin={handleLogin} />}
            />
            <Route
              path="/anatomy"
              element={<Anatomy isLoggedIn={isLoggedIn} onLogin={handleLogin} />}
            />
            <Route path="/anatomy/:id" element={<Viewer />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <Chatbot />
    </ChatbotProvider>
  );
}

export default App;
