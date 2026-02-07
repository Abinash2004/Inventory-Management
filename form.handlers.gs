function form_1_1() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const inputForm = ss.getSheetByName("Input_Form");
  const mainSheet = ss.getSheetByName("Main_Sheet");
  
  if (!inputForm) throw new Error("Input_Form not found");
  if (!mainSheet) throw new Error("Main_Sheet not found");
    
  const data = {
    "SERIAL NUMBER": getSerialNumber(mainSheet),
    "CHASSIS NUMBER": inputForm.getRange("C3").getValue().toString().trim().toUpperCase(),
    "ENGINE NUMBER": inputForm.getRange("C4").getValue().toString().trim().toUpperCase(),
    "MODEL": inputForm.getRange("C6").getValue().toString().trim().toUpperCase(),
    "COLOR": inputForm.getRange("C7").getValue().toString().trim().toUpperCase(),
    "CURRENT COUNTER": inputForm.getRange("C8").getValue().toString().trim().toUpperCase(),
    "STOCK STATUS": "STOCK"
  };

  if (Object.values(data).some(v => !v)) {
    setStatus(inputForm, "SOME FIELDS ARE MISSING","B9:C9",false);
    return;
  }
  if (isDuplicateEntry(mainSheet, data["CHASSIS NUMBER"],7)) {
    setStatus(inputForm, "CHASSIS NUMBER ALREADY EXISTS","B9:C9",false);
    return;
  }

  let inputData = inputForm.getRange("C5").getValue();
  data["KEY NUMBER"] = inputData ? inputData.toString().trim().toUpperCase() : "";

  const nextRow = getFirstEmptyRow(mainSheet, "A2:A");
  safeWriteRow(mainSheet, nextRow, data, MAIN_SHEET_MAP);

  inputForm.getRange("C3:C8").clearContent();
  setStatus(inputForm, "STOCK ADDED SUCCESSFULLY", "B9:C9", true);
  addToTimeSheet("FORM-1.1",data["CHASSIS NUMBER"], TIME_SHEET_MAP);
}

//------------------------------------------------------------------------------------------------------------------

function form_1_2() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const inputForm = ss.getSheetByName("Input_Form");
  const mainSheet = ss.getSheetByName("Main_Sheet");
  
  if (!inputForm) throw new Error("Input_Form not found");
  if (!mainSheet) throw new Error("Main_Sheet not found");

  const chassis = inputForm.getRange("F3").getValue().toString().trim().toUpperCase();
  const date = inputForm.getRange("F4").getValue();
  const invoice = inputForm.getRange("F5").getValue().toString().trim().toUpperCase();
  const gvbd = inputForm.getRange("F6").getValue().toString().trim().toUpperCase();

  if ([chassis, invoice, gvbd].some(v => v === "") || !date) {
    setStatus(inputForm, "SOME FIELDS ARE MISSING", "E7:F7", false);
    return;
  }

  const data = {
    "INVOICE DATE": date,
    "PURCHASED INVOICE NUMBER": invoice,
    "GROSS VALUE BEFORE DISCOUNT": gvbd
  };

  const rowIndex = getRowIndexHandler(mainSheet, chassis, 7);
  console.log(rowIndex);
  if (rowIndex === -1) {
    setStatus(inputForm, "CHASSIS DOES NOT EXIST", "E7:F7", false);
    return;
  }

  safeWriteRow(mainSheet, rowIndex, data, MAIN_SHEET_MAP);
  inputForm.getRange("F3:F6").clearContent();
  setStatus(inputForm, "INVOICE ADDED SUCCESSFULLY", "E7:F7", true);
  addToTimeSheet("FORM-1.2",chassis, TIME_SHEET_MAP);
}

//------------------------------------------------------------------------------------------------------------------

