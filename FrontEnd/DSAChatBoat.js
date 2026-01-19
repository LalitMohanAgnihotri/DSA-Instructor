const feed = document.getElementById("feed");
const textarea = document.getElementById("user-input");

let chatStarted = false;

textarea.addEventListener("input", () => {
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + "px";
});

textarea.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    askAI();
  }
});

async function askAI() {
  const text = textarea.value.trim();
  if (!text) return;

  textarea.value = "";

  const userDiv = document.createElement("div");
  userDiv.className = "user-msg";
  userDiv.innerText = text;
  feed.appendChild(userDiv);

  const aiDiv = document.createElement("div");
  aiDiv.className = "ai-msg";
  aiDiv.innerText = "Processing...";
  feed.appendChild(aiDiv);

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

    if (data.candidates?.length) {
      aiDiv.innerText = data.candidates[0].content.parts
        .map(p => p.text)
        .join("");
    } else {
      aiDiv.innerText = "No response from model.";
    }
  } catch {
    aiDiv.innerText = "Error connecting to instructor.";
  }
}
