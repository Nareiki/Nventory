document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const answer = question.nextElementSibling;
        const isOpen = answer.classList.contains('show');

        // Close all answers
        document.querySelectorAll('.faq-answer').forEach(item => {
            item.classList.remove('show');
        });

        document.querySelectorAll('.faq-question').forEach(item => {
            item.classList.remove('active');
        });

        // Open clicked answer if it was closed
        if (!isOpen) {
            answer.classList.add('show');
            question.classList.add('active');
        }
    });
});