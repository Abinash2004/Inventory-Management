import { loadDropdown } from '../utils/dropdown.js';
import { postAction, displayResponse } from '../utils/api.js';

export function render_form_2_1() {
  const container = document.getElementById("form-container");
  if (!container) return;

  container.innerHTML = `
    <h3>FORM 2.1 - Advance Payment Form</h3>

    <form id="form_2_1">

      <div>
        <label>Advancer Name</label><br>
        <input type="text"
               id="advancer_name"
               required>
      </div><br>

      <div>
        <label>Mobile Number</label><br>
        <input type="text"
               id="mobile"
               required
               pattern="[0-9]{10}"
               title="10 digits only">
      </div><br>

      <div>
        <label>Alternate Mobile Number (Opt)</label><br>
        <input type="text"
               id="alt_mobile"
               pattern="[0-9]{10}"
               title="10 digits only">
      </div><br>

      <div>
        <label>Advance Amount</label><br>
        <input type="number"
               id="amount"
               required
               min="0">
      </div><br>

      <div>
        <label>Counter Name</label><br>
        <select id="counter" required>
          <option value="">loading...</option>
        </select>
      </div><br>

      <div>
        <label>Receiver Name</label><br>
        <select id="receiver" required>
          <option value="">loading...</option>
        </select>
      </div><br>

      <div>
        <label>Model</label><br>
        <select id="model" required>
          <option value="">loading...</option>
        </select>
      </div><br>

      <div>
        <label>Color (Opt)</label><br>
        <select id="color">
          <option value="">loading...</option>
        </select>
      </div><br>

      <div>
        <label>Remark (Opt)</label><br>
        <input type="text"
               id="remarks">
      </div><br>

      <button type="submit">submit</button>

    </form>

    <div id="form_2_1_response"></div>
  `;



  loadDropdown("get_dropdown", "counter", 3);
  loadDropdown("get_dropdown", "receiver", 4);
  loadDropdown("get_dropdown", "model", 1);
  loadDropdown("get_dropdown", "color", 2);



  document
    .getElementById("form_2_1")
    .addEventListener("submit", async function (e) {
      e.preventDefault();

      const data = {
        advancer_name: document.getElementById("advancer_name").value,
        mobile_number: document.getElementById("mobile").value,
        alternate_mobile_number: document.getElementById("alt_mobile").value,
        amount: document.getElementById("amount").value,
        counter: document.getElementById("counter").value,
        receiver_name: document.getElementById("receiver").value,
        model: document.getElementById("model").value,
        color: document.getElementById("color").value,
        remark: document.getElementById("remarks").value
      };

      const res = await postAction("form_2_1", data);
      displayResponse("form_2_1_response", res);
      if (res.status === 1) {
        document.getElementById("form_2_1").reset();
        loadDropdown("get_dropdown", "counter", 3);
        loadDropdown("get_dropdown", "receiver", 4);
        loadDropdown("get_dropdown", "model", 1);
        loadDropdown("get_dropdown", "color", 2);
      }
    });
}


