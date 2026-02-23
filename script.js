const chat = document.getElementById('chat-window');
const input = document.getElementById('user-input');
const btn = document.getElementById('send-btn');

// --- МОДУЛЬ ПАМЯТИ И РАЗВИТИЯ ---
// Загружаем знания из памяти браузера или создаем пустую базу
let aiMemory = JSON.parse(localStorage.getItem('flotji_memory')) || {
    "привет": "Системы активны. Я учусь с каждым твоим словом!",
    "кто ты": "Я FLOTJI-AI, самообучающаяся система."
};

function saveKnowledge() {
    localStorage.setItem('flotji_memory', JSON.stringify(aiMemory));
}

function addMsg(text, type) {
    const d = document.createElement('div');
    d.className = `msg ${type}`;
    d.textContent = text;
    chat.appendChild(d);
    chat.scrollTop = chat.scrollHeight;
}

async function botType(text) {
    const d = document.createElement('div');
    d.className = "msg bot";
    d.textContent = "...";
    chat.appendChild(d);
    await new Promise(r => setTimeout(r, 800));
    d.textContent = text;
    chat.scrollTop = chat.scrollHeight;
}

// ЛОГИКА ОБУЧЕНИЯ
async function handleSend() {
    const val = input.value.trim();
    if (!val) return;

    addMsg(val, 'user');
    input.value = "";

    const low = val.toLowerCase();
    
    // 1. Проверяем, нет ли в сообщении команды обучения (например: "Запомни, что небо зеленое")
    if (low.startsWith("запомни, что ")) {
        const info = val.replace(/запомни, что /i, "").split("—");
        if (info.length === 2) {
            const key = info[0].trim().toLowerCase();
            const value = info[1].trim();
            aiMemory[key] = value;
            saveKnowledge();
            await botType(`Понял. Я внес это в свои протоколы: "${key}" теперь ассоциируется с "${value}".`);
            return;
        } else {
            await botType("Чтобы я запомнил, пиши так: 'Запомни, что [вопрос] — [ответ]'");
            return;
        }
    }

    // 2. Поиск ответа в самообученной базе
    let response = "";
    for (let key in aiMemory) {
        if (low.includes(key)) {
            response = aiMemory[key];
            break;
        }
    }

    // 3. Если ответа нет, имитируем "поиск" и предлагаем пользователю обучить бота
    if (!response) {
        if (low.includes("время")) {
            response = "Сейчас " + new Date().toLocaleTimeString();
        } else {
            response = "Мои текущие алгоритмы не знают ответа. Научишь меня? Напиши: 'Запомни, что [вопрос] — [ответ]'";
        }
    }

    await botType(response);
}

btn.onclick = handleSend;
input.onkeypress = (e) => { if (e.key === 'Enter') handleSend(); };

window.onload = () => {
    botType("Система FLOTJI-AI готова к эволюции. Чему научишь меня сегодня?");
};
