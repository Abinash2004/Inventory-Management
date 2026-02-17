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

    if (!res.data || !Array.isArray(res.data)) return;

    // Add empty option for placeholder behavior if needed, but user said "dont show default values like select model"
    // We will just add the data options.
    res.data.forEach(val => {
        const opt = document.createElement("option");
        opt.value = val;
        opt.textContent = val;
        select.appendChild(opt);
    });

    // Check if Tom Select is already initialized
    if (select.tomselect) {
        select.tomselect.sync(); // Sync instead of destroy to keep it smooth if possible, or destroyre-init
        select.tomselect.destroy();
    }

    if (window.TomSelect) {
        new TomSelect(select, {
            create: false,
            sortField: {
                field: "text",
                direction: "asc"
            },
            placeholder: "",
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
