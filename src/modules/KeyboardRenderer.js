/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useLayoutEffect, useState } from "react";
import KeycodeGraphic from "./KeycodeGraphic";
import KeycodeOptions from "./KeycodeOptions";
import { QmkCodes } from "../utilities/qmk";
import { sendToast } from "../utilities/utils";

export default function KeyboardRenderer({
  targetOS,
  json,
  kbMatrix,
  setKbMatrix,
  setLayoutName,
  layoutName
}) {
  const [kbData, setKbData] = useState(JSON.parse(json));
  const [gridDim, setGridDim] = useState({ width: 0, height: 0 });
  const [selectedKey, setSelectedKey] = useState(null);
  const [currentLayer, setCurrentLayer] = useState("base");
  const [kbContainerWidth, kbContainerHeight] = useKeyboardContainerSize();

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

  function useKeyboardContainerSize() {
    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
      function updateSize() {
        let keyboardContainer = document.getElementById(
          "keyboard-matrix-container"
        );
        if (!keyboardContainer) {
          setSize([0, 0]);
        } else {
          setSize([
            keyboardContainer.offsetWidth,
            keyboardContainer.offsetHeight,
          ]);
        }
      }
      window.addEventListener("resize", updateSize);
      updateSize();
      return () => window.removeEventListener("resize", updateSize);
    }, []);
    return size;
  }

  let switchCodes = (from, to) => {
    let kbM = { ...kbMatrix };
    kbM[currentLayer] = kbMatrix[currentLayer].map((key) => {
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
    if(!file.name.endsWith('.c')) {
      sendToast("Invalid file type", "alert-error");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;

      let kbm = QmkCodes.parseConfig(content, kbMatrix, layoutName);
      setCurrentLayer(Object.keys(kbm)[0]);
      setKbMatrix(kbm);
    };
    reader.readAsText(file);
  };

  const [layerEditMode, setLayerEditMode] = useState(false);
  const [substitutingName, setSubstitutingName] = useState(null);

  let changeLayerNames = () => {
    let newLayer = { ...kbMatrix };
    let newObject = {};
    for (let key in newLayer) {
      if (Object.keys(substitutingName).includes(key)) {
        newObject[substitutingName[key]] = newLayer[key];
      } else {
        newObject[key] = newLayer[key];
      }
    }
    newLayer = newObject;
    setKbMatrix(newLayer);
    setSubstitutingName(null);
    setCurrentLayer((old) =>
      Object.keys(substitutingName).includes(old) ? substitutingName[old] : old
    );
  };

  // useEffect(() => {
  //   document.addEventListener("keydown", enterHandler, false);
  //   return () => {
  //     document.removeEventListener("keydown", enterHandler, false);
  //   };
  // }, []);

  return (
    <div className="w-full h-full flex flex-row items-center justify-center animationWrapper">
      <div className="w-1/5 min-w-60 h-full flex flex-col items-center justify-between pr-4 py-4">
        <div className="w-full h-full overflow-y-scroll scrollbar-none flex flex-col gap-2">
          <button
            onClick={() => {
              if (layerEditMode && substitutingName !== null) {
                changeLayerNames();
              }
              setLayerEditMode((old) => !old);
            }}
            className={
              "w-fit h-fit flex flex-row items-center justify-start gap-2 rounded-full mb-2 bg-base-200 sticky top-0 z-10"
            }
          >
            <div
              className={
                "h-full aspect-square p-2 rounded-full " +
                (layerEditMode ? "bg-primary" : "bg-base-300")
              }
            >
              <svg
                dataSlot="icon"
                fill="none"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                className={
                  layerEditMode
                    ? "stroke-primary-content"
                    : "stroke-base-content"
                }
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                />
              </svg>
            </div>
            <p
              className={
                "text-base xl:text-lg whitespace-nowrap py-2 pr-4 text-base-content "
              }
            >
              {layerEditMode ? "Save" : "Edit Mode"}
            </p>
          </button>
          {kbMatrix &&
            Object.keys(kbMatrix).map((layer, idx) => {
              return layerEditMode ? (
                <div className="join w-full">
                  <input
                    type="text"
                    value={
                      substitutingName &&
                      Object.keys(substitutingName).includes(layer)
                        ? substitutingName[layer]
                        : layer
                    }
                    onChange={(e) => {
                      e.preventDefault();
                      let substitute = { ...substitutingName };
                      substitute[layer] = e.target.value;
                      setSubstitutingName(substitute);
                    }}
                    className="input input-bordered join-item w-full"
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      let newLayer = { ...kbMatrix };
                      delete newLayer[layer];
                      setKbMatrix(newLayer);
                    }}
                    className="btn btn-error join-item w-fit px-4"
                  >
                    <svg
                      dataSlot="icon"
                      fill="none"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      className="w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
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
                  <p className="basis-2/3 h-full flex items-center justify-start pl-4">
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
              disabled={layerEditMode}
            />
            <button
              key="add-layer"
              onClick={addLayer}
              className="btn join-item"
              disabled={newLayerName === "" || layerEditMode}
            >
              {" "}
              addLayer
            </button>
          </div>
        </div>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Load <code className="bg-base-300 px-1">keymap.c</code></span>
          </div>
          <input
            type="file"
            id="file"
            className="file-input file-input-bordered file-input-md w-full max-w-xs "
            onChange={inputConfig}
          />
        </label>
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
            className={`w-full justify-items-center grid grid-cols-${gridDim.width} grid-rows-${gridDim.height}`}
            style={{
              height: gridDim.height * (kbContainerWidth / gridDim.width),
            }}
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
                      "hover:scale-105 bg-secondary text-secondary-content rounded-xl flex items-center justify-center relative " +
                      (selectedKey && key.id === selectedKey.id
                        ? " font-bold scale-110 shadow-md "
                        : "")
                    }
                    style={{
                      aspectRatio: "1/1",
                      width: kbContainerWidth / (gridDim.width + 2),
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
          <div className="w-fit h-fit grid justify-items-center grid-cols-2 grid-rows-2 gap-4">
            <button
              onClick={() => switchCodes("EMPTY", "KC_NO")}
              className="btn btn-outline w-full max-w-xs"
            >
              Set EMPTY to Ignore
            </button>
            <button
              onClick={() => switchCodes("EMPTY", "KC_TRNS")}
              className="btn btn-outline w-full max-w-xs"
            >
              Set EMPTY to TRNS
            </button>
            <button
              onClick={() => switchCodes("KC_NO", "EMPTY")}
              className="btn btn-outline w-full max-w-xs"
            >
              Set Ignore to EMPTY
            </button>
            <button
              onClick={() => switchCodes("KC_TRNS", "EMPTY")}
              className="btn btn-outline w-full max-w-xs"
            >
              Set TRNS to EMPTY
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
