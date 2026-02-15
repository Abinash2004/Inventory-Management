function get_advance_amount(advancer_name) {
  if (!advancer_name) {
    return { status: 0, message: "invalid advancer name" };
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const advanceSheet = ss.getSheetByName("advance_sheet");

  if (!advanceSheet) {
    return { status: 0, message: "advance_sheet not found" };
  }

  const rowIndex = getAdvancerRowIndexHandler(
    advanceSheet,
    advancer_name
  );

  if (rowIndex === -1) {
    return { status: 0, message: "advancer does not exist or not active" };
  }

  // Get AMOUNT (col 5) from the map
  const amountCol = ADVANCE_SHEET_MAP["AMOUNT"];

  // Fetch only the specific cell
  const amount = advanceSheet.getRange(rowIndex, amountCol).getValue();

  return {
    status: 1,
    data: {
      amount: amount
    }
  };
}
