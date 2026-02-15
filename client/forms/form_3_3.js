import { loadDropdown } from '../utils/dropdown.js';
import { postAction, getChassisDetails, displayResponse } from '../utils/api.js';

export function render_form_3_3() {
  const container = document.getElementById("form-container");
  if (!container) return;

  container.innerHTML = `
    <h3>FORM 3.3 - Finance Details Form</h3>

    <form id="form_3_3">

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
        <label>Due Date</label><br>
        <input type="date"
               id="due_date"
               required>
      </div><br>

      <div>
        <label>EMI</label><br>
        <input type="number"
               id="emi"
               required
               min="0">
      </div><br>

      <div>
        <label>Tenure</label><br>
        <input type="number"
               id="tenure"
               required
               min="1">
      </div><br>

      <div>
        <label>Date of Birth</label><br>
        <input type="date"
               id="date_of_birth"
               required>
      </div><br>

      <div>
        <label>Agreement Number</label><br>
        <input type="text"
               id="agreement_number"
               required
               pattern="[a-zA-Z0-9]+"
               title="alphanumeric only">
      </div><br>

      <div>
        <label>Estimated Disbursement</label><br>
        <input type="number"
               id="estimated_disbursement"
               required
               min="0">
      </div><br>

      <button type="submit">submit</button>

    </form>

    <div id="form_3_3_response"></div>
  `;

  
  loadDropdown("get_dropdown", "chassis", 12); 


  
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


  
  document.getElementById("form_3_3").addEventListener("submit", async function (e) {
    e.preventDefault();

    const data = {
      chassis: document.getElementById("chassis").value,
      due_date: document.getElementById("due_date").value,
      emi: document.getElementById("emi").value,
      tenure: document.getElementById("tenure").value,
      date_of_birth: document.getElementById("date_of_birth").value,
      agreement_number: document.getElementById("agreement_number").value,
      estimated_disbursement: document.getElementById("estimated_disbursement").value
    };

    const res = await postAction("form_3_3", data);
    displayResponse("form_3_3_response", res); if(res.status === 1) document.getElementById("form_3_3").reset();
  });
}


