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
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if(mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Toggle icon
            const icon = this.querySelector('i');
            if(icon && icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else if(icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
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
                if(icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });
}

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

// Mock test questions functions
function getLevelTestQuestions() {
    return [
        {
            question: "What ___ you doing tomorrow?",
            options: ["are", "is", "am", "be"],
            correctAnswer: 0
        },
        {
            question: "She ___ lived in Paris for five years.",
            options: ["is", "has", "have", "was"],
            correctAnswer: 1
        },
        {
            question: "If I ___ rich, I would travel the world.",
            options: ["am", "was", "were", "be"],
            correctAnswer: 2
        },
        {
            question: "This is the best movie I ___ ever seen.",
            options: ["had", "have", "has", "was"],
            correctAnswer: 1
        },
        {
            question: "By the time we arrived, the meeting ___ started.",
            options: ["has", "had", "have", "was"],
            correctAnswer: 1
        },
        {
            question: "Choose the correct sentence:",
            options: [
                "I've been living here since three years.",
                "I've been living here for three years.",
                "I live here since three years.",
                "I live here for three years."
            ],
            correctAnswer: 1
        },
        {
            question: "She suggested ___ for a walk.",
            options: ["to go", "going", "go", "went"],
            correctAnswer: 1
        },
        {
            question: "The report ___ by next Friday.",
            options: ["will finish", "will be finished", "finishes", "is finishing"],
            correctAnswer: 1
        },
        {
            question: "I wish I ___ more free time.",
            options: ["have", "had", "having", "would have"],
            correctAnswer: 1
        },
        {
            question: "They ___ to have dinner with us next Saturday.",
            options: ["agree", "agreed", "have agreed", "are agreeing"],
            correctAnswer: 2
        }
    ];
}

function getGrammarTestQuestions() {
    return [
        {
            question: "Which sentence is grammatically correct?",
            options: [
                "Neither John nor his brothers is going.",
                "Neither John nor his brothers are going.",
                "Neither John nor his brothers goes.",
                "Neither John nor his brothers go."
            ],
            correctAnswer: 1
        },
        {
            question: "Choose the correct conditional sentence:",
            options: [
                "If I would have known, I would have told you.",
                "If I had known, I would told you.",
                "If I had known, I would have told you.",
                "If I have known, I would have told you."
            ],
            correctAnswer: 2
        },
        {
            question: "Identify the correct passive voice:",
            options: [
                "The cake was being eaten by the children.",
                "The cake is being ate by the children.",
                "The cake being eaten by the children.",
                "The cake was ate by the children."
            ],
            correctAnswer: 0
        },
        {
            question: "Choose the correct reported speech:",
            options: [
                "She said she will come tomorrow.",
                "She said she would come the next day.",
                "She said she would come tomorrow.",
                "She said she will come the next day."
            ],
            correctAnswer: 1
        },
        {
            question: "Which is the correct usage of articles?",
            options: [
                "I saw an university near the hospital.",
                "I saw a university near a hospital.",
                "I saw an university near a hospital.",
                "I saw a university near an hospital."
            ],
            correctAnswer: 1
        },
        {
            question: "Select the sentence with the correct subject-verb agreement:",
            options: [
                "The number of students are increasing every year.",
                "The number of students is increasing every year.",
                "The number of students were increasing every year.",
                "The number of students increasing every year."
            ],
            correctAnswer: 1
        },
        {
            question: "Which sentence uses the gerund correctly?",
            options: [
                "I look forward to meet you.",
                "I look forward to meeting you.",
                "I look forward to met you.",
                "I look forward meeting you."
            ],
            correctAnswer: 1
        },
        {
            question: "Choose the correct comparative form:",
            options: [
                "This is the most unique painting I've ever seen.",
                "This is the uniquest painting I've ever seen.",
                "This is the more unique painting I've ever seen.",
                "This is a unique painting I've ever seen."
            ],
            correctAnswer: 0
        },
        {
            question: "Which sentence contains a split infinitive?",
            options: [
                "She wants quickly to finish her homework.",
                "She wants to finish her homework quickly.",
                "She wants to quickly finish her homework.",
                "Quickly she wants to finish her homework."
            ],
            correctAnswer: 2
        },
        {
            question: "Identify the sentence with the correct relative clause:",
            options: [
                "The man which lives next door is a doctor.",
                "The man who lives next door is a doctor.",
                "The man whose lives next door is a doctor.",
                "The man whom lives next door is a doctor."
            ],
            correctAnswer: 1
        }
    ];
}

function getVocabularyTestQuestions() {
    return [
        {
            question: "What is the synonym of 'abundant'?",
            options: ["scarce", "plentiful", "inadequate", "moderate"],
            correctAnswer: 1
        },
        {
            question: "Choose the antonym of 'benevolent':",
            options: ["malevolent", "charitable", "generous", "kind"],
            correctAnswer: 0
        },
        {
            question: "What does 'procrastinate' mean?",
            options: [
                "to work quickly", 
                "to plan ahead", 
                "to delay doing something", 
                "to delegate tasks"
            ],
            correctAnswer: 2
        },
        {
            question: "Which word best completes the sentence: 'The detective found a crucial ___ at the crime scene.'",
            options: ["proof", "clue", "sign", "mark"],
            correctAnswer: 1
        },
        {
            question: "What is the meaning of 'ubiquitous'?",
            options: [
                "rare and unique", 
                "present everywhere", 
                "extremely large", 
                "constantly changing"
            ],
            correctAnswer: 1
        },
        {
            question: "Choose the word that doesn't belong in this group:",
            options: ["ecstatic", "jubilant", "melancholy", "elated"],
            correctAnswer: 2
        },
        {
            question: "What does the idiom 'beat around the bush' mean?",
            options: [
                "to avoid the main topic", 
                "to search thoroughly", 
                "to create problems", 
                "to win easily"
            ],
            correctAnswer: 0
        },
        {
            question: "Which is the correct definition of 'pragmatic'?",
            options: [
                "dealing with things sensibly and realistically", 
                "showing great attention to detail", 
                "based on theoretical considerations", 
                "extremely critical of others"
            ],
            correctAnswer: 0
        },
        {
            question: "What is the correct plural form of 'criterion'?",
            options: ["criterions", "criteria", "criterias", "criterion"],
            correctAnswer: 1
        },
        {
            question: "Choose the correct meaning of 'ephemeral':",
            options: [
                "lasting for a very short time", 
                "extremely important", 
                "visually appealing", 
                "occurring irregularly"
            ],
            correctAnswer: 0
        }
    ];
}

function getIELTSTestQuestions() {
    return [
        {
            question: "Read the passage and answer: 'Global warming refers to the gradual increase in the Earth's average surface temperature. Scientists have documented that the global temperature has been rising over the past century. Many believe that human activities, particularly the burning of fossil fuels, are the main contributors to this phenomenon.' What is the main topic of this passage?",
            options: [
                "The rise in Earth's temperature over the last century",
                "Human activities that contribute to global warming",
                "The concept of global warming and its causes",
                "Scientists' documentation of temperature changes"
            ],
            correctAnswer: 2
        },
        {
            question: "Choose the word that best completes the sentence: 'Despite the economic downturn, the company has managed to remain ___ and continue its operations.'",
            options: ["soluble", "solvent", "dissolved", "solution"],
            correctAnswer: 1
        },
        {
            question: "Study the graph showing coffee consumption in five countries and answer: Which country showed the highest increase in coffee consumption between 2010 and 2020? (Note: This would include a graph in a real test)",
            options: ["Brazil", "Italy", "Finland", "United States"],
            correctAnswer: 3
        },
        {
            question: "Listen to the recording and answer: What is the speaker's main concern about urban development? (Note: This would include an audio clip in a real test)",
            options: [
                "The loss of green spaces",
                "Increased pollution levels",
                "Rising housing costs",
                "Traffic congestion"
            ],
            correctAnswer: 0
        },
        {
            question: "Choose the sentence with the correct academic style:",
            options: [
                "The experiment was a total failure and proved nothing.",
                "The results of the experiment were inconclusive.",
                "We messed up the experiment and got no useful data.",
                "The experiment didn't work out as expected."
            ],
            correctAnswer: 1
        },
        {
            question: "In IELTS Writing Task 2, which of these would be considered the most effective thesis statement?",
            options: [
                "In this essay, I will discuss both sides of the argument and give my opinion.",
                "This issue has advantages and disadvantages.",
                "While technological advancements have revolutionized education, they have also introduced significant challenges that must be addressed.",
                "In my opinion, there are both good and bad points."
            ],
            correctAnswer: 2
        },
        {
            question: "For the IELTS Speaking section, which response would receive the highest score for fluency and coherence?",
            options: [
                "I like... um... traveling because... you know... it's fun and... like... interesting.",
                "Traveling is my passion. I particularly enjoy exploring different cultures and trying local cuisines wherever I go.",
                "I travel. It's good. I see things. I eat food. I meet people.",
                "Traveling, yes, traveling is what I like. I travel to places and do things there."
            ],
            correctAnswer: 1
        },
        {
            question: "In an IELTS Listening test, which note-taking strategy is most effective?",
            options: [
                "Writing down every word you hear",
                "Focusing only on names and numbers",
                "Predicting possible answers before listening",
                "Copying the examples provided"
            ],
            correctAnswer: 2
        },
        {
            question: "Which of these would be the most appropriate way to begin an IELTS Academic Writing Task 1 report?",
            options: [
                "I'm going to tell you about this graph showing population changes.",
                "The graph illustrates the population changes in four European countries between 1990 and 2020.",
                "Today I will write about a graph on population.",
                "Here is a graph about population changes that I will describe."
            ],
            correctAnswer: 1
        },
        {
            question: "In an IELTS Reading test, what is the best approach when you encounter unfamiliar vocabulary?",
            options: [
                "Skip the question and move to the next one.",
                "Guess the meaning based on the context.",
                "Look up every word in a dictionary.",
                "Ask the examiner for clarification."
            ],
            correctAnswer: 1
        }
    ];
    }
    