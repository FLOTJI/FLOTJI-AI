const chat = document.getElementById('chat-window');
const input = document.getElementById('user-input');
const btn = document.getElementById('send-btn');
const muteBtn = document.getElementById('mute-btn');
const micBtn = document.getElementById('mic-btn');

let isMuted = false;
let isListening = false;

// РАСШИРЕННАЯ ПАМЯТЬ
let aiMemory = JSON.parse(localStorage.getItem('flotji_brain')) || {
    "привет": "Системы онлайн. Я готов к работе.",
    "кто ты": "Я твой персональный ИИ-ассистент FLOTJI.",
    "умеешь": "Я умею считать, создавать пароли, переводить текст и обучаться!",
    "команды": "Скажи 'пароль', 'время' или обучи: 'Запомни, что [вопрос] - [ответ]'",
    "создатель": "Меня создал гениальный разработчик с помощью нейросетей."
};

// ОЗВУЧКА
function speak(text) {
    if (isMuted) return;
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance();
    msg.text = text;
    msg.lang = 'ru-RU';
    window.speechSynthesis.speak(msg);
}

// СЛУХ (Speech Recognition)
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'ru-RU';
    recognition.continuous = false;

    micBtn.onclick = () => {
        if (!isListening) {
            recognition.start();
            isListening = true;
            micBtn.style.boxShadow = "0 0 15px #58a6ff";
            micBtn.textContent = "🔊";
        } else {
            recognition.stop();
            isListening = false;
            micBtn.style.boxShadow = "none";
            micBtn.textContent = "🎤";
        }
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        
        // Режим активации по имени
        if (transcript.includes("флотжи") || transcript.includes("флоджи")) {
            const query = transcript.replace(/флотжи|флоджи/gi, "").trim();
            if (query) {
                input.value = query;
                handleSend();
            } else {
                botType("Да, я слушаю!");
            }
        } else {
            // Если имя не названо, просто вставляем текст
            input.value = transcript;
        }
    };

    recognition.onend = () => {
        if (isListening) recognition.start(); // Перезапуск для эффекта "Станции"
    };
}

// ЛОГИКА ОТВЕТОВ
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
            response = "Принято, я это запомнил!";
        }
    } 
    // 2. Пароль
    else if (low.includes("пароль")) {
        response = "Безопасный ключ: " + Math.random().toString(36).slice(-10).toUpperCase();
    }
    // 3. Математика
    else if (/[0-9]/.test(val) && /[+\-*/]/.test(val)) {
        try { response = "Результат: " + eval(val.replace(/[^-()\d/*+.]/g, '')); } 
        catch(e) { response = "Ошибка в расчетах."; }
    }
    // 4. УМНЫЙ ПОИСК (по корням слов)
    else {
        for (let key in aiMemory) {
            if (low.includes(key.slice(0, 4))) { // Ищем совпадение первых 4-х букв
                response = aiMemory[key];
                break;
            }
        }
    }

    // 5. Финальный ответ
    if (!response) {
        if (low.includes("время")) response = "Сейчас " + new Date().toLocaleTimeString();
        else if (low.includes("дата")) response = "Сегодня " + new Date().toLocaleDateString();
        else response = "Я пока не знаю ответа. Научи меня: 'Запомни, что [вопрос] - [ответ]'.";
    }

    await botType(response);
}

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

muteBtn.onclick = () => {
    isMuted = !isMuted;
    muteBtn.textContent = isMuted ? "🔇" : "🔊";
    if (isMuted) window.speechSynthesis.cancel();
};

btn.onclick = handleSend;
input.onkeypress = (e) => { if (e.key === 'Enter') handleSend(); };
window.onload = () => botType("Система FLOTJI активна. Жду команду.");
