const chat = document.getElementById('chat-window');
const input = document.getElementById('user-input');
const btn = document.getElementById('send-btn');

// --- ИНТЕЛЛЕКТУАЛЬНАЯ ПАМЯТЬ ---
let aiMemory = JSON.parse(localStorage.getItem('flotji_brain')) || {
    "привет": "Системы FLOTJI-AI активны. Я готов к саморазвитию!",
    "кто ты": "Я самообучающийся интеллект. Каждое твоё слово делает меня умнее."
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
    d.textContent = "...";
    chat.appendChild(d);
    await new Promise(r => setTimeout(r, 700));
    d.textContent = text;
    chat.scrollTop = chat.scrollHeight;
}

// --- АЛГОРИТМ АВТОНОМНОГО ОБУЧЕНИЯ ---
function autoLearn(text) {
    const lowText = text.toLowerCase();
    
    // Ищем паттерны типа "я люблю ...", "меня зовут ...", "... это ..."
    const patterns = [
        { regex: /меня зовут (.+)/i, key: "как меня зовут", prefix: "Тебя зовут " },
        { regex: /я люблю (.+)/i, key: "что я люблю", prefix: "Ты любишь " },
        { regex: /(.+) это (.+)/i, custom: true }
    ];

    patterns.forEach(p => {
        const match = lowText.match(p.regex);
        if (match) {
            if (p.custom) {
                // Если фраза типа "Лев это царь зверей"
                aiMemory[match[1].trim()] = match[2].trim();
            } else {
                // Если фраза типа "Я люблю кофе"
                aiMemory[p.key] = p.prefix + match[1].trim();
            }
            saveKnowledge();
        }
    });
}

async function handleSend() {
    const val = input.value.trim();
    if (!val) return;

    addMsg(val, 'user');
    
    // Запускаем процесс обучения на лету
    autoLearn(val);
    
    const low = val.toLowerCase();
    input.value = "";

    let response = "";

    // 1. Сначала ищем точное совпадение в памяти
    for (let key in aiMemory) {
        if (low.includes(key)) {
            response = aiMemory[key];
            break;
        }
    }

    // 2. Стандартные функции
    if (!response) {
        if (low.includes("время")) response = "Сейчас " + new Date().toLocaleTimeString();
        else if (low.includes("дата")) response = "Сегодня " + new Date().toLocaleDateString();
        else response = "Я записал это в свою базу данных и проанализирую позже.";
    }

    await botType(response);
}

btn.onclick = handleSend;
input.onkeypress = (e) => { if (e.key === 'Enter') handleSend(); };

window.onload = () => {
    botType("Я активирован и готов учиться у тебя.");
};