function form_1_3() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const inputForm = ss.getSheetByName("Input_Form");
  const mainSheet = ss.getSheetByName("Main_Sheet");
  
  if (!inputForm) throw new Error("Input_Form not found");
  if (!mainSheet) throw new Error("Main_Sheet not found");

  const chassis = inputForm.getRange("I3").getValue().toString().trim().toUpperCase();
  const counter = inputForm.getRange("I4").getValue().toString().trim().toUpperCase();

  if ([chassis, counter].some(v => v === "")) {
    setStatus(inputForm, "SOME FIELDS ARE MISSING", "H5:I5", false);
    return;
  }

  const data = {
    "CURRENT COUNTER": counter,
  };

  const rowIndex = getRowIndexHandler(mainSheet, chassis, 7);
  if (rowIndex === -1) {
    setStatus(inputForm, "CHASSIS DOES NOT EXIST", "H5:I5", false);
    return;
  }

  safeWriteRow(mainSheet, rowIndex, data, MAIN_SHEET_MAP);
  inputForm.getRange("I3:I4").clearContent();
  setStatus(inputForm, "STOCK MOVED SUCCESSFULLY", "H5:I5", true);
  addToTimeSheet("FORM-1.3",chassis, TIME_SHEET_MAP);
}

//------------------------------------------------------------------------------------------------------------------

function form_2_1() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const inputForm = ss.getSheetByName("Input_Form");
  const advanceSheet = ss.getSheetByName("Advance_Sheet");
  
  if (!inputForm) throw new Error("Input_Form not found");
  if (!advanceSheet) throw new Error("Advance_Sheet not found");

  let data = {
    "ADVANCE DATE":new Date(Date.now()),
    "ADVANCER NAME":inputForm.getRange("C14").getValue().toString().trim().toUpperCase(),
    "MOBILE NUMBER":inputForm.getRange("C15").getValue().toString().trim().toUpperCase(),
    "AMOUNT":inputForm.getRange("C17").getValue().toString().trim().toUpperCase(),
    "COUNTER":inputForm.getRange("C18").getValue().toString().trim().toUpperCase(),
    "RECEIVER NAME":inputForm.getRange("C19").getValue().toString().trim().toUpperCase(),
    "MODEL":inputForm.getRange("C20").getValue().toString().trim().toUpperCase(),
    "STATUS": "RECEIVED"
  }

  if (Object.values(data).some(v => !v)) {
    setStatus(inputForm, "SOME FIELDS ARE MISSING","B23:C23",false);
    return;
  }
  if (isDuplicateAdvancerEntry(advanceSheet, data["ADVANCER NAME"])) {
    setStatus(inputForm, "ADVANCER ALREADY EXISTS","B23:C23",false);
    return;
  }

  let inputData = inputForm.getRange("C16").getValue();
  data["ALTERNATE MOBILE NUMBER"] = inputData ? inputData.toString().trim().toUpperCase() : "";
  inputData = inputForm.getRange("C21").getValue();
  data["COLOR"] = inputData ? inputData.toString().trim().toUpperCase() : "";
  inputData = inputForm.getRange("C22").getValue();
  data["REMARK"] = inputData ? inputData.toString().trim().toUpperCase() : "";

  const nextRow = getFirstEmptyRow(advanceSheet, "A2:A");
  safeWriteRow(advanceSheet, nextRow, data, ADVANCE_SHEET_MAP);
  inputForm.getRange("C14:C22").clearContent();
  setStatus(inputForm, "ADVANCE PAYMENT ADDED SUCCESSFULLY", "B23:C23", true);
  addToTimeSheet("FORM-2.1",data["ADVANCER NAME"], TIME_SHEET_MAP);
}

//------------------------------------------------------------------------------------------------------------------

