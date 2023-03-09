/** @return {HTMLSelectElement} */
function getSelect() {
  // #hub elemnt is frash new after every API request.
  // Becaouse of this we need to constanlty find new invterval selector
  return document.querySelector('[name="interval"]');
}

function insertYearSelect() {
  if (document.getElementById("yearSelect")) {
    return;
  }

  const divFlex = document.createElement('div')
  divFlex.classList.add('flex-1')

  const yearSelect = document.createElement('div');
  yearSelect.onchange = onYearSelect;
  yearSelect.id = "yearSelect";

  yearSelect.innerHTML = `
    <label>Year:</label>
    <div class="select-wrapper">
      <select name="year">
        <option value="" selected="selected">Pick a year</option>
        <option value="2023">2023</option>
        <option value="2022">2022</option>
        <option value="2021">2021</option>
        <option value="2020">2020</option>
        <option value="2019">2019</option>
        <option value="2018">2018</option>
        <option value="2017">2017</option>
        <option value="2016">2016</option>
        <option value="2015">2015</option>
        <option value="2014">2014</option>
        <option value="2013">2013</option>
      </select>
    </div>
    `;

  const params = new URLSearchParams(document.location.href);
  const after = params.get('after')?.split('-')[0];;
  const before = params.get('before')?.split('-')[0];
  const today = new Date();

  if (after && (
    (before && after === before) ||
    (after == today.getFullYear())
  )) {
    yearSelect.children[1].children[0].value = after;
  }

  selectParent = getSelect().parentElement.parentElement;
  selectParent.parentNode.insertBefore(yearSelect, selectParent.nextSibling);
  selectParent.parentNode.insertBefore(divFlex, selectParent.nextSibling);
}

/** @param {Event} event */
function onYearSelect(event) {
  const value = event.target.value;

  if (value === "") return;

  const after = `${value}-01-01`;
  const before = `${value}-12-31`;

  const params = new URLSearchParams(window.location.search);
  params.set('after', after);
  params.set('before', '');

  const today = new Date();
  if (value != today.getFullYear()) {
    params.set('before', before);
  }

  window.location.search = params.toString();
}

function onPeriodSelect() {
  if (getSelect().value !== "") {
    return;
  }

  insertYearSelect();
}

function listenToHubUbdate() {
  const observer = new MutationObserver(() => getSelect().onchange = onPeriodSelect);
  el = document.getElementById('hub').parentNode;
  observer.observe(el, { childList: true });
}

function main() {
  const hub = document.getElementById('hub');
  if (!hub) return;

  listenToHubUbdate();
  getSelect().onchange = onPeriodSelect;

  if (getSelect().value === "") {
    insertYearSelect();
  }
}

main();
