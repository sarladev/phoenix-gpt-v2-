const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const thinking = document.getElementById("thinking");
const fileInput = document.getElementById("fileInput");

renderOldMessages();
renderHistory();

async function sendMessage() {
  let text = userInput.value.trim();

  if (!text) return;

  const fileText = await readUploadedFile();

  if (fileText) {
    text += "\n\nUploaded file content:\n" + fileText;
  }

  lastQuestion = text;

  addMessage("user", text);

  messages.push({
    role: "user",
    content: text
  });

  saveMessages();

  userInput.value = "";
  thinking.classList.remove("hidden");

  const answer = await callOpenRouterAPI(messages);

  thinking.classList.add("hidden");

  lastAnswer = answer;

  typeBotMessage(answer);

  messages.push({
    role: "assistant",
    content: answer
  });

  saveMessages();
}

function addMessage(role, text) {
  const msg = document.createElement("div");
  msg.className = "message " + role;

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = role === "user" ? "👤" : "🤖";

  const bubble = document.createElement("div");
  bubble.className = "bubble";

  bubble.innerHTML = `
    <b>${role === "user" ? "You" : "Phoenix GPT"}</b>
    <p>${escapeHTML(text)}</p>
  `;

  if (role === "bot") {
    const copy = document.createElement("button");
    copy.className = "copy-btn";
    copy.textContent = "Copy";
    copy.onclick = () => navigator.clipboard.writeText(text);
    bubble.appendChild(copy);
  }

  if (role === "user") {
    msg.appendChild(bubble);
    msg.appendChild(avatar);
  } else {
    msg.appendChild(avatar);
    msg.appendChild(bubble);
  }

  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function typeBotMessage(text) {
  const msg = document.createElement("div");
  msg.className = "message bot";

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = "🤖";

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.innerHTML = "<b>Phoenix GPT</b><p></p>";

  msg.appendChild(avatar);
  msg.appendChild(bubble);
  chatBox.appendChild(msg);

  const p = bubble.querySelector("p");

  let i = 0;

  const interval = setInterval(() => {
    p.textContent = text.slice(0, i);
    i++;

    chatBox.scrollTop = chatBox.scrollHeight;

    if (i > text.length) {
      clearInterval(interval);

      const copy = document.createElement("button");
      copy.className = "copy-btn";
      copy.textContent = "Copy";
      copy.onclick = () => navigator.clipboard.writeText(text);
      bubble.appendChild(copy);
    }
  }, 10);
}

function renderOldMessages() {
  messages.forEach(m => {
    addMessage(m.role === "user" ? "user" : "bot", m.content);
  });
}

function newChat() {
  messages = [];
  lastQuestion = "";
  lastAnswer = "";
  clearSavedChat();

  chatBox.innerHTML = `
    <div class="message bot">
      <div class="avatar">🤖</div>
      <div class="bubble">
        <b>Phoenix GPT</b>
        <p>New chat started 🔥 Ask me anything.</p>
      </div>
    </div>
  `;

  renderHistory();
}

function clearChat() {
  if (confirm("Clear this chat?")) {
    newChat();
  }
}

async function regenerate() {
  if (!lastQuestion) {
    alert("No previous question found.");
    return;
  }

  userInput.value = lastQuestion;
  await sendMessage();
}

function copyLastAnswer() {
  if (!lastAnswer) {
    alert("No answer to copy.");
    return;
  }

  navigator.clipboard.writeText(lastAnswer);
  alert("Copied.");
}

function downloadChat() {
  const text = messages.map(m => `${m.role.toUpperCase()}:\n${m.content}`).join("\n\n");

  const blob = new Blob([text], {
    type: "text/plain"
  });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "phoenix-gpt-v2-chat.txt";
  a.click();
}

function quickPrompt(text) {
  userInput.value = text;
  userInput.focus();
}

function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("active");
}

function readUploadedFile() {
  return new Promise((resolve) => {
    const file = fileInput.files[0];

    if (!file) {
      resolve("");
      return;
    }

    if (!file.type.includes("text")) {
      resolve("Uploaded file: " + file.name + ". This version supports text file reading only.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result.slice(0, 7000));
    };

    reader.readAsText(file);
  });
}

function escapeHTML(text) {
  return text.replace(/[&<>"']/g, function(char) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[char];
  });
                }