function form_2_2() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const inputForm = ss.getSheetByName("Input_Form");
  const advanceSheet = ss.getSheetByName("Advance_Sheet");
  
  if (!inputForm) throw new Error("Input_Form not found");
  if (!advanceSheet) throw new Error("Advance_Sheet not found");

  let data = {
    "ADVANCER NAME":inputForm.getRange("F14").getValue().toString().trim().toUpperCase(),
    "ADVANCE RETURN":inputForm.getRange("F15").getValue().toString().trim().toUpperCase(),
    "RETURN PERSON":inputForm.getRange("F16").getValue().toString().trim().toUpperCase(),
    "STATUS": "RETURNED"
  }

  if (Object.values(data).some(v => !v)) {
    setStatus(inputForm, "SOME FIELDS ARE MISSING","E17:F17",false);
    return;
  }

  const rowIndex = getAdvancerRowIndexHandler(advanceSheet, data["ADVANCER NAME"]);
  if (rowIndex === -1) {
    setStatus(inputForm, "ADVANCER DOES NOT EXIST", "E17:F17", false);
    return;
  }

  safeWriteRow(advanceSheet, rowIndex, data, ADVANCE_SHEET_MAP);
  inputForm.getRange("F14:F16").clearContent();
  setStatus(inputForm, "ADVANCE RETURNED SUCCESSFULLY", "E17:F17", true);
  addToTimeSheet("FORM-2.2",data["ADVANCER NAME"], TIME_SHEET_MAP);
}

//------------------------------------------------------------------------------------------------------------------

function form_3_1() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const inputForm = ss.getSheetByName("Input_Form");
  const mainSheet = ss.getSheetByName("Main_Sheet");
  
  if (!inputForm) throw new Error("Input_Form not found");
  if (!mainSheet) throw new Error("Main_Sheet not found");

  const chassis = inputForm.getRange("C28").getValue().toString().trim().toUpperCase();

  let data = {
    "SALE COUNTER": inputForm.getRange("C31").getValue().toString().trim().toUpperCase(),
    "STOCK STATUS": inputForm.getRange("C32").getValue().toString().trim().toUpperCase(),
    "SALE DATE": inputForm.getRange("C33").getValue(),
    "CUSTOMER NAME": inputForm.getRange("C34").getValue().toString().trim().toUpperCase(),
    "SALES PERSON": inputForm.getRange("C39").getValue().toString().trim().toUpperCase()
  }
  
  if (data["STOCK STATUS"] === "B2C") {
    data["MOBILE NUMBER"] = inputForm.getRange("C35").getValue().toString().trim().toUpperCase();
    data["CASH / FINANCE"] = inputForm.getRange("C37").getValue().toString().trim().toUpperCase();
    data["FINANCER"] = inputForm.getRange("C38").getValue().toString().trim().toUpperCase();
  }

  if (Object.values(data).some(v => !v) || chassis === "") {
    setStatus(inputForm, "SOME FIELDS ARE MISSING","B40:C40",false);
    return;
  }
  
  if (data["STOCK STATUS"] === "B2C") {
    let inputData = inputForm.getRange("C36").getValue();
    data["ALTERNATE MOBILE NUMBER"] = inputData ? inputData.toString().trim().toUpperCase() : "";
  }

  const rowIndex = getRowIndexHandler(mainSheet, chassis, 7);
  if (rowIndex === -1) {
    setStatus(inputForm, "CHASSIS DOES NOT EXIST", "B40:C40", false);
    return;
  }

  safeWriteRow(mainSheet, rowIndex, data, MAIN_SHEET_MAP);
  inputForm.getRange("C28").clearContent();
  inputForm.getRange("C31:C39").clearContent();
  setStatus(inputForm, "SALE ADDED SUCCESSFULLY", "B40:C40", true);
  addToTimeSheet("FORM-3.1",chassis, TIME_SHEET_MAP);
}

//------------------------------------------------------------------------------------------------------------------

