(function () {
    console.log('JohnnyBot script loaded.');

    // ==========================
    // DOM ELEMENTS & VARIABLES
    // ==========================
    const chatWindow = document.getElementById('chatWindow');
    const input = document.getElementById('mainInputField');
    const submit = document.getElementById('submitButton');
    const submitIcon = document.querySelector('.submitIcon');
    const defaultPlaceholder = 'Message Johnny';

    let isProcessing = false; // Flag to track if the bot is responding
    let conversationHistory = []; // Temporary in-memory conversation history

    if (!chatWindow || !input || !submit) {
        console.error('Required DOM elements are missing.');
        return;
    }

    // ==========================
    // INITIAL GREETING FUNCTION
    // ==========================
    function greetUser() {
        console.log('Greeting the user...');
        const greeting = document.createElement('div');
        greeting.classList.add('chatOutput', 'bot');
        greeting.textContent = `Hi there! I'm Johnny Thunderbot – your guide to St. John's University. Ask me anything!`;
        chatWindow.appendChild(greeting);
    }

    // ==========================
    // VIEWPORT ZOOM MANAGEMENT
    // ==========================
    function manageViewportZoom() {
        const viewportMeta = document.querySelector('meta[name="viewport"]');
        const smallScreen = window.innerWidth < 500;

        if (smallScreen) {
            if (viewportMeta) {
                viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
            } else {
                const meta = document.createElement('meta');
                meta.name = 'viewport';
                meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
                document.head.appendChild(meta);
            }
        } else if (viewportMeta) {
            viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1');
        }
    }

    window.addEventListener('load', manageViewportZoom);
    window.addEventListener('resize', manageViewportZoom);

    // ==========================
    // PLACEHOLDER & ICON UPDATES
    // ==========================
    function toggleSubmitIconColor() {
        if (isProcessing) {
            submitIcon.classList.add('submitDisabled');
            submitIcon.classList.remove('submitEnabled');
        } else if (input.value.trim() !== '') {
            submitIcon.classList.add('submitEnabled');
            submitIcon.classList.remove('submitDisabled');
        } else {
            submitIcon.classList.remove('submitEnabled', 'submitDisabled');
        }
    }

    function updateInputPlaceholder() {
        input.placeholder = isProcessing ? 'Johnny is Responding...' : defaultPlaceholder;
    }

    input.addEventListener('input', toggleSubmitIconColor);

    // ==========================
    // UTILITY FUNCTIONS
    // ==========================
    function saveConversation(role, message) {
        conversationHistory.push({ role, message });
    
        // Keep only the last MAX_HISTORY messages
        if (conversationHistory.length > MAX_HISTORY) {
            conversationHistory.shift();
        }
    }

    function smoothScroll(elem) {
        elem.scrollTo({
            top: elem.scrollHeight,
            behavior: 'smooth',
        });
    }

    // Function to toggle links visibility
    function toggleLinksVisibility(button) {
        const linksContainer = button.nextElementSibling;

        if (linksContainer.style.display === 'none' || linksContainer.style.display === '') {
            linksContainer.style.display = 'block';
            button.textContent = 'Hide Links';
        } else {
            linksContainer.style.display = 'none';
            button.textContent = 'Show Links';
        }
    }

    // Format the response to include toggle-able links
    function formatResponse(answer) {
        const linkPattern = /(https?:\/\/[^\s]+)/g;
        const linkSectionPattern = /\*\*Links:\*\*([\s\S]*)/;

        // Check if links are present in the response
        const hasLinks = linkSectionPattern.test(answer);

        let formattedAnswer = answer
            .replace(linkPattern, '<a href="$1" target="_blank" rel="noopener noreferrer" style="color: rgb(206, 180, 121); text-decoration: none;">$1</a>')
            .replace('Links:\n', '<br><br>Links:<br><br>')
            .trimEnd();

        // Wrap the links in a hidden container and add a toggle button if links exist
        if (hasLinks) {
            formattedAnswer = formattedAnswer.replace(linkSectionPattern, (match, links) => {
                const formattedLinks = links
                    .trim()
                    .split('\n')
                    .map(link => `<div>${link.replace(/^[0-9]+\.\s*/, '')}</div><br>`) // Remove numbering
                    .join('');
                return `
                    <div>
                        <button class="toggleLinksButton" onclick="toggleLinksVisibility(this)">Show Links</button>
                        <div class="hiddenLinks" style="display: none;">
                            ${formattedLinks}
                        </div>
                    </div>
                `;
            });
        }

        return formattedAnswer;
    }

    // ==========================
    // MAIN RESPONSE FUNCTION
    // ==========================
    async function getResponse() {
        const userMessage = input.value.trim();
        if (!userMessage || isProcessing) return;

        // Update UI & Flags
        isProcessing = true;
        updateInputPlaceholder();
        toggleSubmitIconColor();

        // Append user message
        const userDiv = document.createElement('div');
        userDiv.classList.add('chatOutput', 'user');
        userDiv.textContent = userMessage;
        chatWindow.appendChild(userDiv);
        saveConversation('user', userMessage);

        input.value = '';

        // Typing indicator
        const botIndicator = document.createElement('div');
        botIndicator.classList.add('chatOutput', 'bot', 'typingIndicator');
        botIndicator.innerHTML = `
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
        `;
        chatWindow.appendChild(botIndicator);
        smoothScroll(chatWindow);

        try {
            const response = await fetch('https://3kmvlmiw79.execute-api.us-east-1.amazonaws.com/dev/query', { 
            //Above, plug in a link to API Gateway which is integrated with the connecting flask lambda backend function. The one above will not work with any other code.
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: userMessage, recent_context: conversationHistory.map(msg => `${msg.role}: ${msg.message}`).join('\n') }),
            });

            if (!response.ok) throw new Error('Failed to fetch response.');
            const data = await response.json();

            chatWindow.removeChild(botIndicator);

            const botDiv = document.createElement('div');
            botDiv.classList.add('chatOutput', 'bot');
            botDiv.innerHTML = formatResponse(data.answer);
            chatWindow.appendChild(botDiv);

            saveConversation('bot', data.answer);
            smoothScroll(chatWindow);
        } catch (error) {
            console.error(error);
            chatWindow.removeChild(botIndicator);

            const errorDiv = document.createElement('div');
            errorDiv.classList.add('chatOutput', 'bot');
            errorDiv.textContent = 'Sorry, Johnny could not process your request. Please try again later.';
            chatWindow.appendChild(errorDiv);
        } finally {
            isProcessing = false;
            updateInputPlaceholder();
            toggleSubmitIconColor();
        }
    }

    // ==========================
    // EVENT LISTENERS
    // ==========================
    submit.addEventListener('click', () => {
        if (!isProcessing) getResponse();
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !isProcessing) {
            e.preventDefault();
            getResponse();
        }
    });

    // ==========================
    // ON WINDOW LOAD
    // ==========================
    window.onload = greetUser;

    // Expose the toggle function globally
    window.toggleLinksVisibility = toggleLinksVisibility;
})();
