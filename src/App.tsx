import { useState } from "react";
import YoutubeForm from "./components/YoutubeForm";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <YoutubeForm />
    </>
  );
}

export default App;