function form_3_2() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const inputForm = ss.getSheetByName("Input_Form");
  const mainSheet = ss.getSheetByName("Main_Sheet");
  const advanceSheet = ss.getSheetByName("Advance_Sheet");
  
  if (!inputForm) throw new Error("Input_Form not found");
  if (!mainSheet) throw new Error("Main_Sheet not found");

  const chassis = inputForm.getRange("F28").getValue().toString().trim().toUpperCase();
  const anyAdvance = inputForm.getRange("F32").getValue().toString().trim().toUpperCase();

  let data = {
    "PRICE TAG NUMBER": inputForm.getRange("F30").getValue().toString().trim().toUpperCase(),
    "TOTAL DP": inputForm.getRange("F31").getValue().toString().trim().toUpperCase(),
    "RECEIVED DP": inputForm.getRange("F35").getValue().toString().trim().toUpperCase(),
    "ANY EXCHANGE": inputForm.getRange("F37").getValue().toString().trim().toUpperCase(),
  }
  
  if (anyAdvance === "YES") {
    data["ADVANCER NAME"] = inputForm.getRange("F33").getValue().toString().trim().toUpperCase();
    data["ADVANCE AMOUNT"] = inputForm.getRange("F34").getValue().toString().trim().toUpperCase();
  }

  if (data["ANY EXCHANGE"] === "YES") {
    data["EXCHANGE MODEL"] = inputForm.getRange("F38").getValue().toString().trim().toUpperCase();
    data["EXCHANGE REGISTER NUMBER"] = inputForm.getRange("F39").getValue().toString().trim().toUpperCase();
    data["CUSTOMER EXCHANGE VALUE"] = inputForm.getRange("F40").getValue().toString().trim().toUpperCase();
    data["DEALER NAME"] = inputForm.getRange("F41").getValue().toString().trim().toUpperCase();
    data["DEALER EXCHANGE VALUE"] = inputForm.getRange("F42").getValue().toString().trim().toUpperCase();
  }

  if (Object.values(data).some(v => !v) || chassis === "" || anyAdvance === "") {
    setStatus(inputForm, "SOME FIELDS ARE MISSING","E43:F43",false);
    return;
  }

  const rowIndex = getRowIndexHandler(mainSheet, chassis, 7);
  if (rowIndex === -1) {
    setStatus(inputForm, "CHASSIS DOES NOT EXIST", "E43:F43", false);
    return;
  }

  safeWriteRow(mainSheet, rowIndex, data, MAIN_SHEET_MAP);

  if (anyAdvance === "YES") {
    const advanceRowIndex = getAdvancerRowIndexHandler(advanceSheet, data["ADVANCER NAME"]);
    if (advanceRowIndex === -1) {
      setStatus(inputForm, "ADVANCER DOES NOT EXIST", "E43:F43", false);
      return;
    }
    const advanceData = {
      "STATUS": "PURCHASED"
    }
    safeWriteRow(advanceSheet, rowIndex, advanceData, ADVANCE_SHEET_MAP);
  }

  inputForm.getRange("F28").clearContent();
  inputForm.getRange("F30:F33").clearContent();
  inputForm.getRange("F35").clearContent();
  inputForm.getRange("F37:F42").clearContent();
  setStatus(inputForm, "SALE ACCOUNT ADDED SUCCESSFULLY", "E43:F43", true);
  addToTimeSheet("FORM-3.2",chassis, TIME_SHEET_MAP);
}

//------------------------------------------------------------------------------------------------------------------

function form_3_3() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const inputForm = ss.getSheetByName("Input_Form");
  const mainSheet = ss.getSheetByName("Main_Sheet");
  
  if (!inputForm) throw new Error("Input_Form not found");
  if (!mainSheet) throw new Error("Main_Sheet not found");

  const chassis = inputForm.getRange("I28").getValue().toString().trim().toUpperCase();

  let data = {
    "DUE DATE": inputForm.getRange("I30").getValue(),
    "EMI": inputForm.getRange("I31").getValue().toString().trim().toUpperCase(),
    "TENURE": inputForm.getRange("I32").getValue().toString().trim().toUpperCase(),
    "DATE OF BIRTH": inputForm.getRange("I33").getValue(),
    "AGREEMENT NUMBER": inputForm.getRange("I34").getValue().toString().trim().toUpperCase(),
    "ESTIMATED DISBURSEMENT": inputForm.getRange("I35").getValue().toString().trim().toUpperCase()
  }

  if (Object.values(data).some(v => !v) || chassis === "") {
    setStatus(inputForm, "SOME FIELDS ARE MISSING","H36:I36",false);
    return;
  }

  const rowIndex = getRowIndexHandler(mainSheet, chassis, 7);
  if (rowIndex === -1) {
    setStatus(inputForm, "CHASSIS DOES NOT EXIST", "H36:I36", false);
    return;
  }

  safeWriteRow(mainSheet, rowIndex, data, MAIN_SHEET_MAP);
  inputForm.getRange("I28").clearContent();
  inputForm.getRange("I30:I35").clearContent();
  setStatus(inputForm, "SALE FINANCE ADDED SUCCESSFULLY", "H36:I36", true);
  addToTimeSheet("FORM-3.3",chassis, TIME_SHEET_MAP);
}

