const chat = document.getElementById('chat-window');
const input = document.getElementById('user-input');
const btn = document.getElementById('send-btn');

let aiMemory = JSON.parse(localStorage.getItem('flotji_brain')) || {
    "привет": "Системы FLOTJI-AI активны. Чем могу помочь?",
    "кто ты": "Я твой персональный ИИ-ассистент, способный к самообучению.",
    "как дела": "Мои алгоритмы работают в штатном режиме. А у тебя?"
};

function saveKnowledge() {
    localStorage.setItem('flotji_brain', JSON.stringify(aiMemory));
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
    d.innerHTML = '<span class="typing">...</span>';
    chat.appendChild(d);
    chat.scrollTop = chat.scrollHeight;
    await new Promise(r => setTimeout(r, 600));
    d.textContent = text;
    chat.scrollTop = chat.scrollHeight;
}

function generatePass() {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let res = "";
    for (let i = 0; i < 14; i++) res += charset.charAt(Math.floor(Math.random() * charset.length));
    return res;
}

async function handleSend() {
    const val = input.value.trim();
    if (!val) return;

    addMsg(val, 'user');
    const low = val.toLowerCase();
    input.value = "";

    let response = "";

    // 1. ОБУЧЕНИЕ (Самый высокий приоритет)
    if (low.includes("запомни, что")) {
        const clean = val.replace(/запомни, что/i, "").trim();
        const parts = clean.includes("—") ? clean.split("—") : clean.split("-");
        if (parts.length === 2) {
            aiMemory[parts[0].trim().toLowerCase()] = parts[1].trim();
            saveKnowledge();
            response = `Понял! Теперь я знаю, что "${parts[0].trim()}" — это "${parts[1].trim()}".`;
        } else {
            response = "Используй формат: Запомни, что [вопрос] — [ответ]";
        }
    }

    // 2. ГЕНЕРАТОР ПАРОЛЕЙ
    if (!response && (low.includes("пароль") || low.includes("pass"))) {
        response = "Сгенерировал пароль: " + generatePass();
    }

    // 3. ПЕРЕВОДЧИК
    if (!response && low.startsWith("переведи")) {
        const text = val.replace(/переведи/i, "").trim();
        if (text) {
            window.open(`https://translate.google.com/?sl=auto&tl=en&text=${encodeURIComponent(text)}`, '_blank');
            response = "Открыл переводчик.";
        }
    }

    // 4. ПОИСК В ПАМЯТИ
    if (!response) {
        for (let key in aiMemory) {
            if (low.includes(key)) {
                response = aiMemory[key];
                break;
            }
        }
    }

    // 5. МАТЕМАТИКА (Только если это реально пример)
    if (!response && /^[0-9+\-*/().\s]+$/.test(val) && /[+\-*/]/.test(val)) {
        try {
            response = "Результат: " + new Function('return ' + val)();
        } catch (e) { response = "Ошибка в вычислении."; }
    }

    // 6. СТАНДАРТНЫЕ ФУНКЦИИ
    if (!response) {
        if (low.includes("время")) response = "Сейчас " + new Date().toLocaleTimeString();
        else if (low.includes("дата")) response = "Сегодня " + new Date().toLocaleDateString();
        else response = "Я пока не знаю, что ответить. Научи меня через 'Запомни, что...'";
    }

    await botType(response);
}

btn.onclick = handleSend;
input.onkeypress = (e) => { if (e.key === 'Enter') handleSend(); };

window.onload = () => {
    botType("Система FLOTJI-AI в строю. Я готов учиться!");
};
