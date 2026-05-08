import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import DriversPage from "./pages/DriversPage";
import VehicleManagementPage from "./pages/VehicleManagementPage";
import RoutesPage from "./pages/RoutesPage";
import PackagesPage from "./pages/PackagesPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"          element={<HomePage />} />
        <Route path="/drivers"   element={<DriversPage />} />
        <Route path="/vehicles"  element={<VehicleManagementPage />} />
        <Route path="/routes"    element={<RoutesPage />} />
        <Route path="/packages"  element={<PackagesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
