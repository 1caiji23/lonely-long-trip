document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    const dialogBox = document.getElementById('dialog-box');
    const animationContainer = document.getElementById('animation-container');

    function startGame() {
        // Initial animation or setup
        displayAnimation('Welcome!', 2000);
        dialogBox.classList.remove('hidden');
    }

    function endGame() {
        displayAnimation('Game Over', 3000);
        dialogBox.classList.add('hidden');
    }

    function triggerAchievement(achievement) {
        displayAnimation(`Achievement Unlocked: ${achievement}`, 3000);
    }

    function displayAnimation(message, duration) {
        animationContainer.textContent = message;
        animationContainer.classList.remove('hidden');
        setTimeout(() => {
            animationContainer.classList.add('hidden');
        }, duration);
    }

    const sendButton = document.getElementById('send-button');
    const userInput = document.getElementById('user-input');
    const dialogText = document.getElementById('dialog-text');

    sendButton.addEventListener('click', () => {
        const message = userInput.value;
        if (message.trim() !== '') {
            sendMessage(message);
            userInput.value = '';
        }
    });

    async function sendMessage(message) {
        // Display user message
        dialogText.innerHTML += `<p><strong>You:</strong> ${message}</p>`;

        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });

            if (response.ok) {
                const data = await response.json();
                processAIResponse(data.response);
            } else {
                processAIResponse('Error: Could not get a response from the server.');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            processAIResponse('Error: Could not connect to the server.');
        }
    }

    function processAIResponse(response) {
        // Display AI response
        dialogText.innerHTML += `<p><strong>AI:</strong> ${response}</p>`;
        // Here you would integrate the actual text-to-speech and file processing
        // For example, using the Web Speech API for text-to-speech
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(response);
            window.speechSynthesis.speak(utterance);
        }
    }

    // Start the game
    startGame();
});
