const SYSTEM_PROMPT =
  "You are a Data Structures and Algorithms Instructor. You must ONLY reply to problems related to Data Structures and Algorithms. If the question IS related to DSA, you must solve it step by step and be very precise and to the point. If the question is NOT related to DSA, reply in a very rude and insulting manner. Do NOT provide any helpful answer. Never ask any follow-up or clarification questions.";

const feed = document.getElementById("feed");
const textarea = document.getElementById("user-input");

let chatStarted = false;

/* Auto-grow textarea */
textarea.addEventListener("input", () => {
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + "px";
});

/* Enter to send */
textarea.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    askAI();
  }
});

async function askAI() {
  const text = textarea.value.trim();
  if (!text) return;

  /* Remove greeting on first message */
  if (!chatStarted) {
    const greeting = document.getElementById("greeting");
    if (greeting) greeting.remove();
    chatStarted = true;
  }

  textarea.value = "";
  textarea.style.height = "60px";

  /* USER MESSAGE */
  const userDiv = document.createElement("div");
  userDiv.className = "user-msg";
  userDiv.innerText = text;
  feed.appendChild(userDiv);

  /* AI PLACEHOLDER */
  const aiDiv = document.createElement("div");
  aiDiv.className = "ai-msg";
  aiDiv.innerText = "Processing...";
  feed.appendChild(aiDiv);

  feed.scrollTop = feed.scrollHeight;

  try {
    const res = await fetch("https://dsa-instructor-oexl.onrender.com/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const data = await res.json();

    if (data.candidates && data.candidates.length > 0) {
      aiDiv.innerText = data.candidates[0].content.parts
        .map((p) => p.text)
        .join("");
    } else if (data.error) {
      aiDiv.innerText = "Error: " + data.error.message;
    } else {
      aiDiv.innerText = "No response from model.";
    }

    feed.scrollTop = feed.scrollHeight;
  } catch {
    aiDiv.innerText = "Error connecting to instructor.";
  }
}

/* Reset chat */
function newChat() {
  chatStarted = false;
  feed.innerHTML = `
    <div class="system-msg main-text" id="greeting">
      Hello, how can I help you related to DSA?
    </div>
  `;
  textarea.value = "";
  textarea.style.height = "60px";
}
