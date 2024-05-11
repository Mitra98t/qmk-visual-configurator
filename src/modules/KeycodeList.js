/* eslint-disable react-hooks/exhaustive-deps */
import Fuse from "fuse.js";
import React, { useEffect, useState } from "react";
import { QmkCodes } from "../utilities/qmk";
import { sendToast } from "../utilities/utils";

export default function KeycodeList({
  list,
  selectedKey,
  setSelectedKey,
  updateKeys,
  targetOS,
  keyboardInput = false,
  customKeycodeCreator = (x) => x,
}) {
  const [fuse, setFuse] = useState(null);
  const [listShow, setListShow] = useState(null);
  const [keyFilter, setKeyFilter] = useState("");

  useEffect(() => {
    let fs = new Fuse(list.list, {
      keys: ["code", "description"],
      threshold: 0.3,
    });
    setFuse(fs);
    setListShow(list.list.map((el) => ({ item: el })));
  }, [list]);

  useEffect(() => {
    if (!fuse) return;
    if (list.list === null) return;
    if (keyFilter === "") {
      setListShow(list.list.map((el) => ({ item: el })));
      return;
    }
    const timeout = setTimeout(() => {
      let list = fuse.search(keyFilter);
      setListShow(list);
    }, 300);
    return () => clearTimeout(timeout);
  }, [keyFilter]);

  let readKeycode = (e) => {
    e.preventDefault();
    let foundKey = QmkCodes.findKeycode(` ${e.key} `, list.list);
    if (!foundKey) {
      sendToast("Key not found", "alert-error");
      return;
    }
    if (targetOS !== "any" && foundKey.os && foundKey.os[targetOS] === false) {
      sendToast(
        `Key ${foundKey.code} not available for ${targetOS}`,
        "alert-error"
      );
    }
    let newSelectedKey = { ...selectedKey };
    newSelectedKey.code = customKeycodeCreator(
      QmkCodes.getAppropriatedCode(foundKey, list.structure)
    );

    setSelectedKey(newSelectedKey);
    updateKeys(newSelectedKey);
    setKeyFilter("");
  };

  let manuallySelectedKey = (key) => {
    if (
      targetOS !== "any" &&
      Object.keys(key).includes("os") &&
      !key.os[targetOS.toLowerCase()]
    ) {
      sendToast(`Key ${key.code} not available for ${targetOS}`, "alert-error");
    }
    let newSelectedKey = { ...selectedKey };
    newSelectedKey.code = customKeycodeCreator(
      QmkCodes.getAppropriatedCode(key, list.structure)
    );

    setSelectedKey(newSelectedKey);
    updateKeys(newSelectedKey);
    setKeyFilter("");
  };

  return (
    <>
      <div className="w-full h-fit flex flex-col gap-2">
        {keyboardInput && (
          <input
            id="keyboard-input"
            className="input input-bordered w-full input-sm"
            placeholder="Clone keyboard input"
            onKeyDown={readKeycode}
            value={selectedKey.code === "EMPTY" ? "" : selectedKey.code}
          />
        )}
        <input
          className="input input-bordered w-full input-sm"
          placeholder="Search key"
          onChange={(e) => setKeyFilter(e.target.value)}
          value={keyFilter}
        />
      </div>
      <div className="w-full h-full flex flex-col items-start justify-start gap-2 overflow-y-scroll scrollbar-thumb-base-100 scrollbar-track-base-300 scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thin">
        {listShow &&
          listShow.map((el) => (
            <button
              key={el.item.code}
              onClick={() => manuallySelectedKey(el.item)}
              className="btn btn-neutral btn-sm w-full flex flex-col justify-start items-center h-fit py-2"
            >
              <p className="">{el.item.code}</p>
              <p
                className="font-thin"
                dangerouslySetInnerHTML={{
                  __html: el.item.descriptionUnformatted,
                }}
              />
            </button>
          ))}
      </div>
    </>
  );
}
