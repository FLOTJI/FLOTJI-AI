// --- МОЗГ FLOTJI-AI PRO (POWERED BY LOGIC) ---
const chat = document.getElementById('chat-window');
const input = document.getElementById('user-input');
const btn = document.getElementById('send-btn');

let aiMemory = JSON.parse(localStorage.getItem('flotji_brain')) || {
    "привет": "Системы FLOTJI-AI онлайн. Чем я могу помочь вам как ваш персональный интеллект?",
    "что ты умеешь": "Я объединяю логику калькулятора, креативность генератора и память ассистента. \n\nЯ могу:\n1. Решать сложные уравнения\n2. Генерировать идеи и пароли\n3. Анализировать текст и переводить его\n4. Обучаться вашим фактам\n5. Управлять интерфейсом",
    "кто тебя создал": "Я был разработан как проект FLOTJI, вдохновленный архитектурой больших языковых моделей, таких как Gemini.",
    "коды": "Я понимаю базовый JavaScript. Можешь спросить меня о функциях или переменных."
};

function saveKnowledge() {
    localStorage.setItem('flotji_brain', JSON.stringify(aiMemory));
}

// Эффект "Нейронного раздумья"
async function botType(text) {
    const d = document.createElement('div');
    d.className = "msg bot";
    d.innerHTML = '<span class="ai-thinking">Анализ запроса...</span>';
    chat.appendChild(d);
    chat.scrollTop = chat.scrollHeight;

    await new Promise(r => setTimeout(r, 1000));
    
    // Плавное появление текста
    d.textContent = "";
    let i = 0;
    const interval = setInterval(() => {
        d.textContent += text[i];
        i++;
        if (i >= text.length) clearInterval(interval);
        chat.scrollTop = chat.scrollHeight;
    }, 15);
}

// Функция генерации идей (Креативный модуль)
function generateIdea() {
    const ideas = [
        "Создать мобильное приложение для учета выпитой воды.",
        "Написать бота, который пересказывает книги за 1 минуту.",
        "Разработать сайт-портфолио в стиле киберпанк.",
        "Сделать игру на JS, где нужно управлять гравитацией."
    ];
    return ideas[Math.floor(Math.random() * ideas.length)];
}

async function handleSend() {
    const val = input.value.trim();
    if (!val) return;

    const d = document.createElement('div');
    d.className = "msg user";
    d.textContent = val;
    chat.appendChild(d);
    
    const low = val.toLowerCase();
    input.value = "";
    chat.scrollTop = chat.scrollHeight;

    let response = "";

    // 1. ЛОГИКА ОБУЧЕНИЯ
    if (low.includes("запомни, что")) {
        const clean = val.replace(/запомни, что/i, "").trim();
        const parts = clean.split(/[—-]/);
        if (parts.length === 2) {
            aiMemory[parts[0].trim().toLowerCase()] = parts[1].trim();
            saveKnowledge();
            response = "Информация интегрирована в мою долговременную память.";
        }
    }

    // 2. КРЕАТИВНЫЙ МОДУЛЬ
    if (!response && (low.includes("идея") || low.includes("придумай"))) {
        response = "Вот идея для проекта: " + generateIdea();
    }

    // 3. МАТЕМАТИЧЕСКИЙ ПРОЦЕССОР
    if (!response && /[0-9]/.test(val) && /[+\-*/]/.test(val)) {
        try {
            const mathRes = eval(val.replace(/[^-()\d/*+.]/g, ''));
            response = `Вычисление завершено. Результат: ${mathRes}`;
        } catch(e) { response = "Ошибка в математическом синтаксисе."; }
    }

    // 4. ГЕНЕРАТОР БЕЗОПАСНОСТИ
    if (!response && low.includes("пароль")) {
        response = "Сгенерирован ключ доступа: " + Math.random().toString(36).slice(-10).toUpperCase() + Math.random().toString(36).slice(-5);
    }

    // 5. ПЕРЕВОД И ПОИСК
    if (!response && low.startsWith("переведи")) {
        const t = val.replace(/переведи/i, "").trim();
        window.open(`https://translate.google.com/?sl=auto&tl=en&text=${encodeURIComponent(t)}`);
        response = "Запрос перенаправлен в лингвистический модуль.";
    }

    // 6. СЕМАНТИЧЕСКИЙ ПОИСК В ПАМЯТИ
    if (!response) {
        for (let key in aiMemory) {
            if (low.includes(key)) {
                response = aiMemory[key];
                break;
            }
        }
    }

    // 7. СТАНДАРТНЫЙ ИНТЕЛЛЕКТ
    if (!response) {
        if (low.includes("время")) response = "Локальное время: " + new Date().toLocaleTimeString();
        else if (low.includes("дата")) response = "Сегодняшнее число: " + new Date().toLocaleDateString();
        else response = "Моих текущих данных недостаточно для точного ответа. Пожалуйста, обучите меня или уточните запрос.";
    }

    await botType(response);
}

btn.onclick = handleSend;
input.onkeypress = (e) => { if (e.key === 'Enter') handleSend(); };
