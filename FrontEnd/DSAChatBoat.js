/* Protect page */
if (!localStorage.getItem("token")) {
  window.location.href = "login.html";
}

const feed = document.getElementById("feed");
const textarea = document.getElementById("user-input");
const sendBtn = document.getElementById("sendBtn");
const newChatBtn = document.getElementById("newChatBtn");
const sidebar = document.getElementById("sidebar");
const hamburger = document.getElementById("hamburger");



const BACKEND_URL = "https://dsachatboat-backend.onrender.com/api/chat";



let isStreaming = false;
let activeHistoryItem = null;


sendBtn.addEventListener("click", askAI);
const historyList = document.getElementById("historyList");
const historyBtn = document.getElementById("historyBtn");

/* Toggle History */
if (historyBtn) {
  historyBtn.addEventListener("click", () => {
    const isHidden = historyList.style.display === "none";
    historyList.style.display = isHidden ? "block" : "none";
  });
}
function makeTitle(text) {
  return text
    .replace(/^(hi|hello|hey|please)\s+/i, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 35)
    .replace(/^\w/, c => c.toUpperCase());
}
async function loadHistory() {
  try {
    const res = await fetch(`${BACKEND_URL}/history`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const chats = await res.json();
    historyList.innerHTML = "";

    if (!Array.isArray(chats) || chats.length === 0) {
      historyList.innerHTML = `
        <div style="
          padding: 10px;
          font-size: 0.8rem;
          color: #94a3b8;
          text-align: center;
        ">
          No chat history yet
        </div>
      `;
      return;
    }

    chats.forEach((chat) => {
      const item = document.createElement("div");
      item.className = "history-item";
      item.textContent = makeTitle(chat.question);

      item.onclick = () => {
        // remove previous active highlight
        if (activeHistoryItem) {
          activeHistoryItem.classList.remove("active");
        }

        // highlight current item
        item.classList.add("active");
        activeHistoryItem = item;

        // load chat
        feed.innerHTML = "";

        const userMsg = document.createElement("div");
        userMsg.className = "user-msg";
        userMsg.textContent = chat.question;

        const aiMsg = document.createElement("div");
        aiMsg.className = "ai-msg";
        aiMsg.textContent = chat.answer;

        feed.append(userMsg, aiMsg);
      };
      historyList.appendChild(item);
    });
  } catch (err) {
    console.error("History load failed", err);
  }
}

/* Auto-resize textarea */
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

/* Sidebar toggle */
hamburger.addEventListener("click", (e) => {
  e.stopPropagation();
  sidebar.classList.toggle("open");
});

document.addEventListener("click", (e) => {
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

/* Ask AI (via YOUR backend) */
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
    const res = await fetch(BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ text }),
    });

    const data = await res.json();
    streamText(aiMsg, data.answer || "No response.");
  } catch {
    aiMsg.textContent = "Error connecting to server.";
    isStreaming = false;
  }
}
loadHistory();

/* Logout */
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
  });
}
