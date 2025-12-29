import { BrowserRouter, Routes, Route } from "react-router-dom";
import VeriMedia from "./pages/VeriMedia";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HistoryPage from "./pages/History";
import WatermarkPanel from "./components/watermark/WatermarkPanel"; 
import SwissCheeseModel from "./components/about/SwissCheeseModel";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<VeriMedia />} />
        <Route path="/verify" element={<VeriMedia />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/watermark" element={<VeriMedia />} />
        <Route path="/about" element={<VeriMedia />} />
      </Routes>
    </BrowserRouter>
  );
}
