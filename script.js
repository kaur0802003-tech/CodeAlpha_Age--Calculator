

// DOM Elements
const dobInput = document.getElementById('dob');
const resultSection = document.getElementById('resultSection');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');

// Result Elements
const yearsElement = document.getElementById('years');
const monthsElement = document.getElementById('months');
const daysElement = document.getElementById('days');
const birthdayInfo = document.getElementById('birthdayInfo');
const totalDaysInfo = document.getElementById('totalDaysInfo');
const nextBirthdayInfo = document.getElementById('nextBirthdayInfo');

/**
 * Main function to calculate age
 */
function calculateAge() {
    // Get input value
    const dobValue = dobInput.value;
    
    // Validate input
    if (!dobValue) {
        showError('Please enter your Date of Birth');
        return;
    }
    
    const dob = new Date(dobValue);
    const today = new Date();
    
    // Validate date
    if (isNaN(dob.getTime())) {
        showError('Invalid Date of Birth');
        return;
    }
    
    // Check if date is in the future
    if (dob > today) {
        showError('Date of Birth cannot be in the future!');
        return;
    }
    
    // Check if date is too old (more than 150 years)
    const maxAge = 150;
    const ageInYears = today.getFullYear() - dob.getFullYear();
    if (ageInYears > maxAge) {
        showError(`Age cannot be more than ${maxAge} years`);
        return;
    }
    
    // Hide error message
    hideError();
    
    // Calculate age
    const age = calculateExactAge(dob, today);
    
    // Display results
    displayResults(age, dob);
    
    // Show result section with animation
    resultSection.classList.add('show');
}

/**
 * Calculate exact age in years, months, and days
 * @param {Date} birthDate - Date of Birth
 * @param {Date} currentDate - Current Date
 * @returns {Object} - Object containing years, months, and days
 */
function calculateExactAge(birthDate, currentDate) {
    let years = currentDate.getFullYear() - birthDate.getFullYear();
    let months = currentDate.getMonth() - birthDate.getMonth();
    let days = currentDate.getDate() - birthDate.getDate();
    
    // Adjust if days are negative
    if (days < 0) {
        months--;
        // Get the number of days in the previous month
        const previousMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            0
        );
        days += previousMonth.getDate();
    }
    
    // Adjust if months are negative
    if (months < 0) {
        years--;
        months += 12;
    }
    
    return { years, months, days };
}

/**
 * Display the calculated results
 * @param {Object} age - Object containing years, months, and days
 * @param {Date} dob - Date of Birth
 */
function displayResults(age, dob) {
    // Animate numbers
    animateNumber(yearsElement, age.years);
    animateNumber(monthsElement, age.months);
    animateNumber(daysElement, age.days);
    
    // Display additional information
    displayAdditionalInfo(dob);
}

/**
 * Animate number counting
 * @param {HTMLElement} element - Target element
 * @param {number} targetNumber - Final number to display
 */
function animateNumber(element, targetNumber) {
    const duration = 1000; // Animation duration in ms
    const startNumber = 0;
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentNumber = Math.floor(startNumber + (targetNumber - startNumber) * easeOutQuart);
        
        element.textContent = currentNumber;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        } else {
            element.textContent = targetNumber;
        }
    }
    
    requestAnimationFrame(updateNumber);
}

/**
 * Display additional information about the birth
 * @param {Date} dob - Date of Birth
 */
function displayAdditionalInfo(dob) {
    // Format birth date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    birthdayInfo.textContent = dob.toLocaleDateString('en-US', options);
    
    // Calculate total days lived
    const today = new Date();
    const totalDays = Math.floor((today - dob) / (1000 * 60 * 60 * 24));
    totalDaysInfo.textContent = `${totalDays.toLocaleString()} days`;
    
    // Calculate next birthday
    const nextBirthday = getNextBirthday(dob);
    const daysUntilBirthday = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilBirthday === 0) {
        nextBirthdayInfo.textContent = '🎉 Today is your birthday!';
    } else if (daysUntilBirthday === 1) {
        nextBirthdayInfo.textContent = 'Tomorrow! 🎂';
    } else {
        nextBirthdayInfo.textContent = `In ${daysUntilBirthday} days`;
    }
}

/**
 * Get the next birthday date
 * @param {Date} dob - Date of Birth
 * @returns {Date} - Next birthday date
 */
function getNextBirthday(dob) {
    const today = new Date();
    const currentYear = today.getFullYear();
    
    let nextBirthday = new Date(currentYear, dob.getMonth(), dob.getDate());
    
    // If birthday has passed this year, set to next year
    if (nextBirthday <= today) {
        nextBirthday = new Date(currentYear + 1, dob.getMonth(), dob.getDate());
    }
    
    return nextBirthday;
}

/**
 * Show error message
 * @param {string} message - Error message to display
 */
function showError(message) {
    errorText.textContent = message;
    errorMessage.classList.add('show');
    resultSection.classList.remove('show');
}

/**
 * Hide error message
 */
function hideError() {
    errorMessage.classList.remove('show');
}

/**
 * Set maximum date to today (prevent future dates in date picker)
 */
function setMaxDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    dobInput.max = `${year}-${month}-${day}`;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    setMaxDate();
    
    // Add enter key support
    dobInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            calculateAge();
        }
    });
    
    // Clear error when user starts typing
    dobInput.addEventListener('input', function() {
        if (errorMessage.classList.contains('show')) {
            hideError();
        }
    });
});