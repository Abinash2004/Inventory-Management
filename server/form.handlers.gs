function form_1_1(data) {
  if (!data) {
    return { status: 0, message: "invalid payload" };
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const mainSheet = ss.getSheetByName("main_sheet");

  if (!mainSheet) {
    return { status: 0, message: "main_sheet not found" };
  }

  const nextRow = getFirstEmptyRow(mainSheet, "A2:A");
  const payload = {
    "SERIAL NUMBER": nextRow - 1,
    "CHASSIS NUMBER": normalize(data.chassis),
    "ENGINE NUMBER": normalize(data.engine),
    "MODEL": normalize(data.model),
    "COLOR": normalize(data.color),
    "CURRENT COUNTER": normalize(data.counter),
    "KEY NUMBER": normalize(data.key),
    "STOCK STATUS": "STOCK"
  };

  const requiredFields = [
    payload["CHASSIS NUMBER"],
    payload["ENGINE NUMBER"],
    payload["MODEL"],
    payload["COLOR"],
    payload["CURRENT COUNTER"]
  ];

  if (requiredFields.some(v => !v)) {
    return { status: 0, message: "some fields are missing" };
  }
  if (isDuplicateEntry(mainSheet,payload["CHASSIS NUMBER"],MAIN_SHEET_MAP["CHASSIS NUMBER"])) {
    return { status: 0, message: "chassis number already exists" };
  }

  safeWriteRow(mainSheet, nextRow, payload, MAIN_SHEET_MAP);
  addToTimeSheet("FORM-1.1", payload["CHASSIS NUMBER"], TIME_SHEET_MAP);
  return { status: 1, message: "stock data added successfully" };
}

//------------------------------------------------------------------------------------------------------------------

function form_1_2(data) {
  if (!data) {
    return { status: 0, message: "invalid payload" };
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const mainSheet = ss.getSheetByName("main_sheet");

  if (!mainSheet) {
    return { status: 0, message: "main_sheet not found" };
  }

  const chassis = normalize(data.chassis);
  const rowIndex = getRowIndexHandler(mainSheet,chassis,MAIN_SHEET_MAP["CHASSIS NUMBER"]);

  if (rowIndex === -1) {
    return { status: 0, message: "chassis does not exist" };
  }

  const payload = {
    "INVOICE DATE": data.date || "",
    "PURCHASED INVOICE NUMBER": normalize(data.invoice),
    "GROSS VALUE BEFORE DISCOUNT": normalize(data.gvbd)
  };

  const requiredFields = [
    chassis,
    payload["INVOICE DATE"],
    payload["PURCHASED INVOICE NUMBER"],
    payload["GROSS VALUE BEFORE DISCOUNT"]
  ];

  if (requiredFields.some(v => !v)) {
    return { status: 0, message: "some fields are missing" };
  }

  safeWriteRow(mainSheet, rowIndex, payload, MAIN_SHEET_MAP);
  addToTimeSheet("FORM-1.2", chassis, TIME_SHEET_MAP);
  return { status: 1, message: "invoice added successfully" };
}

//------------------------------------------------------------------------------------------------------------------

function form_1_3(data) {
  if (!data) {
    return { status: 0, message: "invalid payload" };
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const mainSheet = ss.getSheetByName("main_sheet");

  if (!mainSheet) {
    return { status: 0, message: "main_sheet not found" };
  }

  const chassis = normalize(data.chassis);
  const payload = {
    "CURRENT COUNTER": normalize(data.counter)
  };

  const requiredFields = [
    chassis,
    payload["CURRENT COUNTER"]
  ];

  if (requiredFields.some(v => !v)) {
    return { status: 0, message: "some fields are missing" };
  }

  const rowIndex = getRowIndexHandler(
    mainSheet,
    chassis,
    MAIN_SHEET_MAP["CHASSIS NUMBER"]
  );

  if (rowIndex === -1) {
    return { status: 0, message: "chassis does not exist" };
  }

  safeWriteRow(mainSheet, rowIndex, payload, MAIN_SHEET_MAP);
  addToTimeSheet("FORM-1.3", chassis, TIME_SHEET_MAP);
  return { status: 1, message: "stock moved successfully" };
}

//------------------------------------------------------------------------------------------------------------------

function form_2_1(data) {
  if (!data) {
    return { status: 0, message: "invalid payload" };
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const advanceSheet = ss.getSheetByName("advance_sheet");

  if (!advanceSheet) {
    return { status: 0, message: "advance_sheet not found" };
  }

  const nextRow = getFirstEmptyRow(advanceSheet, "A2:A");
  const payload = {
    "ADVANCE DATE": new Date(Date.now()),
    "ADVANCER NAME": normalize(data.advancer_name),
    "MOBILE NUMBER": normalize(data.mobile_number),
    "AMOUNT": normalize(data.amount),
    "COUNTER": normalize(data.counter),
    "RECEIVER NAME": normalize(data.receiver_name),
    "MODEL": normalize(data.model),
    "STATUS": "RECEIVED",
    "ALTERNATE MOBILE NUMBER": normalize(data.alternate_mobile_number),
    "COLOR": normalize(data.color),
    "REMARK": normalize(data.remark)
  };

  const requiredFields = [
    payload["ADVANCER NAME"],
    payload["MOBILE NUMBER"],
    payload["AMOUNT"],
    payload["COUNTER"],
    payload["RECEIVER NAME"],
    payload["MODEL"]
  ];

  if (requiredFields.some(v => !v)) {
    return { status: 0, message: "some fields are missing" };
  }

  if (isDuplicateAdvancerEntry(advanceSheet,payload["ADVANCER NAME"])) {
    return { status: 0, message: "advancer already exists" };
  }

  safeWriteRow(advanceSheet, nextRow, payload, ADVANCE_SHEET_MAP);
  addToTimeSheet("FORM-2.1", payload["ADVANCER NAME"], TIME_SHEET_MAP);
  return { status: 1, message: "advance payment added successfully" };
}

//------------------------------------------------------------------------------------------------------------------

function form_2_2(data) {
  if (!data) {
    return { status: 0, message: "invalid payload" };
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const advanceSheet = ss.getSheetByName("advance_sheet");

  if (!advanceSheet) {
    return { status: 0, message: "advance_sheet not found" };
  }

  const payload = {
    "ADVANCER NAME": normalize(data.advancer_name),
    "ADVANCE RETURN": normalize(data.advance_return),
    "RETURN PERSON": normalize(data.return_person),
    "STATUS": "RETURNED"
  };

  const requiredFields = [
    payload["ADVANCER NAME"],
    payload["ADVANCE RETURN"],
    payload["RETURN PERSON"]
  ];

  if (requiredFields.some(v => !v)) {
    return { status: 0, message: "some fields are missing" };
  }

  const rowIndex = getAdvancerRowIndexHandler(
    advanceSheet,
    payload["ADVANCER NAME"]
  );

  if (rowIndex === -1) {
    return { status: 0, message: "advancer does not exist" };
  }

  safeWriteRow(advanceSheet, rowIndex, payload, ADVANCE_SHEET_MAP);
  addToTimeSheet("FORM-2.2", payload["ADVANCER NAME"], TIME_SHEET_MAP);
  return { status: 1, message: "advance returned successfully" };
}

//------------------------------------------------------------------------------------------------------------------

function form_3_1(data) {
  if (!data) {
    return { status: 0, message: "invalid payload" };
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const mainSheet = ss.getSheetByName("main_sheet");

  if (!mainSheet) {
    return { status: 0, message: "main_sheet not found" };
  }

  const chassis = normalize(data.chassis);

  const payload = {
    "SALE COUNTER": normalize(data.sale_counter),
    "STOCK STATUS": normalize(data.stock_status),
    "SALE DATE": data.sale_date || "",
    "CUSTOMER NAME": normalize(data.customer_name),
    "SALES PERSON": normalize(data.sales_person)
  };

  if (payload["STOCK STATUS"] === "B2C") {
    payload["MOBILE NUMBER"] = normalize(data.mobile_number);
    payload["CASH / FINANCE"] = normalize(data.cash_or_finance);
    payload["FINANCER"] = normalize(data.financer);
  }

  const requiredFields = [
    chassis,
    payload["SALE COUNTER"],
    payload["STOCK STATUS"],
    payload["SALE DATE"],
    payload["CUSTOMER NAME"],
    payload["SALES PERSON"]
  ];

  if (payload["STOCK STATUS"] === "B2C") {
    requiredFields.push(
      payload["MOBILE NUMBER"],
      payload["CASH / FINANCE"],
      payload["FINANCER"]
    );
  }

  if (requiredFields.some(v => !v)) {
    return { status: 0, message: "some fields are missing" };
  }

  if (payload["STOCK STATUS"] === "B2C") {
    payload["ALTERNATE MOBILE NUMBER"] = normalize(data.alternate_mobile_number);
  }

  const rowIndex = getRowIndexHandler(
    mainSheet,
    chassis,
    MAIN_SHEET_MAP["CHASSIS NUMBER"]
  );

  if (rowIndex === -1) {
    return { status: 0, message: "chassis does not exist" };
  }

  safeWriteRow(mainSheet, rowIndex, payload, MAIN_SHEET_MAP);
  addToTimeSheet("FORM-3.1", chassis, TIME_SHEET_MAP);
  return { status: 1, message: "sale added successfully" };
}

//------------------------------------------------------------------------------------------------------------------

function form_3_2(data) {
  if (!data) {
    return { status: 0, message: "invalid payload" };
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const mainSheet = ss.getSheetByName("main_sheet");
  const advanceSheet = ss.getSheetByName("advance_sheet");

  if (!mainSheet) {
    return { status: 0, message: "main_sheet not found" };
  }

  const chassis = normalize(data.chassis);
  const anyAdvance = normalize(data.any_advance);
  const payload = {
    "PRICE TAG NUMBER": normalize(data.price_tag_number),
    "TOTAL DP": normalize(data.total_dp),
    "RECEIVED DP": normalize(data.received_dp),
    "ANY EXCHANGE": normalize(data.any_exchange)
  };

  if (anyAdvance === "YES") {
    payload["ADVANCER NAME"] = normalize(data.advancer_name);
    payload["ADVANCE AMOUNT"] = normalize(data.advance_amount);
  }

  if (payload["ANY EXCHANGE"] === "YES") {
    payload["EXCHANGE MODEL"] = normalize(data.exchange_model);
    payload["EXCHANGE REGISTER NUMBER"] = normalize(data.exchange_register_number);
    payload["CUSTOMER EXCHANGE VALUE"] = normalize(data.customer_exchange_value);
    payload["DEALER NAME"] = normalize(data.dealer_name);
    payload["DEALER EXCHANGE VALUE"] = normalize(data.dealer_exchange_value);
  }

  const requiredFields = [
    chassis,
    anyAdvance,
    payload["PRICE TAG NUMBER"],
    payload["TOTAL DP"],
    payload["RECEIVED DP"],
    payload["ANY EXCHANGE"]
  ];

  if (anyAdvance === "YES") {
    requiredFields.push(
      payload["ADVANCER NAME"],
      payload["ADVANCE AMOUNT"]
    );
  }

  if (payload["ANY EXCHANGE"] === "YES") {
    requiredFields.push(
      payload["EXCHANGE MODEL"],
      payload["EXCHANGE REGISTER NUMBER"],
      payload["CUSTOMER EXCHANGE VALUE"],
      payload["DEALER NAME"],
      payload["DEALER EXCHANGE VALUE"]
    );
  }

  if (requiredFields.some(v => !v)) {
    return { status: 0, message: "some fields are missing" };
  }

  const rowIndex = getRowIndexHandler(
    mainSheet,
    chassis,
    MAIN_SHEET_MAP["CHASSIS NUMBER"]
  );

  if (rowIndex === -1) {
    return { status: 0, message: "chassis does not exist" };
  }

  safeWriteRow(mainSheet, rowIndex, payload, MAIN_SHEET_MAP);

  if (anyAdvance === "YES") {
    if (!advanceSheet) {
      return { status: 0, message: "advance_sheet not found" };
    }

    const advanceRowIndex = getAdvancerRowIndexHandler(
      advanceSheet,
      payload["ADVANCER NAME"]
    );

    if (advanceRowIndex === -1) {
      return { status: 0, message: "advancer does not exist" };
    }

    safeWriteRow(
      advanceSheet,
      advanceRowIndex,
      { "STATUS": "PURCHASED" },
      ADVANCE_SHEET_MAP
    );
  }

  addToTimeSheet("FORM-3.2", chassis, TIME_SHEET_MAP);
  return { status: 1, message: "sale account added successfully" };
}

//------------------------------------------------------------------------------------------------------------------

function form_3_3(data) {
  if (!data) {
    return { status: 0, message: "invalid payload" };
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const mainSheet = ss.getSheetByName("main_sheet");

  if (!mainSheet) {
    return { status: 0, message: "main_sheet not found" };
  }

  const chassis = normalize(data.chassis);
  const payload = {
    "ESTIMATED DISBURSEMENT": normalize(data.estimated_disbursement)
  };

  const requiredFields = [
    chassis,
    payload["ESTIMATED DISBURSEMENT"]
  ];

  if (requiredFields.some(v => !v)) {
    return { status: 0, message: "some fields are missing" };
  }

  const rowIndex = getRowIndexHandler(
    mainSheet,
    chassis,
    MAIN_SHEET_MAP["CHASSIS NUMBER"]
  );

  if (rowIndex === -1) {
    return { status: 0, message: "chassis does not exist" };
  }

  safeWriteRow(mainSheet, rowIndex, payload, MAIN_SHEET_MAP);
  addToTimeSheet("FORM-3.3", chassis, TIME_SHEET_MAP);
  return { status: 1, message: "sale finance added successfully" };
}

//------------------------------------------------------------------------------------------------------------------

function form_3_4(data) {
  if (!data) {
    return { status: 0, message: "invalid payload" };
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const mainSheet = ss.getSheetByName("main_sheet");

  if (!mainSheet) {
    return { status: 0, message: "main_sheet not found" };
  }

  const chassis = normalize(data.chassis);
  const payload = {
    "SALE INVOICE NUMBER": normalize(data.sale_invoice_number)
  };

  const requiredFields = [
    chassis,
    payload["SALE INVOICE NUMBER"]
  ];

  if (requiredFields.some(v => !v)) {
    return { status: 0, message: "some fields are missing" };
  }

  const rowIndex = getRowIndexHandler(
    mainSheet,
    chassis,
    MAIN_SHEET_MAP["CHASSIS NUMBER"]
  );

  if (rowIndex === -1) {
    return { status: 0, message: "chassis does not exist" };
  }

  safeWriteRow(mainSheet, rowIndex, payload, MAIN_SHEET_MAP);
  addToTimeSheet("FORM-3.4", chassis, TIME_SHEET_MAP);
  return { status: 1, message: "sale invoice added successfully" };
}

//------------------------------------------------------------------------------------------------------------------

function form_4_1(data) {
  if (!data) {
    return { status: 0, message: "invalid payload" };
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const mainSheet = ss.getSheetByName("main_sheet");

  if (!mainSheet) {
    return { status: 0, message: "main_sheet not found" };
  }

  const chassis = normalize(data.chassis);
  const payload = {
    "INSURANCE AMOUNT": normalize(data.insurance_amount)
  };

  const requiredFields = [
    chassis,
    payload["INSURANCE AMOUNT"]
  ];

  if (requiredFields.some(v => !v)) {
    return { status: 0, message: "some fields are missing" };
  }

  const rowIndex = getRowIndexHandler(
    mainSheet,
    chassis,
    MAIN_SHEET_MAP["CHASSIS NUMBER"]
  );

  if (rowIndex === -1) {
    return { status: 0, message: "chassis does not exist" };
  }

  safeWriteRow(mainSheet, rowIndex, payload, MAIN_SHEET_MAP);
  addToTimeSheet("FORM-4.1", chassis, TIME_SHEET_MAP);
  return { status: 1, message: "insurance amount added successfully" };
}

//------------------------------------------------------------------------------------------------------------------

function form_4_2(data) {
  if (!data) {
    return { status: 0, message: "invalid payload" };
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const mainSheet = ss.getSheetByName("main_sheet");

  if (!mainSheet) {
    return { status: 0, message: "main_sheet not found" };
  }

  const chassis = normalize(data.chassis);
  const payload = {
    "RTO AMOUNT": normalize(data.rto_amount)
  };

  const requiredFields = [
    chassis,
    payload["RTO AMOUNT"]
  ];

  if (requiredFields.some(v => !v)) {
    return { status: 0, message: "some fields are missing" };
  }

  const rowIndex = getRowIndexHandler(
    mainSheet,
    chassis,
    MAIN_SHEET_MAP["CHASSIS NUMBER"]
  );

  if (rowIndex === -1) {
    return { status: 0, message: "chassis does not exist" };
  }

  safeWriteRow(mainSheet, rowIndex, payload, MAIN_SHEET_MAP);
  addToTimeSheet("FORM-4.2", chassis, TIME_SHEET_MAP);
  return { status: 1, message: "rto amount added successfully" };
}

//------------------------------------------------------------------------------------------------------------------

function form_4_3(data) {
  if (!data) {
    return { status: 0, message: "invalid payload" };
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const mainSheet = ss.getSheetByName("main_sheet");

  if (!mainSheet) {
    return { status: 0, message: "main_sheet not found" };
  }

  const chassis = normalize(data.chassis);
  const payload = {
    "REGISTRATION NUMBER": normalize(data.registration_number)
  };

  const requiredFields = [
    chassis,
    payload["REGISTRATION NUMBER"]
  ];

  if (requiredFields.some(v => !v)) {
    return { status: 0, message: "some fields are missing" };
  }

  const rowIndex = getRowIndexHandler(
    mainSheet,
    chassis,
    MAIN_SHEET_MAP["CHASSIS NUMBER"]
  );

  if (rowIndex === -1) {
    return { status: 0, message: "chassis does not exist" };
  }

  safeWriteRow(mainSheet, rowIndex, payload, MAIN_SHEET_MAP);
  addToTimeSheet("FORM-4.3", chassis, TIME_SHEET_MAP);
  return { status: 1, message: "registration number added successfully" };
}

//------------------------------------------------------------------------------------------------------------------

function form_4_4(data) {
  if (!data) {
    return { status: 0, message: "invalid payload" };
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const mainSheet = ss.getSheetByName("main_sheet");

  if (!mainSheet) {
    return { status: 0, message: "main_sheet not found" };
  }

  const chassis = normalize(data.chassis);
  const payload = {
    "DISBURSEMENT AMOUNT": normalize(data.disbursement_amount),
    "DISBURSEMENT DATE": data.disbursement_date || "",
    "DISBURSEMENT ACCOUNT": normalize(data.disbursement_account)
  };

  const requiredFields = [
    chassis,
    payload["DISBURSEMENT AMOUNT"],
    payload["DISBURSEMENT DATE"],
    payload["DISBURSEMENT ACCOUNT"]
  ];

  if (requiredFields.some(v => !v)) {
    return { status: 0, message: "some fields are missing" };
  }

  const rowIndex = getRowIndexHandler(
    mainSheet,
    chassis,
    MAIN_SHEET_MAP["CHASSIS NUMBER"]
  );

  if (rowIndex === -1) {
    return { status: 0, message: "chassis does not exist" };
  }

  safeWriteRow(mainSheet, rowIndex, payload, MAIN_SHEET_MAP);
  addToTimeSheet("FORM-4.4", chassis, TIME_SHEET_MAP);
  return { status: 1, message: "disbursement added successfully" };
}
