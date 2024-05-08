import logo from './logo.svg';
import './App.css';
import KeyboardRenderer from './modules/KeyboardRenderer';
import { useEffect, useState } from 'react';

function App() {
  let themesList= [
    "night",
    "coffee",
    "dim",
    "sunset",
    "valentine",
    "bumblebee",
    "dracula",
  ]

  let targetOperatingSystems = [
    "Windows",
    "macOS",
    "Linux",
  ]

  // auto detect the OS
  const [targetOS, setTargetOS] = useState(null)

  useEffect(() => {
    let os = window.navigator.userAgent
    if (os.includes("Mac")) {
      setTargetOS("macOS")
    }
    else if (os.includes("Linux")) {
      setTargetOS("Linux")
    }
    else {
      setTargetOS("Windows")
    }
  }, []);

  const [theme, setTheme] = useState("dracula")
  return (
    <div data-theme={theme} className="w-full h-screen flex flex-col items-center justify-center animationWrapper bg-base-100">
      <select className="absolute top-4 right-4 select select-bordered select-sm w-fit max-w-xs" value={theme} onChange={(e)=> setTheme(e.target.value)}>
        {themesList.sort().map((theme) => (
          <option value={theme} key={theme}>
            {theme === "valentine" ? "polaretto" : theme}
          </option>
        ))}
      </select>
      <select className="absolute top-4 left-4 select select-bordered select-sm w-fit max-w-xs" value={targetOS} onChange={(e)=> setTargetOS(e.target.value)}>
        {targetOperatingSystems.map((os) => (
          <option value={os} key={os}>
            {os}
          </option>
        ))}
      </select>
      <KeyboardRenderer />
    </div>
  );
}

export default App;
