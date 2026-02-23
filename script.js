// --- ИНИЦИАЛИЗАЦИЯ ЭЛЕМЕНТОВ ---
const chat = document.getElementById('chat-window');
const input = document.getElementById('user-input');
const btn = document.getElementById('send-btn');
const muteBtn = document.getElementById('mute-btn');
const micBtn = document.getElementById('mic-btn');

let isMuted = false;
let isListening = false;

// --- БАЗА ЗНАНИЙ (ИНТЕЛЛЕКТ GEMINI + FLOTJI) ---
let aiMemory = JSON.parse(localStorage.getItem('flotji_brain')) || {
    "привет": "Системы ИИ инициализированы. Я — Флотжи, твой цифровой интеллект. Чем могу помочь?",
    "кто ты": "Я — продвинутый ассистент с нейронным ядром. Моя цель — автоматизировать твои задачи.",
    "умеешь": "Я умею: писать код, считать математику, генерировать пароли и обучаться новому. Просто скажи 'Флотжи'!",
    "программирование": "Я мастер JavaScript. Могу подсказать логику функций или структуру HTML-страниц.",
    "пароль": "Для защиты данных используй команду 'пароль' — я создам надежный ключ.",
    "математика": "Вводи любой пример, и мой вычислительный модуль выдаст результат мгновенно.",
    "космос": "Интересный факт: в космосе полная тишина, так как там нет атмосферы для проведения звука.",
    "анекдот": "Программист в лифте. Нажимает кнопку 4. Потом судорожно ищет кнопку Enter.",
    "время": "Я синхронизирован с мировым временем. Спроси 'время', и я скажу точный час.",
    "команды": "Попробуй: 'пароль', 'время', '2+2' или научи меня: 'Запомни, что [вопрос] — [ответ]'",
    "создатель": "Меня создал гениальный разработчик, объединив веб-технологии и искусственный интеллект."
};

// --- МОДУЛЬ ГОЛОСА (SPEAK) ---
function speak(text) {
    if (isMuted) return;
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance();
    msg.text = text;
    msg.lang = 'ru-RU';
    msg.pitch = 1.0;
    msg.rate = 1.0;
    window.speechSynthesis.speak(msg);
}

// --- МОДУЛЬ СЛУХА (SPEECH RECOGNITION) ---
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'ru-RU';
    recognition.continuous = false; // Перезапуск вручную для стабильности "Станции"

    micBtn.onclick = () => {
        if (!isListening) {
            recognition.start();
            isListening = true;
            micBtn.style.boxShadow = "0 0 20px #58a6ff";
            micBtn.style.background = "#58a6ff";
            micBtn.textContent = "🔊";
        } else {
            recognition.stop();
            isListening = false;
            micBtn.style.boxShadow = "none";
            micBtn.style.background = "#21262d";
            micBtn.textContent = "🎤";
        }
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        
        // Логика "Умной колонки": ищем имя Флотжи
        if (transcript.includes("флотжи") || transcript.includes("флоджи")) {
            const query = transcript.replace(/флотжи|флоджи/gi, "").trim();
            if (query) {
                input.value = query;
                handleSend();
            } else {
                botType("Да, я слушаю тебя!");
            }
        } else {
            input.value = transcript; // Если просто нажал и сказал без имени
        }
    };

    recognition.onend = () => {
        if (isListening) recognition.start(); // Авто-перезапуск (Режим Алисы)
    };
}

// --- ВИЗУАЛЬНАЯ ПЕЧАТЬ ТЕКСТА ---
async function botType(text) {
    const d = document.createElement('div');
    d.className = "msg bot";
    chat.appendChild(d);
    speak(text);

    let i = 0;
    const interval = setInterval(() => {
        d.textContent += text[i];
        i++;
        if (i >= text.length) {
            clearInterval(interval);
            chat.scrollTop = chat.scrollHeight;
        }
    }, 20);
}

// --- ОБРАБОТКА СООБЩЕНИЙ ---
async function handleSend() {
    const val = input.value.trim();
    if (!val) return;

    addMsg(val, 'user');
    const low = val.toLowerCase();
    input.value = "";
    let response = "";

    // 1. Модуль обучения
    if (low.includes("запомни, что")) {
        const clean = val.replace(/запомни, что/i, "").trim();
        const parts = clean.split(/[—-]/);
        if (parts.length === 2) {
            aiMemory[parts[0].trim().toLowerCase()] = parts[1].trim();
            localStorage.setItem('flotji_brain', JSON.stringify(aiMemory));
            response = "Мои базы обновлены. Я это запомнил!";
        } else {
            response = "Используй формат: Запомни, что [вопрос] — [ответ].";
        }
    } 
    // 2. Модуль паролей
    else if (low.includes("пароль")) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
        let pass = "";
        for(let i=0; i<10; i++) pass += chars[Math.floor(Math.random()*chars.length)];
        response = "Сгенерирован ключ доступа: " + pass;
    }
    // 3. Математика
    else if (/[0-9]/.test(val) && /[+\-*/]/.test(val)) {
        try {
            const mathRes = eval(val.replace(/[^-()\d/*+.]/g, ''));
            response = "Результат вычисления: " + mathRes;
        } catch(e) { response = "Ошибка в математическом модуле."; }
    }
    // 4. Умный поиск по памяти (по корням)
    else {
        for (let key in aiMemory) {
            if (low.includes(key.slice(0, 4))) { 
                response = aiMemory[key];
                break;
            }
        }
    }

    // 5. Системные ответы
    if (!response) {
        if (low.includes("время")) response = "Текущее время: " + new Date().toLocaleTimeString();
        else if (low.includes("дата")) response = "Сегодня " + new Date().toLocaleDateString();
        else response = "Информации по этому запросу нет. Но ты можешь обучить меня через 'Запомни, что...'";
    }

    await botType(response);
}

function addMsg(text, type) {
    const d = document.createElement('div');
    d.className = `msg ${type}`;
    d.textContent = text;
    chat.appendChild(d);
    chat.scrollTop = chat.scrollHeight;
}

// --- УПРАВЛЕНИЕ ЗВУКОМ ---
muteBtn.onclick = () => {
    isMuted = !isMuted;
    muteBtn.textContent = isMuted ? "🔇" : "🔊";
    if (isMuted) window.speechSynthesis.cancel();
};

btn.onclick = handleSend;
input.onkeypress = (e) => { if (e.key === 'Enter') handleSend(); };

// СТАРТ СИСТЕМЫ
window.onload = () => {
    botType("Система FLOTJI активирована. Я готов слушать.");
};
