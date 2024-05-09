/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import KeycodeGraphic from "./KeycodeGraphic";
import KeycodeOptions from "./KeycodeOptions";
import { QmkCodes } from "../utilities/qmk";

export default function KeyboardRenderer({
  targetOS,
  json,
  kbMatrix,
  setKbMatrix,
  setLayoutName
}) {
  const [kbData, setKbData] = useState(JSON.parse(json));
  const [gridDim, setGridDim] = useState({ width: 0, height: 0 });
  const [selectedKey, setSelectedKey] = useState(null);
  const [currentLayer, setCurrentLayer] = useState("base");

  useEffect(() => {
    setLayoutName(Object.keys(kbData.layouts)[0]);
    let kbM = { base: Object.values(kbData.layouts)[0].layout };
    kbM.base.map((key) => {
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

    Object.values(kbMatrix)[0].forEach((key) => {
      if (key.matrix[0] > maxX) maxX = key.matrix[0];
      if (key.matrix[1] > maxY) maxY = key.matrix[1];
    });

    setGridDim({ height: maxX + 1, width: maxY + 1 });
  }, [kbMatrix]);

  let switchCodes = (from, to) => {
    let kbM = kbMatrix[currentLayer].map((key) => {
      if (key.code === from) {
        key.code = to;
      }
      return key;
    });
    setKbMatrix(kbM);
  };

  let updateKeys = (newKey) => {
    let kb = { ...kbMatrix };

    kb[currentLayer] = kb[currentLayer].map((key) => {
      if (
        key.matrix[0] === newKey.matrix[0] &&
        key.matrix[1] === newKey.matrix[1]
      ) {
        return newKey;
      }
      return key;
    });

    setKbMatrix(kb);
  };

  const [newLayerName, setNewLayerName] = useState("");

  let addLayer = () => {
    let newLayer = { ...kbMatrix };
    newLayer[newLayerName] = Object.values(kbData.layouts)[0].layout.map(
      (key) => {
        key.code = "EMPTY";
        key.id = key.matrix[0] + "," + key.matrix[1];
        return key;
      }
    );
    setNewLayerName("");
    setKbMatrix(newLayer);
    setCurrentLayer(newLayerName);
    setSelectedKey(null);
  };

  

  let inputConfig = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;

      let kbm = QmkCodes.parseConfig(content, kbMatrix);
      setCurrentLayer(Object.keys(kbm)[0]);
      setKbMatrix(kbm);
    };
    reader.readAsText(file);
  };

  return (
    <div className="w-full h-full flex flex-row items-center justify-center animationWrapper">
      <div className="w-1/5 h-full flex flex-col items-center justify-between p-4">
        <div className="w-full h-full overflow-y-scroll scrollbar-hidden flex flex-col gap-2">
          {kbMatrix &&
            Object.keys(kbMatrix).map((layer, idx) => {
              return (
                <button
                  key={layer}
                  onClick={() => {
                    setCurrentLayer(layer);
                    setSelectedKey(null);
                  }}
                  className={
                    "btn  h-fit flex flex-row flex-nowrap items-center justify-evenly divide-x  p-0 " +
                    (currentLayer === layer
                      ? " btn-primary divide-primary "
                      : " btn-outline divide-base-content ")
                  }
                >
                  <p className="basis-2/3 h-full flex items-center justify-center">
                    {layer}
                  </p>
                  <p className="basis-1/3 h-full flex items-center justify-center">
                    {idx}
                  </p>
                </button>
              );
            })}
          <div className="w-full h-fit join">
            <input
              type="text"
              value={newLayerName}
              onChange={(e) => {
                e.preventDefault();
                setNewLayerName(e.target.value);
              }}
              className="input input-bordered join-item w-full"
              placeholder="Layer Name"
            />
            <button
              key="add-layer"
              onClick={addLayer}
              className="btn join-item"
              disabled={newLayerName === ""}
            >
              {" "}
              addLayer
            </button>
          </div>
        </div>
        <input
          type="file"
          id="file"
          className="file-input file-input-bordered file-input-md w-full max-w-xs "
          onChange={inputConfig}
        />
      </div>
      <div className="w-full h-full bg-base-200 rounded-3xl py-4 px-6 gap-4 flex flex-row items-start justify-between">
        <div className="w-full h-full basis-1/3 flex items-center justify-center">
          <KeycodeOptions
            selectedKey={selectedKey}
            setSelectedKey={setSelectedKey}
            updateKeys={updateKeys}
            targetOS={targetOS}
            kbMatrix={kbMatrix}
            currentLayer={currentLayer}
          />
        </div>
        <div className="w-full h-full flex flex-col items-center justify-evenly basis-2/3">
          <div
            id="keyboard-matrix-container"
            className={`w-fit h-fit gap-2 grid grid-cols-${gridDim.width} grid-rows-${gridDim.height}`}
          >
            {kbMatrix &&
              kbMatrix[currentLayer] &&
              kbMatrix[currentLayer].map((key, index) => {
                return (
                  <button
                    onClick={() => {
                      setSelectedKey(key);
                      try {
                        document.getElementById("keyboard-input").focus();
                      } catch (e) {}
                    }}
                    key={index}
                    className={
                      "w-20 hover:scale-105 bg-secondary text-secondary-content rounded-xl flex items-center justify-center aspect-square relative " +
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
              className="btn btn-outline basis-1/3"
            >
              Set EMPTY to Ignore
            </button>
            <button
              onClick={() => switchCodes("EMPTY", "KC_TRNS")}
              className="btn btn-outline basis-1/3"
            >
              Set EMPTY to TRNS
            </button>
            <button
              onClick={() => switchCodes("KC_TRNS", "EMPTY")}
              className="btn btn-outline basis-1/3"
            >
              Set TRNS to EMPTY
            </button>
            <button
              onClick={() => switchCodes("KC_NO", "EMPTY")}
              className="btn btn-outline basis-1/3"
            >
              Set Ignore to EMPTY
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
