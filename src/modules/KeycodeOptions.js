/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { QmkCodes } from "../utilities/qmk";
import Fuse from "fuse.js";

export default function KeycodeOptions({
  selectedKey,
  setSelectedKey,
  updateKeys,
  targetOS,
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
          new Fuse(newQmkLists[keyMode].list, {
            keys: ["code", "descriptionUnformatted"],
          })
        );
        setListShow(newQmkLists[keyMode].list.map((el) => ({ item: el })));
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!fuse) return;
    if (qmkLists === null) return;
    if (keyFilter === "") {
      setListShow(qmkLists[keyMode].list.map((el) => ({ item: el })));
      return;
    }
    const timeout = setTimeout(() => {
      let list = fuse.search(keyFilter);
      setListShow(list);
    }, 500);
    return () => clearTimeout(timeout);
  }, [keyFilter]);

  useEffect(() => {
    if (!qmkLists) return;
    setFuse(
      new Fuse(qmkLists[keyMode].list, {
        keys: ["code", "descriptionUnformatted"],
      })
    );
    setListShow(qmkLists[keyMode].list.map((el) => ({ item: el })));
  }, [keyMode]);

  return selectedKey ? (
    <div className="w-full h-full flex flex-col items-start justify-start gap-2">
      <h1 className="text-xl font-semibold mb-2">{`Key Options of ${selectedKey.id}`}</h1>
      <select
        onChange={(e) => setKeyMode(e.target.value)}
        className="select select-bordered w-full"
      >
        {qmkLists &&
          Object.keys(qmkLists).map((list) => (
            <option defaultChecked={keyMode === list} value={list}>
              {qmkLists[list].title}
            </option>
          ))}
        {/* <option value={"keycode"} defaultChecked>
            KeyCode
          </option> */}
      </select>
      {keyMode === "BasicKeycodes" ? (
        <input
          className="input input-bordered w-full py-2"
          placeholder="Clone keyboard input"
          onKeyDown={(e) => {
            e.preventDefault();
            let list = listShow.map((el) => el.item);
            let foundKey = QmkCodes.findKeycode(" " + e.key + " ", list);
            let newSelectedKey = {
              ...selectedKey,
            };
            if (foundKey) {
              newSelectedKey.code =
                foundKey.code.length > 7 && foundKey.alternative.length > 0
                  ? foundKey.alternative[0]
                  : foundKey.code;
            } else {
              newSelectedKey.code = "kc not found";
            }
            if (targetOS !== "any" && foundKey && !foundKey.os[targetOS.toLowerCase()]) {
              document
                .getElementById("toaster")
                .appendChild(
                  document.createElement("div")
                ).innerHTML = `<div class="alert alert-error"><span>Keycode ${foundKey.code} not available for ${targetOS}</span></div>`;
              setTimeout(() => {
                document
                  .getElementById("toaster")
                  .removeChild(document.getElementById("toaster").firstChild);
              }, 3000);
            }
            setSelectedKey(newSelectedKey);
            updateKeys(newSelectedKey);
          }}
          value={selectedKey.code === "EMPTY" ? "" : selectedKey.code}
        />
      ) : (
        <></>
      )}

      <input
        className="input input-bordered w-full h-fit py-2"
        placeholder="Search key"
        onChange={(e) => setKeyFilter(e.target.value)}
        value={keyFilter}
      />
      <div className="w-full h-full flex flex-col items-start gap-2 overflow-y-scroll scrollbar-hidden relative ">
        {listShow &&
          listShow.map((el) => {
            return (
              <button
                className="btn btn-neutral h-fit flex-nowrap py-1 flex flex-col items-center justify-center w-full"
                onClick={() => {
                  let newSelectedKey = {
                    ...selectedKey,
                    code:
                      el.item.code.length > 7 && el.item.alternative.length > 0
                        ? el.item.alternative[0]
                        : el.item.code,
                  };
                  if (
                    targetOS !== "any" &&
                    !el.item.os[targetOS.toLowerCase()]
                  ) {
                    document
                      .getElementById("toaster")
                      .appendChild(
                        document.createElement("div")
                      ).innerHTML = `<div class="alert alert-error"><span>Keycode ${el.item.code} not available for ${targetOS}</span></div>`;
                    setTimeout(() => {
                      document
                        .getElementById("toaster")
                        .removeChild(
                          document.getElementById("toaster").firstChild
                        );
                    }, 3000);
                  }
                  setSelectedKey(newSelectedKey);
                  updateKeys(newSelectedKey);
                  setKeyFilter("");
                }}
              >
                <p className=" text-base">{el.item.code}</p>
                <p className="text-sx font-thin" dangerouslySetInnerHTML={{__html: el.item.descriptionUnformatted}} />
              </button>
            );
          })}
      </div>
      <div className="toast" id="toaster"></div>
    </div>
  ) : (
    <div className="w-full h-full flex flex-col items-start justify-start">
      <h1 className="text-xl font-semibold mb-2">{`Key Options`}</h1>
    </div>
  );
}
