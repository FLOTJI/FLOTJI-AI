const chat = document.getElementById('chat-window');
const input = document.getElementById('user-input');
const btn = document.getElementById('send-btn');
const muteBtn = document.getElementById('mute-btn');
const micBtn = document.getElementById('mic-btn');

let isMuted = false;
let aiMemory = JSON.parse(localStorage.getItem('flotji_brain')) || {
    "привет": "Системы онлайн. Я готов к работе.",
    "кто ты": "Я твой персональный ИИ-ассистент FLOTJI.",
    "умеешь": "Я умею считать, создавать пароли, переводить текст и обучаться!",
    "можешь": "Я могу быть твоим голосовым помощником и выполнять команды.",
    "команды": "Скажи 'пароль', 'время' или обучи: 'Запомни, что...'"
};
// ПАМЯТЬ
// 4. Улучшенный поиск в памяти (ищет совпадения по частям слов)
    else {
        for (let key in aiMemory) {
            // Если ключ из памяти есть в твоем вопросе 
            // ИЛИ твой вопрос содержит часть ключа
            if (low.includes(key.slice(0, 5)) || key.includes(low.slice(0, 5))) {
                response = aiMemory[key];
                break;
            }
        }
    }

// ГОЛОСОВОЙ ВЫВОД (ОЗВУЧКА)
function speak(text) {
    if (isMuted) return;
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance();
    msg.text = text;
    msg.lang = 'ru-RU';
    window.speechSynthesis.speak(msg);
}

// РАСПОЗНАВАНИЕ РЕЧИ (СЛУХ)
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'ru-RU';

    micBtn.onclick = () => {
        recognition.start();
        micBtn.style.boxShadow = "0 0 15px red";
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        input.value = transcript;
        handleSend();
        micBtn.style.boxShadow = "none";
    };

    recognition.onerror = () => { micBtn.style.boxShadow = "none"; };
}

// ПЕЧАТЬ И ОБРАБОТКА
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

async function handleSend() {
    const val = input.value.trim();
    if (!val) return;
    addMsg(val, 'user');
    const low = val.toLowerCase();
    input.value = "";
    let response = "";

    if (low.includes("запомни, что")) {
        const clean = val.replace(/запомни, что/i, "").trim();
        const parts = clean.split(/[—-]/);
        if (parts.length === 2) {
            aiMemory[parts[0].trim().toLowerCase()] = parts[1].trim();
            localStorage.setItem('flotji_brain', JSON.stringify(aiMemory));
            response = "Запомнил!";
        }
    } else if (low.includes("пароль")) {
        response = "Ключ: " + Math.random().toString(36).slice(-8).toUpperCase();
    } else if (/[0-9]/.test(val) && /[+\-*/]/.test(val)) {
        try { response = "Результат: " + eval(val.replace(/[^-()\d/*+.]/g, '')); } 
        catch(e) { response = "Ошибка в примере."; }
    } else {
        for (let key in aiMemory) {
            if (low.includes(key)) { response = aiMemory[key]; break; }
        }
    }

    if (!response) {
        if (low.includes("время")) response = "Сейчас " + new Date().toLocaleTimeString();
        else response = "Я учусь. Попробуй обучить меня через 'Запомни, что...'";
    }
    await botType(response);
}

muteBtn.onclick = () => {
    isMuted = !isMuted;
    muteBtn.textContent = isMuted ? "🔇" : "🔊";
    if (isMuted) window.speechSynthesis.cancel();
};

btn.onclick = handleSend;
input.onkeypress = (e) => { if (e.key === 'Enter') handleSend(); };
window.onload = () => botType("Система FLOTJI активирована. Я тебя слушаю.");

