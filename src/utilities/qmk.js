export class QmkCodes{

  static parseFullList(listFromQmk){
    let listArray = listFromQmk.split("\n")
    let lists = {}
    let listTitle = ""
    listArray.forEach((el, idx) => {
      if (el.slice(0,4) === "|Key"){
        listTitle = this.parseListName(listArray[idx-2])
        lists[listTitle] = []
      }else{
        if(el[0] === "|" && el[1] !== "-")
          lists[listTitle].push(this.parseRow(el))
      }
    });
    return lists
  }

  static parseListName(listNameRow){
    return listNameRow.split("[")[1].split("]")[0].replace(/\s+/g, '')
  }

  static parseRow(row){
    let rowArrayUnformatted = row.split("|").map((el) => el.trim())
    let rowArray = rowArrayUnformatted.map((el) => el.replace(/`/g, ""))
    return {
      code: rowArray[1],
      alternative: rowArray[2].split(",").map((el) => el.trim()),
      description: rowArray[3].replace(/and/g, ""),
      descriptionUnformatted: rowArrayUnformatted[3].replace(/`/g, ""),
      os: {
        windows: rowArray[4] === "✔",
        mac: rowArray[5] === "✔",
        linux: rowArray[6] === "✔",
      }
    }
  }

  static findKeycode(keycode, list){
    for (let i = 0; i < list.length; i++){
        let key = list[i]
        if (key.description.includes(keycode)){
          return key
        }
      
    }
    return null
  }
}