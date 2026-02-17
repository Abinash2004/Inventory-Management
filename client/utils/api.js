import { CONFIG } from './config.js';
import { loader } from './loader.js';

export function postAction(action, data) {
    loader.show();
    return fetch(CONFIG.WEB_APP_URL, {
        method: "POST",
        body: JSON.stringify({ action, token: CONFIG.TOKEN, data })
    })
        .then(res => res.json())
        .finally(() => loader.hide());
}

export function getAction(action, params) {
    loader.show();
    const url = new URL(CONFIG.WEB_APP_URL);
    url.searchParams.append("action", action);
    url.searchParams.append("token", CONFIG.TOKEN);
    url.searchParams.append("column", params);

    return fetch(url.toString())
        .then(res => res.json())
        .finally(() => loader.hide());
}

export function getChassisDetails(chassis) {
    loader.show();
    const url = new URL(CONFIG.WEB_APP_URL);
    url.searchParams.append("action", "get_model_color_customer");
    url.searchParams.append("token", CONFIG.TOKEN);
    url.searchParams.append("chassis", chassis);
    return fetch(url.toString())
        .then(res => res.json())
        .finally(() => loader.hide());
}

export function getAdvanceDetails(advancerName) {
    loader.show();
    const url = new URL(CONFIG.WEB_APP_URL);
    url.searchParams.append("action", "get_advance_amount");
    url.searchParams.append("token", CONFIG.TOKEN);
    url.searchParams.append("advancer_name", advancerName);
    return fetch(url.toString())
        .then(res => res.json())
        .finally(() => loader.hide());
}

export function checkPassword(password) {
    loader.show();
    return fetch(CONFIG.WEB_APP_URL, {
        method: "POST",
        body: JSON.stringify({ action: "verify_password", token: CONFIG.TOKEN, data: password })
    })
        .then(res => res.json())
        .finally(() => loader.hide());
}


export function displayResponse(elementId, res) {
    const responseDiv = document.getElementById(elementId);
    if (!responseDiv) return;

    responseDiv.innerText = res.message;
    responseDiv.className = "";

    if (res.status === 1) {
        responseDiv.classList.add("success");
    } else {
        responseDiv.classList.add("error");
    }
}
