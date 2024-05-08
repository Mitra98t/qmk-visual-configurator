import React, { useEffect, useState } from "react";
import KeycodeGraphic from "./KeycodeGraphic";
import KeycodeOptions from "./KeycodeOptions";

function formatStyle(styles) {
  return styles.join(" ");
}

export default function KeyboardRenderer() {
  let json = `
  {
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

  `;

  const [kbData, setKbData] = useState(JSON.parse(json));
  const [kbMatrix, setKbMatrix] = useState(null);
  const [gridDim, setGridDim] = useState({ width: 0, height: 0 });
  const [selectedKey, setSelectedKey] = useState(null);

  useEffect(() => {
    let kbM = Object.values(kbData.layouts)[0].layout;
    kbM.map((key) => {
      key.code = "EMPTY";
      key.id = key.matrix[0] + "," + key.matrix[1];
      return key;
    });
    setKbMatrix(kbM);
  }, [kbData]);

  useEffect(() => {
    if (!kbMatrix) return;
    let maxX = 0;
    let maxY = 0;

    kbMatrix.forEach((key) => {
      if (key.matrix[0] > maxX) maxX = key.matrix[0];
      if (key.matrix[1] > maxY) maxY = key.matrix[1];
    });

    setGridDim({ height: maxX + 1, width: maxY + 1 });
  }, [kbMatrix]);

  let switchCodes = (from, to) => {
    let kbM = kbMatrix.map((key) => {
      if (key.code === from) {
        key.code = to;
      }
      return key;
    });
    setKbMatrix(kbM);
  };

  let updateKeys = (newKey) => {
    let kbM = kbMatrix.map((key) => {
      if (
        key.matrix[0] === newKey.matrix[0] &&
        key.matrix[1] === newKey.matrix[1]
      ) {
        return newKey;
      }
      return key;
    });
    setKbMatrix(kbM);
  };

  return (
    <div className="w-10/12 h-3/4 bg-base-200 rounded-3xl py-4 px-6 gap-4 flex flex-row items-start justify-between">
      <KeycodeOptions
        selectedKey={selectedKey}
        setSelectedKey={setSelectedKey}
        updateKeys={updateKeys}
      />
      <div className="w-full h-full flex flex-col items-center justify-evenly">
        <div
          id="keyboard-matrix-container"
          className={`w-fit h-fit gap-2 grid grid-cols-${gridDim.width} grid-rows-${gridDim.height}`}
        >
          {kbMatrix &&
            kbMatrix.map((key, index) => {
              return (
                <button
                  onClick={() => setSelectedKey(key)}
                  key={index}
                  //   className="w-full h-auto aspect-square bg-secondary text-secondary-content col-span-1 row-span-1 rounded-2xl flex items-center justify-center col-start-1"
                  className={
                    "w-20 bg-secondary text-secondary-content rounded-xl flex items-center justify-center aspect-square relative " +
                    (selectedKey && key.id === selectedKey.id
                      ? "  font-bold scale-105"
                      : "")
                  }
                  style={{
                    gridColumnStart: key.matrix[1] + 1,
                    gridRowStart: key.matrix[0] + 1,
                  }}
                >
                  <KeycodeGraphic keycode={key.code} />
                  <p className="absolute bottom-1 right-2 text-xs font-thin">
                    {key.id}
                  </p>
                </button>
              );
            })}
        </div>
        <div className="w-full h-fit flex flex-row flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => switchCodes("EMPTY", "KC_NO")}
            className="btn btn-primary basis-1/3"
          >
            Set EMPTY to Ignore
          </button>
          <button
            onClick={() => switchCodes("EMPTY", "KC_TRNS")}
            className="btn btn-primary basis-1/3"
          >
            Set EMPTY to TRNS
          </button>
          <button
            onClick={() => switchCodes("KC_TRNS", "EMPTY")}
            className="btn btn-primary basis-1/3"
          >
            Set TRNS to EMPTY
          </button>
          <button
            onClick={() => switchCodes("KC_NO", "EMPTY")}
            className="btn btn-primary basis-1/3"
          >
            Set Ignore to EMPTY
          </button>
        </div>
      </div>
    </div>
  );
}
