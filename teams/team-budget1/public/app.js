// public/app.js
// Small client-side enhancement: set default date on the form if empty.
(function () {
  const dateInput = document.querySelector('input[type="date"][name="date"]');
  if (dateInput && !dateInput.value) {
    const today = new Date();
    const yyyy = String(today.getFullYear());
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    dateInput.value = `${yyyy}-${mm}-${dd}`;
  }
})();