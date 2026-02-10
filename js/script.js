const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.getElementById('nav-links');

mobileMenu.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});


const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  item.addEventListener('click', () => {
    const openItem = document.querySelector('.faq-item.active');
    
    if(openItem && openItem !== item) {
      openItem.classList.remove('active');
      openItem.querySelector('.faq-answer').style.display = 'none';
    }

    const answer = item.querySelector('.faq-answer');
    if(item.classList.contains('active')) {
      answer.style.display = 'none';
      item.classList.remove('active');
    } else {
      answer.style.display = 'block';
      item.classList.add('active');
    }
  });
});
