let model = null;
const chat = document.getElementById('chat-window');
const input = document.getElementById('user-input');
const status = document.getElementById('status');

// Запуск ИИ
async function init() {
    try {
        status.innerText = "СИСТЕМА ГРУЗИТСЯ...";
        model = await mobilenet.load();
        status.innerText = "FLOTJI: В СЕТИ";
        addMsg("Я готов к работе! Спроси меня о чем-нибудь или пришли фото.", "bot");
    } catch (e) {
        status.innerText = "ИИ В ОФФЛАЙНЕ";
        addMsg("Привет! Я пока работаю в режиме простого чата.", "bot");
    }
}
init();

function addMsg(text, type, isHTML = false) {
    const d = document.createElement('div');
    d.className = `msg ${type}`;
    if (isHTML) d.innerHTML = text; else d.textContent = text;
    chat.appendChild(d);
    chat.scrollTop = chat.scrollHeight;
}

function handleText() {
    const val = input.value.trim();
    if (!val) return;
    addMsg(val, "user");
    input.value = "";

    setTimeout(() => {
        let res = "Я тебя не совсем понял, но я учусь!";
        const low = val.toLowerCase();

        if (low.includes("привет")) res = "Привет! Я Флотжи, твой ИИ.";
        else if (low.includes("как дела")) res = "У меня всё отлично, летаю по проводам интернета!";
        else if (low.includes("покажи")) {
            const q = low.replace("покажи", "").trim() || "neon";
            res = "Вот что я нашел по запросу: " + q;
            addMsg(`<img src="https://loremflickr.com/400/300/${q}?random=${Math.random()}">`, "bot", true);
        }
        addMsg(res, "bot");
