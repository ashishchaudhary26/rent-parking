import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home, Layout, noPage, Parking } from "./pages";
import ParkingForm from "./pages/parkingForm";
import Login from "./pages/login";
import Register from "./pages/register";
import Space from "./pages/space";
import SpaceForm from "./pages/spaceForm";
import BookingForm from "./pages/bookingForm";
import Booking from "./pages/booking";
import Profile from "./pages/profile";
// import Reviews from "./pages/Reviews";
import Users from "./pages/users";
import About from "./pages/about";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="parking" element={<Parking />} />
          <Route path="parkingForm" element={<ParkingForm />} />
          <Route path="space" element={<Space />} />
          <Route path="spaceForm" element={<SpaceForm />} />
          <Route path="bookingForm" element={<BookingForm />} />
          <Route path="booking" element={<Booking />} />
          <Route path="profile" element={<Profile />} />
          <Route path="review" element={<Reviews />} />
          <Route path="users" element={<Users />} />
          <Route path="about" element={<About />} />
        </Route>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
