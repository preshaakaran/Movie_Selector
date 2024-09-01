import './App.css';
import { useState } from 'react';
import Body from './Components/Body';
import Footer from './Components/Footer';
import Header from './Components/Header';

function App() {
  const [query, setQuery] = useState("");
  return (
    <div className="App">
      <Header query={query} setQuery={setQuery}/>
      <Body query={query}/>
      <Footer />

    </div>
  );
}

export default App;

