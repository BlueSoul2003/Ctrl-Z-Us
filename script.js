// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));
}

// Form Validation and Submission
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = '#ef4444';
                showError(input, 'This field is required');
            } else {
                input.style.borderColor = '#e5e7eb';
                removeError(input);
            }
        });

        // Email validation
        const emailInput = form.querySelector('input[type="email"]');
        if (emailInput && emailInput.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value)) {
                isValid = false;
                emailInput.style.borderColor = '#ef4444';
                showError(emailInput, 'Please enter a valid email address');
            }
        }

        // Password validation
        const passwordInput = form.querySelector('input[type="password"]');
        if (passwordInput && passwordInput.value) {
            if (passwordInput.value.length < 6) {
                isValid = false;
                passwordInput.style.borderColor = '#ef4444';
                showError(passwordInput, 'Password must be at least 6 characters long');
            }
        }

        if (isValid) {
            showSuccess('Form submitted successfully!');
            form.reset();
        }
    });
}

function showError(input, message) {
    const errorDiv = input.parentNode.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.textContent = message;
    } else {
        const div = document.createElement('div');
        div.className = 'error-message';
        div.style.color = '#ef4444';
        div.style.fontSize = '0.875rem';
        div.style.marginTop = '0.25rem';
        div.textContent = message;
        input.parentNode.appendChild(div);
    }
}

