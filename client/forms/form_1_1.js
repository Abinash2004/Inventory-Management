import { loadDropdown } from '../utils/dropdown.js';
import { postAction, displayResponse } from '../utils/api.js';

export function render_form_1_1() {
  const container = document.getElementById("form-container");
  if (!container) return;

  container.innerHTML = `
    <h3>FORM 1.1 - Inventory Stock Form</h3>

    <form id="form_1_1">

      <div>
        <label>Chassis Number</label><br>
        <input type="text"
               id="chassis"
               required
               pattern="[a-zA-Z0-9]+"
               title="alphanumeric only">
      </div><br>

      <div>
        <label>Engine Number</label><br>
        <input type="text"
               id="engine"
               required
               pattern="[a-zA-Z0-9]+"
               title="alphanumeric only">
      </div><br>

      <div>
        <label>Key Number (Opt)</label><br>
        <input type="number"
               id="key">
      </div><br>

      <div>
        <label>Model</label><br>
        <select id="model" required>
          <option value="">loading...</option>
        </select>
      </div><br>

      <div>
        <label>Color</label><br>
        <select id="color" required>
          <option value="">loading...</option>
        </select>
      </div><br>

      <div>
        <label>Current Counter</label><br>
        <select id="counter" required>
          <option value="">loading...</option>
        </select>
      </div><br>

      <button type="submit">submit</button>

    </form>

    <div id="form_1_1_response"></div>
  `;



  loadDropdown("get_dropdown", "model", 1);
  loadDropdown("get_dropdown", "color", 2);
  loadDropdown("get_dropdown", "counter", 3);



  document
    .getElementById("form_1_1")
    .addEventListener("submit", async function (e) {

      e.preventDefault();

      const data = {
        chassis: document.getElementById("chassis").value,
        engine: document.getElementById("engine").value,
        key: document.getElementById("key").value,
        model: document.getElementById("model").value,
        color: document.getElementById("color").value,
        counter: document.getElementById("counter").value
      };

      const res = await postAction("form_1_1", data);
      displayResponse("form_1_1_response", res);
      if (res.status === 1) {
        document.getElementById("form_1_1").reset();
        loadDropdown("get_dropdown", "model", 1);
        loadDropdown("get_dropdown", "color", 2);
        loadDropdown("get_dropdown", "counter", 3);
      }
    }
    );
}


