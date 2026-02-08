function doPost(e) {
  try {
    const { action, token } = JSON.parse(e.postData.contents);

    if (token !== WEBAPP_TOKEN) {
      return ContentService.createTextOutput("UNAUTHORIZED");
    }

    if (!action || typeof globalThis[action] !== "function") {
      return ContentService.createTextOutput("INVALID_ACTION");
    }

    globalThis[action]();
    return ContentService.createTextOutput("OK");

  } catch (err) {
    return ContentService.createTextOutput("ERROR");
  }
}
