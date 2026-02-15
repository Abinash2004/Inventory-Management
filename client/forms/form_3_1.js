import { loadDropdown } from '../utils/dropdown.js';
import { postAction, getChassisDetails, displayResponse } from '../utils/api.js';

export function render_form_3_1() {
  const container = document.getElementById("form-container");
  if (!container) return;

  container.innerHTML = `
    <h3>FORM 3.1 - Sale Entry Form</h3>

    <form id="form_3_1">

      <div>
        <label>Chassis Number</label><br>
        <select id="chassis" required>
          <option value="">loading...</option>
        </select>
      </div><br>

      <div>
        <label>Model</label><br>
        <input type="text"
               id="model"
               readonly
               placeholder="auto-fetched">
      </div><br>

      <div>
        <label>Color</label><br>
        <input type="text"
               id="color"
               readonly
               placeholder="auto-fetched">
      </div><br>

      <div>
        <label>Sale Counter</label><br>
        <select id="sale_counter" required>
          <option value="">loading...</option>
        </select>
      </div><br>

      <div>
        <label>Sale Date</label><br>
        <input type="date"
               id="sale_date"
               required>
      </div><br>

      <div>
        <label>Customer Name</label><br>
        <input type="text"
               id="customer_name"
               required>
      </div><br>

      <div>
        <label>Mobile Number</label><br>
        <input type="tel"
               id="mobile_number"
               required
               pattern="[0-9]{10}"
               title="10 digits only">
      </div><br>

      <div>
        <label>Alternate Mobile Number (Opt)</label><br>
        <input type="tel"
               id="alternate_mobile_number"
               pattern="[0-9]{10}"
               title="10 digits only">
      </div><br>

      <div>
        <label>Cash / Finance</label><br>
        <select id="cash_or_finance" required>
          <option value="">loading...</option>
        </select>
      </div><br>

      <div>
        <label>Financer</label><br>
        <input type="text"
               id="financer"
               required>
      </div><br>

      <div>
        <label>Sales Person</label><br>
        <select id="sales_person" required>
          <option value="">loading...</option>
        </select>
      </div><br>

      <button type="submit">submit</button>

    </form>

    <div id="form_3_1_response"></div>
  `;

  
  loadDropdown("get_dropdown", "chassis", 8);
  loadDropdown("get_dropdown", "sale_counter", 3);
  loadDropdown("get_dropdown", "cash_or_finance", 5);
  loadDropdown("get_dropdown", "sales_person", 4);


  
  const chassisSelect = document.getElementById("chassis");

  chassisSelect.addEventListener("change", async function () {
    const chassis = this.value;
    const modelInput = document.getElementById("model");
    const colorInput = document.getElementById("color");

    
    modelInput.value = "fetching...";
    colorInput.value = "fetching...";

    if (!chassis) {
      modelInput.value = "";
      colorInput.value = "";
      return;
    }

    try {
      const res = await getChassisDetails(chassis);
      if (res.status === 1 && res.data) {
        modelInput.value = res.data.model || "";
        colorInput.value = res.data.color || "";
      } else {
        modelInput.value = "not found";
        colorInput.value = "not found";
      }
    } catch (error) {
      console.error("Error fetching details:", error);
      modelInput.value = "error";
      colorInput.value = "error";
    }
  });


  

  document
    .getElementById("form_3_1")
    .addEventListener("submit", async function (e) {
      e.preventDefault();

      const data = {
        chassis: document.getElementById("chassis").value,
        
        
        
        
        
        
        stock_status: "B2C", 
        sale_counter: document.getElementById("sale_counter").value,
        sale_date: document.getElementById("sale_date").value,
        customer_name: document.getElementById("customer_name").value,
        mobile_number: document.getElementById("mobile_number").value,
        alternate_mobile_number: document.getElementById("alternate_mobile_number").value,
        cash_or_finance: document.getElementById("cash_or_finance").value,
        financer: document.getElementById("financer").value,
        sales_person: document.getElementById("sales_person").value
      };

      const res = await postAction("form_3_1", data);
      displayResponse("form_3_1_response", res); if(res.status === 1) document.getElementById("form_3_1").reset();
    });
}


