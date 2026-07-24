import "./App.css";

import Home from "./pages/Home";

import WhatsApp from "./components/WhatsApp/WhatsApp";
import CosmicBg from "./components/Three/CosmicBg";

function App() {
  return (
    <>
      <CosmicBg mouseInfluence={true} />
      <Home />

      <WhatsApp />
    </>
  );
}

export default App;