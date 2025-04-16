/**
 * Test Engine JavaScript
 * This file contains the core functionality for all test types
 */

class TestEngine {
    constructor(options) {
        this.testId = options.testId || 'generic-test';
        this.questions = options.questions || [];
        this.timeLimit = options.timeLimit || 20; // time in minutes
        this.shuffleQuestions = options.shuffleQuestions || true;
        this.shuffleAnswers = options.shuffleAnswers || true;
        this.passPercentage = options.passPercentage || 60;
        this.onComplete = options.onComplete || function() {};
        
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.timer = null;
        this.timeRemaining = this.timeLimit * 60; // in seconds
        
        this.elements = {
            testIntro: document.querySelector('.test-intro'),
            testContainer: document.querySelector('.test-container'),
            testResults: document.querySelector('.test-results'),
            testAnswers: document.querySelector('.test-answers'),
            startButton: document.getElementById('start-test'),
            questionContainer: document.getElementById('question-container'),
            currentQuestionEl: document.getElementById('current-question'),
            totalQuestionsEl: document.getElementById('total-questions'),
            progressBar: document.querySelector('.progress'),
            timerEl: document.getElementById('timer'),
            prevBtn: document.getElementById('prev-btn'),
            nextBtn: document.getElementById('next-btn'),
            finishBtn: document.getElementById('finish-btn'),
            scorePercentage: document.getElementById('score-percentage'),
            levelResult: document.getElementById('level-result'),
            correctAnswers: document.getElementById('correct-answers'),
            totalAnswers: document.getElementById('total-answers'),
            levelDescription: document.getElementById('level-description'),
            recommendations: document.getElementById('recommendations'),
            testRecommendations: document.getElementById('test-recommendations'),
            showAnswersBtn: document.getElementById('show-answers'),
            retryTestBtn: document.getElementById('retry-test'),
            answersContainer: document.getElementById('answers-container'),
            backToResultsBtn: document.getElementById('back-to-results')
        };
        
        if (this.shuffleQuestions) {
            this.questions = this.shuffleArray(this.questions);
        }
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Start test button
        if (this.elements.startButton) {
            this.elements.startButton.addEventListener('click', () => this.startTest());
        }
        
        // Navigation buttons
        if (this.elements.prevBtn) {
            this.elements.prevBtn.addEventListener('click', () => this.goToPreviousQuestion());
        }
        
        if (this.elements.nextBtn) {
            this.elements.nextBtn.addEventListener('click', () => this.goToNextQuestion());
        }
        
        if (this.elements.finishBtn) {
            this.elements.finishBtn.addEventListener('click', () => this.finishTest());
        }
        
        // Results screen buttons
        if (this.elements.showAnswersBtn) {
            this.elements.showAnswersBtn.addEventListener('click', () => this.showAnswers());
        }
        
        if (this.elements.retryTestBtn) {
            this.elements.retryTestBtn.addEventListener('click', () => this.resetTest());
        }
        
        if (this.elements.backToResultsBtn) {
            this.elements.backToResultsBtn.addEventListener('click', () => {
                this.elements.testAnswers.style.display = 'none';
                this.elements.testResults.style.display = 'block';
            });
        }
    }
    
    startTest() {
        // Hide intro and show test container
        this.elements.testIntro.style.display = 'none';
        this.elements.testContainer.style.display = 'block';
        
        // Set total questions
        this.elements.totalQuestionsEl.textContent = this.questions.length;
        
        // Start timer
        this.startTimer();
        
        // Load first question
        this.loadQuestion(0);
    }
    
    startTimer() {
        this.timer = setInterval(() => {
            this.timeRemaining--;
            
            const minutes = Math.floor(this.timeRemaining / 60);
            const seconds = this.timeRemaining % 60;
            
            this.elements.timerEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            if (this.timeRemaining <= 0) {
                clearInterval(this.timer);
                this.finishTest();
            }
        }, 1000);
    }
    
