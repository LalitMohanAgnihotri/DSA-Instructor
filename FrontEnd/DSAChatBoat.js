const feed = document.getElementById("feed");
const textarea = document.getElementById("user-input");
const sendBtn = document.getElementById("sendBtn");
const newChatBtn = document.getElementById("newChatBtn");
const sidebar = document.getElementById("sidebar");
const hamburger = document.getElementById("hamburger");

let isStreaming = false;

/* Auto-resize textarea */
textarea.addEventListener("input", () => {
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + "px";
});

/* Enter to send */
textarea.addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    askAI();
  }
});

/* Toggle sidebar */
hamburger.addEventListener("click", e => {
  e.stopPropagation();
  sidebar.classList.toggle("open");
});

/* Close sidebar when clicking outside (mobile only) */
document.addEventListener("click", e => {
  if (
    window.innerWidth <= 768 &&
    sidebar.classList.contains("open") &&
    !sidebar.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    sidebar.classList.remove("open");
  }
});

/* New Chat */
newChatBtn.addEventListener("click", () => {
  feed.innerHTML = `
    <div class="system-msg main-text" id="greeting">
      Hello, how can I help you related to DSA?
    </div>
  `;
  textarea.value = "";
  textarea.style.height = "auto";
  sidebar.classList.remove("open");
});

/* Streaming effect */
function streamText(el, text) {
  let i = 0;
  el.textContent = "";
  isStreaming = true;

  const interval = setInterval(() => {
    el.textContent += text[i++];
    feed.scrollTop = feed.scrollHeight;

    if (i >= text.length) {
      clearInterval(interval);
      isStreaming = false;
    }
  }, 18);
}

/* Ask AI */
async function askAI() {
  if (isStreaming) return;

  const text = textarea.value.trim();
  if (!text) return;

  textarea.value = "";
  textarea.style.height = "auto";

  document.getElementById("greeting")?.remove();

  const userMsg = document.createElement("div");
  userMsg.className = "user-msg";
  userMsg.textContent = text;
  feed.appendChild(userMsg);

  const aiMsg = document.createElement("div");
  aiMsg.className = "ai-msg";
  aiMsg.textContent = "Typing…";
  feed.appendChild(aiMsg);

  feed.scrollTop = feed.scrollHeight;

  try {
    const res = await fetch(
      "https://dsa-instructor-oexl.onrender.com/api/chat",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      }
    );

    const data = await res.json();
    const output =
      data?.candidates?.[0]?.content?.parts
        ?.map(p => p.text)
        .join("") || "No response from instructor.";

    streamText(aiMsg, output);
  } catch {
    aiMsg.textContent = "Error connecting to instructor.";
    isStreaming = false;
  }
}
