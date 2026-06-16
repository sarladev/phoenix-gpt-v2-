let messages = JSON.parse(localStorage.getItem("phoenix_v2_messages")) || [];
let lastQuestion = "";
let lastAnswer = "";

function saveMessages() {
  localStorage.setItem("phoenix_v2_messages", JSON.stringify(messages));
  renderHistory();
}

function renderHistory() {
  const historyList = document.getElementById("historyList");
  historyList.innerHTML = "";

  messages
    .filter(m => m.role === "user")
    .slice(-10)
    .reverse()
    .forEach(m => {
      const item = document.createElement("div");
      item.className = "history-item";
      item.textContent = m.content.slice(0, 35) + "...";
      item.onclick = () => {
        document.getElementById("userInput").value = m.content;
      };
      historyList.appendChild(item);
    });
}

function clearSavedChat() {
  localStorage.removeItem("phoenix_v2_messages");
}
