import { loadDropdown } from '../utils/dropdown.js';
import { postAction, displayResponse } from '../utils/api.js';

export function render_form_1_2() {
  const container = document.getElementById("form-container");
  if (!container) return;

  container.innerHTML = `
    <h3>FORM 1.2 - Inventory Invoice Form</h3>

    <form id="form_1_2">

      <div>
        <label>Chassis Number</label><br>
        <select id="chassis" required>
          <option value="">loading...</option>
        </select>
      </div><br>

      <div>
        <label>Stock Date</label><br>
        <input type="date"
               id="invoice_date"
               required>
      </div><br>

      <div>
        <label>Purchased Invoice Number</label><br>
        <input type="text"
               id="invoice_number"
               required
               pattern="[a-zA-Z0-9]+"
               title="alphanumeric only">
      </div><br>

      <div>
        <label>Gross Value Before Discount</label><br>
        <input type="number"
               id="gross_value"
               required
               step="0.01"
               min="0">
      </div><br>

      <button type="submit">submit</button>

    </form>

    <div id="form_1_2_response"></div>
  `;




  loadDropdown("get_dropdown", "chassis", 9);



  document
    .getElementById("form_1_2")
    .addEventListener("submit", async function (e) {

      e.preventDefault();

      const data = {
        chassis: document.getElementById("chassis").value,
        date: document.getElementById("invoice_date").value,
        invoice: document.getElementById("invoice_number").value,
        gvbd: document.getElementById("gross_value").value
      };

      const res = await postAction("form_1_2", data);
      displayResponse("form_1_2_response", res);
      if (res.status === 1) {
        document.getElementById("form_1_2").reset();
        loadDropdown("get_dropdown", "chassis", 9);
      }
    }
    );
}


