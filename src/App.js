import "./App.css";
import Skills from "./components/Skills";
import Footer from "./components/Footer";
import CursorEffect from "./components/CursorEffect";
import Portfolioview from "./components/Portfolioview";
import Contact from "./components/Contact";
import Navbar from "./components/Navbar";
import Experience from "./components/Experience";

function App() {
  return (
    <div className="App">
      <Navbar />
      <CursorEffect />
      <Skills />
      <Experience />
      <Portfolioview />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
