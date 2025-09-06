document.addEventListener("DOMContentLoaded", function() {
    const preloader = document.getElementById('preloader');
    const mainContent = document.querySelector('main');
    
    // Promises for minimum load time and page content load
    const minTimePromise = new Promise(resolve => setTimeout(resolve, 3000));
    const pageLoadPromise = new Promise(resolve => window.addEventListener('load', resolve));

    // Hide preloader after both conditions are met
    Promise.all([minTimePromise, pageLoadPromise]).then(() => {
        preloader.classList.add('hide');
        mainContent.style.visibility = 'visible';
        mainContent.style.opacity = '1';
    });

    // Set initial state of main content to hidden
    mainContent.style.visibility = 'hidden';
    mainContent.style.opacity = '0';
    mainContent.style.transition = 'opacity 1s ease-out';

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-up').forEach(element => {
        observer.observe(element);
    });

    // Typing animation for roles
    const roles = ["Software Developer and AI Engineer", "IoT & AI Developer Intern"];
    const typingTextElement = document.querySelector('.typing-text');
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const currentRole = roles[roleIndex];
        const displayText = isDeleting
            ? currentRole.substring(0, charIndex--)
            : currentRole.substring(0, charIndex++);

        typingTextElement.textContent = displayText;

        if (!isDeleting && charIndex > currentRole.length) {
            setTimeout(() => isDeleting = true, 1500);
        } else if (isDeleting && charIndex < 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            charIndex = 0;
        }

        const typingSpeed = isDeleting ? 50 : 100;
        setTimeout(typeEffect, typingSpeed);
    }

    typeEffect();

    // Gemini API call for project descriptions
    const expandButtons = document.querySelectorAll('.expand-btn');

    async function getProjectDetails(title, brief) {
        const prompt = `Generate a detailed, engaging, and professional single-paragraph description for a portfolio project titled "${title}". The current brief summary is: "${brief}". The output should be only the paragraph, without any extra text or titles.`;

        const payload = {
            contents: [{ parts: [{ text: prompt }] }],
            model: "gemini-2.5-flash-preview-05-20"
        };
        const apiKey = "AIzaSyCaBGFo97LN8XSymsiZzIPvI12fv_0ej_8"; 
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await response.json();
            if (result.candidates && result.candidates.length > 0 && result.candidates[0].content && result.candidates[0].content.parts && result.candidates[0].content.parts.length > 0) {
                return result.candidates[0].content.parts[0].text;
            }
            return "Could not generate a detailed description.";
        } catch (error) {
            console.error("API call failed:", error);
            return "Failed to generate description. Please try again later.";
        }
    }

    expandButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const card = event.target.closest('.project-card');
            const title = card.querySelector('h3').textContent;
            const brief = card.querySelector('p').getAttribute('data-brief');
            const generatedDescriptionDiv = card.querySelector('.generated-description');
            const loadingIndicator = card.querySelector('.loading-indicator');

            // Hide button and show loading indicator
            button.style.display = 'none';
            loadingIndicator.style.display = 'block';

            const newDescription = await getProjectDetails(title, brief);

            // Hide loading indicator and show description
            loadingIndicator.style.display = 'none';
            generatedDescriptionDiv.textContent = newDescription;
            generatedDescriptionDiv.style.display = 'block';
        });
    });

    // Chatbot Functionality
    const chatbotButton = document.getElementById('chatbot-button');
    const chatbotContainer = document.getElementById('chatbot-container');
    const closeBtn = document.querySelector('.close-btn');
    const chatbotMessages = document.querySelector('.chatbot-messages');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSendBtn = document.getElementById('chatbot-send-btn');
    
    let chatHistory = [{
        role: "model",
        parts: [{ text: "Hi there! Ask me anything about Aditya's skills, experience, and projects." }]
    }];

    function appendMessage(role, text) {
        const messageBubble = document.createElement('div');
        messageBubble.classList.add('message-bubble');
        messageBubble.classList.add(role === 'user' ? 'user-message' : 'bot-message');
        messageBubble.textContent = text;
        chatbotMessages.appendChild(messageBubble);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight; // Auto-scroll to the latest message
    }

    async function sendMessage() {
        const userText = chatbotInput.value.trim();
        if (userText === '') return;

        appendMessage('user', userText);
        chatHistory.push({ role: 'user', parts: [{ text: userText }] });
        chatbotInput.value = '';

        // Add a "typing" indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('chatbot-typing-indicator');
        typingIndicator.textContent = 'Typing...';
        chatbotMessages.appendChild(typingIndicator);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

        const payload = {
            contents: chatHistory,
            model: "gemini-2.5-flash-preview-05-20"
        };
        const apiKey = "AIzaSyCaBGFo97LN8XSymsiZzIPvI12fv_0ej_8"; 
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            const botResponse = result.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I am unable to respond at the moment.";

            // Remove the typing indicator before appending the actual message
            chatbotMessages.removeChild(typingIndicator);

            appendMessage('bot', botResponse);
            chatHistory.push({ role: 'model', parts: [{ text: botResponse }] });

        } catch (error) {
            console.error("Chatbot API call failed:", error);
            chatbotMessages.removeChild(typingIndicator);
            appendMessage('bot', "Oops! Something went wrong. Please try again.");
        }
    }

    chatbotButton.addEventListener('click', () => {
        chatbotContainer.classList.toggle('is-visible');
    });

    closeBtn.addEventListener('click', () => {
        chatbotContainer.classList.remove('is-visible');
    });

    chatbotSendBtn.addEventListener('click', sendMessage);
    chatbotInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });
});

