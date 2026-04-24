const elements = document.querySelectorAll(".simple-animate");

window.addEventListener("scroll", () => {
    elements.forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 100) {
            el.classList.add("show");
        }
    });
});

window.dispatchEvent(new Event("scroll"));

// --- AI CHATBOT LOGIC ---
const chatToggleBtn = document.getElementById("chat-toggle-btn");
const chatCloseBtn = document.getElementById("chat-close-btn");
const chatWindow = document.getElementById("chat-window");
const chatBody = document.getElementById("chat-body");
const chatInput = document.getElementById("chat-input");
const chatSendBtn = document.getElementById("chat-send-btn");

// Toggle chat window
chatToggleBtn.addEventListener("click", () => {
    chatWindow.classList.remove("hidden");
    chatInput.focus();
});

chatCloseBtn.addEventListener("click", () => {
    chatWindow.classList.add("hidden");
});

// Create and append a message element
function appendMessage(sender, text) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("chat-message");
    if (sender === "user") {
        msgDiv.classList.add("user-message");
    } else {
        msgDiv.classList.add("bot-message");
    }
    msgDiv.textContent = text;
    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight; // auto scroll to bottom
}

// Show typing indicator
function showTypingIndicator() {
    const indicator = document.createElement("div");
    indicator.classList.add("typing-indicator");
    indicator.id = "typing-indicator";
    indicator.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';
    chatBody.appendChild(indicator);
    chatBody.scrollTop = chatBody.scrollHeight;
}

// Hide typing indicator
function hideTypingIndicator() {
    const indicator = document.getElementById("typing-indicator");
    if (indicator) {
        indicator.remove();
    }
}

// Handle sending message
async function handleSend() {
    const text = chatInput.value.trim();
    if (!text) return;

    // 1. Display user message
    appendMessage("user", text);
    chatInput.value = "";

    // 2. Show typing phase
    showTypingIndicator();

    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: text })
        });
        
        const data = await response.json();
        const botReply = data.reply;

        hideTypingIndicator();
        appendMessage("bot", botReply);

    } catch (error) {
        console.error("Error asking agent:", error);
        hideTypingIndicator();
        appendMessage("bot", "Oops! I encountered an error connecting to my brain. Is the Python server running?");
    }
}

// Event Listeners for send
chatSendBtn.addEventListener("click", handleSend);
chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        handleSend();
    }
});
