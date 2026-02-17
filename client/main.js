import { render_form_1_1 } from './forms/form_1_1.js';
import { render_form_1_2 } from './forms/form_1_2.js';
import { render_form_1_3 } from './forms/form_1_3.js';
import { render_form_2_1 } from './forms/form_2_1.js';
import { render_form_2_2 } from './forms/form_2_2.js';
import { render_form_3_1 } from './forms/form_3_1.js';
import { render_form_3_2 } from './forms/form_3_2.js';
import { render_form_3_3 } from './forms/form_3_3.js';
import { render_form_3_4 } from './forms/form_3_4.js';
import { render_form_4_1 } from './forms/form_4_1.js';
import { render_form_4_2 } from './forms/form_4_2.js';
import { render_form_4_3 } from './forms/form_4_3.js';
import { render_form_4_4 } from './forms/form_4_4.js';
import { CONFIG } from './utils/config.js';

const routes = {
    '1.1 - Inventory Stock Form': render_form_1_1,
    '1.2 - Inventory Invoice Form': render_form_1_2,
    '1.3 - Stock Movement Form': render_form_1_3,
    '2.1 - Advance Payment Form': render_form_2_1,
    '2.2 - Advance Return Form': render_form_2_2,
    '3.1 - Sale Entry Form': render_form_3_1,
    '3.2 - Sales Account Form': render_form_3_2,
    '3.3 - Estimated Disburse Form': render_form_3_3,
    '3.4 - Sale Invoice Form': render_form_3_4,
    '4.1 - Insurance Entry Form': render_form_4_1,
    '4.2 - RTO Entry Form': render_form_4_2,
    '4.3 - Registration Entry Form': render_form_4_3,
    '4.4 - Disburse Entry Form': render_form_4_4
};

function checkAuth() {
    const TTL = CONFIG.SESSION_TTL;
    const expiry = sessionStorage.getItem("auth_expiry");

    if (expiry && parseInt(expiry) > Date.now()) {
        initSidebar();
        return;
    }
    sessionStorage.removeItem("auth_expiry");

    const overlay = document.createElement("div");
    overlay.id = "auth-overlay";
    overlay.innerHTML = `
        <div id="auth-container">
            <h2>System Locked</h2>
            <p style="margin-bottom: 20px; color: #636e72;">Enter password to access inventory</p>
            <input type="password" id="auth-input" placeholder="Enter Password" autofocus>
            <button id="auth-btn" style="width: 100%; padding: 12px; background: #6c5ce7; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">Unlock</button>
            <div id="auth-error"></div>
        </div>
    `;
    document.body.appendChild(overlay);

    const input = document.getElementById("auth-input");
    const btn = document.getElementById("auth-btn");
    const errorMsg = document.getElementById("auth-error");

    const handleLogin = () => {
        if (input.value === CONFIG.AUTH_PASS) {
            sessionStorage.setItem("auth_expiry", Date.now() + TTL);
            document.body.removeChild(overlay);
            initSidebar();
        } else {
            errorMsg.textContent = "Incorrect Password";
            input.value = "";
            input.classList.add("shake");
            setTimeout(() => { errorMsg.textContent = ""; }, 2000);
        }
    };

    btn.onclick = handleLogin;
    input.onkeypress = (e) => {
        if (e.key === "Enter") handleLogin();
    };
}

function initMobileToggle() {
    const btn = document.getElementById("menu-toggle");
    const sidebar = document.getElementById("sidebar");
    if (btn && sidebar) {
        btn.onclick = () => {
            sidebar.classList.toggle("active");
        };
    }
}

function initSidebar() {
    const sidebar = document.getElementById("sidebar");
    if (!sidebar) return;

    sidebar.innerHTML = '';

    Object.keys(routes).forEach(formName => {
        const link = document.createElement("div");
        link.textContent = formName;

        link.onclick = function () {

            const allLinks = sidebar.querySelectorAll("div");
            allLinks.forEach(l => l.classList.remove("active"));
            this.classList.add("active");

            if (sidebar.classList.contains("active") && window.innerWidth <= 900) {
                sidebar.classList.remove("active");
            }

            routes[formName]();

            const formContainer = document.getElementById("form-container");
            if (formContainer) {
                const form = formContainer.querySelector("form");
                const submitBtn = form ? form.querySelector('button[type="submit"]') : null;
                const responseDiv = formContainer.querySelector('[id$="_response"]');

                if (form && submitBtn && responseDiv) {
                    form.insertBefore(responseDiv, submitBtn);
                    responseDiv.style.marginBottom = "15px";
                }
            }
        };
        sidebar.appendChild(link);
    });

    // Add View Sheet Link
    const sheetLink = document.createElement("div");
    sheetLink.id = "view-sheet-btn";
    sheetLink.textContent = "View Google Sheet";
    sheetLink.onclick = () => {
        window.open(CONFIG.SHEET_URL, '_blank');
    };
    sidebar.appendChild(sheetLink);
}


document.addEventListener('DOMContentLoaded', () => {
    initMobileToggle();
    checkAuth();
});
