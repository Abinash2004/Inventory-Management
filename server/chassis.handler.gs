function get_model_color(chassis) {
  if (!chassis) {
    return { status: 0, message: "invalid chassis number" };
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const mainSheet = ss.getSheetByName("main_sheet");

  if (!mainSheet) {
    return { status: 0, message: "main_sheet not found" };
  }

  const rowIndex = getRowIndexHandler(
    mainSheet,
    chassis,
    MAIN_SHEET_MAP["CHASSIS NUMBER"]
  );

  if (rowIndex === -1) {
    return { status: 0, message: "chassis does not exist" };
  }

  // Get MODEL (col 8) and COLOR (col 9) from the map
  const modelCol = MAIN_SHEET_MAP["MODEL"];
  const colorCol = MAIN_SHEET_MAP["COLOR"];
  const customerCol = MAIN_SHEET_MAP["CUSTOMER NAME"];

  // Fetch only the specific cells for optimization
  const model = mainSheet.getRange(rowIndex, modelCol).getValue();
  const color = mainSheet.getRange(rowIndex, colorCol).getValue();
  const customer = mainSheet.getRange(rowIndex, customerCol).getValue();

  return {
    status: 1,
    data: {
      model: model,
      color: color,
      customer: customer
    }
  };
}
