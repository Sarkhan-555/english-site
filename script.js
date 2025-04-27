// DOM Ready function
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all site functions
    initSite();
});

function initSite() {
    // Mobile menu toggle
    initMobileMenu();
    
    // Smooth scrolling
    initSmoothScroll();
    
    // Initialize animations
    initAnimations();

    // Initialize test buttons
    initTestButtons();

    // Initialize responsive behaviors
    handleResponsive();
}

// Mobile menu toggle function
// Mobile menu toggle function - COMPLETELY REPLACED
function initMobileMenu() {
    console.log("Mobile menu initialized"); // Debug log
    
    const mobileMenuToggle = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    
    if(mobileMenuToggle) {
        console.log("Mobile menu toggle found"); // Debug log
        
        mobileMenuToggle.addEventListener('click', function() {
            console.log("Menu toggle clicked"); // Debug log
            navMenu.classList.toggle('active');
        });
    }
    
    // All menu links including dropdown toggles and submenu links
    const allLinks = document.querySelectorAll('.nav-menu a');
    allLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Do not close menu if clicking dropdown toggle links
            if(this.classList.contains('nav-link') && this.nextElementSibling) {
                // This is a dropdown toggle, don't close menu
                e.stopPropagation();
                return;
            }
            
            console.log("Menu link clicked, closing menu"); // Debug log
            // Otherwise close the menu
            navMenu.classList.remove('active');
        });
    });
}
    
    
    // Close menu when clicking menu items
    const menuItems = document.querySelectorAll('.nav-menu a');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            if(navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                
                const icon = mobileMenuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });


// Smooth scroll to anchor links
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            // Don't do anything if link is empty or just "#"
            if(this.getAttribute('href') === '#' || this.getAttribute('href') === '') {
                return;
            }
            
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if(targetElement) {
                // Get header height for offset
                const headerHeight = document.querySelector('header').offsetHeight;
                
                window.scrollTo({
                    top: targetElement.offsetTop - headerHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize animations
function initAnimations() {
    // Add animation classes when elements come into view
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements that should be animated
    const animatedElements = document.querySelectorAll('.feature-card, .test-card, .testimonial-card');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Initialize test buttons
function initTestButtons() {
    const testButtons = document.querySelectorAll('.test-card .btn, .btn-primary');
    
    testButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if(this.getAttribute('href') === '#' || this.getAttribute('href') === '') {
                e.preventDefault();
                
                // Here we would normally launch the test
                // For now, just show modal or alert
                showModal('Test Feature', 'This test will be available soon! We\'re working on implementing it.');
            }
        });
    });
}