function removeError(input) {
    const errorDiv = input.parentNode.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 10000;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    `;
    successDiv.textContent = message;
    document.body.appendChild(successDiv);

    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// Initialize form validation for all forms
document.addEventListener('DOMContentLoaded', function() {
    validateForm('studentSignupForm');
    validateForm('tutorRegisterForm');
    validateForm('signInForm');
});

// Tutor Filtering
function filterTutors() {
    const subjectFilter = document.getElementById('subjectFilter');
    const priceFilter = document.getElementById('priceFilter');
    const ratingFilter = document.getElementById('ratingFilter');
    
    if (!subjectFilter) return;

    const tutors = document.querySelectorAll('.tutor-card');
    
    tutors.forEach(tutor => {
        let show = true;
        
        // Subject filter
        if (subjectFilter.value && subjectFilter.value !== 'all') {
            const tutorSubjects = tutor.querySelector('.tutor-subjects').textContent.toLowerCase();
            if (!tutorSubjects.includes(subjectFilter.value.toLowerCase())) {
                show = false;
            }
        }
        
        // Price filter
        if (priceFilter && priceFilter.value && priceFilter.value !== 'all') {
            const price = parseInt(tutor.querySelector('.tutor-price').textContent.match(/\d+/)[0]);
            const filterPrice = parseInt(priceFilter.value);
            
            if (priceFilter.value === 'under-25' && price >= 25) show = false;
            if (priceFilter.value === '25-50' && (price < 25 || price > 50)) show = false;
            if (priceFilter.value === 'over-50' && price <= 50) show = false;
        }
        
        // Rating filter
        if (ratingFilter && ratingFilter.value && ratingFilter.value !== 'all') {
            const rating = parseFloat(tutor.querySelector('.stars').getAttribute('data-rating'));
            const filterRating = parseFloat(ratingFilter.value);
            
            if (rating < filterRating) show = false;
        }
        
        tutor.style.display = show ? 'block' : 'none';
    });
}

// Initialize filters
document.addEventListener('DOMContentLoaded', function() {
    const filterSelects = document.querySelectorAll('.filter-select');
    filterSelects.forEach(select => {
        select.addEventListener('change', filterTutors);
    });
});

// Chat Functionality
function initializeChat() {
    const chatInput = document.querySelector('.chat-input input');
    const chatButton = document.querySelector('.chat-input button');
    const chatMessages = document.querySelector('.chat-messages');
    
    if (!chatInput || !chatButton || !chatMessages) return;

    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = 'message sent';
        messageDiv.textContent = message;
        chatMessages.appendChild(messageDiv);
        
        chatInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Simulate reply after 1 second
        setTimeout(() => {
            const replyDiv = document.createElement('div');
            replyDiv.className = 'message received';
            replyDiv.textContent = 'Thanks for your message! I\'ll get back to you soon.';
            chatMessages.appendChild(replyDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
    }

    chatButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

// Progress Bar Animation
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    progressBars.forEach(bar => {
        const percentage = bar.getAttribute('data-percentage');
        if (percentage) {
            setTimeout(() => {
                bar.style.width = percentage + '%';
            }, 500);
        }
    });
}

// Calendar Functionality
function initializeCalendar() {
    const calendarDays = document.querySelectorAll('.calendar-day');
    
    calendarDays.forEach(day => {
        day.addEventListener('click', function() {
            // Remove active class from all days
            calendarDays.forEach(d => d.classList.remove('active'));
            // Add active class to clicked day
            this.classList.add('active');
            
            // Show sessions for selected day
            showSessionsForDay(this.textContent);
        });
    });
}

function showSessionsForDay(day) {
    // This would typically fetch sessions from a database
    console.log(`Showing sessions for day ${day}`);
}

// Book Session Functionality
function bookSession(tutorId) {
    const sessionModal = document.createElement('div');
    sessionModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    sessionModal.innerHTML = `
        <div style="background: white; padding: 2rem; border-radius: 12px; max-width: 400px; width: 90%;">
            <h3 style="margin-bottom: 1rem;">Book a Session</h3>
            <form id="bookingForm">
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">Date:</label>
                    <input type="date" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                </div>
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">Time:</label>
                    <select required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                        <option value="">Select time</option>
                        <option value="09:00">9:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="15:00">3:00 PM</option>
                        <option value="16:00">4:00 PM</option>
                    </select>
                </div>
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">Duration:</label>
                    <select required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                        <option value="1">1 hour</option>
                        <option value="1.5">1.5 hours</option>
                        <option value="2">2 hours</option>
                    </select>
                </div>
                <div style="display: flex; gap: 1rem;">
                    <button type="submit" style="flex: 1; padding: 10px; background: #2563eb; color: white; border: none; border-radius: 6px; cursor: pointer;">Book Session</button>
                    <button type="button" onclick="this.closest('div[style*=\"position: fixed\"]').remove()" style="flex: 1; padding: 10px; background: #6b7280; color: white; border: none; border-radius: 6px; cursor: pointer;">Cancel</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(sessionModal);
    
    // Handle form submission
    const form = sessionModal.querySelector('#bookingForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        showSuccess('Session booked successfully!');
        sessionModal.remove();
    });
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeChat();
    animateProgressBars();
    initializeCalendar();
    
    // Add click handlers for book session buttons
    const bookButtons = document.querySelectorAll('.book-session');
    bookButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tutorId = this.getAttribute('data-tutor-id');
            bookSession(tutorId);
        });
    });
    
    // Add click handlers for chat items
    const chatItems = document.querySelectorAll('.chat-item');
    chatItems.forEach(item => {
        item.addEventListener('click', function() {
            chatItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            // Update chat header
            const chatHeader = document.querySelector('.chat-header');
            if (chatHeader) {
                chatHeader.textContent = this.textContent;
            }
        });
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading states to buttons
document.querySelectorAll('.btn, .form-button, .book-session').forEach(button => {
    button.addEventListener('click', function() {
        if (this.type !== 'submit') return;
        
        const originalText = this.textContent;
        this.textContent = 'Loading...';
        this.disabled = true;
        
        setTimeout(() => {
            this.textContent = originalText;
            this.disabled = false;
        }, 2000);
    });
});

// Ranking System and Pet Game Functionality
class RankingSystem {
    constructor() {
        this.leaderboardData = [
            { name: 'Sarah Johnson', points: 850, rank: 1, avatar: '👩‍🎓' },
            { name: 'Mike Chen', points: 720, rank: 2, avatar: '👨‍🎓' },
            { name: 'Emma Davis', points: 680, rank: 3, avatar: '👩‍🎓' },
            { name: 'Alex Thompson', points: 650, rank: 4, avatar: '👨‍🎓' },
            { name: 'You', points: 450, rank: 5, avatar: '👤' },
            { name: 'Lisa Wang', points: 420, rank: 6, avatar: '👩‍🎓' },
            { name: 'David Kim', points: 380, rank: 7, avatar: '👨‍🎓' },
            { name: 'Maria Garcia', points: 350, rank: 8, avatar: '👩‍🎓' }
        ];
        this.init();
    }

    init() {
        this.renderLeaderboard();
        this.updateUserRank();
    }

    renderLeaderboard() {
        const leaderboardList = document.getElementById('leaderboardList');
        if (!leaderboardList) return;

        leaderboardList.innerHTML = '';
        
        this.leaderboardData.forEach((user, index) => {
            const userDiv = document.createElement('div');
            userDiv.style.cssText = `
                display: flex;
                align-items: center;
                padding: 1rem;
                margin-bottom: 0.5rem;
                background: ${user.name === 'You' ? '#fef3c7' : '#f8fafc'};
                border-radius: 8px;
                border: ${user.name === 'You' ? '2px solid #f59e0b' : '1px solid #e5e7eb'};
            `;

            const rankDiv = document.createElement('div');
            rankDiv.style.cssText = `
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 700;
                margin-right: 1rem;
                background: ${index < 3 ? ['#f59e0b', '#6b7280', '#8b5cf6'][index] : '#e5e7eb'};
                color: ${index < 3 ? 'white' : '#374151'};
            `;
            rankDiv.textContent = user.rank;

            const avatarDiv = document.createElement('div');
            avatarDiv.style.cssText = `
                font-size: 1.5rem;
                margin-right: 1rem;
            `;
            avatarDiv.textContent = user.avatar;

            const infoDiv = document.createElement('div');
            infoDiv.style.cssText = `
                flex: 1;
            `;

            const nameDiv = document.createElement('div');
            nameDiv.style.cssText = `
                font-weight: 600;
                color: #1e293b;
                margin-bottom: 0.25rem;
            `;
            nameDiv.textContent = user.name;

            const pointsDiv = document.createElement('div');
            pointsDiv.style.cssText = `
                font-size: 0.875rem;
                color: #64748b;
            `;
            pointsDiv.textContent = `${user.points} points`;

            infoDiv.appendChild(nameDiv);
            infoDiv.appendChild(pointsDiv);

            userDiv.appendChild(rankDiv);
            userDiv.appendChild(avatarDiv);
            userDiv.appendChild(infoDiv);

            leaderboardList.appendChild(userDiv);
        });
    }

    updateUserRank() {
        const userData = this.leaderboardData.find(user => user.name === 'You');
        if (userData) {
            // Update the points earned display in the progress overview
            const pointsDisplay = document.querySelector('.progress-overview .container div:nth-child(3) div:first-child');
            if (pointsDisplay) {
                pointsDisplay.textContent = userData.points;
            }
        }
    }

    addPoints(points) {
        const userData = this.leaderboardData.find(user => user.name === 'You');
        if (userData) {
            userData.points += points;
            this.sortLeaderboard();
            this.updateRanks();
            this.renderLeaderboard();
            this.updateUserRank();
        }
    }

    sortLeaderboard() {
        this.leaderboardData.sort((a, b) => b.points - a.points);
    }

    updateRanks() {
        this.leaderboardData.forEach((user, index) => {
            user.rank = index + 1;
        });
    }
}

class PetGame {
    constructor() {
        this.hunger = 100;
        this.gamePoints = 0;
        this.timesFed = 0;
        this.petMood = 'happy';
        this.init();
    }

    init() {
        this.updateDisplay();
        this.setupEventListeners();
        this.startHungerDecay();
    }

    setupEventListeners() {
        const foodItems = document.querySelectorAll('.food-item');
        foodItems.forEach(item => {
            item.addEventListener('click', () => {
                const points = parseInt(item.getAttribute('data-points'));
                const food = item.getAttribute('data-food');
                this.feedPet(points, food);
            });
        });

        const pet = document.getElementById('pet');
        if (pet) {
            pet.addEventListener('click', () => {
                this.petInteraction();
            });
        }
    }

    feedPet(points, food) {
        if (this.hunger >= 100) {
            this.showMessage('Your pet is not hungry right now!');
            return;
        }

        this.hunger = Math.min(100, this.hunger + 20);
        this.gamePoints += points;
        this.timesFed++;
        
        // Add points to ranking system
        if (window.rankingSystem) {
            window.rankingSystem.addPoints(points);
        }

        this.updatePetMood();
        this.updateDisplay();
        this.showMessage(`Yum! Your pet loved the ${food}! +${points} points`);
        
        // Animate the pet
        this.animatePet();
    }

    petInteraction() {
        if (this.hunger > 50) {
            this.showMessage('Your pet is happy and playful! 🎉');
        } else if (this.hunger > 20) {
            this.showMessage('Your pet is getting hungry... 😕');
        } else {
            this.showMessage('Your pet is very hungry! Please feed it! 😢');
        }
    }

    updatePetMood() {
        if (this.hunger >= 80) {
            this.petMood = 'happy';
        } else if (this.hunger >= 40) {
            this.petMood = 'neutral';
        } else {
            this.petMood = 'hungry';
        }
    }

    updateDisplay() {
        const hungerLevel = document.getElementById('hungerLevel');
        const hungerBarFill = document.getElementById('hungerBarFill');
        const gamePoints = document.getElementById('gamePoints');
        const timesFed = document.getElementById('timesFed');
        const petStatus = document.getElementById('petStatus');
        const pet = document.getElementById('pet');

        if (hungerLevel) hungerLevel.textContent = `${this.hunger}%`;
        if (hungerBarFill) hungerBarFill.style.width = `${this.hunger}%`;
        if (gamePoints) gamePoints.textContent = this.gamePoints;
        if (timesFed) timesFed.textContent = this.timesFed;

        // Update pet appearance based on mood
        if (pet) {
            const petEmojis = {
                happy: '🐱',
                neutral: '😺',
                hungry: '😿'
            };
            pet.textContent = petEmojis[this.petMood];
        }

        // Update status message
        if (petStatus) {
            const statusMessages = {
                happy: 'Your pet is happy and well-fed! 🎉',
                neutral: 'Your pet could use a snack... 😊',
                hungry: 'Your pet is hungry! Please feed it! 😢'
            };
            petStatus.textContent = statusMessages[this.petMood];
        }

        // Update hunger bar color
        if (hungerBarFill) {
            if (this.hunger >= 80) {
                hungerBarFill.style.background = 'linear-gradient(90deg, #10b981, #34d399)';
            } else if (this.hunger >= 40) {
                hungerBarFill.style.background = 'linear-gradient(90deg, #f59e0b, #fbbf24)';
            } else {
                hungerBarFill.style.background = 'linear-gradient(90deg, #ef4444, #f87171)';
            }
        }
    }

    animatePet() {
        const pet = document.getElementById('pet');
        if (pet) {
            pet.style.transform = 'scale(1.2)';
            setTimeout(() => {
                pet.style.transform = 'scale(1)';
            }, 200);
        }
    }

    showMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #2563eb;
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            font-weight: 500;
        `;
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }

    startHungerDecay() {
        setInterval(() => {
            if (this.hunger > 0) {
                this.hunger = Math.max(0, this.hunger - 1);
                this.updatePetMood();
                this.updateDisplay();
            }
        }, 30000); // Decrease hunger every 30 seconds
    }
}

// Initialize ranking system and pet game when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize existing functionality
    initializeChat();
    animateProgressBars();
    initializeCalendar();
    
    // Initialize new features
    window.rankingSystem = new RankingSystem();
    window.petGame = new PetGame();
    
    // Add click handlers for book session buttons
    const bookButtons = document.querySelectorAll('.book-session');
    bookButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tutorId = this.getAttribute('data-tutor-id');
            bookSession(tutorId);
        });
    });
    
    // Add click handlers for chat items
    const chatItems = document.querySelectorAll('.chat-item');
    chatItems.forEach(item => {
        item.addEventListener('click', function() {
            chatItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            // Update chat header
            const chatHeader = document.querySelector('.chat-header');
            if (chatHeader) {
                chatHeader.textContent = this.textContent;
            }
        });
    });
});
