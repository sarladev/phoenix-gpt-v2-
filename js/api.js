function saveApiKey() {
  const key = prompt("Paste your OpenRouter API key:");

  if (!key) return;

  localStorage.setItem("phoenix_v2_api_key", key);
  alert("API key saved in this browser only.");
}

async function callOpenRouterAPI(chatMessages) {
  const apiKey = localStorage.getItem("phoenix_v2_api_key");

  if (!apiKey) {
    return "Please click 🔑 API Key and paste your OpenRouter API key first.";
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + apiKey,
      "Content-Type": "application/json",
      "HTTP-Referer": window.location.href,
      "X-Title": "Phoenix GPT v2"
    },
    body: JSON.stringify({
      model: "openrouter/free",
      messages: [
        {
          role: "system",
          content: "You are Phoenix GPT v2, a fast, helpful, creative AI assistant. Answer clearly, professionally, and simply."
        },
        ...chatMessages
      ]
    })
  });

  const data = await response.json();

  if (data.error) {
    return "API Error: " + data.error.message;
  }

  return data.choices?.[0]?.message?.content || "No response received.";
    }
