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
  const [json, setJson] = useState(`{
    "manufacturer": "Federico",
    "keyboard_name": "mk2",
    "maintainer": "Mitra98t",
    "bootloader": "rp2040",
    "diode_direction": "COL2ROW",
    "features": {
        "bootmagic": true,
        "command": false,
        "console": false,
        "extrakey": true,
        "mousekey": true,
        "nkro": true
    },
    "matrix_pins": {
        "cols": [
            "GP5",
            "GP4",
            "GP3",
            "GP1",
            "GP0",
            "GP29",
            "GP28",
            "GP27",
            "GP2",
            "GP26"
        ],
        "rows": [
            "GP13",
            "GP12",
            "GP11",
            "GP10",
            "GP9"
        ]
    },
    "processor": "RP2040",
    "url": "",
    "usb": {
        "device_version": "1.0.0",
        "pid": "0x0002",
        "vid": "0x6B6D"
    },
    "layouts": {
        "LAYOUT_ortho_10x5": {
            "layout": [
                {
                    "matrix": [
                        0,
                        0
                    ],
                    "x": 0,
                    "y": 0
                },
                {
                    "matrix": [
                        0,
                        1
                    ],
                    "x": 1,
                    "y": 0
                },
                {
                    "matrix": [
                        0,
                        2
                    ],
                    "x": 2,
                    "y": 0
                },
                {
                    "matrix": [
                        0,
                        3
                    ],
                    "x": 3,
                    "y": 0
                },
                {
                    "matrix": [
                        0,
                        4
                    ],
                    "x": 4,
                    "y": 0
                },
                {
                    "matrix": [
                        0,
                        5
                    ],
                    "x": 5,
                    "y": 0
                },
                {
                    "matrix": [
                        0,
                        6
                    ],
                    "x": 6,
                    "y": 0
                },
                {
                    "matrix": [
                        0,
                        7
                    ],
                    "x": 7,
                    "y": 0
                },
                {
                    "matrix": [
                        0,
                        8
                    ],
                    "x": 8,
                    "y": 0
                },
                {
                    "matrix": [
                        0,
                        9
                    ],
                    "x": 9,
                    "y": 0
                },
                {
                    "matrix": [
                        1,
                        0
                    ],
                    "x": 0,
                    "y": 1
                },
                {
                    "matrix": [
                        1,
                        1
                    ],
                    "x": 1,
                    "y": 1
                },
                {
                    "matrix": [
                        1,
                        2
                    ],
                    "x": 2,
                    "y": 1
                },
                {
                    "matrix": [
                        1,
                        3
                    ],
                    "x": 3,
                    "y": 1
                },
                {
                    "matrix": [
                        1,
                        4
                    ],
                    "x": 4,
                    "y": 1
                },
                {
                    "matrix": [
                        1,
                        5
                    ],
                    "x": 5,
                    "y": 1
                },
                {
                    "matrix": [
                        1,
                        6
                    ],
                    "x": 6,
                    "y": 1
                },
                {
                    "matrix": [
                        1,
                        7
                    ],
                    "x": 7,
                    "y": 1
                },
                {
                    "matrix": [
                        1,
                        8
                    ],
                    "x": 8,
                    "y": 1
                },
                {
                    "matrix": [
                        1,
                        9
                    ],
                    "x": 9,
                    "y": 1
                },
                {
                    "matrix": [
                        2,
                        0
                    ],
                    "x": 0,
                    "y": 2
                },
                {
                    "matrix": [
                        2,
                        1
                    ],
                    "x": 1,
                    "y": 2
                },
                {
                    "matrix": [
                        2,
                        2
                    ],
                    "x": 2,
                    "y": 2
                },
                {
                    "matrix": [
                        2,
                        3
                    ],
                    "x": 3,
                    "y": 2
                },
                {
                    "matrix": [
                        2,
                        4
                    ],
                    "x": 4,
                    "y": 2
                },
                {
                    "matrix": [
                        2,
                        5
                    ],
                    "x": 5,
                    "y": 2
                },
                {
                    "matrix": [
                        2,
                        6
                    ],
                    "x": 6,
                    "y": 2
                },
                {
                    "matrix": [
                        2,
                        7
                    ],
                    "x": 7,
                    "y": 2
                },
                {
                    "matrix": [
                        2,
                        8
                    ],
                    "x": 8,
                    "y": 2
                },
                {
                    "matrix": [
                        2,
                        9
                    ],
                    "x": 9,
                    "y": 2
                },
                {
                    "matrix": [
                        3,
                        0
                    ],
                    "x": 0,
                    "y": 3
                },
                {
                    "matrix": [
                        3,
                        1
                    ],
                    "x": 1,
                    "y": 3
                },
                {
                    "matrix": [
                        3,
                        2
                    ],
                    "x": 2,
                    "y": 3
                },
                {
                    "matrix": [
                        3,
                        3
                    ],
                    "x": 3,
                    "y": 3
                },
                {
                    "matrix": [
                        3,
                        4
                    ],
                    "x": 4,
                    "y": 3
                },
                {
                    "matrix": [
                        3,
                        5
                    ],
                    "x": 5,
                    "y": 3
                },
                {
                    "matrix": [
                        3,
                        6
                    ],
                    "x": 6,
                    "y": 3
                },
                {
                    "matrix": [
                        3,
                        7
                    ],
                    "x": 7,
                    "y": 3
                },
                {
                    "matrix": [
                        3,
                        8
                    ],
                    "x": 8,
                    "y": 3
                },
                {
                    "matrix": [
                        3,
                        9
                    ],
                    "x": 9,
                    "y": 3
                },
                {
                    "matrix": [
                        4,
                        2
                    ],
                    "x": 2,
                    "y": 4
                },
                {
                    "matrix": [
                        4,
                        3
                    ],
                    "x": 3,
                    "y": 4
                },
                {
                    "matrix": [
                        4,
                        4
                    ],
                    "x": 4,
                    "y": 4
                },
                {
                    "matrix": [
                        4,
                        5
                    ],
                    "x": 5,
                    "y": 4
                },
                {
                    "matrix": [
                        4,
                        6
                    ],
                    "x": 6,
                    "y": 4
                },
                {
                    "matrix": [
                        4,
                        7
                    ],
                    "x": 7,
                    "y": 4
                }
            ]
        }
    }
}
`);
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
          <button onClick={() => {setInputJson(""); setJson("")}} className="btn btn-error float-left">Exit</button>
        </div>
      )}
      <div className="toast" id="toaster"></div>
    </div>
  );
}

export default App;
