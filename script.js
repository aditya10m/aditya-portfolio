// script.js
document.addEventListener('DOMContentLoaded', () => {
  // Dark mode toggle
  const toggle = document.createElement('button');
  toggle.textContent = '🌙 Toggle Dark Mode';
  toggle.style.position = 'fixed';
  toggle.style.top = '20px';
  toggle.style.right = '20px';
  toggle.style.padding = '8px 12px';
  toggle.style.backgroundColor = '#2c3e50';
  toggle.style.color = 'white';
  toggle.style.border = 'none';
  toggle.style.borderRadius = '5px';
  toggle.style.cursor = 'pointer';
  toggle.style.zIndex = '1000';
  document.body.appendChild(toggle);

  toggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
  });

  document.querySelectorAll('.project img').forEach((img, index) => {
    img.src = projectIcons[index % projectIcons.length];
  });

  // Typing effect
  document.addEventListener('DOMContentLoaded', () => {
  const typingTarget = document.getElementById('typing-intro');
  const phrases = [
    "Software Developer",
    "AI/ML Enthusiast",
    "Data Scientist",
    "Full-Stack Engineer",
    "Tech Explorer"
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    if (!typingTarget) return;
    const currentPhrase = phrases[phraseIndex];
    typingTarget.textContent = isDeleting
      ? currentPhrase.substring(0, charIndex--)
      : currentPhrase.substring(0, charIndex++);

    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      setTimeout(type, 1000);
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(type, 500);
    } else {
      setTimeout(type, isDeleting ? 50 : 100);
    }
  }

  type();
});
  
