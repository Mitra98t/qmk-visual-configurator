/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { QmkCodes } from "../utilities/qmk";
import Fuse from "fuse.js";
import KeycodeList from "./KeycodeList";

export default function KeycodeOptions({
  selectedKey,
  setSelectedKey,
  updateKeys,
  targetOS,
  kbMatrix,
  currentLayer
}) {
  const [keyMode, setKeyMode] = useState("BasicKeycodes");
  const [qmkLists, setQmkLists] = useState(null);

  const [listShow, setListShow] = useState(null);

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/qmk/qmk_firmware/master/docs/keycodes.md"
    ).then((response) => {
      response.text().then((data) => {
        let newQmkLists = QmkCodes.parseFullList(data);
        setQmkLists(newQmkLists);
        setListShow(newQmkLists[keyMode].list.map((el) => ({ item: el })));
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!qmkLists) return;
    setListShow(qmkLists[keyMode].list.map((el) => ({ item: el })));
  }, [keyMode]);

  useEffect(() => {
    setKeyMode("BasicKeycodes");
    setSelectedKey(null);
    setSelectedTargetLayer(null);

  }, [currentLayer]);

  const [layerMode, setLayerMode] = useState(null);


  const [selectedTargetLayer, setSelectedTargetLayer] = useState(null);

  useEffect(() => {
    setSelectedTargetLayer(null);
    setLayerMode(null);
  }, [selectedKey,currentLayer])
  

  return selectedKey ? (
    <div className="w-full h-full flex flex-col items-start justify-start gap-2">
      <h1 className="text-xl font-semibold">{`Key Options of ${selectedKey.id}`}</h1>
      <select
        onChange={(e) => setKeyMode(e.target.value)}
        className="select select-bordered w-full"
      >
        {qmkLists &&
          Object.keys(qmkLists)
            .filter((l) => ["BasicKeycodes", "LayerSwitching"].includes(l))
            .map((list) => (
              <option defaultChecked={keyMode === list} value={list}>
                {qmkLists[list].title}
              </option>
            ))}
        {/* <option value={"keycode"} defaultChecked>
            KeyCode
          </option> */}
      </select>
      {keyMode === "LayerSwitching" ? (
        <>
          <div className="w-full h-fit flex flex-row flex-wrap gap-2">
            {listShow.map((el) => {
              return (
                <div
                  className="tooltip tooltip-accent"
                  data-tip={el.item.descriptionUnformatted}
                >
                  <button
                    onClick={() => {
                      setLayerMode(el.item.code);
                      setSelectedTargetLayer(null);
                    }}
                    className={
                      "btn " +
                      (layerMode === el.item.code
                        ? "btn-primary"
                        : "btn-neutral")
                    }
                  >
                    {el.item.code}
                  </button>
                </div>
              );
            })}
          </div>
          {layerMode ? (
            selectedTargetLayer === null || !layerMode.includes("kc") ? (
              <div className="w-full h-full flex flex-col gap-2">
                <div className="w-full h-fit flex flex-col flex-wrap gap-2">
                  {Object.keys(kbMatrix).map((layer, idx) => {
                    return (
                      <button
                        key={layer}
                        onClick={() => {
                          if (layerMode.includes("kc")) {
                            setSelectedTargetLayer(idx);
                          } else {
                            let newSelectedKey = {
                              ...selectedKey,
                              code: `${layerMode
                                .slice(0, 2)
                                .toUpperCase()}(${idx})`,
                            };
                            setSelectedKey(newSelectedKey);
                            updateKeys(newSelectedKey);
                          }
                        }}
                        className={
                          "btn btn-outline w-full h-auto " +
                          (layerMode === layer ? "btn-primary" : "")
                        }
                      >
                        {layer}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <KeycodeList
                list={qmkLists.BasicKeycodes}
                selectedKey={selectedKey}
                setSelectedKey={setSelectedKey}
                updateKeys={updateKeys}
                targetOS={targetOS}
                customKeycodeCreator={(code) => {
                  return `${layerMode.slice(0,2)}(${selectedTargetLayer}, ${code})`;
                }}
              />
            )
          ) : (
            <></>
          )}
        </>
      ) : keyMode === "BasicKeycodes" ? (
        <KeycodeList
          list={qmkLists.BasicKeycodes}
          selectedKey={selectedKey}
          setSelectedKey={setSelectedKey}
          updateKeys={updateKeys}
          targetOS={targetOS}
          keyboardInput
        />
      ) : (
        <></>
      )}
    </div>
  ) : (
    <div className="w-full h-full flex flex-col items-start justify-start">
      <h1 className="text-xl font-semibold mb-2">{`Key Options`}</h1>
    </div>
  );
}
