import "./App.css";
import KeyboardRenderer from "./modules/KeyboardRenderer";
import { useEffect, useState } from "react";

function App() {
  let themesList = [
    "night",
    "coffee",
    "dim",
    "sunset",
    "valentine",
    "bumblebee",
    "dracula",
  ];

  let targetOperatingSystems = ["any", "Windows", "macOS", "Linux"];

  // auto detect the OS
  const [targetOS, setTargetOS] = useState("any");

  useEffect(() => {
    let os = window.navigator.userAgent;
    if (os.includes("Mac")) {
      setTargetOS("macOS");
    } else if (os.includes("Linux")) {
      setTargetOS("Linux");
    } else {
      setTargetOS("Windows");
    }
  }, []);

  const [theme, setTheme] = useState("coffee");

  const [inputJson, setInputJson] = useState("");
  const [json, setJson] = useState(``);
  return (
    <div
      data-theme={theme}
      className="w-full h-screen flex items-center justify-center animationWrapper"
    >
      <select
        className="absolute top-4 right-4 select select-bordered select-sm w-fit max-w-xs"
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
      >
        {themesList.sort().map((theme) => (
          <option value={theme} key={theme}>
            {theme === "valentine" ? "polaretto" : theme}
          </option>
        ))}
      </select>
      <select
        className="absolute top-4 left-4 select select-bordered select-sm w-fit max-w-xs"
        value={targetOS}
        onChange={(e) => setTargetOS(e.target.value)}
      >
        {targetOperatingSystems.map((os) => (
          <option defaultChecked={targetOS === os} value={os} key={os}>
            {os}
          </option>
        ))}
      </select>
      {json === "" ? (
        <div className="w-1/3 h-3/4 flex flex-col items-center justify-center animationWrapper bg-base-100">
          <div className="w-full h-full gap-4 flex flex-col items-start justify-start">
            <h1 className="text-2xl">
              Paste your{" "}
              <code className="bg-base-300 rounded-lg px-2">info.json</code>{" "}
              here
            </h1>
            <div className="mockup-code w-full h-full">
              <textarea
                className="w-full h-full bg-transparent rounded-lg focus:ring-0 focus:outline-none px-6 scrollbar-hidden"
                placeholder="Paste your JSON here"
                onChange={(e) => {
                  e.preventDefault();
                  setInputJson(e.target.value);
                }}
              />
            </div>
            <button
              className="btn btn-primary"
              onClick={() => {
                try {
                  JSON.parse(inputJson);
                  setJson(inputJson);
                } catch (e) {
                  console.error(e);
                  document
                    .getElementById("toaster")
                    .appendChild(
                      document.createElement("div")
                    ).innerHTML = `<div class="alert alert-error"><span>Invalid JSON</span></div>`;
                  setTimeout(() => {
                    document
                      .getElementById("toaster")
                      .removeChild(
                        document.getElementById("toaster").firstChild
                      );
                  }, 3000);
                }
              }}
            >
              Render Keyboard
            </button>
          </div>
        </div>
      ) : (
        <div className="w-10/12 h-auto aspect-[7/3] flex flex-col items-end gap-4 justify-center">
          <KeyboardRenderer targetOS={targetOS} json={json} />
          <div className="w-full h-fit flex items-center justify-end">
            <button
              onClick={() => {
                setInputJson("");
                setJson("");
              }}
              className="btn btn-error float-left"
            >
              Exit
            </button>
          </div>
        </div>
      )}
      <div className="toast" id="toaster"></div>
    </div>
  );
}

export default App;
