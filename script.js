const chat = document.getElementById('chat-window');
const input = document.getElementById('user-input');
const btn = document.getElementById('send-btn');

function addMsg(text, type) {
    const d = document.createElement('div');
    d.className = `msg ${type}`;
    d.textContent = text;
    chat.appendChild(d);
    chat.scrollTop = chat.scrollHeight;
}

async function handleSend() {
    const val = input.value.trim();
    if (!val) return;

    addMsg(val, 'user');
    input.value = "";

    // Эффект "печатает..."
    setTimeout(() => {
        let response = "Я получил твой запрос. Давай проанализируем это подробнее.";
        
        const low = val.toLowerCase();
        if (low.includes("привет")) response = "Привет! Я твой ИИ-ассистент в новой оболочке. Чем займемся?";
        if (low.includes("кто ты")) response = "Я Gemini 3 Flash, адаптированный для твоего личного приложения.";
        
        addMsg(response, 'bot');
    }, 800);
}

btn.onclick = handleSend;
input.onkeypress = (e) => { if (e.key === 'Enter') handleSend(); };
