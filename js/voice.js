function startVoice() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Voice input is not supported. Use Chrome browser.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-IN";
  recognition.start();

  recognition.onresult = function(event) {
    document.getElementById("userInput").value = event.results[0][0].transcript;
  };
}

function speakLastAnswer() {
  if (!lastAnswer) {
    alert("No answer to speak.");
    return;
  }

  const speech = new SpeechSynthesisUtterance(lastAnswer);
  speech.lang = "en-IN";
  speech.rate = 1;
  speechSynthesis.speak(speech);
}
