import { loadDropdown } from '../utils/dropdown.js';
import { postAction, getChassisDetails, displayResponse } from '../utils/api.js';

export function render_form_4_2() {
  const container = document.getElementById("form-container");
  if (!container) return;

  container.innerHTML = `
    <h3>FORM 4.2 - RTO Entry Form</h3>

    <form id="form_4_2">

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
        <label>RTO Amount</label><br>
        <input type="number"
               id="rto_amount"
               required
               min="0">
      </div><br>

      <button type="submit">submit</button>

    </form>

    <div id="form_4_2_response"></div>
  `;

  
  loadDropdown("get_dropdown", "chassis", 14);


  
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


  
  document.getElementById("form_4_2").addEventListener("submit", async function (e) {
    e.preventDefault();

    const data = {
      chassis: document.getElementById("chassis").value,
      rto_amount: document.getElementById("rto_amount").value
    };

    const res = await postAction("form_4_2", data);
    displayResponse("form_4_2_response", res); if(res.status === 1) document.getElementById("form_4_2").reset();
  });
}


