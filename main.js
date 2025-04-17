document.addEventListener('DOMContentLoaded', function() {
    // Sticky Header
    const header = document.querySelector('header');
    const heroSection = document.querySelector('.hero');
    
    if (header && heroSection) {
        const headerHeight = header.offsetHeight;
        heroSection.style.paddingTop = `${headerHeight}px`;
        
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
                header.style.backgroundColor = '#fff';
            } else {
                header.style.boxShadow = 'none';
                header.style.backgroundColor = '#fff';
            }
        });
    }

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - headerHeight,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile Menu Toggle (for responsiveness)
    const mobileToggle = document.createElement('button');
    mobileToggle.className = 'mobile-toggle';
    mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
    
    const nav = document.querySelector('nav');
    
    if (nav) {
        const navParent = nav.parentElement;
        navParent.insertBefore(mobileToggle, nav);
        
        mobileToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            
            if (nav.classList.contains('active')) {
                this.innerHTML = '<i class="fas fa-times"></i>';
            } else {
                this.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }

    // Login Modal
    const loginButtons = document.querySelectorAll('.login-btn');
    
    loginButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Daxil ol funksiyası hazırlanır...');
            // Here you would normally show a login modal
        });
    });
});

// Test selection functionality will be added in test-engine.js