const chat = document.getElementById('chat-window');
const input = document.getElementById('user-input');
const btn = document.getElementById('send-btn');
const muteBtn = document.getElementById('mute-btn');

let isMuted = false;

// ПАМЯТЬ
let aiMemory = JSON.parse(localStorage.getItem('flotji_brain')) || {
    "привет": "Системы онлайн. Я готов к работе.",
    "кто ты": "Я твой персональный ИИ-ассистент FLOTJI.",
    "что ты умеешь": "Я умею считать, создавать пароли, переводить текст и обучаться новым фразам.",
    "команды": "Напиши: 'пароль', 'время', '2+2' или 'Запомни, что [вопрос] - [ответ]'"
};

// ЛОГИКА ЗВУКА
muteBtn.onclick = () => {
    isMuted = !isMuted;
    muteBtn.textContent = isMuted ? "🔇" : "🔊";
    if (isMuted) window.speechSynthesis.cancel();
};

function speak(text) {
    if (isMuted) return;
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance();
    msg.text = text;
    msg.lang = 'ru-RU';
    msg.rate = 1;
    window.speechSynthesis.speak(msg);
}

// ПЕЧАТЬ ТЕКСТА
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

function addMsg(text, type) {
    const d = document.createElement('div');
    d.className = `msg ${type}`;
    d.textContent = text;
    chat.appendChild(d);
    chat.scrollTop = chat.scrollHeight;
}

// ОБРАБОТКА КОМАНД
async function handleSend() {
    const val = input.value.trim();
    if (!val) return;

    addMsg(val, 'user');
    const low = val.toLowerCase();
    input.value = "";

    let response = "";

    // 1. Обучение
    if (low.includes("запомни, что")) {
        const clean = val.replace(/запомни, что/i, "").trim();
        const parts = clean.split(/[—-]/);
        if (parts.length === 2) {
            aiMemory[parts[0].trim().toLowerCase()] = parts[1].trim();
            localStorage.setItem('flotji_brain', JSON.stringify(aiMemory));
            response = "Понял, я это запомнил!";
        }
    }

    // 2. Пароль
    else if (low.includes("пароль")) {
        response = "Твой пароль: " + Math.random().toString(36).slice(-10).toUpperCase();
    }

    // 3. Математика
    else if (/[0-9]/.test(val) && /[+\-*/]/.test(val)) {
        try {
            response = "Результат: " + eval(val.replace(/[^-()\d/*+.]/g, ''));
        } catch(e) { response = "Не могу посчитать этот пример."; }
    }

    // 4. Поиск в памяти (гибкий)
    else {
        for (let key in aiMemory) {
            if (low.includes(key)) {
                response = aiMemory[key];
                break;
            }
        }
    }

    // 5. Системные или заглушка
    if (!response) {
        if (low.includes("время")) response = "Сейчас " + new Date().toLocaleTimeString();
        else if (low.includes("дата")) response = "Сегодня " + new Date().toLocaleDateString();
        else response = "Я пока не знаю, что ответить. Научи меня через 'Запомни, что...'";
    }

    await botType(response);
}

btn.onclick = handleSend;
input.onkeypress = (e) => { if (e.key === 'Enter') handleSend(); };

window.onload = () => botType("Система активна. Звук включен.");
