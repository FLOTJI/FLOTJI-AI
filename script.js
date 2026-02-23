// --- ИНИЦИАЛИЗАЦИЯ СИСТЕМЫ И ПАМЯТИ ---
const chat = document.getElementById('chat-window');
const input = document.getElementById('user-input');
const btn = document.getElementById('send-btn');

// База знаний + загрузка из LocalStorage
let aiMemory = JSON.parse(localStorage.getItem('flotji_brain')) || {
    "привет": "Системы FLOTJI-AI онлайн. Я готов к работе и общению.",
    "кто ты": "Я твой персональный ИИ-ассистент. Я могу считать, генерировать пароли и обучаться.",
    "что ты умеешь": "Мой функционал включает: голосовую озвучку, математические вычисления, генерацию ключей безопасности и самообучение.",
    "команды": "Попробуй: 'пароль', 'время', '2+2' или научи меня: 'Запомни, что [вопрос] — [ответ]'"
};

// Функция сохранения знаний
function saveKnowledge() {
    localStorage.setItem('flotji_brain', JSON.stringify(aiMemory));
}

// --- ГОЛОСОВОЙ МОДУЛЬ ---
function speak(text) {
    // Отменяем текущую озвучку, если она идет, чтобы не накладывалась
    window.speechSynthesis.cancel();
    
    const msg = new SpeechSynthesisUtterance();
    msg.text = text;
    msg.lang = 'ru-RU';
    msg.pitch = 1.1; // Немного футуристичный тон
    msg.rate = 1;    // Скорость речи
    window.speechSynthesis.speak(msg);
}

// --- ВИЗУАЛЬНЫЙ ВЫВОД (ПЕЧАТЬ) ---
async function botType(text) {
    const d = document.createElement('div');
    d.className = "msg bot";
    chat.appendChild(d);
    
    // Запускаем озвучку параллельно с печатью
    speak(text);

    let i = 0;
    const interval = setInterval(() => {
        d.textContent += text[i];
        i++;
        if (i >= text.length) {
            clearInterval(interval);
            chat.scrollTop = chat.scrollHeight;
        }
    }, 25); // Скорость появления букв
}

function addMsg(text, type) {
    const d = document.createElement('div');
    d.className = `msg ${type}`;
    d.textContent = text;
    chat.appendChild(d);
    chat.scrollTop = chat.scrollHeight;
}

// --- ЛОГИЧЕСКИЙ ЦЕНТР ОБРАБОТКИ ---
async function handleSend() {
    const val = input.value.trim();
    if (!val) return;

    addMsg(val, 'user');
    const low = val.toLowerCase();
    input.value = "";

    let response = "";

    // 1. Модуль обучения (Приоритет №1)
    if (low.includes("запомни, что")) {
        const clean = val.replace(/запомни, что/i, "").trim();
        const parts = clean.split(/[—-]/);
        if (parts.length === 2) {
            const key = parts[0].trim().toLowerCase();
            const value = parts[1].trim();
            aiMemory[key] = value;
            saveKnowledge();
            response = `Принято. Я интегрировал знание о "${key}" в свою базу данных.`;
        } else {
            response = "Для обучения используй формат: Запомни, что [вопрос] — [ответ].";
        }
    }

    // 2. Модуль безопасности (Пароли)
    else if (low.includes("пароль") || low.includes("pass")) {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        let pass = "";
        for (let i = 0; i < 14; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
        response = "Сгенерирован зашифрованный ключ: " + pass;
    }

    // 3. Лингвистический модуль (Перевод)
    else if (low.startsWith("переведи")) {
        const textToTranslate = val.replace(/переведи/i, "").trim();
        if (textToTranslate) {
            window.open(`https://translate.google.com/?sl=auto&tl=en&text=${encodeURIComponent(textToTranslate)}`, '_blank');
            response = "Открываю модуль перевода для текста: " + textToTranslate;
        }
    }

    // 4. Математический процессор
    else if (/[0-9]/.test(val) && /[+\-*/]/.test(val)) {
        try {
            // Очистка строки от лишних символов для безопасности eval
            const cleanMath = val.replace(/[^-()\d/*+.]/g, '');
            const res = new Function('return ' + cleanMath)();
            response = "Результат вычисления: " + res;
        } catch(e) { 
            response = "Обнаружена ошибка в математическом выражении."; 
        }
    }

    // 5. Поиск в ассоциативной памяти
    else {
        for (let key in aiMemory) {
            if (low.includes(key)) {
                response = aiMemory[key];
                break;
            }
        }
    }

    // 6. Системные утилиты (Время/Дата) и ответ по умолчанию
    if (!response) {
        if (low.includes("время")) {
            response = "Текущее системное время: " + new Date().toLocaleTimeString();
        } else if (low.includes("дата") || low.includes("число")) {
            response = "Сегодня: " + new Date().toLocaleDateString();
        } else {
            response = "Моих алгоритмов пока недостаточно для ответа на этот вопрос. Ты можешь обучить меня через команду 'Запомни, что...'.";
        }
    }

    await botType(response);
}

// --- СЛУШАТЕЛИ СОБЫТИЙ ---
btn.onclick = handleSend;
input.onkeypress = (e) => { if (e.key === 'Enter') handleSend(); };

// Стартовое приветствие
window.onload = () => {
    botType("Система FLOTJI-AI PRO активирована. Голос и интеллект в норме.");
};
