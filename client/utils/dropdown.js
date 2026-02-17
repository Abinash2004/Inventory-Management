import { getAction } from './api.js';

export async function loadDropdown(action, selectId, column) {
    const res = await getAction(action, column);
    if (!res.status) return;

    const select = document.getElementById(selectId);
    if (!select) return;

    let placeholderText = "select";
    const parentDiv = select.closest('div');
    if (parentDiv) {
        const label = parentDiv.querySelector('label');
        if (label) {

            const labelText = label.innerText.trim();
            placeholderText = `Select ${labelText}`;
        }
    }

    select.innerHTML = `<option value="">${placeholderText}</option>`;

    if (!res.data || !Array.isArray(res.data)) return;

    res.data.forEach(val => {
        const opt = document.createElement("option");
        opt.value = val;
        opt.textContent = val;
        select.appendChild(opt);
    });
}
