function setStatus(sheet, message, cell, category) {
  sheet
  .getRange(cell)
  .setValue(message)
  .setFontWeight("bold")
  .setFontColor((category) ? "green" : "red");
}

//---------------------------------------------------------------------------------------------

function getSerialNumber(mainSheet) {
  const lastRow = mainSheet.getLastRow();
  if (lastRow < 2) return 1;
  const lastValue = mainSheet.getRange(lastRow, 1).getValue();
  return (Number(lastValue) || 0) + 1;
}

//---------------------------------------------------------------------------------------------

function getFirstEmptyRow(sheet, columnRange) {
  const range = sheet.getRange(columnRange);
  const values = range.getValues();
  const startRow = range.getRow();
  for (let i = 0; i < values.length; i++) {
    if (!values[i][0]) return startRow + i;
  }
  return sheet.getLastRow() + 1;
}

//---------------------------------------------------------------------------------------------

function isDuplicateEntry(sheet, input, column) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return false;
  const data = sheet.getRange(2, column, lastRow - 1, 1).getValues();
  console.log(data);
  for (let i = 0; i < data.length; i++) {
    if (String(data[i][0]).trim().toUpperCase() === input) return true;
  }
  return false;
}


//---------------------------------------------------------------------------------------------

function getRowIndexHandler(sheet, input, column) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return -1;
  const data = sheet.getRange(2, column, lastRow - 1, 1).getValues();
  for (let i = 0; i < data.length; i++) {
    if (data[i][0] === input) {
      return i + 2;
    }
  }
  return -1;
}

//---------------------------------------------------------------------------------------------

function isDuplicateAdvancerEntry(sheet, input) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return false;
  const data = sheet.getRange(2, 2, lastRow - 1, 10).getValues();
  for (let i = 0; i < data.length; i++) {
    if (
      String(data[i][0]).trim().toUpperCase() === input && 
      String(data[i][9]).trim().toUpperCase() === "RECEIVED"
    ) return true;
  }
  return false;
}

//---------------------------------------------------------------------------------------------

function getAdvancerRowIndexHandler(sheet, input) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return -1;
  const data = sheet.getRange(2, 2, lastRow - 1, 10).getValues();
  for (let i = 0; i < data.length; i++) {
    if (data[i][0] === input && data[i][9] === "RECEIVED") {
      return i + 2;
    }
  }
  return -1;
}

//---------------------------------------------------------------------------------------------