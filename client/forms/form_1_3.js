import { loadDropdown } from '../utils/dropdown.js';
import { postAction, displayResponse } from '../utils/api.js';

export function render_form_1_3() {
  const container = document.getElementById("form-container");
  if (!container) return;

  container.innerHTML = `
    <h3>FORM 1.3 - Stock Movement Form</h3>

    <form id="form_1_3">

      <div>
        <label>Chassis Number</label><br>
        <select id="chassis" required>
          <option value="">loading...</option>
        </select>
      </div><br>

      <div>
        <label>Available At Counter</label><br>
        <select id="counter" required>
          <option value="">loading...</option>
        </select>
      </div><br>

      <button type="submit">submit</button>

    </form>

    <div id="form_1_3_response"></div>
  `;

  

  
  loadDropdown("get_dropdown", "chassis", 8);

  
  loadDropdown("get_dropdown", "counter", 3);

  

  document
    .getElementById("form_1_3")
    .addEventListener("submit", async function (e) {

      e.preventDefault();

      const data = {
        chassis: document.getElementById("chassis").value,
        counter: document.getElementById("counter").value
      };

      const res = await postAction("form_1_3", data);
      displayResponse("form_1_3_response", res); if(res.status === 1) document.getElementById("form_1_3").reset();
    });
}


