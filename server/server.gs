function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ status: 0, message: "invalid request" });
    }

    const { action, token, data } = JSON.parse(e.postData.contents);

    if (!token || token !== WEBAPP_TOKEN) {
      return jsonResponse({ status: 0, message: "unauthorized" });
    }

    if (!action || typeof allowedActions[action] !== "function") {
      return jsonResponse({ status: 0, message: "invalid action" });
    }

    const result = globalThis[action](data);
    return jsonResponse(result || { status: 1, message: "success" });

  } catch (err) {
    return jsonResponse({
      status: 0,
      message: err.message || "server error"
    });
  }
}

//---------------------------------------------------------------------------------------------

function doGet(e) {
  try {
    if (!e || !e.parameter) {
      return jsonResponse({ status: 0, message: "invalid request" });
    }

    const { action, token, column, chassis, advancer_name } = e.parameter;

    if (!token || token !== WEBAPP_TOKEN) {
      return jsonResponse({ status: 0, message: "unauthorized" });
    }

    if (!action || typeof allowedActions[action] !== "function") {
      return jsonResponse({ status: 0, message: "invalid action" });
    }

    let result;
    if (action === "get_model_color_customer") {
      result = allowedActions[action](chassis);
    } else if (action === "get_advance_amount") {
      result = allowedActions[action](advancer_name);
    } else {
      result = allowedActions[action](column);
    }
    
    return jsonResponse(result || { status: 1, message: "success" });

  } catch (err) {
    return jsonResponse({
      status: 0,
      message: err.message || "server error"
    });
  }
}

function verify_password(password) {
  if (password === AUTH_PASS) {
    return { status: 1, message: "success" };
  } else {
    return { status: 0, message: "incorrect password" };
  }
}
