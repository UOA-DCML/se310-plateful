import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Search from "./pages/Search";
import RestaurantDetails from "./pages/RestaurantDetails";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/search" element={<Search />} />
          <Route path="/restaurant/:id" element={<RestaurantDetails />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
