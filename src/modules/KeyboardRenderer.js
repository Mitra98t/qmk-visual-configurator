import React, { useEffect, useState } from "react";
import KeycodeGraphic from "./KeycodeGraphic";
import KeycodeOptions from "./KeycodeOptions";

export default function KeyboardRenderer({ targetOS, json }) {
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
    <div className="w-full h-full bg-base-200 rounded-3xl py-4 px-6 gap-4 flex flex-row items-start justify-between">
      <div className="w-full h-full basis-1/3 flex items-center justify-center">
        <KeycodeOptions
          selectedKey={selectedKey}
          setSelectedKey={setSelectedKey}
          updateKeys={updateKeys}
          targetOS={targetOS}
        />
      </div>
      <div className="w-full h-full flex flex-col items-center justify-evenly basis-2/3">
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
                      ? " font-bold scale-110 shadow-md "
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
