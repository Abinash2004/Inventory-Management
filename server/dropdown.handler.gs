function get_dropdown(columnIndex) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName("collection");

  if (!sheet) {
    return { status: 0, message: "collection not found" };
  }

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return { status: 1, data: [] };
  }

  const values = sheet
  .getRange(2, columnIndex, lastRow - 1, 1)
  .getValues()
  .flat()
  .filter(Boolean);
  
  const unique = [...new Set(values)];
  return { status: 1, data: unique };
}
