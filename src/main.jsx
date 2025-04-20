import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // Ensure React Router is wrapped
import "./index.css";
import App from "./App.jsx";
import 'swiper/css'; // Import Swiper styles


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>

      <App />
    </BrowserRouter>
  </StrictMode>
);