// Modal function for notifications
function showModal(title, message) {
    // Check if modal already exists
    let modal = document.querySelector('.custom-modal');
    
    if(!modal) {
        // Create modal elements
        modal = document.createElement('div');
        modal.className = 'custom-modal';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        
        const modalHeader = document.createElement('div');
        modalHeader.className = 'modal-header';
        
        const modalTitle = document.createElement('h3');
        modalTitle.textContent = title;
        
        const closeBtn = document.createElement('span');
        closeBtn.className = 'modal-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        const modalBody = document.createElement('div');
        modalBody.className = 'modal-body';
        modalBody.textContent = message;
        
        // Assemble modal elements
        modalHeader.appendChild(modalTitle);
        modalHeader.appendChild(closeBtn);
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalBody);
        modal.appendChild(modalContent);
        
        // Add modal to body
        document.body.appendChild(modal);
        
        // Add styles for modal
        const style = document.createElement('style');
        style.textContent = `
            .custom-modal {
                display: none;
                position: fixed;
                z-index: 9999;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.5);
                animation: fadeIn 0.3s ease;
            }
            .modal-content {
                background-color: white;
                margin: 15% auto;
                padding: 20px;
                border-radius: 12px;
                width: 80%;
                max-width: 500px;
                animation: slideIn 0.3s ease;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            }
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #e5e7eb;
                padding-bottom: 15px;
                margin-bottom: 15px;
            }
            .modal-close {
                font-size: 28px;
                font-weight: bold;
                cursor: pointer;
            }
            .modal-body {
                color: #6b7280;
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideIn {
                from { transform: translateY(-50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    } else {
        // Update existing modal
        modal.querySelector('.modal-header h3').textContent = title;
        modal.querySelector('.modal-body').textContent = message;
    }
    
    // Display modal
    modal.style.display = 'block';
    
    // Close when clicking outside
    window.addEventListener('click', function(e) {
        if(e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Handle responsive design elements
function handleResponsive() {
    // Add active class to current nav item based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-menu a');
    
    window.addEventListener('scroll', function() {
        let current = '';
        const headerHeight = document.querySelector('header').offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100;
            const sectionHeight = section.offsetHeight;
            
            if(window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if(item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });
    
    // Handle sticky header
    const header = document.querySelector('header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if(scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Function to initialize test interface
function createTestInterface(testType) {
    console.log(`Creating test interface for: ${testType}`);
    
    // Mock test data
    const testData = {
        'level': {
            title: 'English Level Assessment',
            description: 'Find out your current English level on the CEFR scale',
            questions: getLevelTestQuestions()
        },
        'grammar': {
            title: 'Grammar Master Test',
            description: 'Test your knowledge of English grammar structures',
            questions: getGrammarTestQuestions()
        },
        'vocabulary': {
            title: 'Vocabulary Builder',
            description: 'Check and improve your English vocabulary',
            questions: getVocabularyTestQuestions()
        },
        'ielts': {
            title: 'IELTS Preparation',
            description: 'Practice for your IELTS exam',
            questions: getIELTSTestQuestions()
        }
    };
    
    // Create test container
    const testContainer = document.createElement('div');
    testContainer.className = 'test-container';
    
    // Create test header
    const testHeader = document.createElement('div');
    testHeader.className = 'test-header';
    
    const testTitle = document.createElement('h2');
    testTitle.textContent = testData[testType].title;
    
    const testDescription = document.createElement('p');
    testDescription.textContent = testData[testType].description;
    
    testHeader.appendChild(testTitle);
    testHeader.appendChild(testDescription);
    
    // Create progress bar
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container';
    
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.style.width = '0%';
    
    progressContainer.appendChild(progressBar);
    
    // Create question container
    const questionContainer = document.createElement('div');
    questionContainer.className = 'question-container';
    
    // Create navigation buttons
    const navButtons = document.createElement('div');
    navButtons.className = 'nav-buttons';
    
    const prevButton = document.createElement('button');
    prevButton.className = 'btn btn-secondary';
    prevButton.textContent = 'Previous';
    prevButton.disabled = true;
    
    const nextButton = document.createElement('button');
    nextButton.className = 'btn btn-primary';
    nextButton.textContent = 'Next';
    
    navButtons.appendChild(prevButton);
    navButtons.appendChild(nextButton);
    
    // Assemble test interface
    testContainer.appendChild(testHeader);
    testContainer.appendChild(progressContainer);
    testContainer.appendChild(questionContainer);
    testContainer.appendChild(navButtons);
    
    // Replace main content with test interface
    const mainContent = document.querySelector('.main-content') || document.querySelector('main');
    if(mainContent) {
        mainContent.innerHTML = '';
        mainContent.appendChild(testContainer);
    } else {
        document.body.appendChild(testContainer);
    }
    
    // Add test specific styles
    const testStyle = document.createElement('style');
    testStyle.textContent = `
        .test-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .test-header {
            text-align: center;
            margin-bottom: 30px;
        }
        .progress-container {
            height: 10px;
            background-color: #e5e7eb;
            border-radius: 5px;
            margin-bottom: 30px;
        }
        .progress-bar {
            height: 100%;
            background-color: #4f46e5;
            border-radius: 5px;
            transition: width 0.3s ease;
        }
        .question-container {
            background-color: white;
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .nav-buttons {
            display: flex;
            justify-content: space-between;
        }
        .question {
            display: none;
        }
        .question.active {
            display: block;
        }
        .options {
            margin-top: 20px;
        }
        .option {
            display: block;
            padding: 15px;
            margin-bottom: 10px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .option:hover {
            background-color: #f9fafb;
        }
        .option.selected {
            background-color: #e0e7ff;
            border-color: #4f46e5;
        }
        .result-container {
            text-align: center;
            padding: 30px;
        }
        .result-score {
            font-size: 2.5rem;
            font-weight: bold;
            color: #4f46e5;
            margin-bottom: 20px;
        }
    `;
    document.head.appendChild(testStyle);
    
    // Initialize the first question
    let currentQuestionIndex = 0;
    const questions = testData[testType].questions;
    let userAnswers = new Array(questions.length).fill(null);
    
    function renderQuestion(index) {
        // Clear previous question
        questionContainer.innerHTML = '';
        
        // Create question element
        const questionElement = document.createElement('div');
        questionElement.className = 'question active';
        
        const questionText = document.createElement('h3');
        questionText.textContent = `${index + 1}. ${questions[index].question}`;
        
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'options';
        
        // Create options
        questions[index].options.forEach((option, optionIndex) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            if(userAnswers[index] === optionIndex) {
                optionElement.classList.add('selected');
            }
            optionElement.textContent = option;
            
            optionElement.addEventListener('click', function() {
                // Remove selected class from all options
                document.querySelectorAll('.option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                
                // Add selected class to clicked option
                this.classList.add('selected');
                
                // Save answer
                userAnswers[index] = optionIndex;
            });
            
            optionsContainer.appendChild(optionElement);
        });
        
        // Assemble question
        questionElement.appendChild(questionText);
        questionElement.appendChild(optionsContainer);
        questionContainer.appendChild(questionElement);
        
        // Update progress bar
        progressBar.style.width = `${((index + 1) / questions.length) * 100}%`;
        
        // Update buttons
        prevButton.disabled = index === 0;
        if(index === questions.length - 1) {
            nextButton.textContent = 'Finish';
        } else {
            nextButton.textContent = 'Next';
        }
    }
    
    function showResults() {
        // Calculate score
        let score = 0;
        userAnswers.forEach((answer, index) => {
            if(answer === questions[index].correctAnswer) {
                score++;
            }
        });
        
        // Clear question container
        questionContainer.innerHTML = '';
        
        // Create result elements
        const resultContainer = document.createElement('div');
        resultContainer.className = 'result-container';
        
        const resultTitle = document.createElement('h2');
        resultTitle.textContent = 'Test Complete!';
        
        const resultScore = document.createElement('div');
        resultScore.className = 'result-score';
        resultScore.textContent = `${score}/${questions.length}`;
        
        const resultMessage = document.createElement('p');
        const percentage = Math.round((score / questions.length) * 100);
        
        // Determine level based on percentage
        let level = '';
        if(percentage >= 90) {
            level = testType === 'level' ? 'C2 - Proficient' : 'Advanced';
        } else if(percentage >= 75) {
            level = testType === 'level' ? 'C1 - Advanced' : 'Upper Intermediate';
        } else if(percentage >= 60) {
            level = testType === 'level' ? 'B2 - Upper Intermediate' : 'Intermediate';
        } else if(percentage >= 40) {
            level = testType === 'level' ? 'B1 - Intermediate' : 'Pre-Intermediate';
        } else if(percentage >= 20) {
            level = testType === 'level' ? 'A2 - Elementary' : 'Elementary';
        } else {
            level = testType === 'level' ? 'A1 - Beginner' : 'Beginner';
        }
        
        resultMessage.textContent = `Your level: ${level}`;
        
        const feedbackMessage = document.createElement('p');
        feedbackMessage.textContent = `You answered ${score} out of ${questions.length} questions correctly.`;
        
        // Create retry button
        const retryButton = document.createElement('button');
        retryButton.className = 'btn btn-primary';
        retryButton.textContent = 'Try Again';
        retryButton.addEventListener('click', function() {
            userAnswers = new Array(questions.length).fill(null);
            currentQuestionIndex = 0;
            renderQuestion(currentQuestionIndex);
            progressBar.style.width = `${((currentQuestionIndex + 1) / questions.length) * 100}%`;
            navButtons.style.display = 'flex';
        });
        
        // Create explore more button
        const exploreButton = document.createElement('button');
        exploreButton.className = 'btn btn-secondary';
        exploreButton.style.marginLeft = '10px';
        exploreButton.textContent = 'Explore More Tests';
        exploreButton.addEventListener('click', function() {
            window.location.href = '#tests';
        });
        
        // Assemble results
        resultContainer.appendChild(resultTitle);
        resultContainer.appendChild(resultScore);
        resultContainer.appendChild(resultMessage);
        resultContainer.appendChild(feedbackMessage);
        resultContainer.appendChild(retryButton);
        resultContainer.appendChild(exploreButton);
        
        questionContainer.appendChild(resultContainer);
        
        // Hide navigation buttons
        navButtons.style.display = 'none';
    }
    
    // Add event listeners to buttons
    prevButton.addEventListener('click', function() {
        if(currentQuestionIndex > 0) {
            currentQuestionIndex--;
            renderQuestion(currentQuestionIndex);
        }
    });
    
    nextButton.addEventListener('click', function() {
        if(currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            renderQuestion(currentQuestionIndex);
        } else {
            showResults();
        }
    });
    
    // Render first question
    renderQuestion(currentQuestionIndex);
}

