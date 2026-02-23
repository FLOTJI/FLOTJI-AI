const chatWindow = document.getElementById('chat-window');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

function addMsg(text, type) {
    const d = document.createElement('div');
    d.style.margin = "5px";
    d.style.padding = "10px";
    d.style.borderRadius = "10px";
    d.style.background = type === 'user' ? '#724ae8' : '#e0e0e0';
    d.style.color = type === 'user' ? 'white' : 'black';
    d.style.alignSelf = type === 'user' ? 'flex-end' : 'flex-start';
    d.textContent = text;
    chatWindow.appendChild(d);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Кнопка теперь точно сработает
sendBtn.onclick = function() {
    const val = userInput.value.trim();
    if (!val) return;
    
    addMsg(val, 'user');
    userInput.value = "";

    setTimeout(() => {
        addMsg("Я получил твое сообщение! Работаю над ответом.", "bot");
    }, 500);
};

// Отправка по Enter
userInput.onkeypress = function(e) {
    if (e.key === 'Enter') sendBtn.click();
};

addMsg("Привет! Теперь я работаю без ошибок. Напиши мне!", "bot");