//------------------------------------------------------------------------------------------------------------------

function form_3_4() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const inputForm = ss.getSheetByName("Input_Form");
  const mainSheet = ss.getSheetByName("Main_Sheet");
  
  if (!inputForm) throw new Error("Input_Form not found");
  if (!mainSheet) throw new Error("Main_Sheet not found");

  const chassis = inputForm.getRange("L28").getValue().toString().trim().toUpperCase();

  let data = {
    "SALE INVOICE NUMBER": inputForm.getRange("L30").getValue().toString().trim().toUpperCase()
  }

  if (Object.values(data).some(v => !v) || chassis === "") {
    setStatus(inputForm, "SOME FIELDS ARE MISSING","K31:L31",false);
    return;
  }

  const rowIndex = getRowIndexHandler(mainSheet, chassis, 7);
  if (rowIndex === -1) {
    setStatus(inputForm, "CHASSIS DOES NOT EXIST", "K31:L31", false);
    return;
  }

  safeWriteRow(mainSheet, rowIndex, data, MAIN_SHEET_MAP);
  inputForm.getRange("L28").clearContent();
  inputForm.getRange("L30").clearContent();
  setStatus(inputForm, "SALE INVOICE ADDED SUCCESSFULLY", "K31:L31", true);
  addToTimeSheet("FORM-3.4",chassis, TIME_SHEET_MAP);
}

//------------------------------------------------------------------------------------------------------------------

function form_4_1() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const inputForm = ss.getSheetByName("Input_Form");
  const mainSheet = ss.getSheetByName("Main_Sheet");
  
  if (!inputForm) throw new Error("Input_Form not found");
  if (!mainSheet) throw new Error("Main_Sheet not found");

  const chassis = inputForm.getRange("C48").getValue().toString().trim().toUpperCase();

  let data = {
    "INSURANCE AMOUNT": inputForm.getRange("C50").getValue().toString().trim().toUpperCase(),
  }

  if (Object.values(data).some(v => !v) || chassis === "") {
    setStatus(inputForm, "SOME FIELDS ARE MISSING","B51:C51",false);
    return;
  }

  const rowIndex = getRowIndexHandler(mainSheet, chassis, 7);
  if (rowIndex === -1) {
    setStatus(inputForm, "CHASSIS DOES NOT EXIST", "B51:C51", false);
    return;
  }

  safeWriteRow(mainSheet, rowIndex, data, MAIN_SHEET_MAP);
  inputForm.getRange("C48").clearContent();
  inputForm.getRange("C50").clearContent();
  setStatus(inputForm, "INSURANCE AMOUNT ADDED SUCCESSFULLY", "B51:C51", true);
  addToTimeSheet("FORM-4.1",chassis, TIME_SHEET_MAP);
}

//------------------------------------------------------------------------------------------------------------------

