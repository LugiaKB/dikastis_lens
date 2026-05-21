import "./popup.css";

// Log initialization
console.log("Popup iniciado");

// Select the main application container
const appDiv = document.getElementById("app");

if (appDiv) {
  appDiv.innerHTML = `
    <h1>Dikastis Lens</h1>
    <p>v0.1.0</p>
    <p class="status-ok">Pronto.</p>
  `;
}
