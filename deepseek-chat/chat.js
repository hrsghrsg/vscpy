// 聊天功能相关代码
async function sendMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();
    
    if (!message) return;

    if (!checkRequestLimit()) {
        appendMessage('抱歉，已达到每小时100次的请求限制，请稍后再试。', 'bot');
        return;
    }

    appendMessage(message, 'user');
    userInput.value = '';

    try {
        recordNewRequest();
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [{
                    role: "user",
                    content: message
                }]
            })
        });

        const data = await response.json();
        const botResponse = data.choices[0].message.content;
        appendMessage(botResponse, 'bot');
    } catch (error) {
        console.error('Error:', error);
        appendMessage('抱歉，发生了错误，请稍后重试。', 'bot');
    }
}

function appendMessage(message, sender) {
    const chatContainer = document.getElementById('chat-container');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    if (sender === 'bot') {
        contentDiv.innerHTML = marked.parse(message);
    } else {
        contentDiv.textContent = message;
    }
    
    messageDiv.appendChild(contentDiv);
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// 添加回车键发送功能
document.getElementById('user-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
}); 