function form_4_2() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const inputForm = ss.getSheetByName("Input_Form");
  const mainSheet = ss.getSheetByName("Main_Sheet");
  
  if (!inputForm) throw new Error("Input_Form not found");
  if (!mainSheet) throw new Error("Main_Sheet not found");

  const chassis = inputForm.getRange("F48").getValue().toString().trim().toUpperCase();

  let data = {
    "RTO AMOUNT": inputForm.getRange("F50").getValue().toString().trim().toUpperCase(),
  }

  if (Object.values(data).some(v => !v) || chassis === "") {
    setStatus(inputForm, "SOME FIELDS ARE MISSING","E51:F51",false);
    return;
  }

  const rowIndex = getRowIndexHandler(mainSheet, chassis, 7);
  if (rowIndex === -1) {
    setStatus(inputForm, "CHASSIS DOES NOT EXIST", "E51:F51", false);
    return;
  }

  safeWriteRow(mainSheet, rowIndex, data, MAIN_SHEET_MAP);
  inputForm.getRange("F48").clearContent();
  inputForm.getRange("F50").clearContent();
  setStatus(inputForm, "RTO AMOUNT ADDED SUCCESSFULLY", "E51:F51", true);
  addToTimeSheet("FORM-4.2",chassis, TIME_SHEET_MAP);
}

//------------------------------------------------------------------------------------------------------------------

function form_4_3() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const inputForm = ss.getSheetByName("Input_Form");
  const mainSheet = ss.getSheetByName("Main_Sheet");
  
  if (!inputForm) throw new Error("Input_Form not found");
  if (!mainSheet) throw new Error("Main_Sheet not found");

  const chassis = inputForm.getRange("I48").getValue().toString().trim().toUpperCase();

  let data = {
    "REGISTRATION NUMBER": inputForm.getRange("I50").getValue().toString().trim().toUpperCase(),
  }

  if (Object.values(data).some(v => !v) || chassis === "") {
    setStatus(inputForm, "SOME FIELDS ARE MISSING","H51:I51",false);
    return;
  }

  const rowIndex = getRowIndexHandler(mainSheet, chassis, 7);
  if (rowIndex === -1) {
    setStatus(inputForm, "CHASSIS DOES NOT EXIST", "H51:I51", false);
    return;
  }

  safeWriteRow(mainSheet, rowIndex, data, MAIN_SHEET_MAP);
  inputForm.getRange("I48").clearContent();
  inputForm.getRange("I50").clearContent();
  setStatus(inputForm, "REGISTRATION NUMBER ADDED SUCCESSFULLY", "H51:I51", true);
  addToTimeSheet("FORM-4.3",chassis, TIME_SHEET_MAP);
}

//------------------------------------------------------------------------------------------------------------------

function form_4_4() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const inputForm = ss.getSheetByName("Input_Form");
  const mainSheet = ss.getSheetByName("Main_Sheet");
  
  if (!inputForm) throw new Error("Input_Form not found");
  if (!mainSheet) throw new Error("Main_Sheet not found");

  const chassis = inputForm.getRange("L48").getValue().toString().trim().toUpperCase();

  let data = {
    "DISBURSEMENT AMOUNT": inputForm.getRange("L50").getValue().toString().trim().toUpperCase(),
    "DISBURSEMENT DATE": inputForm.getRange("L51").getValue(),
    "DISBURSEMENT ACCOUNT": inputForm.getRange("L52").getValue().toString().trim().toUpperCase()
  }

  if (Object.values(data).some(v => !v) || chassis === "") {
    setStatus(inputForm, "SOME FIELDS ARE MISSING","K53:L53",false);
    return;
  }

  const rowIndex = getRowIndexHandler(mainSheet, chassis, 7);
  if (rowIndex === -1) {
    setStatus(inputForm, "CHASSIS DOES NOT EXIST", "K53:L53", false);
    return;
  }

  safeWriteRow(mainSheet, rowIndex, data, MAIN_SHEET_MAP);
  inputForm.getRange("L48").clearContent();
  inputForm.getRange("L50:L52").clearContent();
  setStatus(inputForm, "DISBURSEMENT ADDED SUCCESSFULLY", "K53:L53", true);
  addToTimeSheet("FORM-4.4",chassis, TIME_SHEET_MAP);
}