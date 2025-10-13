import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Search from "./pages/Search";
import RestaurantDetails from "./pages/RestaurantDetails";
import SigninPage from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";
import { AuthProvider } from "./auth/AuthContext";
import { ToasterProvider } from "./components/Toaster";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToasterProvider>
          <Toaster position="top-center" />
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/search" element={<Search />} />
              <Route path="/restaurant/:id" element={<RestaurantDetails />} />
              <Route path="/signin" element={<SigninPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Routes>
          </Layout>
        </ToasterProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
