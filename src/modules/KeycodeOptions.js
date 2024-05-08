import React, { useEffect, useState } from "react";
import { QmkCodes } from "../utilities/qmk";
import Fuse from "fuse.js";

export default function KeycodeOptions({
  selectedKey,
  setSelectedKey,
  updateKeys,
}) {
  const [keyMode, setKeyMode] = useState("BasicKeycodes");
  const [qmkLists, setQmkLists] = useState(null);
  const [keyFilter, setKeyFilter] = useState("");
  const [fuse, setFuse] = useState(null);

  const [listShow, setListShow] = useState(null);

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/qmk/qmk_firmware/master/docs/keycodes.md"
    ).then((response) => {
      response.text().then((data) => {
        let newQmkLists = QmkCodes.parseFullList(data);
        setQmkLists(newQmkLists);
        setFuse(
          new Fuse(newQmkLists[keyMode], {
            keys: ["code", "descriptionUnformatted"],
          })
        );
        setListShow(newQmkLists[keyMode].map((el) => ({ item: el })));
      });
    });
  }, []);

  useEffect(() => {
    if (!fuse) return;
    if (qmkLists === null) return;
    if (keyFilter === "") {
      setListShow(qmkLists[keyMode].map((el) => ({ item: el })));
      return;
    }
    const timeout = setTimeout(() => {
      let list = fuse.search(keyFilter);
      setListShow(list);
    }, 500);
  }, [keyFilter]);

  useEffect(() => {
    if (!qmkLists) return;
    setFuse(
      new Fuse(qmkLists[keyMode], {
        keys: ["code", "descriptionUnformatted"],
      })
    );
    setListShow(qmkLists[keyMode].map((el) => ({ item: el })));
  }, [keyMode]);

  return selectedKey ? (
    <div className="w-full h-full">
      <h1 className="">{`Key Options of ${selectedKey.id}`}</h1>
      <div className="h-full flex flex-col items-start gap-2 p-2 w-full">
        <select
          onChange={(e) => setKeyMode(e.target.value)}
          className="select select-bordered w-full"
        >
          {qmkLists &&
            Object.keys(qmkLists).map((list) => (
              <option defaultChecked={keyMode === list} value={list}>
                {list}
              </option>
            ))}
          {/* <option value={"keycode"} defaultChecked>
            KeyCode
          </option> */}
        </select>
        {keyMode === "BasicKeycodes" ? (
          <input
            className="input input-bordered w-full"
            placeholder="Clone keyboard input"
            onKeyDown={(e) => {
              e.preventDefault();
              let list = listShow.map((el) => el.item);
              let foundKey = QmkCodes.findKeycode(e.key, list);
              let newSelectedKey = {
                ...selectedKey,
              };
              if (foundKey) {
                newSelectedKey.code =
                  foundKey.code.length > 7 && foundKey.alternative.length > 0
                    ? foundKey.alternative[0]
                    : foundKey.code;
              } else {
                newSelectedKey = "KC_" + e.key.toUpperCase();
              }
              setSelectedKey(newSelectedKey);
              updateKeys(newSelectedKey);
            }}
            value={selectedKey.code}
          />
        ) : (
          <></>
        )}

        <input
          className="input input-bordered w-full "
          placeholder="Search key"
          onChange={(e) => setKeyFilter(e.target.value)}
          value={keyFilter}
        />
        <div className="w-full h-full flex flex-col items-start gap-2 overflow-y-scroll scrollbar-hidden relative">
          {listShow &&
            listShow.map((el) => {
              return (
                <button
                  className="btn btn-neutral h-fit flex-nowrap py-1 flex flex-col items-center justify-center w-full"
                  onClick={() => {
                    let newSelectedKey = {
                      ...selectedKey,
                      code:
                        el.item.code.length > 7
                          ? el.item.alternative[0]
                          : el.item.code,
                    };
                    setSelectedKey(newSelectedKey);
                    updateKeys(newSelectedKey);
                    setKeyFilter("");
                  }}
                >
                  <p className=" text-base">{el.item.code}</p>
                  <p className="text-sx font-thin">
                    {el.item.descriptionUnformatted}
                  </p>
                </button>
              );
            })}
        </div>
      </div>
    </div>
  ) : (
    <div className="w-full"></div>
  );
}
