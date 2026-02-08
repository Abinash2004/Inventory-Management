function callWebApp(action) {
  UrlFetchApp.fetch(WEBAPP_URL, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({
      action,
      token: WEBAPP_TOKEN
    }),
    muteHttpExceptions: true
  });
}

function run_FORM_1_1() {
  callWebApp("form_1_1");
}
function run_FORM_1_2() {
  callWebApp("form_1_2");
}
function run_FORM_1_3() {
  callWebApp("form_1_3");
}

function run_FORM_2_1() {
  callWebApp("form_2_1");
}
function run_FORM_2_2() {
  callWebApp("form_2_2");
}

function run_FORM_3_1() {
  callWebApp("form_3_1");
}
function run_FORM_3_2() {
  callWebApp("form_3_2");
}
function run_FORM_3_3() {
  callWebApp("form_3_3");
}
function run_FORM_3_4() {
  callWebApp("form_3_4");
}

function run_FORM_4_1() {
  callWebApp("form_4_1");
}
function run_FORM_4_2() {
  callWebApp("form_4_2");
}
function run_FORM_4_3() {
  callWebApp("form_4_3");
}
function run_FORM_4_4() {
  callWebApp("form_4_4");
}
 