import { loadDropdown } from '../utils/dropdown.js';
import { postAction, getChassisDetails, displayResponse } from '../utils/api.js';

export function render_form_3_4() {
  const container = document.getElementById("form-container");
  if (!container) return;

  container.innerHTML = `
    <h3>FORM 3.4 - Sale Invoice Form</h3>

    <form id="form_3_4">

      <div>
        <label>Chassis Number</label><br>
        <select id="chassis" required>
          <option value="">loading...</option>
        </select>
      </div><br>

      <div>
        <label>Customer Name</label><br>
        <input type="text"
               id="customer_name"
               readonly
               placeholder="auto-fetched">
      </div><br>

      <div>
        <label>Sale Invoice Number</label><br>
        <input type="text"
               id="sale_invoice_number"
               required
               pattern="[a-zA-Z0-9]+"
               title="alphanumeric only">
      </div><br>

      <button type="submit">submit</button>

    </form>

    <div id="form_3_4_response"></div>
  `;

  
  loadDropdown("get_dropdown", "chassis", 10);


  
  const chassisSelect = document.getElementById("chassis");
  chassisSelect.addEventListener("change", async function () {
    const chassis = this.value;
    const customerInput = document.getElementById("customer_name");

    customerInput.value = "fetching...";
    if (!chassis) {
      customerInput.value = "";
      return;
    }

    try {
      const res = await getChassisDetails(chassis);
      if (res.status === 1 && res.data) {
        customerInput.value = res.data.customer || "not found";
      } else {
        customerInput.value = "not found";
      }
    } catch (error) {
      console.error(error);
      customerInput.value = "error";
    }
  });


  
  document.getElementById("form_3_4").addEventListener("submit", async function (e) {
    e.preventDefault();

    const data = {
      chassis: document.getElementById("chassis").value,
      sale_invoice_number: document.getElementById("sale_invoice_number").value
    };

    const res = await postAction("form_3_4", data);
    displayResponse("form_3_4_response", res); if(res.status === 1) document.getElementById("form_3_4").reset();
  });
}


