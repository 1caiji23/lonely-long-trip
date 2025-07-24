document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    const dialogBox = document.getElementById('dialog-box');
    const animationContainer = document.getElementById('animation-container');

    function startGame() {
        // Initial animation or setup
        displayAnimation('Welcome!', 2000);
        dialogBox.classList.remove('hidden');
        dialogBox.style.opacity = '0';
        setTimeout(() => {
            dialogBox.style.transition = 'opacity 0.5s ease';
            dialogBox.style.opacity = '1';
        }, 100);
    }

    function endGame() {
        displayAnimation('Game Over', 3000);
        dialogBox.classList.add('hidden');
    }

    function triggerAchievement(achievement) {
        displayAnimation(`Achievement Unlocked: ${achievement}`, 3000);
    }

    function displayAnimation(message, duration) {
        // Clear previous content
        animationContainer.innerHTML = '';
        animationContainer.classList.remove('hidden');
        
        // Create a container for the text
        const textContainer = document.createElement('div');
        textContainer.className = 'streaming-text';
        animationContainer.appendChild(textContainer);
        
        // Display text character by character
        let index = 0;
        const interval = setInterval(() => {
            if (index < message.length) {
                const char = message.charAt(index);
                const span = document.createElement('span');
                span.textContent = char;
                span.style.opacity = '0';
                textContainer.appendChild(span);
                
                // Fade in the character
                setTimeout(() => {
                    span.style.transition = 'opacity 0.3s ease';
                    span.style.opacity = '1';
                }, 10);
                
                index++;
            } else {
                clearInterval(interval);
                
                // Set timeout to fade out the entire message
                setTimeout(() => {
                    animationContainer.style.transition = 'opacity 0.5s ease';
                    animationContainer.style.opacity = '0';
                    setTimeout(() => {
                        animationContainer.classList.add('hidden');
                        animationContainer.style.opacity = '1'; // Reset for next time
                    }, 500);
                }, duration);
            }
        }, 50); // Adjust this value to control the speed of text streaming
    }

    const userInput = document.getElementById('user-input');

    userInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const message = userInput.value;
            if (message.trim() !== '') {
                sendMessage(message);
                userInput.value = '';
            }
        }
    });

    async function sendMessage(message) {
        // Display user message in animation container
        displayAnimation(`You: ${message}`, 2000);

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
        // Display AI response in animation container
        displayAnimation(`AI: ${response}`, 5000);
        // Here you would integrate the actual text-to-speech and file processing
    }

    // Start the game
    startGame();
});
