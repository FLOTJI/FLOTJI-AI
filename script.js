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

// Приветствие при загрузке
window.onload = () => {
    setTimeout(() => {
        addMsg("Система FLOTJI-AI активирована. Я готов к работе. Чем могу помочь?", "bot");
    }, 500);
};

async function handleSend() {
    const val = input.value.trim();
    if (!val) return;

    addMsg(val, 'user');
    input.value = "";

    setTimeout(() => {
        let response = "Запрос принят в обработку FLOTJI-AI. Нужно больше данных.";
        const low = val.toLowerCase();

        if (low.includes("привет")) response = "Приветствую! На связи FLOTJI-AI. Как твои дела?";
        if (low.includes("кто ты")) response = "Я FLOTJI-AI — твой персональный искусственный интеллект.";
        if (low.includes("как дела")) response = "Мои системы работают в штатном режиме. Все отлично!";
        
        addMsg(response, 'bot');
    }, 700);
}

btn.onclick = handleSend;
input.onkeypress = (e) => { if (e.key === 'Enter') handleSend(); };
