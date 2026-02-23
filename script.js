// 1. ПАМЯТЬ И БАЗОВЫЕ ЗНАНИЯ
const chat = document.getElementById('chat-window');
const input = document.getElementById('user-input');
const btn = document.getElementById('send-btn');

let aiMemory = JSON.parse(localStorage.getItem('flotji_brain')) || {
    "привет": "Привет! Я FLOTJI-AI. Рад тебя видеть!",
    "кто ты": "Я твой персональный ИИ-ассистент. Я могу учиться, считать и помогать в делах.",
    "как дела": "У меня всё отлично, мои системы работают на 100%. Как твоё настроение?",
    "что ты умеешь": "Я многозадачный: \n• Считаю математику (2+2)\n• Создаю сложные пароли\n• Перевожу фразы\n• Запоминаю факты\n• Подсказываю время и дату",
    "команды": "Попробуй:\n1. Написать пример (например, 540/4)\n2. Написать 'пароль'\n3. Написать 'переведи [текст]'\n4. Обучить меня: 'Запомни, что [вопрос] — [ответ]'"
};

function saveKnowledge() {
    localStorage.setItem('flotji_brain', JSON.stringify(aiMemory));
}

// 2. ИНТЕРФЕЙС
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

// 3. ЛОГИКА ОБРАБОТКИ
async function handleSend() {
    const val = input.value.trim();
    if (!val) return;

    addMsg(val, 'user');
    const low = val.toLowerCase();
    input.value = "";

    let response = "";

    // А) ПРОВЕРКА НА ОБУЧЕНИЕ (Запомни, что...)
    if (low.includes("запомни, что")) {
        const clean = val.replace(/запомни, что/i, "").trim();
        const parts = clean.includes("—") ? clean.split("—") : clean.split("-");
        if (parts.length === 2) {
            aiMemory[parts[0].trim().toLowerCase()] = parts[1].trim();
            saveKnowledge();
            response = `Принято! Теперь я знаю, что "${parts[0].trim()}" — это "${parts[1].trim()}".`;
        }
    }

    // Б) ПРОВЕРКА НА ПАРОЛЬ
    if (!response && (low.includes("пароль") || low.includes("pass"))) {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        let pass = "";
        for (let i = 0; i < 14; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
        response = "Твой секретный пароль: " + pass;
    }

    // В) ПРОВЕРКА НА ПЕРЕВОД
    if (!response && low.startsWith("переведи")) {
        const text = val.replace(/переведи/i, "").trim();
        if (text) {
            window.open(`https://translate.google.com/?sl=auto&tl=en&text=${encodeURIComponent(text)}`, '_blank');
            response = "Открываю переводчик для тебя!";
        }
    }

    // Г) ПРОВЕРКА НА МАТЕМАТИКУ (Только если есть знаки вычисления)
    if (!response && /[0-9]/.test(val) && /[+\-*/]/.test(val)) {
        try {
            const cleanMath = val.replace(/[^-()\d/*+.]/g, '');
            const res = new Function('return ' + cleanMath)();
            if (res !== undefined) response = "Результат: " + res;
        } catch (e) { /* не математика */ }
    }

    // Д) ПОИСК В БАЗЕ ЗНАНИЙ (Привет, умения и т.д.)
    if (!response) {
        for (let key in aiMemory) {
            if (low.includes(key)) {
                response = aiMemory[key];
                break;
            }
        }
    }

    // Е) ВРЕМЯ / ДАТА
    if (!response) {
        if (low.includes("время")) response = "Сейчас " + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        else if (low.includes("дата") || low.includes("число")) response = "Сегодня " + new Date().toLocaleDateString();
    }

    // Ё) ФИНАЛЬНЫЙ ВАРИАНТ (Если ничего не сработало)
    if (!response) {
        response = "Я записал твой запрос. Пока не знаю, что ответить, но ты можешь обучить меня через 'Запомни, что [вопрос] — [ответ]'.";
    }

    await botType(response);
}

// 4. ЗАПУСК
btn.onclick = handleSend;
input.onkeypress = (e) => { if (e.key === 'Enter') handleSend(); };

window.onload = () => {
    botType("Система FLOTJI-AI онлайн. Спроси меня: 'что ты умеешь'");
};
