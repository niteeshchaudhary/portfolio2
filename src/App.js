import logo from "./logo.svg";
import "./App.css";
import Skills from "./components/Skills";
import Footer from "./components/Footer";
import CursorEffect from "./components/CursorEffect";
import Portfolioview from "./components/Portfolioview";
import Contact from "./components/Contact";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="App">
      <Navbar />
      <CursorEffect />
      <Skills />
      <Portfolioview />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
