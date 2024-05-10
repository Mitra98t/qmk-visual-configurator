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

  const [kbMatrix, setKbMatrix] = useState(null);
  const [layoutName, setLayoutName] = useState("");

  let getSpaces = (num) => {
    let spaces = "";
    for (let i = 0; i < num; i++) {
      spaces += " ";
    }
    return spaces;
  };

  let formatAndDownload = () => {
    let kb = { ...kbMatrix };
    let layers = Object.keys(kb);
    let formatted = `enum layer_names {\n`;
    layers.forEach((layer, layeridx) => {
      formatted += `  ${layer}${layeridx === layers.length - 1 ? "" : ",\n"}`;
    });
    formatted += `\n};\n\n`;
    formatted += `const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {\n`;
    layers.forEach((layer, layeridx) => {
      formatted += `  [${layer}] = ${layoutName}(\n\t\t`;
      let longestCode = 0;
      kb[layer].forEach((key) => {
        let keycode = key.code === "EMPTY" ? "KC_TRNS" : key.code;
        if (keycode.length > longestCode) {
          longestCode = keycode.length;
        }
      });
      longestCode += 3;
      kb[layer].forEach((key, keyidx) => {
        let keycode = key.code === "EMPTY" ? "KC_TRNS" : key.code;
        if (keyidx > 0 && key.y !== kb[layer][keyidx - 1].y) {
          formatted += `\n\t\t`;
          for (let i = 0; i < key.x; i++) {
            formatted += getSpaces(longestCode);
          }
        }
        let keycodeToUse =
          keycode + (keyidx === kb[layer].length - 1 ? "\n" : `,`);
        formatted += `${keycodeToUse}${
          keycodeToUse.endsWith(",")
            ? getSpaces(longestCode - keycodeToUse.length)
            : ""
        }`;
      });
      formatted += `  )${layeridx === layers.length - 1 ? "" : ","}\n`;
    });

    formatted += `};\n`;

    let blob = new Blob([formatted], { type: "text/plain" });
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = "keymap.c";
    a.click();
  };

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
              Paste or upload your{" "}
              <code className="bg-base-300 rounded-lg px-2">info.json</code>{" "}
              here
            </h1>
            <input
              type="file"
              id="info-json"
              className="file-input file-input-bordered w-full max-w-xs"
              onChange={(e) => {
                let file = e.target.files[0];
                let reader = new FileReader();
                reader.onload = (e) => {
                  setInputJson(e.target.result);
                };
                reader.readAsText(file);
              }}
            />
            <div className="mockup-code w-full h-full">
              <textarea
                className="w-full h-full bg-transparent rounded-lg focus:ring-0 focus:outline-none px-6 scrollbar-hidden"
                placeholder="Paste your JSON here"
                onChange={(e) => {
                  e.preventDefault();
                  setInputJson(e.target.value);
                }}
                value={inputJson}
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
        <div className="px-6 w-full 2xl:px-0 2xl:w-10/12 h-auto aspect-[7/3] flex flex-col items-end gap-4 justify-center">
          <KeyboardRenderer
            targetOS={targetOS}
            json={json}
            kbMatrix={kbMatrix}
            setKbMatrix={setKbMatrix}
            setLayoutName={setLayoutName}
          />
          <div
            id="button-section"
            className="w-full h-fit flex items-center justify-between px-4"
          >
            <button
              id="download-button"
              className="btn btn-success"
              onClick={formatAndDownload}
            >
              Download Keymap
            </button>
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
      <div className=" absolute bottom-4 right-4">
        <a
          href="https://github.com/Mitra98t/qmk-visual-configurator"
          target="_blank"
          rel="noreferrer"
          className="bg-base-300 px-4 py-2 rounded-full hover:bg-base-200"
        >
          GitHub
        </a>
      </div>
    </div>
  );
}

export default App;