    loadQuestion(index) {
        const question = this.questions[index];
        
        // Update current question number
        this.elements.currentQuestionEl.textContent = index + 1;
        
        // Update progress bar
        const progress = ((index + 1) / this.questions.length) * 100;
        this.elements.progressBar.style.width = `${progress}%`;
        
        // Prepare answer options
        let options = question.options;
        if (this.shuffleAnswers) {
            options = this.shuffleArray([...options]);
        }
        
        // Create question HTML
        let questionHTML = `
            <div class="question-box">
                <div class="question-number">Sual ${index + 1} / ${this.questions.length}</div>
                <div class="question-text">${question.question}</div>
                <div class="answer-options">
        `;
        
        options.forEach((option, optionIndex) => {
            const isSelected = this.userAnswers[index] === option;
            questionHTML += `
                <div class="answer-option ${isSelected ? 'selected' : ''}">
                    <input type="radio" id="option-${optionIndex}" name="question-${index}" value="${option}" ${isSelected ? 'checked' : ''}>
                    <label for="option-${optionIndex}">${option}</label>
                </div>
            `;
        });
        
        questionHTML += `
                </div>
            </div>
        `;
        
        // Set content and add event listeners
        this.elements.questionContainer.innerHTML = questionHTML;
        
        // Add event listeners to answer options
        const answerOptions = document.querySelectorAll('.answer-option');
        answerOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                // Clear all selected classes
                answerOptions.forEach(o => o.classList.remove('selected'));
                
                // Add selected class to clicked option
                option.classList.add('selected');
                
                // Check the radio button
                const radioBtn = option.querySelector('input[type="radio"]');
                radioBtn.checked = true;
                
                // Save answer
                this.userAnswers[index] = radioBtn.value;
            });
        });
        
        // Update navigation buttons
        this.updateNavigationButtons();
    }
    
    updateNavigationButtons() {
        // Update Previous button
        if (this.currentQuestionIndex === 0) {
            this.elements.prevBtn.disabled = true;
        } else {
            this.elements.prevBtn.disabled = false;
        }
        
        // Update Next/Finish buttons
        if (this.currentQuestionIndex === this.questions.length - 1) {
            this.elements.nextBtn.style.display = 'none';
            this.elements.finishBtn.style.display = 'inline-block';
        } else {
            this.elements.nextBtn.style.display = 'inline-block';
            this.elements.finishBtn.style.display = 'none';
        }
    }
    
    goToPreviousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.loadQuestion(this.currentQuestionIndex);
        }
    }
    
    goToNextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            this.loadQuestion(this.currentQuestionIndex);
        }
    }
    
    finishTest() {
        // Stop timer
        clearInterval(this.timer);
        
        // Calculate score
        const result = this.calculateScore();
        
        // Display results
        this.showResults(result);
        
        // Call onComplete callback
        if (typeof this.onComplete === 'function') {
            this.onComplete(result);
        }
    }
    
    calculateScore() {
        let correctCount = 0;
        
        for (let i = 0; i < this.questions.length; i++) {
            if (this.userAnswers[i] === this.questions[i].correctAnswer) {
                correctCount++;
            }
        }
        
        const percentage = Math.round((correctCount / this.questions.length) * 100);
        let level = '';
        let description = '';
        let recommendations = '';
        
        // Determine level based on score
        if (percentage >= 90) {
            level = 'C2 (Proficiency)';
            description = 'Siz ingilis dilində demək olar ki, ana dili səviyyəsində danışırsınız. Mürəkkəb mövzularda sərbəst danışa və akademik ingilis dilindən istifadə edə bilərsiniz.';
            recommendations = 'Dilinizi daha da təkmilləşdirmək üçün akademik yazı və nitq üzərində çalışın. İxtisaslaşmış sahələr üzrə terminologiyanı öyrənin.';
        } else if (percentage >= 75) {
            level = 'C1 (Advanced)';
            description = 'Siz mürəkkəb mətnləri başa düşə və abstrakt mövzularda fikir mübadiləsi apara bilərsiniz. Peşəkar mühitdə ingilis dilindən istifadə edə bilərsiniz.';
            recommendations = 'İdiomlar və deyimlərin istifadəsini təkmilləşdirin. Müxtəlif aksent və dialektləri anlamaq üçün müxtəlif audio-video materiallardan istifadə edin.';
        } else if (percentage >= 60) {
            level = 'B2 (Upper-Intermediate)';
            description = 'Siz bir çox mövzularda sərbəst danışa bilir və müxtəlif mətnləri başa düşürsünüz. Detallı fikirlər ifadə edə bilərsiniz.';
            recommendations = 'Yazı və nitq bacarıqlarınızı daha da inkişaf etdirin. Daha mürəkkəb qrammatika strukturlarını mənimsəyin.';
        } else if (percentage >= 45) {
            level = 'B1 (Intermediate)';
            description = 'Siz gündəlik mövzularda ünsiyyət qura bilir və mətnləri başa düşürsünüz. Səyahət zamanı qarşınıza çıxan vəziyyətlərin öhdəsindən gələ bilərsiniz.';
            recommendations = 'Lüğət ehtiyatınızı artırın və qrammatika biliyinizi möhkəmləndirin. Daha çox danışma təcrübəsi əldə edin.';
        } else if (percentage >= 30) {
            level = 'A2 (Elementary)';
            description = 'Siz sadə cümlələr qura bilir və gündəlik vəziyyətlərdə ünsiyyət saxlaya bilərsiniz. Sadə mətnləri başa düşürsünüz.';
            recommendations = 'Əsas qrammatika qaydalarını təkmilləşdirin və gündəlik danışıq üçün lazım olan söz ehtiyatınızı artırın.';
        } else {
            level = 'A1 (Beginner)';
            description = 'Siz ingilis dilinin əsas ifadələrini bilir və çox sadə ünsiyyət qura bilərsiniz. Sadə sualları cavablandıra bilərsiniz.';
            recommendations = 'Əsas qrammatika və söz ehtiyatı ilə başlayın. Sadə dialoqları başa düşməyə və təkrar etməyə çalışın.';
        }
        
        return {
            correctCount,
            totalCount: this.questions.length,
            percentage,
            level,
            description,
            recommendations
        };
    }
    
    showResults(result) {
        // Hide test container and show results
        this.elements.testContainer.style.display = 'none';
        this.elements.testResults.style.display = 'block';
        
        // Update results UI
        this.elements.scorePercentage.textContent = `${result.percentage}%`;
        this.elements.levelResult.textContent = result.level;
        this.elements.correctAnswers.textContent = result.correctCount;
        this.elements.totalAnswers.textContent = result.totalCount;
        this.elements.levelDescription.textContent = result.description;
        this.elements.recommendations.textContent = result.recommendations;
        
        // Add recommendation tests if available
        if (this.elements.testRecommendations) {
            this.generateTestRecommendations(result.level);
        }
    }
    
    generateTestRecommendations(level) {
        // Clear previous recommendations
        this.elements.testRecommendations.innerHTML = '';
        
        // Generate recommendations based on level
        let recommendedTests = [];
        
        switch(level) {
            case 'C2 (Proficiency)':
                recommendedTests = [
                    { name: 'Academic Writing Skills', url: 'academic-writing-test' },
                    { name: 'Advanced Vocabulary', url: 'advanced-vocabulary-test' }
                ];
                break;
            case 'C1 (Advanced)':
                recommendedTests = [
                    { name: 'Business English', url: 'business-english-test' },
                    { name: 'Advanced Grammar', url: 'advanced-grammar-test' }
                ];
                break;
            case 'B2 (Upper-Intermediate)':
                recommendedTests = [
                    { name: 'Phrasal Verbs', url: 'phrasal-verbs-test' },
                    { name: 'Reading Comprehension', url: 'reading-comprehension-test' }
                ];
                break;
            case 'B1 (Intermediate)':
                recommendedTests = [
                    { name: 'Grammar Practice', url: 'grammar-practice-test' },
                    { name: 'Vocabulary Building', url: 'vocabulary-test' }
                ];
                break;
            case 'A2 (Elementary)':
                recommendedTests = [
                    { name: 'Basic Grammar', url: 'basic-grammar-test' },
                    { name: 'Everyday English', url: 'everyday-english-test' }
                ];
                break;
            case 'A1 (Beginner)':
                recommendedTests = [
                    { name: 'Beginner Vocabulary', url: 'beginner-vocabulary-test' },
                    { name: 'Simple Grammar', url: 'simple-grammar-test' }
                ];
                break;
        }
        
        // Generate HTML for test recommendations
        if (recommendedTests.length > 0) {
            const recommendationsHTML = recommendedTests.map(test => 
                `<a href="${test.url}" class="recommendation-card">
                    <div class="card-title">${test.name}</div>
                    <div class="card-action">İndi Başla</div>
                </a>`
            ).join('');
            
            this.elements.testRecommendations.innerHTML = `
                <h3>Tövsiyə edilən testlər</h3>
                <div class="recommendation-cards">
                    ${recommendationsHTML}
                </div>
            `;
        }
    }
    
    showAnswers() {
        // Hide results and show answers review
        this.elements.testResults.style.display = 'none';
        this.elements.testAnswers.style.display = 'block';
        
        // Generate answers review
        let answersHTML = '';
        
        this.questions.forEach((question, index) => {
            const userAnswer = this.userAnswers[index] || 'Cavab verilməyib';
            const isCorrect = userAnswer === question.correctAnswer;
            
            answersHTML += `
                <div class="review-question">
                    <div class="question-number">Sual ${index + 1}</div>
                    <div class="question-text">${question.question}</div>
                    <div class="user-answer ${isCorrect ? 'correct' : 'incorrect'}">
                        <strong>Sizin cavabınız:</strong> ${userAnswer}
                    </div>
                    <div class="correct-answer">
                        <strong>Düzgün cavab:</strong> ${question.correctAnswer}
                    </div>
                    ${question.explanation ? `<div class="explanation"><strong>İzah:</strong> ${question.explanation}</div>` : ''}
                </div>
            `;
        });
        
        this.elements.answersContainer.innerHTML = answersHTML;
    }
    
    resetTest() {
        // Reset all test state
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.timeRemaining = this.timeLimit * 60;
        
        // Shuffle questions again if needed
        if (this.shuffleQuestions) {
            this.questions = this.shuffleArray(this.questions);
        }
        
        // Reset UI
        this.elements.testResults.style.display = 'none';
        this.elements.testAnswers.style.display = 'none';
        this.elements.testIntro.style.display = 'block';
    }
    
    shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
}