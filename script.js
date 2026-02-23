const chat = document.getElementById('chat-window');
const input = document.getElementById('user-input');
const btn = document.getElementById('send-btn');

// Функция для добавления сообщений
function addMsg(text, type) {
    const d = document.createElement('div');
    d.className = `msg ${type}`;
    d.textContent = text;
    chat.appendChild(d);
    chat.scrollTop = chat.scrollHeight;
}

// Эффект печати FLOTJI-AI
async function botType(text) {
    const d = document.createElement('div');
    d.className = "msg bot";
    d.textContent = "● ● ●"; // Индикатор раздумья
    chat.appendChild(d);
    
    await new Promise(res => setTimeout(res, 1000)); // Ждем секунду

    d.textContent = text; // Заменяем точки на текст
    chat.scrollTop = chat.scrollHeight;
}

// Приветствие
window.onload = () => {
    setTimeout(() => {
        botType("FLOTJI-AI готов к работе. Как я могу помочь тебе сегодня?");
    }, 500);
};

// Главная логика ответов
async function handleSend() {
    const val = input.value.trim();
    if (!val) return;

    addMsg(val, 'user');
    input.value = "";

    const low = val.toLowerCase();
    let response = "Интересный запрос. Мои алгоритмы пока изучают эту тему, но я постоянно учусь!";

    // База знаний FLOTJI-AI
    if (low.includes("привет")) {
        response = "Привет! Я на связи. Чем сегодня займемся?";
    } else if (low.includes("время") || low.includes("час")) {
        response = "Сейчас " + new Date().toLocaleTimeString();
    } else if (low.includes("дата") || low.includes("число")) {
        response = "Сегодня " + new Date().toLocaleDateString();
    } else if (low.includes("кто тебя создал")) {
        response = "Я — продукт совместной разработки и твоего видения интерфейса!";
    } else if (low.includes("очистить")) {
        chat.innerHTML = "";
        response = "История чата очищена.";
    } else if (low.includes("анекдот")) {
        const jokes = [
            "Почему программисты не любят природу? Там слишком много багов.",
            "Искусственный интеллект — это когда машина думает, а человек при этом отдыхает.",
            "Мой создатель сказал, что я умный. Я ему верю, он же меня создал!"
        ];
        response = jokes[Math.floor(Math.random() * jokes.length)];
    }

    await botType(response);
}

btn.onclick = handleSend;
input.onkeypress = (e) => { if (e.key === 'Enter') handleSend(); };
