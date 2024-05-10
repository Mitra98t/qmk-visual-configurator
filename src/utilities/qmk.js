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
            windows: rowArray[i + 1].includes("*N/A*")||rowArray[i + 1].includes("✔"),
          };
          break;
        case "macos":
          res.os = {
            ...res.os,
            macos: rowArray[i + 1].includes("*N/A*")||rowArray[i + 1].includes("✔"),
          };
          break;
        case "linux":
          res.os = {
            ...res.os,
            linux: rowArray[i + 1].includes("*N/A*")||rowArray[i + 1].includes("✔"),
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

  static parseConfig(config, kbMatrix) {
    let kb = { ...kbMatrix };
    let configArray = config.split("\n");
    let layers = [];
    configArray.forEach((line, idx) => {
      if (line.includes("enum") && line.includes("layer_names")) {
        layers = config.split("\n").slice(idx, configArray.length).join("");
        layers = layers.split("}")[0];
        layers = layers.split("{")[1];
        layers = layers.split(",");
        layers = layers.map((el) => el.trim());
        layers.forEach((layer) => {
          kb[layer] = Object.values(kb)[0].map((key) => {
            return { ...key };
          });
        });
      }
    });

    let keymaps = config.replace(/\s+/g, "").split("constuint16_t")[1];
    keymaps = keymaps.split("{")[1].split("};")[0];
    keymaps = keymaps.split("[");
    keymaps.shift();
    keymaps = keymaps.map((km) => {
      let layername = km.split("]")[0];
      let kmarr = km.split("(");
      kmarr.shift();
      kmarr = kmarr.join("(");
      if (kmarr.endsWith(")")) kmarr = kmarr.substring(0, kmarr.length - 1);
      if (kmarr.endsWith("),")) kmarr = kmarr.substring(0, kmarr.length - 2);
      kmarr = kmarr.split(",");
      kmarr.forEach((el, idx) => {
        if (el.includes("(")) {
          kmarr[idx] += ", " + kmarr[idx + 1];
          kmarr.splice(idx + 1, 1);
        }
      });
      return { layer: layername, keymaps: kmarr };
    });
    keymaps.forEach((km, idx) => {
      km.keymaps.forEach((key, idx) => {
        kb[km.layer][idx].code = key;
      });
    });

    Object.keys(kb).forEach((layer) => {
      if (!layers.includes(layer)) delete kb[layer];
    });

    return kb;
  }
}
