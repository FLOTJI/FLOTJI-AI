// --- ИНИЦИАЛИЗАЦИЯ И ПАМЯТЬ ---
const chat = document.getElementById('chat-window');
const input = document.getElementById('user-input');
const btn = document.getElementById('send-btn');

// Загружаем базу знаний из памяти браузера
let aiMemory = JSON.parse(localStorage.getItem('flotji_brain')) || {
    "привет": "Системы FLOTJI-AI активны. Чем могу помочь?",
    "кто ты": "Я твой персональный ИИ-ассистент, способный к самообучению.",
    "как дела": "Мои алгоритмы работают в штатном режиме. А у тебя?"
};

function saveKnowledge() {
    localStorage.setItem('flotji_brain', JSON.stringify(aiMemory));
}

// --- ФУНКЦИИ ИНТЕРФЕЙСА ---
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
    d.innerHTML = '<span class="typing">...</span>';
    chat.appendChild(d);
    chat.scrollTop = chat.scrollHeight;

    await new Promise(r => setTimeout(r, 600)); // Имитация раздумья
    d.textContent = text;
    chat.scrollTop = chat.scrollHeight;
}

// Генератор паролей
function generatePass() {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let res = "";
    for (let i = 0; i < 14; i++) res += charset.charAt(Math.floor(Math.random() * charset.length));
    return res;
}

// --- ГЛАВНАЯ ЛОГИКА ОБРАБОТКИ ---
async function handleSend() {
    const val = input.value.trim();
    if (!val) return;

    addMsg(val, 'user');
    const low = val.toLowerCase();
    input.value = "";

    let response = "";

    // 1. МАТЕМАТИКА
    // Проверяем, состоит ли строка только из цифр и знаков + - * / ( ) .
    const mathRegex = /^[0-9+\-*/().\s]+$/;
    if (mathRegex.test(val) && /[0-9]/.test(val)) {
        try {
            // Используем Function вместо eval для безопасности
            const result = new Function('return ' + val)();
            response = "Результат вычислений: " + result;
        } catch (e) { 
            response = "Ошибка в примере. Проверь знаки!"; 
        }
    }

    // 2. ГЕНЕРАТОР ПАРОЛЕЙ
    if (!response && (low.includes("пароль") || low.includes("pass"))) {
        response = "Сгенерировал надежный пароль: " + generatePass();
    }

    // 3. ПЕРЕВОДЧИК
    if (!response && low.startsWith("переведи")) {
        const textToTranslate = val.replace(/переведи/i, "").trim();
        if (textToTranslate) {
            window.open(`https://translate.google.com/?sl=auto&tl=en&text=${encodeURIComponent(textToTranslate)}`, '_blank');
            response = "Открываю переводчик для фразы: " + textToTranslate;
        } else {
            response = "Напиши 'переведи' и далее текст, который нужно перевести.";
        }
    }

    // 4. КОМАНДА ОБУЧЕНИЯ (Запомни, что [вопрос] - [ответ])
    if (!response && low.includes("запомни, что")) {
        const clean = val.replace(/запомни, что/i, "").trim();
        // Разделяем по тире или по слову "это"
        const parts = clean.includes("—") ? clean.split("—") : clean.split("-");
        
        if (parts.length === 2) {
            const key = parts[0].trim().toLowerCase();
            const value = parts[1].trim();
            aiMemory[key] = value;
            saveKnowledge();
            response = `Понял! Теперь я знаю, что "${key}" — это "${value}".`;
        } else {
            response = "Чтобы я запомнил, используй формат: Запомни, что [вопрос] — [ответ] (обязательно с тире).";
        }
    }

    // 5. ПОИСК В БАЗЕ ЗНАНИЙ
    if (!response) {
        for (let key in aiMemory) {
            if (low.includes(key)) {
                response = aiMemory[key];
                break;
            }
        }
    }

    // 6. СТАНДАРТНЫЕ КОМАНДЫ (Время, Дата)
    if (!response) {
        if (low.includes("время")) {
            response = "Сейчас " + new Date().toLocaleTimeString();
        } else if (low.includes("дата") || low.includes("число")) {
            response = "Сегодня " + new Date().toLocaleDateString();
        } else if (low.includes("очисти") || low.includes("удали чат")) {
            chat.innerHTML = "";
            response = "Чат очищен. Начнем с чистого листа!";
        } else {
            // Если ничего не подошло
            response = "Я пока не знаю, что ответить. Но ты можешь научить меня! Напиши: Запомни, что [вопрос] — [ответ]";
        }
    }

    await botType(response);
}

// Слушатели событий
btn.onclick = handleSend;
input.onkeypress = (e) => { if (e.key === 'Enter') handleSend(); };

// Стартовое приветствие
window.onload = () => {
    botType("Система FLOTJI-AI готова. Попробуй математику (например 2+2), команду 'пароль' или обучи меня чему-то новому!");
};
