import { loadDropdown } from '../utils/dropdown.js';
import { postAction, getChassisDetails, getAdvanceDetails, displayResponse } from '../utils/api.js';
import { CONFIG } from '../utils/config.js';

export function render_form_3_2() {
  const container = document.getElementById("form-container");
  if (!container) return;

  container.innerHTML = `
    <h3>FORM 3.2 - Sales Account Form</h3>

    <form id="form_3_2">

      <!-- Chassis Selection -->
      <div>
        <label>Chassis Number</label><br>
        <select id="chassis" required>
          <option value="">loading...</option>
        </select>
      </div><br>

      <!-- Auto-Fetched Customer Name -->
      <div>
        <label>Customer Name</label><br>
        <input type="text"
               id="customer_name"
               readonly
               placeholder="auto-fetched">
      </div><br>

      <!-- Price Tag -->
      <div>
        <label>Price Tag Number</label><br>
        <input type="text"
               id="price_tag_number"
               required
               pattern="[a-zA-Z0-9]+"
               title="alphanumeric only">
      </div><br>

      <!-- Total Down Payment -->
      <div>
        <label>Total Down Payment</label><br>
        <input type="number"
               id="total_dp"
               required
               min="0">
      </div><br>

      <!-- Any Advance -->
      <div>
        <label>Any Advance?</label><br>
        <select id="any_advance" required>
          <option value="NO">NO</option>
          <option value="YES">YES</option>
        </select>
      </div><br>

      <!-- Advance Fields (Hidden by default) -->
      <div id="advance_fields" style="display:none; border-left: 3px solid #ccc; padding-left: 10px;">
        
        <div>
          <label>Advancer Name</label><br>
          <select id="advancer_name">
            <option value="">loading...</option>
          </select>
        </div><br>

        <div>
          <label>Advance Amount</label><br>
          <input type="number"
                 id="advance_amount"
                 readonly
                 placeholder="auto-fetched">
        </div><br>

      </div>

      <!-- Received Down Payment -->
      <div>
        <label>Received Down Payment</label><br>
        <input type="number"
               id="received_dp"
               required
               min="0">
      </div><br>

      <!-- Calculated Due -->
      <div>
        <label>Due (Calculated)</label><br>
        <input type="number"
               id="due_amount"
               readonly
               value="0">
      </div><br>

      <!-- Any Exchange -->
      <div>
        <label>Any Exchange?</label><br>
        <select id="any_exchange" required>
          <option value="NO">NO</option>
          <option value="YES">YES</option>
        </select>
      </div><br>

      <!-- Exchange Fields (Hidden by default) -->
      <div id="exchange_fields" style="display:none; border-left: 3px solid #ccc; padding-left: 10px;">

        <div>
          <label>Exchange Model</label><br>
          <select id="exchange_model">
            <option value="">loading...</option>
          </select>
        </div><br>

        <div>
          <label>Register Number</label><br>
          <input type="text"
                 id="exchange_register_number"
                 pattern="[a-zA-Z0-9]+"
                 title="alphanumeric only">
        </div><br>

        <div>
          <label>Customer Exchange Value</label><br>
          <input type="number"
                 id="customer_exchange_value"
                 min="0">
        </div><br>

        <div>
           <label>Exchange Dealer</label><br>
           <input type="text"
                  id="dealer_name">
        </div><br>

        <div>
          <label>Dealer Value</label><br>
          <input type="number"
                 id="dealer_exchange_value"
                 min="0">
        </div><br>

      </div>

      <button type="submit">submit</button>

    </form>

    <div id="form_3_2_response"></div>
  `;

  loadDropdown("get_dropdown", "chassis", 11);
  loadDropdown("get_dropdown", "advancer_name", 7);
  loadDropdown("get_dropdown", "exchange_model", 1);

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



  const anyAdvanceSelect = document.getElementById("any_advance");
  const advanceFields = document.getElementById("advance_fields");
  const advancerNameSelect = document.getElementById("advancer_name");
  const advanceAmountInput = document.getElementById("advance_amount");

  anyAdvanceSelect.addEventListener("change", function () {
    if (this.value === "YES") {
      advanceFields.style.display = "block";
      advancerNameSelect.setAttribute("required", "true");
      advanceAmountInput.setAttribute("required", "true");
    } else {
      advanceFields.style.display = "none";
      advancerNameSelect.removeAttribute("required");
      advanceAmountInput.removeAttribute("required");

      advancerNameSelect.value = "";
      advanceAmountInput.value = "";
      calculateDue();
    }
  });


  advancerNameSelect.addEventListener("change", async function () {
    const advancer = this.value;
    advanceAmountInput.value = "fetching...";

    if (!advancer) {
      advanceAmountInput.value = "";
      calculateDue();
      return;
    }

    try {

      const url = new URL(CONFIG.WEB_APP_URL);





      const res = await getAdvanceDetails(advancer);

      if (res.status === 1 && res.data) {
        advanceAmountInput.value = res.data.amount || 0;
      } else {
        advanceAmountInput.value = 0;
      }
    } catch (error) {
      console.error(error);
      advanceAmountInput.value = 0;
    }
    calculateDue();
  });



  const anyExchangeSelect = document.getElementById("any_exchange");
  const exchangeFields = document.getElementById("exchange_fields");
  const exchangeInputs = [
    "exchange_model",
    "exchange_register_number",
    "customer_exchange_value",
    "dealer_name",
    "dealer_exchange_value"
  ];

  anyExchangeSelect.addEventListener("change", function () {
    if (this.value === "YES") {
      exchangeFields.style.display = "block";
      exchangeInputs.forEach(id => document.getElementById(id).setAttribute("required", "true"));
    } else {
      exchangeFields.style.display = "none";
      exchangeInputs.forEach(id => {
        const el = document.getElementById(id);
        el.removeAttribute("required");
        el.value = "";
      });
    }
  });



  const totalDpInput = document.getElementById("total_dp");
  const receivedDpInput = document.getElementById("received_dp");
  const dueOutput = document.getElementById("due_amount");

  function calculateDue() {
    const total = parseFloat(totalDpInput.value) || 0;
    const received = parseFloat(receivedDpInput.value) || 0;
    const advance = parseFloat(advanceAmountInput.value) || 0;



    const due = total - (received + advance);
    dueOutput.value = due;
  }

  [totalDpInput, receivedDpInput, advanceAmountInput].forEach(el => {
    el.addEventListener("input", calculateDue);
  });



  document.getElementById("form_3_2").addEventListener("submit", async function (e) {
    e.preventDefault();

    const data = {
      chassis: document.getElementById("chassis").value,
      any_advance: document.getElementById("any_advance").value,
      price_tag_number: document.getElementById("price_tag_number").value,
      total_dp: document.getElementById("total_dp").value,
      received_dp: document.getElementById("received_dp").value,
      any_exchange: document.getElementById("any_exchange").value,


      advancer_name: document.getElementById("advancer_name").value,
      advance_amount: document.getElementById("advance_amount").value,


      exchange_model: document.getElementById("exchange_model").value,
      exchange_register_number: document.getElementById("exchange_register_number").value,
      customer_exchange_value: document.getElementById("customer_exchange_value").value,
      dealer_name: document.getElementById("dealer_name").value,
      dealer_exchange_value: document.getElementById("dealer_exchange_value").value
    };

    const res = await postAction("form_3_2", data);
    displayResponse("form_3_2_response", res);
    if (res.status === 1) {
      document.getElementById("form_3_2").reset();
      loadDropdown("get_dropdown", "chassis", 11);
      loadDropdown("get_dropdown", "advancer_name", 7);
      loadDropdown("get_dropdown", "exchange_model", 1);
    }
  });
}


