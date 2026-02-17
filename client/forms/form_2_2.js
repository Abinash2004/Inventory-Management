import { loadDropdown } from '../utils/dropdown.js';
import { postAction, displayResponse } from '../utils/api.js';

export function render_form_2_2() {
  const container = document.getElementById("form-container");
  if (!container) return;

  container.innerHTML = `
    <h3>FORM 2.2 - Advance Return Form</h3>

    <form id="form_2_2">

      <div>
        <label>Advancer Name</label><br>
        <select id="advancer_name" required>
          <option value="">loading...</option>
        </select>
      </div><br>

      <div>
        <label>Return Amount</label><br>
        <input type="number"
               id="advance_return"
               required
               min="0">
      </div><br>

      <div>
        <label>Return Person</label><br>
        <select id="return_person" required>
          <option value="">loading...</option>
        </select>
      </div><br>

      <button type="submit">submit</button>

    </form>

    <div id="form_2_2_response"></div>
  `;


  loadDropdown("get_dropdown", "advancer_name", 7);
  loadDropdown("get_dropdown", "return_person", 4);




  document
    .getElementById("form_2_2")
    .addEventListener("submit", async function (e) {
      e.preventDefault();

      const data = {
        advancer_name: document.getElementById("advancer_name").value,
        advance_return: document.getElementById("advance_return").value,
        return_person: document.getElementById("return_person").value
      };

      const res = await postAction("form_2_2", data);
      displayResponse("form_2_2_response", res);
      if (res.status === 1) {
        document.getElementById("form_2_2").reset();
        loadDropdown("get_dropdown", "advancer_name", 7);
        loadDropdown("get_dropdown", "return_person", 4);
      }
    });
}


