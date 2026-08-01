import "./App.css";

import Home from "./pages/Home";

import WhatsApp from "./components/WhatsApp/WhatsApp";

import Assistant from "./components/Assistant/Assistant";

import ListenButton from "./components/ListenButton/ListenButton";

function App() {
  return (
    <>
      <Home />

      <WhatsApp />

      <Assistant />

      <ListenButton />
    </>
  );
}

export default App;