export function sendToast(message, type) {
  document
    .getElementById("toaster")
    .appendChild(
      document.createElement("div")
    ).innerHTML = `<div class="alert ${type}"><span>${message}</span></div>`;
  setTimeout(() => {
    document
      .getElementById("toaster")
      .removeChild(document.getElementById("toaster").firstChild);
  }, 3000);
}
