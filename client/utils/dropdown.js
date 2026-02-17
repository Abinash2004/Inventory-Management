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

    // Clear select
    select.innerHTML = '';

    // Add empty option required for Tom Select placeholder to work
    const emptyOpt = document.createElement("option");
    emptyOpt.value = "";
    select.appendChild(emptyOpt);

    if (!res.data || !Array.isArray(res.data)) return;

    // Add data options
    res.data.forEach(val => {
        const opt = document.createElement("option");
        opt.value = val;
        opt.textContent = val;
        select.appendChild(opt);
    });

    // Check if Tom Select is already initialized
    if (select.tomselect) {
        select.tomselect.sync();
        select.tomselect.destroy();
    }

    if (window.TomSelect) {
        new TomSelect(select, {
            create: false,
            sortField: {
                field: "text",
                direction: "asc"
            },
            placeholder: placeholderText, // Restore "Select [Label]"
            allowEmptyOption: true,
            maxOptions: null,
            onType: function (str) {
                if (str && str.length > 0) {
                    this.wrapper.classList.add('typing');
                } else {
                    this.wrapper.classList.remove('typing');
                }
            },
            onBlur: function () {
                this.wrapper.classList.remove('typing');
            },
            onChange: function () {
                this.wrapper.classList.remove('typing');
            }
        });
    }
}
