import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Search from "./pages/Search";
import RestaurantDetails from "./pages/RestaurantDetails";
import UserProfile from "./pages/UserProfile";
import Settings from "./pages/Settings";
import BrowseHistory from "./pages/BrowseHistory";
import Favorites from "./pages/Favorites";
import SigninPage from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";
import { AuthProvider } from "./auth/AuthContext";
import { TextSizeProvider } from "./context/TextSizeContext";
import { ToasterProvider } from "./components/Toaster";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <TextSizeProvider>
          <ToasterProvider>
            <Toaster position="top-center" />
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/search" element={<Search />} />
                <Route path="/restaurant/:id" element={<RestaurantDetails />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/history" element={<BrowseHistory />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/signin" element={<SigninPage />} />
                <Route path="/signup" element={<SignupPage />} />
              </Routes>
            </Layout>
          </ToasterProvider>
        </TextSizeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
