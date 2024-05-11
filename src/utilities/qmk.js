export class QmkCodes {
  static parseFullList(listFromQmk) {
    let listArray = listFromQmk.split("\n");
    let lists = {};
    let listTitle = "";
    let structure = [];
    listArray.forEach((el, idx) => {
      if (el.slice(0, 4) === "|Key") {
        let str = el.split("|").map((el) => el.trim());
        structure = [];
        str.forEach((el, idx) => {
          if (el.includes("Key")) structure.push("code");
          if (el.includes("Aliases")) structure.push("alternative");
          if (el.includes("Description")) {
            structure.push("description");
          }
          if (el.includes("Windows")) structure.push("windows");
          if (el.includes("macOS")) structure.push("macos");
          if (el.includes("Linux")) structure.push("linux");
        });
        listTitle = this.parseListName(listArray[idx - 2]);
        lists[listTitle[1]] = {
          title: listTitle[0],
          structure: structure,
          list: [],
        };
      } else {
        if (el[0] === "|" && el[1] !== "-")
          lists[listTitle[1]].list.push(this.parseRow(el, structure));
      }
    });

    lists["BasicKeycodes"].list = lists["BasicKeycodes"].list.concat(
      lists["USANSIShiftedSymbols"].list
    );
    delete lists["USANSIShiftedSymbols"];

    return lists;
  }

  static parseListName(listNameRow) {
    let title = listNameRow.split("[")[1].split("]")[0];
    return [title, title.replace(/\s+/g, "")];
  }

  static parseRow(row, structure) {
    let rowArrayUnformatted = row.split("|").map((el) => el.trim());
    let rowArray = rowArrayUnformatted.map((el) => el.replace(/`/g, ""));
    let res = {};
    for (let i = 0; i < structure.length; i++) {
      switch (structure[i]) {
        case "code":
          res[structure[i]] = rowArray[i + 1];
          break;
        case "alternative":
          let arrayOfAternatives = rowArray[i + 1]
            .split(",")
            .map((el) => el.trim());
          let isEmpty = arrayOfAternatives.every((el) => el.length === 0);
          if (isEmpty) res[structure[i]] = [];
          else
            res[structure[i]] = rowArray[i + 1]
              .split(",")
              .map((el) => el.trim());
          break;
        case "description":
          res[structure[i]] = " " + rowArray[i + 1].replace(/and/g, "") + " ";
          res[structure[i] + "Unformatted"] = rowArray[i + 1];
          break;
        case "windows":
          res.os = {
            ...res.os,
            windows:
              rowArray[i + 1].includes("*N/A*") ||
              rowArray[i + 1].includes("✔"),
          };
          break;
        case "macos":
          res.os = {
            ...res.os,
            macos:
              rowArray[i + 1].includes("*N/A*") ||
              rowArray[i + 1].includes("✔"),
          };
          break;
        case "linux":
          res.os = {
            ...res.os,
            linux:
              rowArray[i + 1].includes("*N/A*") ||
              rowArray[i + 1].includes("✔"),
          };
          break;
        default:
          break;
      }
    }

    return res;
  }

  /**
   *
   * @param {*} keycode
   * @param {*} list
   * @returns key if found null if not
   */
  static findKeycode(keycode, list) {
    for (let i = 0; i < list.length; i++) {
      let key = list[i];
      if (key.description.includes(keycode)) {
        return key;
      }
    }
    return null;
  }

  static getAppropriatedCode(key, structure) {
    let res = key.code;
    if (
      key.code.length > 7 &&
      structure &&
      structure.includes("alternative") &&
      key.alternative.length > 0
    )
      res = key.alternative[0];

    return res;
  }

  static parseConfig(configIn, kbMatrix, layoutName) {
    let kb = {};
    let config = configIn.replace(/\s+/g, "");
    let layersInConfig = config.split(layoutName + "(");

    layersInConfig.forEach((layer) => {
      if (layer.endsWith("]=")) {
        let layerSplit = layer.split("[");
        let layerName = layer.split("[")[layerSplit.length - 1].split("]")[0];
        kb[layerName] = Object.values(kbMatrix)[0];
      }
    });

    layersInConfig.shift();

    layersInConfig = layersInConfig.map((layer, idx) => {
      if (idx === layersInConfig.length - 1) {
        return layer.split(")};")[0];
      } else if (layer.endsWith("]=")) {
        return layer.split("),[")[0];
      }
      return "";
    });


    layersInConfig.forEach((layer, layeridx) => {
      let layerSplit = layer.split(",");

      layerSplit.forEach((el, idx) => {
        if (el.includes("(") && !el.includes(")")) {
          layerSplit[idx] += ", " + layerSplit[idx + 1];
          layerSplit.splice(idx + 1, 1);
        }
      });

      let keysArray = [];
      layerSplit.forEach((key, keyidx) => {
        let keystruct = { ...Object.values(kb)[0][keyidx] };
        keystruct.code = key;
        keysArray.push(keystruct);
      });

      kb[Object.keys(kb)[layeridx]] = keysArray;
    });

    return kb;
  }
}
