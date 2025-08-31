class NanaMagazine {
  constructor() {
    this.currentPage = 0;
    this.totalPages = 10;
    this.isAnimating = false;
    this.mode = 'magazine';
    this.cart = [];
    this.bubbles = [];
    
    // Authentication properties
    this.currentUser = null;
    this.isLoggedIn = false;
    
    // Google OAuth configuration
    this.googleClientId = '1087327885659-your-client-id.apps.googleusercontent.com'; // 실제 클라이언트 ID로 교체 필요
    
    this.init();
    this.initAuth(); // This is now async but we don't await it to avoid blocking initialization
    this.initGoogleAuth();
  }
  
  async init() {
    this.createLoadingScreen();
    this.setupNavigation();
    this.setupMagazineContent();
    await this.setupShoppingContent();
    this.setup3DBubbles();
    this.setupEventListeners();
    
    setTimeout(() => {
      this.hideLoadingScreen();
    }, 2000);
  }
  
  createLoadingScreen() {
    const loadingHTML = `
      <div class="loading-screen" id="loadingScreen">
        <div class="loading-content">
          <div class="loading-logo">NANA</div>
          <div class="loading-spinner"></div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', loadingHTML);
  }
  
  hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    loadingScreen.classList.add('fade-out');
    setTimeout(() => {
      loadingScreen.remove();
    }, 600);
  }
  
  setupNavigation() {
    const navHTML = `
      <nav class="navigation" id="navigation">
        <div class="nav-container">
          <a href="#" class="nav-logo" id="navLogo">NANA</a>
          <ul class="nav-menu">
            <li><a href="#" class="nav-link">COLLECTION</a></li>
            <li><a href="#" class="nav-link">BEAUTY</a></li>
            <li><a href="#" class="nav-link">LIFESTYLE</a></li>
            <li><a href="#" class="nav-link">ABOUT</a></li>
            <li><button class="mode-toggle" id="modeToggle">Shop Mode</button></li>
          </ul>
          <div class="nav-user">
            <div class="cart-icon" onclick="window.nana.checkAuthForCart()">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z" fill="currentColor"/>
                <path d="M9 8V17H11V8H9ZM13 8V17H15V8H13Z" fill="currentColor"/>
              </svg>
              <span class="cart-badge" id="cartBadge">0</span>
            </div>
            <div class="auth-section" id="authSection">
              <!-- Logged out state -->
              <div class="auth-links logged-out">
                <a href="#" class="auth-link" onclick="window.nana.showAuth()">Login</a>
              </div>
              <!-- Logged in state -->
              <div class="auth-links logged-in" style="display: none;">
                <a href="#" class="mypage-link" onclick="window.nana.showMyPage()">My Page</a>
                <span class="user-greeting" id="userGreeting">Hello!</span>
              </div>
            </div>
          </div>
        </div>
      </nav>
    `;
    
    const root = document.getElementById('root');
    root.insertAdjacentHTML('afterbegin', navHTML);
    
    window.addEventListener('scroll', () => {
      const nav = document.getElementById('navigation');
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });
  }
  
  setupMagazineContent() {
    const magazineHTML = `
      <section class="hero-section" id="heroSection">
        <canvas id="bubbleCanvas" class="bubble-canvas"></canvas>
        <div class="magazine-cover">
          <h1 class="magazine-title">NANA</h1>
          <p class="magazine-subtitle">Vol.01 Spring 2025</p>
          <button class="open-magazine-btn" id="openMagazine">
            <span>Open Magazine</span>
          </button>
        </div>
      </section>
      
      <div class="collection-page" id="collectionPage">
        <div class="collection-container">
          <!-- Collection Header -->
          <section class="collection-header">
            <h1 class="collection-title">Spring Collection 2025</h1>
            <p class="collection-subtitle">Discover the essence of kawaii minimalism</p>
          </section>
          
          <!-- Featured Items Editorial -->
          <section class="featured-editorial">
            <div class="editorial-main">
              <div class="main-feature">
                <div class="feature-image-wrapper">
                  <img src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop" alt="Sakura Pink Dress" class="feature-image">
                  <div class="feature-badge">Editor's Pick</div>
                </div>
                <div class="feature-content">
                  <span class="feature-category">Spring Essential</span>
                  <h2 class="feature-title">Sakura Pink Dress</h2>
                  <p class="feature-description">봄의 시작을 알리는 벚꽃 핑크 드레스. 일본 전통 미의식과 현대적 실루엣이 조화를 이룬 시그니처 아이템.</p>
                  <div class="feature-price">¥18,900</div>
                  <button class="feature-btn" data-product-id="101">Add to Cart</button>
                </div>
              </div>
              
              <div class="secondary-features">
                <div class="mini-feature">
                  <img src="https://images.unsplash.com/photo-1588863845063-b4eb8c4ab4eb?w=300&h=400&fit=crop" alt="Morning Sky Cardigan" class="mini-feature-image">
                  <div class="mini-feature-content">
                    <h3>Morning Sky Cardigan</h3>
                    <p>하늘빛 카디건</p>
                    <span class="mini-price">¥15,600</span>
                  </div>
                </div>
                
                <div class="mini-feature">
                  <img src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop" alt="Pearl Button Coat" class="mini-feature-image">
                  <div class="mini-feature-content">
                    <h3>Pearl Button Coat</h3>
                    <p>진주 단추 코트</p>
                    <span class="mini-price">¥24,800</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="editorial-quote">
              <blockquote>
                "Fashion is not just about clothes, it's about expressing your inner beauty."
                <cite>— NANA Editorial Team</cite>
              </blockquote>
            </div>
          </section>
          
          <!-- Main Product Grid -->
          <section class="main-products">
            <div class="products-grid" id="collectionProductsGrid">
              <!-- Products will be dynamically generated -->
            </div>
          </section>
        </div>
      </div>
      
      <div class="beauty-page" id="beautyPage">
        <div class="beauty-container">
          <!-- Beauty Header -->
          <section class="beauty-header">
            <h1 class="beauty-title">Beauty Collection</h1>
            <p class="beauty-subtitle">Kawaii beauty essentials for your daily routine</p>
          </section>
          
          <!-- Beauty Hero Showcase -->
          <section class="beauty-hero">
            <div class="beauty-hero-grid">
              <div class="hero-product large">
                <img src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=800&fit=crop" alt="Hero Beauty Product" class="hero-beauty-image">
                <div class="hero-beauty-overlay">
                  <h3 class="hero-product-title">Sakura Glow Serum</h3>
                  <p class="hero-product-description">Radiant skin with cherry blossom extract</p>
                  <p class="hero-product-price">¥6,800</p>
                  <button class="hero-beauty-btn">Shop Now</button>
                </div>
              </div>
              <div class="hero-lookbook">
                <img src="https://images.unsplash.com/photo-1616683693504-3b44ad8731be?w=400&h=600&fit=crop" alt="Beauty Look 1" class="lookbook-image">
                <div class="lookbook-overlay">
                  <h4>Spring Blush Look</h4>
                  <span class="lookbook-tag">Tutorial</span>
                </div>
              </div>
              <div class="hero-tips">
                <div class="tips-content">
                  <h4>Beauty Tip of the Day</h4>
                  <p>Apply lip tint to the center of your lips and blend outward for a natural gradient effect - the perfect kawaii look!</p>
                  <span class="tip-author">- NANA Beauty Team</span>
                </div>
              </div>
            </div>
          </section>
          
          <!-- Categories Filter -->
          <section class="beauty-categories">
            <div class="category-filters">
              <button class="category-btn active" data-category="all">All Products</button>
              <button class="category-btn" data-category="skincare">Skincare</button>
              <button class="category-btn" data-category="makeup">Makeup</button>
              <button class="category-btn" data-category="lips">Lips</button>
              <button class="category-btn" data-category="eyes">Eyes</button>
              <button class="category-btn" data-category="tools">Tools</button>
            </div>
          </section>
          
          <!-- Lookbook Section -->
          <section class="beauty-lookbook">
            <h2 class="section-title">Spring Lookbook</h2>
            <div class="lookbook-grid">
              <div class="lookbook-item featured">
                <img src="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&h=800&fit=crop" alt="Featured Look" class="lookbook-img">
                <div class="lookbook-content">
                  <h3>Dewy Glass Skin</h3>
                  <p>Achieve the perfect Korean glass skin look with our 3-step routine</p>
                  <div class="lookbook-products">
                    <span class="product-dot" data-product="Hydrating Toner">1</span>
                    <span class="product-dot" data-product="Vitamin C Serum">2</span>
                    <span class="product-dot" data-product="Moisturizer">3</span>
                  </div>
                </div>
              </div>
              <div class="lookbook-item">
                <img src="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=600&fit=crop" alt="Kawaii Pink Look" class="lookbook-img">
                <div class="lookbook-content">
                  <h3>Kawaii Pink</h3>
                  <p>Soft pink tones for everyday cuteness</p>
                </div>
              </div>
              <div class="lookbook-item">
                <img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=600&fit=crop" alt="Natural Glow Look" class="lookbook-img">
                <div class="lookbook-content">
                  <h3>Natural Glow</h3>
                  <p>Effortless radiance for busy mornings</p>
                </div>
              </div>
            </div>
          </section>
          
          <!-- Beauty Products Grid -->
          <section class="beauty-products">
            <h2 class="section-title">All Beauty Products</h2>
            <div class="beauty-products-grid" id="beautyProductsGrid">
              <!-- Products will be dynamically generated -->
            </div>
          </section>
        </div>
      </div>
      
      <div class="about-page" id="aboutPage">
        <div class="about-container">
          <!-- About Hero Section -->
          <section class="about-hero">
            <div class="about-hero-content">
              <h1 class="about-title">About NANA</h1>
              <p class="about-motto">"Living as yourself is the most beautiful thing"</p>
            </div>
            <div class="about-hero-visual">
              <div class="philosophy-bubble">
                <span class="bubble-text">Express</span>
              </div>
              <div class="philosophy-bubble">
                <span class="bubble-text">Believe</span>
              </div>
              <div class="philosophy-bubble">
                <span class="bubble-text">Shine</span>
              </div>
            </div>
          </section>
          
          <!-- Brand Philosophy -->
          <section class="brand-philosophy">
            <div class="philosophy-grid">
              <div class="philosophy-card main">
                <div class="philosophy-icon">✨</div>
                <h3>Express Your Inner Self</h3>
                <p>Fashion is your voice without words. Every piece you choose, every style you create, is a reflection of your inner world brought to light. Through fashion, we complete ourselves by showing who we truly are.</p>
              </div>
              <div class="philosophy-card">
                <div class="philosophy-icon">🌸</div>
                <h3>No Need to Hide</h3>
                <p>When you feel uncertain or want to disappear, remember that expressing your authentic self through fashion is an act of courage. You don't need to hide - the world needs your unique beauty.</p>
              </div>
              <div class="philosophy-card">
                <div class="philosophy-icon">💝</div>
                <h3>Authentic Beauty</h3>
                <p>True beauty isn't about perfection - it's about authenticity. When you dress as yourself, live as yourself, and love as yourself, you create the most beautiful version of who you're meant to be.</p>
              </div>
            </div>
          </section>
          
          <!-- Brand Story -->
          <section class="brand-story">
            <div class="story-content">
              <div class="story-text">
                <h2 class="story-title">Our Story</h2>
                <p class="story-paragraph">
                  NANA was born from a simple belief: fashion should make you feel like the most authentic version of yourself. In a world that often tells us to conform, we believe that showing your true colors through style is a revolutionary act of self-love.
                </p>
                <p class="story-paragraph">
                  Our kawaii minimalism philosophy combines the joy of Japanese kawaii culture with the elegance of minimalist design. We create pieces that whisper rather than shout, that comfort rather than constrain, that celebrate your individuality in the most beautiful way.
                </p>
                <p class="story-paragraph">
                  Every item in our collection is carefully curated to help you tell your story. Because when you wear something that truly represents you, you're not just getting dressed - you're practicing self-expression as an art form.
                </p>
              </div>
              <div class="story-visual">
                <div class="floating-elements">
                  <div class="float-element cherry">🌸</div>
                  <div class="float-element heart">💕</div>
                  <div class="float-element star">⭐</div>
                  <div class="float-element cloud">☁️</div>
                </div>
              </div>
            </div>
          </section>
          
          <!-- Values Section -->
          <section class="brand-values">
            <h2 class="section-title">What We Believe</h2>
            <div class="values-grid">
              <div class="value-item">
                <h4>Editorial First</h4>
                <p>Content leads commerce. Every piece tells a story before it asks for a purchase.</p>
              </div>
              <div class="value-item">
                <h4>Seasonal Narrative</h4>
                <p>Each season brings new stories, colors, and emotions to explore through fashion.</p>
              </div>
              <div class="value-item">
                <h4>Kawaii Minimalism</h4>
                <p>Cute doesn't have to be cluttered. We find beauty in simplicity with a touch of sweetness.</p>
              </div>
              <div class="value-item">
                <h4>Discovery Journey</h4>
                <p>Shopping should be an adventure of self-discovery, not a mundane transaction.</p>
              </div>
            </div>
          </section>
          
          <!-- Call to Action -->
          <section class="about-cta">
            <div class="cta-content">
              <h2 class="cta-title">Ready to Express Yourself?</h2>
              <p class="cta-text">Join us in celebrating authentic beauty through fashion. Your unique style is waiting to be discovered.</p>
              <div class="cta-buttons">
                <button class="cta-btn primary" onclick="window.nana.showCollection()">Explore Collection</button>
                <button class="cta-btn secondary" onclick="window.nana.showLifestyle()">Read Our Stories</button>
              </div>
            </div>
          </section>
        </div>
      </div>
      
      <!-- Login/Signup Page -->
      <div class="auth-page" id="authPage">
        <div class="auth-container">
          <div class="auth-tabs">
            <button class="auth-tab active" data-tab="login">로그인</button>
            <button class="auth-tab" data-tab="signup">회원가입</button>
          </div>
          
          <div class="auth-form-container">
            <!-- Login Form -->
            <form class="auth-form active" id="loginForm">
              <h2 class="auth-title">Welcome Back</h2>
              <p class="auth-subtitle">나나에서 당신만의 스타일을 계속 탐색해보세요</p>
              
              <div class="form-group">
                <input type="email" id="loginEmail" placeholder="이메일" required>
                <span class="form-icon">📧</span>
              </div>
              
              <div class="form-group">
                <input type="password" id="loginPassword" placeholder="비밀번호" required>
                <span class="form-icon">🔒</span>
              </div>
              
              <div class="form-options">
                <label class="checkbox-label">
                  <input type="checkbox" id="rememberMe">
                  <span class="checkmark"></span>
                  로그인 유지
                </label>
                <a href="#" class="forgot-link">비밀번호 찾기</a>
              </div>
              
              <button type="submit" class="auth-btn primary">로그인</button>
              
              <div class="social-login">
                <p>또는 소셜 로그인</p>
                <div class="social-buttons">
                  <button type="button" class="social-btn google">Google</button>
                  <button type="button" class="social-btn kakao">Kakao</button>
                </div>
              </div>
            </form>
            
            <!-- Signup Form -->
            <form class="auth-form" id="signupForm">
              <h2 class="auth-title">Join NANA</h2>
              <p class="auth-subtitle">나만의 스타일 여정을 시작해보세요</p>
              
              <div class="form-group">
                <input type="text" id="signupName" placeholder="이름" required>
                <span class="form-icon">👤</span>
              </div>
              
              <div class="form-group">
                <input type="email" id="signupEmail" placeholder="이메일" required>
                <span class="form-icon">📧</span>
              </div>
              
              <div class="form-group">
                <input type="password" id="signupPassword" placeholder="비밀번호 (8자 이상)" required>
                <span class="form-icon">🔒</span>
              </div>
              
              <div class="form-group">
                <input type="password" id="confirmPassword" placeholder="비밀번호 확인" required>
                <span class="form-icon">🔒</span>
              </div>
              
              <div class="form-options">
                <label class="checkbox-label">
                  <input type="checkbox" id="agreeTerms" required>
                  <span class="checkmark"></span>
                  <span>이용약관 및 개인정보처리방침에 동의합니다</span>
                </label>
              </div>
              
              <button type="submit" class="auth-btn primary">회원가입</button>
              
              <div class="social-login">
                <p>또는 소셜 회원가입</p>
                <div class="social-buttons">
                  <button type="button" class="social-btn google">Google</button>
                  <button type="button" class="social-btn kakao">Kakao</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <!-- MyPage -->
      <div class="mypage" id="myPage">
        <div class="mypage-container">
          <div class="mypage-header">
            <div class="user-info">
              <div class="user-avatar">
                <div class="avatar-placeholder">👤</div>
              </div>
              <div class="user-details">
                <h2 class="user-name" id="userName">사용자 이름</h2>
                <p class="user-email" id="userEmail">user@example.com</p>
                <span class="membership-badge">NANA Member</span>
              </div>
            </div>
            <button class="logout-btn" onclick="window.nana.logout()">로그아웃</button>
          </div>
          
          <div class="mypage-nav">
            <button class="mypage-tab active" data-tab="cart">장바구니</button>
            <button class="mypage-tab" data-tab="orders">주문내역</button>
            <button class="mypage-tab" data-tab="wishlist">찜한 상품</button>
            <button class="mypage-tab" data-tab="profile">프로필 설정</button>
          </div>
          
          <div class="mypage-content">
            <!-- Cart Tab -->
            <div class="mypage-tab-content active" id="cartTab">
              <div class="cart-section">
                <h3 class="section-title">장바구니 <span class="cart-count" id="cartItemsCount">0</span></h3>
                <div class="cart-items" id="cartItemsList">
                  <div class="empty-cart">
                    <div class="empty-icon">🛍️</div>
                    <p>장바구니가 비어있습니다</p>
                    <button class="shop-now-btn" onclick="window.nana.showCollection()">쇼핑하러 가기</button>
                  </div>
                </div>
                <div class="cart-summary" id="cartSummary" style="display: none;">
                  <div class="summary-row">
                    <span>상품 합계</span>
                    <span id="subtotal">¥0</span>
                  </div>
                  <div class="summary-row">
                    <span>배송비</span>
                    <span>¥500</span>
                  </div>
                  <div class="summary-row total">
                    <span>총 결제금액</span>
                    <span id="totalAmount">¥500</span>
                  </div>
                  <button class="checkout-btn">결제하기</button>
                </div>
              </div>
            </div>
            
            <!-- Orders Tab -->
            <div class="mypage-tab-content" id="ordersTab">
              <div class="orders-section">
                <h3 class="section-title">주문내역</h3>
                <div class="orders-list" id="ordersList">
                  <div class="empty-orders">
                    <div class="empty-icon">📦</div>
                    <p>주문내역이 없습니다</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Wishlist Tab -->
            <div class="mypage-tab-content" id="wishlistTab">
              <div class="wishlist-section">
                <h3 class="section-title">찜한 상품</h3>
                <div class="wishlist-items" id="wishlistItems">
                  <div class="empty-wishlist">
                    <div class="empty-icon">💖</div>
                    <p>찜한 상품이 없습니다</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Profile Tab -->
            <div class="mypage-tab-content" id="profileTab">
              <div class="profile-section">
                <h3 class="section-title">프로필 설정</h3>
                <form class="profile-form">
                  <div class="form-group">
                    <label>이름</label>
                    <input type="text" id="profileName" placeholder="이름을 입력하세요">
                  </div>
                  <div class="form-group">
                    <label>이메일</label>
                    <input type="email" id="profileEmail" placeholder="이메일을 입력하세요">
                  </div>
                  <div class="form-group">
                    <label>전화번호</label>
                    <input type="tel" id="profilePhone" placeholder="전화번호를 입력하세요">
                  </div>
                  <div class="form-group">
                    <label>주소</label>
                    <input type="text" id="profileAddress" placeholder="주소를 입력하세요">
                  </div>
                  <button type="submit" class="save-profile-btn">저장하기</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="lifestyle-page" id="lifestylePage">
        <div class="lifestyle-container">
          <!-- Lifestyle Header -->
          <section class="lifestyle-header">
            <h1 class="lifestyle-title">Lifestyle</h1>
            <p class="lifestyle-subtitle">Stories, inspiration & the art of kawaii living</p>
          </section>
          
          <!-- Featured Article Hero -->
          <section class="featured-article">
            <div class="featured-content">
              <img src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1200&h=800&fit=crop" alt="Featured Article" class="featured-image">
              <div class="featured-overlay">
                <span class="article-category">LIFESTYLE</span>
                <h2 class="featured-title">The Art of Slow Living: Finding Beauty in Everyday Moments</h2>
                <p class="featured-excerpt">
                  Discover how Japanese minimalism and kawaii culture blend to create a lifestyle 
                  that celebrates simplicity while finding joy in the smallest details.
                </p>
                <div class="article-meta">
                  <span class="author">By NANA Editorial</span>
                  <span class="date">March 15, 2025</span>
                  <span class="read-time">5 min read</span>
                </div>
                <button class="read-article-btn">Read Article</button>
              </div>
            </div>
          </section>
          
          <!-- Magazine Grid -->
          <section class="magazine-grid">
            <div class="grid-container" id="lifestyleGrid">
              <!-- Articles will be dynamically generated -->
            </div>
          </section>
          
          <!-- Categories Filter -->
          <section class="lifestyle-categories">
            <div class="category-tabs">
              <button class="category-tab active" data-category="all">All Stories</button>
              <button class="category-tab" data-category="fashion">Fashion</button>
              <button class="category-tab" data-category="beauty">Beauty</button>
              <button class="category-tab" data-category="home">Home & Decor</button>
              <button class="category-tab" data-category="travel">Travel</button>
              <button class="category-tab" data-category="food">Food & Cafe</button>
            </div>
          </section>
        </div>
      </div>
      
      <div class="magazine-viewer" id="magazineViewer">
        <div class="magazine-container">
          <div class="magazine-spread" id="magazineSpread">
            <div class="page page-left">
              <h2 class="feature-title">Spring Romance</h2>
              <p class="feature-subtitle">Cherry blossom season, the beginning of new love</p>
              <div class="editorial-text">
                This spring, pastel colors paint the city. Celebrate the beginning of a new season
                with gentle color combinations that blend cherry blossom pink and sky blue.
                Here are the must-have items carefully selected by the NANA editorial team.
              </div>
              <div class="product-tags">
                <span class="product-tag">Pastel Knit ¥8,900</span>
                <span class="product-tag">Pleated Skirt ¥12,800</span>
                <span class="product-tag">Canvas Bag ¥6,500</span>
              </div>
              <span class="page-number">p.24</span>
            </div>
            <div class="page page-right">
              <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1200&fit=crop" alt="Fashion" class="fashion-image">
              <button class="shop-this-look">Shop This Look</button>
              <span class="page-number">p.25</span>
            </div>
          </div>
        </div>
        
        <div class="page-controls">
          <button class="page-control-btn" id="prevPage">←</button>
          <div class="page-indicator">
            <span id="pageIndicator">24-25 / 100</span>
          </div>
          <button class="page-control-btn" id="nextPage">→</button>
        </div>
      </div>
    `;
    
    const root = document.getElementById('root');
    root.insertAdjacentHTML('beforeend', magazineHTML);
  }
  
  async setupShoppingContent() {
    const products = await this.generateProducts();
    const productCards = products.map(product => this.createProductCard(product)).join('');
    
    const shoppingHTML = `
      <div class="shopping-mode" id="shoppingMode">
        <div class="product-grid" id="productGrid">
          ${productCards}
        </div>
      </div>
      
      <div class="cart-bubble" id="cartBubble">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <path d="M9 2L12 2L15 2L19 9L19 20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22L7 22C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20L5 9L9 2Z"/>
          <path d="M9 2L9 9"/>
          <path d="M15 2L15 9"/>
        </svg>
        <span class="cart-count" id="cartCount">0</span>
      </div>
    `;
    
    const root = document.getElementById('root');
    root.insertAdjacentHTML('beforeend', shoppingHTML);
  }
  
  async generateProducts() {
    try {
      // Fetch products from backend API
      const response = await fetch('http://localhost:5001/api/products');
      const data = await response.json();
      
      if (data.status === 'success') {
        const products = data.data.products.map(product => ({
          id: parseInt(product.id),
          name: product.name,
          price: product.price,
          image: product.images[0],
          badge: product.badge,
          sizeClass: product.isFeatured ? 'size-l' : 'size-m',
          colors: product.colors || this.generateRandomColors(),
          category: product.category,
          type: product.type,
          description: product.description
        }));
        return products;
      }
    } catch (error) {
      console.error('Failed to fetch products from API, using fallback data:', error);
    }
    
    // Fallback to local data if API fails
    const products = [];
    const sizes = ['size-s', 'size-m', 'size-l', 'size-xl'];
    const names = [
      'Sakura Pink Knit', 'Sky Blue Dress', 'Pearl White Blouse',
      'Lavender Cardigan', 'Mint Green Skirt', 'Rose Gold Accessories',
      'Cherry Blossom Perfume', 'Pastel Nail Polish', 'Spring Canvas Bag',
      'Fluffy Cloud Sneakers', 'Rainbow Highlighter', 'Dreamy Eye Shadow',
      'Cotton Candy Lip Gloss', 'Morning Dew Moisturizer', 'Sunset Glow Serum'
    ];
    
    for (let i = 0; i < 30; i++) {
      const sizeClass = i < 2 ? 'size-xl' : i < 5 ? 'size-l' : sizes[Math.floor(Math.random() * sizes.length)];
      products.push({
        id: i + 1,
        name: names[i % names.length],
        price: Math.floor(Math.random() * 20000) + 5000,
        image: `https://picsum.photos/400/600?random=${i}`,
        badge: i < 5 ? 'NEW' : i < 8 ? 'BEST' : null,
        sizeClass: sizeClass,
        colors: this.generateRandomColors()
      });
    }
    
    return products;
  }
  
  generateRandomColors() {
    const colors = ['#FFB7C5', '#87CEEB', '#E6E6FA', '#98FB98', '#FADADD'];
    const count = Math.floor(Math.random() * 3) + 2;
    return colors.slice(0, count);
  }

  async showProductDetail(productId) {
    console.log('showProductDetail called with ID:', productId);
    const product = await this.findProductById(productId);
    console.log('Found product:', product);
    if (!product) {
      console.error('Product not found with ID:', productId);
      alert(`상품을 찾을 수 없습니다. ID: ${productId}`);
      return;
    }

    const modalHTML = `
      <div class="product-modal-overlay" id="productModal" onclick="window.nana.closeProductDetail(event)">
        <div class="product-modal" onclick="event.stopPropagation()">
          <button class="modal-close" onclick="window.nana.closeProductDetail()">&times;</button>
          <div class="modal-content">
            <div class="modal-image-section">
              <img src="${product.image}" alt="${product.name}" class="modal-product-image">
              <div class="modal-image-thumbnails">
                <img src="${product.image}" alt="View 1" class="thumbnail active">
                <img src="${product.image}?variant=2" alt="View 2" class="thumbnail">
                <img src="${product.image}?variant=3" alt="View 3" class="thumbnail">
              </div>
            </div>
            <div class="modal-info-section">
              <div class="modal-badge-section">
                ${product.badge ? `<span class="modal-badge">${product.badge}</span>` : ''}
              </div>
              <h2 class="modal-product-name">${product.name}</h2>
              <div class="modal-price">¥${product.price.toLocaleString()}</div>
              
              <div class="modal-description">
                <p>上質な素材を使用した、春にぴったりのアイテム。シンプルながらも洗練されたデザインで、様々なシーンでご着用いただけます。</p>
              </div>
              
              <div class="modal-colors">
                <h4>カラー</h4>
                <div class="color-options">
                  ${product.colors.map(color => 
                    `<button class="color-option" style="background: ${color}"></button>`
                  ).join('')}
                </div>
              </div>
              
              <div class="modal-sizes">
                <h4>サイズ</h4>
                <div class="size-options">
                  <button class="size-option">S</button>
                  <button class="size-option">M</button>
                  <button class="size-option active">L</button>
                  <button class="size-option">XL</button>
                </div>
              </div>
              
              <div class="modal-quantity">
                <h4>数量</h4>
                <div class="quantity-controls">
                  <button class="quantity-btn" onclick="window.nana.updateModalQuantity(-1)">-</button>
                  <input type="number" class="quantity-input" id="modalQuantity" value="1" min="1">
                  <button class="quantity-btn" onclick="window.nana.updateModalQuantity(1)">+</button>
                </div>
              </div>
              
              <div class="modal-actions">
                <button class="add-to-cart-btn" onclick="window.nana.addToCartFromModal('${product.id}')">
                  カートに追加
                </button>
                <button class="buy-now-btn">
                  今すぐ購入
                </button>
              </div>
              
              <div class="product-details">
                <div class="detail-section">
                  <h4>商品詳細</h4>
                  <ul>
                    <li>素材: コットン100%</li>
                    <li>原産国: 日本</li>
                    <li>洗濯: 手洗い可</li>
                    <li>モデル身長: 165cm (Lサイズ着用)</li>
                  </ul>
                </div>
                
                <div class="detail-section">
                  <h4>サイズ詳細</h4>
                  <table class="size-chart">
                    <tr><th>サイズ</th><th>着丈</th><th>胸囲</th><th>袖丈</th></tr>
                    <tr><td>S</td><td>60cm</td><td>88cm</td><td>58cm</td></tr>
                    <tr><td>M</td><td>62cm</td><td>92cm</td><td>59cm</td></tr>
                    <tr><td>L</td><td>64cm</td><td>96cm</td><td>60cm</td></tr>
                    <tr><td>XL</td><td>66cm</td><td>100cm</td><td>61cm</td></tr>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.body.style.overflow = 'hidden';
    
    // Add event listeners for color and size selection
    this.setupModalInteractions();
  }

  closeProductDetail(event) {
    if (event && event.target !== event.currentTarget) return;
    const modal = document.getElementById('productModal');
    if (modal) {
      modal.remove();
      document.body.style.overflow = '';
    }
  }

  updateModalQuantity(change) {
    const quantityInput = document.getElementById('modalQuantity');
    const currentValue = parseInt(quantityInput.value);
    const newValue = Math.max(1, currentValue + change);
    quantityInput.value = newValue;
  }

  setupModalInteractions() {
    // Color selection
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
      option.addEventListener('click', () => {
        colorOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
      });
    });
    
    // Size selection
    const sizeOptions = document.querySelectorAll('.size-option');
    sizeOptions.forEach(option => {
      option.addEventListener('click', () => {
        sizeOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
      });
    });
    
    // Thumbnail selection
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.querySelector('.modal-product-image');
    
    thumbnails.forEach(thumbnail => {
      thumbnail.addEventListener('click', () => {
        thumbnails.forEach(thumb => thumb.classList.remove('active'));
        thumbnail.classList.add('active');
        mainImage.src = thumbnail.src.replace(/\?variant=\d+/, '');
      });
    });
  }

  addToCartFromModal(productId) {
    const quantityInput = document.getElementById('modalQuantity');
    const quantity = parseInt(quantityInput.value);
    const selectedColor = document.querySelector('.color-option.selected')?.style.background || 'default';
    const selectedSize = document.querySelector('.size-option.active')?.textContent || 'L';
    
    for (let i = 0; i < quantity; i++) {
      this.addToCart(productId, selectedSize, selectedColor);
    }
    
    this.closeProductDetail();
    this.showCartNotification(`${quantity}個の商品をカートに追加しました`);
  }
  
  createProductCard(product) {
    const badgeHTML = product.badge ? `<span class="product-badge">${product.badge}</span>` : '';
    const colorsHTML = product.colors.map(color => 
      `<span class="color-dot" style="background: ${color}"></span>`
    ).join('');
    
    return `
      <div class="product-card ${product.sizeClass}" data-id="${product.id}" onclick="window.nana.showProductDetail('${product.id}')">
        <div class="product-image-wrapper">
          <img src="${product.image}" alt="${product.name}" class="product-image">
          ${badgeHTML}
          <button class="quick-add-btn" data-product-id="${product.id}" onclick="event.stopPropagation(); window.nana.addToCart('${product.id}')">+</button>
        </div>
        <div class="product-info">
          <h3 class="product-name">${product.name}</h3>
          <p class="product-price">¥${product.price.toLocaleString()}</p>
          <div class="product-colors">${colorsHTML}</div>
        </div>
      </div>
    `;
  }
  
  
  setup3DBubbles() {
    const canvas = document.getElementById('bubbleCanvas');
    const heroSection = document.getElementById('heroSection');
    if (!canvas || !heroSection) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      canvas, 
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    
    // Set canvas size to hero section size, not full window
    const heroRect = heroSection.getBoundingClientRect();
    renderer.setSize(heroRect.width, heroRect.height);
    camera.position.z = 5;
    
    const bubbleGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const bubbleMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xFFB7C5,
      transparent: true,
      opacity: 0.3,
      roughness: 0,
      metalness: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0,
    });
    
    for (let i = 0; i < 15; i++) {
      const bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial.clone());
      bubble.position.x = (Math.random() - 0.5) * 10;
      bubble.position.y = (Math.random() - 0.5) * 10;
      bubble.position.z = (Math.random() - 0.5) * 5;
      bubble.scale.setScalar(Math.random() * 0.5 + 0.5);
      
      const color = Math.random() > 0.5 ? 0xFFB7C5 : 0x87CEEB;
      bubble.material.color.setHex(color);
      
      scene.add(bubble);
      this.bubbles.push({
        mesh: bubble,
        speedX: (Math.random() - 0.5) * 0.01,
        speedY: Math.random() * 0.01 + 0.005,
        speedZ: (Math.random() - 0.5) * 0.01
      });
    }
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    const animate = () => {
      requestAnimationFrame(animate);
      
      this.bubbles.forEach(bubble => {
        bubble.mesh.position.x += bubble.speedX;
        bubble.mesh.position.y += bubble.speedY;
        bubble.mesh.position.z += bubble.speedZ;
        
        bubble.mesh.rotation.x += 0.001;
        bubble.mesh.rotation.y += 0.002;
        
        if (bubble.mesh.position.y > 6) {
          bubble.mesh.position.y = -6;
        }
        if (Math.abs(bubble.mesh.position.x) > 6) {
          bubble.speedX *= -1;
        }
      });
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    window.addEventListener('resize', () => {
      const heroRect = heroSection.getBoundingClientRect();
      camera.aspect = heroRect.width / heroRect.height;
      camera.updateProjectionMatrix();
      renderer.setSize(heroRect.width, heroRect.height);
    });
    
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
      
      this.bubbles.forEach((bubble, i) => {
        const offsetX = mouseX * 0.5 * (i % 3 + 1) * 0.3;
        const offsetY = mouseY * 0.5 * (i % 3 + 1) * 0.3;
        
        gsap.to(bubble.mesh.position, {
          x: bubble.mesh.position.x + offsetX,
          y: bubble.mesh.position.y + offsetY,
          duration: 2,
          ease: "power2.out"
        });
      });
    });
  }
  
  setupEventListeners() {
    const navLogo = document.getElementById('navLogo');
    if (navLogo) {
      navLogo.addEventListener('click', (e) => {
        e.preventDefault();
        this.returnToHome();
      });
    }
    
    // Navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      if (link.textContent === 'COLLECTION') {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          this.showCollection();
        });
      } else if (link.textContent === 'BEAUTY') {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          this.showBeauty();
        });
      } else if (link.textContent === 'LIFESTYLE') {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          this.showLifestyle();
        });
      } else if (link.textContent === 'ABOUT') {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          this.showAbout();
        });
      }
    });
    
    const openMagazineBtn = document.getElementById('openMagazine');
    if (openMagazineBtn) {
      openMagazineBtn.addEventListener('click', () => {
        this.openMagazine();
      });
    }
    
    const modeToggle = document.getElementById('modeToggle');
    if (modeToggle) {
      modeToggle.addEventListener('click', () => {
        this.toggleMode();
      });
    }
    
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    
    if (prevPageBtn) {
      prevPageBtn.addEventListener('click', () => this.changePage(-1));
    }
    
    if (nextPageBtn) {
      nextPageBtn.addEventListener('click', () => this.changePage(1));
    }
    
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('quick-add-btn')) {
        this.addToCart(e.target.dataset.productId);
      }
      
      if (e.target.classList.contains('shop-this-look')) {
        this.mode = 'magazine';
        this.toggleMode();
      }
    });
    
    this.setupSwipeGestures();
  }
  
  setupSwipeGestures() {
    let touchStartX = 0;
    let touchEndX = 0;
    
    const magazineSpread = document.getElementById('magazineSpread');
    if (!magazineSpread) return;
    
    magazineSpread.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });
    
    magazineSpread.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    });
    
    const handleSwipe = () => {
      if (touchEndX < touchStartX - 50) {
        this.changePage(1);
      }
      if (touchEndX > touchStartX + 50) {
        this.changePage(-1);
      }
    };
  }
  
  returnToHome() {
    const heroSection = document.getElementById('heroSection');
    const magazineViewer = document.getElementById('magazineViewer');
    const shoppingMode = document.getElementById('shoppingMode');
    const collectionPage = document.getElementById('collectionPage');
    const beautyPage = document.getElementById('beautyPage');
    const lifestylePage = document.getElementById('lifestylePage');
    const modeToggle = document.getElementById('modeToggle');
    
    // Reset to magazine mode
    this.mode = 'magazine';
    this.currentPage = 0;
    if (modeToggle) {
      modeToggle.textContent = 'Shop Mode';
    }
    
    // Hide all sections
    if (magazineViewer) magazineViewer.classList.remove('active');
    if (shoppingMode) shoppingMode.classList.remove('active');
    if (collectionPage) collectionPage.classList.remove('active');
    if (beautyPage) beautyPage.classList.remove('active');
    if (lifestylePage) lifestylePage.classList.remove('active');
    const aboutPage = document.getElementById('aboutPage');
    if (aboutPage) aboutPage.classList.remove('active');
    
    // Show hero section
    if (heroSection) {
      heroSection.style.display = 'flex';
      gsap.from(heroSection, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: "power2.out"
      });
    }
  }
  
  showCollection() {
    const heroSection = document.getElementById('heroSection');
    const magazineViewer = document.getElementById('magazineViewer');
    const shoppingMode = document.getElementById('shoppingMode');
    const collectionPage = document.getElementById('collectionPage');
    const beautyPage = document.getElementById('beautyPage');
    const lifestylePage = document.getElementById('lifestylePage');
    
    // Hide other sections
    if (heroSection) heroSection.style.display = 'none';
    if (magazineViewer) magazineViewer.classList.remove('active');
    if (shoppingMode) shoppingMode.classList.remove('active');
    if (beautyPage) beautyPage.classList.remove('active');
    if (lifestylePage) lifestylePage.classList.remove('active');
    const aboutPage = document.getElementById('aboutPage');
    if (aboutPage) aboutPage.classList.remove('active');
    
    // Show collection page
    if (collectionPage) {
      collectionPage.classList.add('active');
      this.populateCollectionProducts();
      
      // Animate entrance
      gsap.from('.collection-header', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power2.out"
      });
      
      // Animate editorial section
      gsap.from('.featured-editorial', {
        opacity: 0,
        y: 50,
        duration: 1,
        delay: 0.3,
        ease: "power2.out"
      });
      
      gsap.from('.feature-image-wrapper', {
        opacity: 0,
        scale: 0.95,
        duration: 0.8,
        delay: 0.5,
        ease: "power2.out"
      });
      
      gsap.from('.feature-content > *', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.1,
        delay: 0.7,
        ease: "power2.out"
      });
      
      gsap.from('.mini-feature', {
        opacity: 0,
        x: 30,
        duration: 0.6,
        stagger: 0.2,
        delay: 0.9,
        ease: "power2.out"
      });
      
      gsap.from('.editorial-quote', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 1.1,
        ease: "power2.out"
      });
      
      // Animate product cards
      setTimeout(() => {
        gsap.from('.collection-product-card', {
          opacity: 0,
          y: 30,
          duration: 0.6,
          stagger: 0.05,
          delay: 0.2,
          ease: "power2.out"
        });
      }, 100);
    }
  }
  
  showBeauty() {
    const heroSection = document.getElementById('heroSection');
    const magazineViewer = document.getElementById('magazineViewer');
    const shoppingMode = document.getElementById('shoppingMode');
    const collectionPage = document.getElementById('collectionPage');
    const beautyPage = document.getElementById('beautyPage');
    const lifestylePage = document.getElementById('lifestylePage');
    
    // Hide other sections
    if (heroSection) heroSection.style.display = 'none';
    if (magazineViewer) magazineViewer.classList.remove('active');
    if (shoppingMode) shoppingMode.classList.remove('active');
    if (collectionPage) collectionPage.classList.remove('active');
    if (lifestylePage) lifestylePage.classList.remove('active');
    const aboutPage = document.getElementById('aboutPage');
    if (aboutPage) aboutPage.classList.remove('active');
    
    // Show beauty page
    if (beautyPage) {
      beautyPage.classList.add('active');
      console.log('Beauty page activated'); // Debug log
      
      this.populateBeautyProducts();
      this.setupBeautyFilters();
      
      // Animate entrance
      gsap.from('.beauty-header', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power2.out"
      });
      
      gsap.from('.hero-product', {
        opacity: 0,
        scale: 0.95,
        duration: 0.8,
        delay: 0.2,
        ease: "power2.out"
      });
      
      gsap.from('.hero-lookbook, .hero-tips', {
        opacity: 0,
        y: 40,
        duration: 0.6,
        stagger: 0.1,
        delay: 0.4,
        ease: "power2.out"
      });
      
      gsap.from('.lookbook-item', {
        opacity: 0,
        y: 50,
        duration: 0.6,
        stagger: 0.1,
        delay: 0.8,
        ease: "power2.out"
      });
    }
  }
  
  showLifestyle() {
    const heroSection = document.getElementById('heroSection');
    const magazineViewer = document.getElementById('magazineViewer');
    const shoppingMode = document.getElementById('shoppingMode');
    const collectionPage = document.getElementById('collectionPage');
    const beautyPage = document.getElementById('beautyPage');
    const lifestylePage = document.getElementById('lifestylePage');
    
    // Hide other sections
    if (heroSection) heroSection.style.display = 'none';
    if (magazineViewer) magazineViewer.classList.remove('active');
    if (shoppingMode) shoppingMode.classList.remove('active');
    if (collectionPage) collectionPage.classList.remove('active');
    if (beautyPage) beautyPage.classList.remove('active');
    
    // Show lifestyle page
    if (lifestylePage) {
      lifestylePage.classList.add('active');
      this.populateLifestyleArticles();
      this.setupLifestyleFilters();
      
      // Animate entrance
      gsap.from('.lifestyle-header', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power2.out"
      });
      
      gsap.from('.featured-article', {
        opacity: 0,
        scale: 0.98,
        duration: 1,
        delay: 0.2,
        ease: "power2.out"
      });
      
      gsap.from('.article-card', {
        opacity: 0,
        y: 50,
        duration: 0.6,
        stagger: 0.1,
        delay: 0.8,
        ease: "power2.out"
      });
    }
  }
  
  populateCollectionProducts() {
    console.log('populateCollectionProducts called'); // Debug log
    const grid = document.getElementById('collectionProductsGrid');
    console.log('Collection grid element:', grid); // Debug log
    if (!grid) {
      console.error('Collection grid not found!');
      return;
    }
    
    const products = this.generateCollectionProducts();
    console.log('Generated products:', products); // Debug log
    const productCards = products.map(product => this.createCollectionProductCard(product)).join('');
    console.log('Product cards HTML length:', productCards.length); // Debug log
    grid.innerHTML = productCards;
    console.log('Grid innerHTML set, children count:', grid.children.length); // Debug log
    
    // First make sure cards are visible immediately
    setTimeout(() => {
      const cards = document.querySelectorAll('.collection-product-card');
      console.log('Found collection cards:', cards.length); // Debug log
      
      cards.forEach(card => {
        card.style.opacity = '1';
        card.style.display = 'block';
      });
      
      // Animate them in
      gsap.from('.collection-product-card', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.05,
        delay: 0.1,
        ease: "power2.out"
      });
    }, 200);
  }
  
  generateCollectionProducts() {
    const sizes = ['small', 'medium', 'large', 'tall', 'wide'];
    const rotations = ['rotate-left', 'rotate-right', 'no-rotate'];
    const collectionProducts = [
      { id: 101, name: 'Sakura Pink Dress', price: 18900, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=600&fit=crop', badge: 'NEW', size: 'large', rotation: 'rotate-left', colors: ['#FFB7C5', '#FADADD', '#E6E6FA'] },
      { id: 102, name: 'Cloud White Blouse', price: 12400, image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop', size: 'small', rotation: 'no-rotate', colors: ['#F8F8FF', '#E6E6FA', '#87CEEB'] },
      { id: 103, name: 'Morning Sky Cardigan', price: 15600, image: 'https://images.unsplash.com/photo-1588863845063-b4eb8c4ab4eb?w=400&h=600&fit=crop', badge: 'BEST', size: 'tall', rotation: 'no-rotate', colors: ['#87CEEB', '#98FB98', '#FFB7C5'] },
      { id: 104, name: 'Pearl Button Coat', price: 24800, image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop', size: 'wide', rotation: 'rotate-right', colors: ['#F8F8FF', '#FADADD'] },
      { id: 105, name: 'Kawaii Mini Skirt', price: 9800, image: 'https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=400&h=600&fit=crop', size: 'medium', rotation: 'rotate-left', colors: ['#FFB7C5', '#E6E6FA', '#98FB98'] },
      { id: 106, name: 'Pastel Knit Sweater', price: 16500, image: 'https://images.unsplash.com/photo-1566479179817-0e7c6c46d14d?w=400&h=600&fit=crop', badge: 'NEW', size: 'small', rotation: 'no-rotate', colors: ['#FADADD', '#87CEEB', '#FFB7C5'] },
      { id: 107, name: 'Dream Tulle Dress', price: 22300, image: 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=400&h=600&fit=crop', size: 'large', rotation: 'rotate-right', colors: ['#E6E6FA', '#FFB7C5', '#98FB98'] },
      { id: 108, name: 'Minimalist Blazer', price: 19700, image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=600&fit=crop', size: 'medium', rotation: 'no-rotate', colors: ['#F8F8FF', '#E6E6FA'] },
      { id: 109, name: 'Ethereal Chiffon Top', price: 14200, image: 'https://images.unsplash.com/photo-1551803091-e20673f15770?w=400&h=600&fit=crop', size: 'tall', rotation: 'rotate-left', colors: ['#FADADD', '#87CEEB', '#E6E6FA'] },
      { id: 110, name: 'Vintage Denim Jacket', price: 21800, image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=400&h=600&fit=crop', badge: 'VINTAGE', size: 'wide', rotation: 'no-rotate', colors: ['#87CEEB', '#98FB98'] },
      { id: 111, name: 'Silk Midi Skirt', price: 17900, image: 'https://images.unsplash.com/photo-1583496661160-fb5886a13d91?w=400&h=600&fit=crop', size: 'small', rotation: 'rotate-right', colors: ['#FFB7C5', '#FADADD', '#E6E6FA'] },
      { id: 112, name: 'Cashmere Sweater', price: 28500, image: 'https://images.unsplash.com/photo-1619701669995-b8ad299c752b?w=400&h=600&fit=crop', badge: 'LUXURY', size: 'medium', rotation: 'rotate-left', colors: ['#FADADD', '#E6E6FA', '#F8F8FF'] }
    ];
    
    return collectionProducts;
  }
  
  createCollectionProductCard(product) {
    const badgeHTML = product.badge ? `<span class="collection-product-badge">${product.badge}</span>` : '';
    
    return `
      <div class="collection-product-card ${product.size} ${product.rotation}" data-id="${product.id}" onclick="window.nana.showProductDetail('${product.id}')">
        <div class="collection-product-image-wrapper">
          <img src="${product.image}" alt="${product.name}" class="collection-product-image">
          ${badgeHTML}
          <button class="collection-quick-add-btn" data-product-id="${product.id}" onclick="event.stopPropagation(); window.nana.addToCart('${product.id}')">+</button>
        </div>
        <div class="collection-product-info">
          <h3 class="collection-product-name">${product.name}</h3>
          <p class="collection-product-price">¥${product.price.toLocaleString()}</p>
        </div>
      </div>
    `;
  }
  
  populateBeautyProducts() {
    console.log('populateBeautyProducts called'); // Debug log
    const grid = document.getElementById('beautyProductsGrid');
    console.log('Beauty grid element:', grid); // Debug log
    if (!grid) {
      console.error('Beauty grid not found!');
      return;
    }
    
    const products = this.generateBeautyProducts();
    this.beautyProducts = products; // Store for filtering
    console.log('Generated beauty products:', products); // Debug log
    const productCards = products.map(product => this.createBeautyProductCard(product)).join('');
    console.log('Beauty product cards HTML length:', productCards.length); // Debug log
    grid.innerHTML = productCards;
    console.log('Beauty grid innerHTML set, children count:', grid.children.length); // Debug log
    
    // First make sure cards are visible
    gsap.set('.beauty-product-card', {
      opacity: 1,
      y: 0
    });
    
    // Then animate them in
    setTimeout(() => {
      gsap.from('.beauty-product-card', {
        opacity: 0,
        y: 30,
        duration: 0.5,
        stagger: 0.05,
        delay: 0.3,
        ease: "power2.out"
      });
    }, 100);
  }
  
  generateBeautyProducts() {
    const beautyProducts = [
      { id: 201, name: 'Sakura Glow Serum', price: 6800, category: 'skincare', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', badge: 'BEST', colors: ['#FFB7C5', '#FADADD'] },
      { id: 202, name: 'Cherry Blossom Lip Tint', price: 2400, category: 'lips', image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop', badge: 'NEW', colors: ['#FFB7C5', '#E6E6FA', '#98FB98'] },
      { id: 203, name: 'Cloud Nine Cushion', price: 4200, category: 'makeup', image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400&h=400&fit=crop', colors: ['#F8F8FF', '#FADADD'] },
      { id: 204, name: 'Kawaii Pink Blush', price: 3600, category: 'makeup', image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=400&fit=crop', colors: ['#FFB7C5', '#FADADD', '#E6E6FA'] },
      { id: 205, name: 'Hydrating Face Mask', price: 1800, category: 'skincare', image: 'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=400&h=400&fit=crop', colors: ['#87CEEB', '#98FB98'] },
      { id: 206, name: 'Glittery Eye Palette', price: 5400, category: 'eyes', image: 'https://images.unsplash.com/photo-1583241800945-9bfd463de64b?w=400&h=400&fit=crop', badge: 'NEW', colors: ['#E6E6FA', '#FFB7C5', '#87CEEB', '#98FB98'] },
      { id: 207, name: 'Vitamin C Toner', price: 2800, category: 'skincare', image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop', colors: ['#FADADD', '#87CEEB'] },
      { id: 208, name: 'Soft Pink Lipstick', price: 3200, category: 'lips', image: 'https://images.unsplash.com/photo-1591360236480-4ed861025fa1?w=400&h=400&fit=crop', colors: ['#FFB7C5', '#FADADD', '#E6E6FA'] },
      { id: 209, name: 'Fluffy Makeup Brushes', price: 4800, category: 'tools', image: 'https://images.unsplash.com/photo-1503236823255-94609f598e71?w=400&h=400&fit=crop', colors: ['#F8F8FF', '#FADADD'] },
      { id: 210, name: 'Dewy Setting Spray', price: 3400, category: 'makeup', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop', colors: ['#87CEEB', '#E6E6FA'] },
      { id: 211, name: 'Gentle Eye Cream', price: 5200, category: 'skincare', image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=400&fit=crop', badge: 'BEST', colors: ['#FADADD', '#F8F8FF'] },
      { id: 212, name: 'Shimmer Eyeshadow', price: 2600, category: 'eyes', image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&h=400&fit=crop', colors: ['#E6E6FA', '#FFB7C5', '#87CEEB'] }
    ];
    
    return beautyProducts;
  }
  
  createBeautyProductCard(product) {
    const badgeHTML = product.badge ? `<span class="beauty-product-badge">${product.badge}</span>` : '';
    
    return `
      <div class="beauty-product-card" data-id="${product.id}" data-category="${product.category}" onclick="window.nana.showProductDetail('${product.id}')">
        <div class="beauty-product-image-wrapper">
          <img src="${product.image}" alt="${product.name}" class="beauty-product-image">
          ${badgeHTML}
          <button class="beauty-quick-add-btn" data-product-id="${product.id}" onclick="event.stopPropagation(); window.nana.addToCart('${product.id}')">+</button>
        </div>
        <div class="beauty-product-info">
          <span class="beauty-category">${this.formatCategory(product.category)}</span>
          <h3 class="beauty-product-name">${product.name}</h3>
          <p class="beauty-product-price">¥${product.price.toLocaleString()}</p>
        </div>
      </div>
    `;
  }
  
  formatCategory(category) {
    const categoryMap = {
      skincare: 'Skincare',
      makeup: 'Makeup',
      lips: 'Lips',
      eyes: 'Eyes',
      tools: 'Tools'
    };
    return categoryMap[category] || category;
  }
  
  setupBeautyFilters() {
    const filterButtons = document.querySelectorAll('.category-btn');
    
    filterButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Remove active class from all buttons
        filterButtons.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        e.target.classList.add('active');
        
        const category = e.target.dataset.category;
        this.filterBeautyProducts(category);
      });
    });
  }
  
  filterBeautyProducts(category) {
    const cards = document.querySelectorAll('.beauty-product-card');
    
    cards.forEach(card => {
      if (category === 'all' || card.dataset.category === category) {
        gsap.to(card, {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        });
        card.style.display = 'block';
      } else {
        gsap.to(card, {
          opacity: 0,
          scale: 0.95,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            card.style.display = 'none';
          }
        });
      }
    });
  }
  
  populateLifestyleArticles() {
    const grid = document.getElementById('lifestyleGrid');
    if (!grid) return;
    
    const articles = this.generateLifestyleArticles();
    this.lifestyleArticles = articles; // Store for filtering
    const articleCards = articles.map(article => this.createArticleCard(article)).join('');
    grid.innerHTML = articleCards;
  }
  
  generateLifestyleArticles() {
    const articles = [
      {
        id: 1,
        title: "5 Ways to Create Your Perfect Morning Routine",
        excerpt: "Start your day with intention and kawaii charm",
        category: "lifestyle",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
        author: "Yuki Tanaka",
        date: "March 20, 2025",
        readTime: "4 min",
        size: "medium"
      },
      {
        id: 2,
        title: "Tokyo Café Guide",
        excerpt: "Hidden gems for coffee lovers",
        category: "food",
        image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=600&fit=crop",
        author: "Mai Sato",
        date: "March 18, 2025",
        readTime: "6 min",
        size: "large"
      },
      {
        id: 3,
        title: "Spring Wardrobe Essentials",
        excerpt: "Minimalist pieces for maximum impact",
        category: "fashion",
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop",
        author: "Sakura Kim",
        date: "March 16, 2025",
        readTime: "3 min",
        size: "small"
      },
      {
        id: 4,
        title: "DIY Skincare with Natural Ingredients",
        excerpt: "Glow up with homemade beauty treatments",
        category: "beauty",
        image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=500&fit=crop",
        author: "Hana Yoshida",
        date: "March 14, 2025",
        readTime: "5 min",
        size: "medium"
      },
      {
        id: 5,
        title: "Creating a Cozy Reading Nook",
        excerpt: "Transform any corner into your sanctuary",
        category: "home",
        image: "https://images.unsplash.com/photo-1481277542470-605612bd2d61?w=500&h=600&fit=crop",
        author: "Emi Nakamura",
        date: "March 12, 2025",
        readTime: "4 min",
        size: "large"
      },
      {
        id: 6,
        title: "Cherry Blossom Season Guide",
        excerpt: "Best spots and hidden locations in Japan",
        category: "travel",
        image: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=600&h=400&fit=crop",
        author: "Kenji Matsuda",
        date: "March 10, 2025",
        readTime: "7 min",
        size: "wide"
      },
      {
        id: 7,
        title: "Minimalist Jewelry Trends",
        excerpt: "Less is more with these delicate pieces",
        category: "fashion",
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop",
        author: "Aiko Suzuki",
        date: "March 8, 2025",
        readTime: "3 min",
        size: "small"
      },
      {
        id: 8,
        title: "Homemade Matcha Treats",
        excerpt: "Sweet recipes for afternoon tea time",
        category: "food",
        image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400&h=500&fit=crop",
        author: "Ryo Takahashi",
        date: "March 6, 2025",
        readTime: "5 min",
        size: "medium"
      }
    ];
    
    return articles;
  }
  
  createArticleCard(article) {
    return `
      <article class="article-card ${article.size}" data-category="${article.category}">
        <div class="article-image-wrapper">
          <img src="${article.image}" alt="${article.title}" class="article-image">
          <div class="article-overlay">
            <span class="article-category-tag">${this.formatCategory(article.category)}</span>
          </div>
        </div>
        <div class="article-content">
          <h3 class="article-title">${article.title}</h3>
          <p class="article-excerpt">${article.excerpt}</p>
          <div class="article-meta">
            <span class="article-author">By ${article.author}</span>
            <span class="article-date">${article.date}</span>
            <span class="article-read-time">${article.readTime} read</span>
          </div>
        </div>
        <div class="read-more-overlay">
          <button class="read-more-btn">Read More</button>
        </div>
      </article>
    `;
  }
  
  setupLifestyleFilters() {
    const filterTabs = document.querySelectorAll('.category-tab');
    
    filterTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        // Remove active class from all tabs
        filterTabs.forEach(t => t.classList.remove('active'));
        // Add active class to clicked tab
        e.target.classList.add('active');
        
        const category = e.target.dataset.category;
        this.filterLifestyleArticles(category);
      });
    });
  }
  
  filterLifestyleArticles(category) {
    const cards = document.querySelectorAll('.article-card');
    
    cards.forEach(card => {
      if (category === 'all' || card.dataset.category === category) {
        gsap.to(card, {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: "power2.out"
        });
        card.style.display = 'block';
      } else {
        gsap.to(card, {
          opacity: 0,
          scale: 0.95,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            card.style.display = 'none';
          }
        });
      }
    });
  }
  
  openMagazine() {
    const heroSection = document.getElementById('heroSection');
    const magazineViewer = document.getElementById('magazineViewer');
    
    gsap.to(heroSection, {
      opacity: 0,
      y: -50,
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => {
        heroSection.style.display = 'none';
        magazineViewer.classList.add('active');
        
        gsap.from(magazineViewer, {
          opacity: 0,
          y: 50,
          duration: 0.8,
          ease: "power2.out"
        });
      }
    });
  }
  
  toggleMode() {
    const modeToggle = document.getElementById('modeToggle');
    const magazineViewer = document.getElementById('magazineViewer');
    const shoppingMode = document.getElementById('shoppingMode');
    const heroSection = document.getElementById('heroSection');
    
    if (this.mode === 'magazine') {
      this.mode = 'shopping';
      modeToggle.textContent = 'Magazine Mode';
      
      if (magazineViewer) magazineViewer.classList.remove('active');
      if (heroSection) heroSection.style.display = 'none';
      shoppingMode.classList.add('active');
      
      gsap.from('.product-card', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.05,
        ease: "power2.out"
      });
    } else {
      this.mode = 'magazine';
      modeToggle.textContent = 'Shop Mode';
      
      shoppingMode.classList.remove('active');
      
      if (this.currentPage === 0) {
        heroSection.style.display = 'flex';
        gsap.from(heroSection, {
          opacity: 0,
          duration: 0.6
        });
      } else {
        magazineViewer.classList.add('active');
      }
    }
  }
  
  changePage(direction) {
    if (this.isAnimating) return;
    
    const newPage = this.currentPage + direction * 2;
    if (newPage < 0 || newPage >= this.totalPages * 2) return;
    
    this.isAnimating = true;
    this.currentPage = newPage;
    
    const magazineSpread = document.getElementById('magazineSpread');
    const pageIndicator = document.getElementById('pageIndicator');
    const pages = magazineSpread.querySelectorAll('.page');
    
    // Create a smooth book-like page turn animation
    const tl = gsap.timeline({
      onComplete: () => {
        // Reset transforms
        gsap.set(magazineSpread, { rotateY: 0, scale: 1 });
        gsap.set(pages, { rotateY: 0, z: 0, opacity: 1 });
        this.updatePageContent();
        this.isAnimating = false;
      }
    });
    
    // Add subtle scale and perspective changes for depth
    tl.to(magazineSpread, {
      scale: 0.95,
      duration: 0.15,
      ease: "power2.out"
    })
    .to(pages, {
      rotateY: direction > 0 ? -15 : 15,
      z: direction > 0 ? -50 : 50,
      duration: 0.25,
      ease: "power1.inOut",
      stagger: direction > 0 ? 0.05 : -0.05
    }, 0.1)
    .to(magazineSpread, {
      rotateY: direction > 0 ? -90 : 90,
      duration: 0.4,
      ease: "power1.inOut"
    }, 0.2)
    .to(pages, {
      opacity: 0.7,
      duration: 0.2,
      ease: "power1.inOut"
    }, 0.3)
    .to(pages, {
      opacity: 1,
      duration: 0.2,
      ease: "power1.inOut"
    }, 0.5)
    .to(magazineSpread, {
      rotateY: direction > 0 ? -180 : 180,
      duration: 0.3,
      ease: "power1.inOut"
    }, 0.4)
    .to(magazineSpread, {
      scale: 1,
      duration: 0.2,
      ease: "power2.inOut"
    }, 0.6);
    
    const leftPage = 24 + this.currentPage;
    const rightPage = 25 + this.currentPage;
    pageIndicator.textContent = `${leftPage}-${rightPage} / 100`;
  }
  
  updatePageContent() {
    const contents = [
      {
        left: {
          title: "Pastel Paradise",
          subtitle: "Pastel Color Paradise",
          text: "This spring's trend features soft colors like a dream. Sweet pink like macarons, refreshing blue like the sky, and gentle white like clouds."
        },
        right: "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=800&h=1200&fit=crop"
      },
      {
        left: {
          title: "Kawaii Culture",
          subtitle: "The Culture of Kawaii",
          text: "Kawaii culture from Japan is now loved all over the world. We propose an adult kawaii style with playfulness hidden within simplicity."
        },
        right: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&h=1200&fit=crop"
      }
    ];
    
    const contentIndex = Math.floor(this.currentPage / 2) % contents.length;
    const content = contents[contentIndex];
    
    const leftPage = document.querySelector('.page-left');
    const rightPage = document.querySelector('.page-right');
    
    if (leftPage && content.left) {
      leftPage.querySelector('.feature-title').textContent = content.left.title;
      leftPage.querySelector('.feature-subtitle').textContent = content.left.subtitle;
      leftPage.querySelector('.editorial-text').textContent = content.left.text;
    }
    
    if (rightPage && content.right) {
      rightPage.querySelector('.fashion-image').src = content.right;
    }
  }
  
  async addToCart(productId, size = 'L', color = 'default') {
    if (!this.isLoggedIn) {
      this.showAuthModal();
      return;
    }
    
    try {
      const token = localStorage.getItem('nana_token');
      const response = await fetch('http://localhost:5001/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: productId.toString(),
          quantity: 1,
          size: size,
          color: color
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Update local cart count
        await this.updateCartFromServer();
        this.showSuccessMessage('장바구니에 추가되었습니다!');
        
        // Create bubble effect if event is available
        if (typeof event !== 'undefined' && event.clientX) {
          this.createBubbleEffect(event.clientX, event.clientY);
        }
      } else {
        this.showErrorMessage(data.message || '장바구니 추가에 실패했습니다.');
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      this.showErrorMessage('장바구니 추가 중 오류가 발생했습니다.');
    }
  }
  
  async updateCartFromServer() {
    try {
      const token = localStorage.getItem('nana_token');
      if (!token) return;
      
      const response = await fetch('http://localhost:5001/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        this.cart = data.data.cart.items;
        this.updateCartBadge();
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  }

  showCartNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: #FFB7C5;
      color: white;
      padding: 12px 20px;
      border-radius: 25px;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 4px 20px rgba(255,183,197,0.3);
      z-index: 10000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }
  
  async findProductById(productId) {
    // Search in all product arrays (상품만 포함, 아티클 제외)
    const allProducts = [
      ...this.generateCollectionProducts(),
      ...this.generateBeautyProducts(),
      ...await this.generateProducts() // 쇼핑 모드 상품들도 포함
    ];
    
    // productId를 숫자로 변환하여 비교
    const id = parseInt(productId);
    return allProducts.find(product => product.id === id);
  }
  
  updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
      cartCount.textContent = this.cart.length;
      
      gsap.to(cartCount, {
        scale: 1.3,
        duration: 0.2,
        ease: "back.out(2)",
        onComplete: () => {
          gsap.to(cartCount, {
            scale: 1,
            duration: 0.2
          });
        }
      });
    }
  }
  
  showAbout() {
    console.log('showAbout method called'); // Debug log
    const heroSection = document.getElementById('heroSection');
    const magazineViewer = document.getElementById('magazineViewer');
    const shoppingMode = document.getElementById('shoppingMode');
    const collectionPage = document.getElementById('collectionPage');
    const beautyPage = document.getElementById('beautyPage');
    const lifestylePage = document.getElementById('lifestylePage');
    const aboutPage = document.getElementById('aboutPage');
    
    console.log('About page element:', aboutPage); // Debug log
    
    // Hide other sections
    if (heroSection) heroSection.style.display = 'none';
    if (magazineViewer) magazineViewer.classList.remove('active');
    if (shoppingMode) shoppingMode.classList.remove('active');
    if (collectionPage) collectionPage.classList.remove('active');
    if (beautyPage) beautyPage.classList.remove('active');
    if (lifestylePage) lifestylePage.classList.remove('active');
    
    // Show about page
    if (aboutPage) {
      aboutPage.classList.add('active');
      console.log('About page should now be active'); // Debug log
      
      // Animate entrance
      gsap.from('.about-hero-content', {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power2.out"
      });
      
      // Make sure bubbles exist before animating
      const bubbles = document.querySelectorAll('.philosophy-bubble');
      console.log('Philosophy bubbles found:', bubbles.length); // Debug log
      
      gsap.from('.philosophy-bubble', {
        opacity: 0,
        scale: 0,
        duration: 0.8,
        stagger: 0.2,
        delay: 0.5,
        ease: "back.out(2)"
      });
      
      gsap.from('.philosophy-card', {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.15,
        delay: 1,
        ease: "power2.out"
      });
      
      gsap.from('.story-content', {
        opacity: 0,
        x: -30,
        duration: 0.8,
        delay: 1.5,
        ease: "power2.out"
      });
      
      gsap.from('.float-element', {
        opacity: 0,
        scale: 0,
        rotation: 180,
        duration: 1,
        stagger: 0.1,
        delay: 2,
        ease: "back.out(2)"
      });
      
      this.startFloatingAnimation();
    }
  }
  
  startFloatingAnimation() {
    const floatingElements = document.querySelectorAll('.float-element');
    
    floatingElements.forEach((element, index) => {
      gsap.to(element, {
        y: "random(-20, 20)",
        x: "random(-15, 15)",
        rotation: "random(-10, 10)",
        duration: "random(3, 5)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: index * 0.5
      });
    });
  }
  
  createBubbleEffect(x, y) {
    const bubble = document.createElement('div');
    bubble.className = 'bubble-effect';
    bubble.style.left = x + 'px';
    bubble.style.top = y + 'px';
    
    document.body.appendChild(bubble);
    
    const cartBubble = document.getElementById('cartBubble');
    const cartRect = cartBubble.getBoundingClientRect();
    
    gsap.to(bubble, {
      x: cartRect.left - x + cartRect.width / 2,
      y: cartRect.top - y + cartRect.height / 2,
      duration: 0.8,
      ease: "power2.in",
      onComplete: () => {
        bubble.remove();
      }
    });
  }
  
  // Authentication Methods
  checkAuthForCart() {
    if (this.isLoggedIn) {
      this.showMyPage('cart');
    } else {
      this.showAuthModal();
    }
  }
  
  showAuth() {
    this.hideAllPages();
    const authPage = document.getElementById('authPage');
    if (authPage) {
      authPage.classList.add('active');
      this.setupAuthTabs();
      this.setupAuthForms();
      
      gsap.from('.auth-container', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: "power2.out"
      });
    }
  }
  
  hideAllPages() {
    const pages = ['heroSection', 'magazineViewer', 'shoppingMode', 'collectionPage', 
                   'beautyPage', 'lifestylePage', 'aboutPage', 'authPage', 'myPage'];
    
    pages.forEach(pageId => {
      const page = document.getElementById(pageId);
      if (page) {
        page.classList.remove('active');
        if (pageId === 'heroSection') {
          page.style.display = 'none';
        }
      }
    });
  }
  
  setupAuthTabs() {
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');
    
    authTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        authTabs.forEach(t => t.classList.remove('active'));
        authForms.forEach(f => f.classList.remove('active'));
        
        tab.classList.add('active');
        const targetTab = tab.dataset.tab;
        document.getElementById(targetTab + 'Form').classList.add('active');
      });
    });
  }
  
  setupAuthForms() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleLogin(e);
      });
    }
    
    if (signupForm) {
      signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSignup(e);
      });
    }
    
    // 구글 로그인 버튼 이벤트
    const googleButtons = document.querySelectorAll('.social-btn.google');
    googleButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.handleGoogleLogin();
      });
    });
  }
  
  async handleLogin(e) {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, rememberMe })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Save token and user data
        localStorage.setItem('nana_token', data.token);
        localStorage.setItem('nana_user', JSON.stringify(data.data.user));
        
        this.currentUser = data.data.user;
        this.isLoggedIn = true;
        this.updateAuthUI();
        this.showSuccessMessage('로그인되었습니다!');
        this.showHomePage();
      } else {
        this.showErrorMessage(data.message || '로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('Login error:', error);
      this.showErrorMessage('로그인 중 오류가 발생했습니다.');
    }
  }

  initGoogleAuth() {
    // 구글 OAuth 스크립트가 로드될 때까지 기다림
    const checkGoogleScript = () => {
      if (typeof google !== 'undefined') {
        google.accounts.id.initialize({
          client_id: this.googleClientId,
          callback: (response) => this.handleGoogleCallback(response),
          auto_select: false,
          cancel_on_tap_outside: true
        });
      } else {
        setTimeout(checkGoogleScript, 100);
      }
    };
    checkGoogleScript();
  }

  handleGoogleLogin() {
    if (typeof google !== 'undefined') {
      google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // 팝업 방식으로 로그인 시도
          google.accounts.oauth2.initTokenClient({
            client_id: this.googleClientId,
            scope: 'email profile',
            callback: (response) => {
              if (response.access_token) {
                this.fetchGoogleUserInfo(response.access_token);
              }
            }
          }).requestAccessToken();
        }
      });
    } else {
      alert('구글 로그인이 초기화되지 않았습니다. 페이지를 새로고침해주세요.');
    }
  }

  async handleGoogleCallback(response) {
    try {
      // Send credential to backend
      const res = await fetch('http://localhost:5001/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential: response.credential })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        // Save token and user data
        localStorage.setItem('nana_token', data.token);
        localStorage.setItem('nana_user', JSON.stringify(data.data.user));
        
        this.currentUser = data.data.user;
        this.isLoggedIn = true;
        this.updateAuthUI();
        this.showSuccessMessage(`${data.data.user.name}님, 환영합니다!`);
        this.showHomePage();
      } else {
        alert('구글 로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('구글 로그인 처리 중 오류:', error);
      alert('로그인 중 오류가 발생했습니다.');
    }
  }

  async fetchGoogleUserInfo(accessToken) {
    try {
      const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`);
      const userInfo = await response.json();
      
      const userData = {
        id: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        loginType: 'google'
      };

      this.loginSuccess(userData);
    } catch (error) {
      console.error('구글 사용자 정보 가져오기 오류:', error);
      alert('사용자 정보를 가져오는 중 오류가 발생했습니다.');
    }
  }

  loginSuccess(userData) {
    // 사용자 정보 저장
    this.currentUser = userData;
    this.isLoggedIn = true;
    
    // 로컬 스토리지에 저장
    localStorage.setItem('nana_user', JSON.stringify(userData));
    localStorage.setItem('nana_login_status', 'true');
    
    // UI 업데이트
    this.updateAuthUI();
    
    // 홈으로 이동
    this.showHomePage();
    
    // 성공 메시지
    this.showSuccessMessage(`${userData.name}님, 환영합니다!`);
  }
  
  async handleSignup(e) {
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    if (password !== confirmPassword) {
      this.showErrorMessage('비밀번호가 일치하지 않습니다.');
      return;
    }
    
    if (!agreeTerms) {
      this.showErrorMessage('이용약관에 동의해주세요.');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Save token and user data
        localStorage.setItem('nana_token', data.token);
        localStorage.setItem('nana_user', JSON.stringify(data.data.user));
        
        this.currentUser = data.data.user;
        this.isLoggedIn = true;
        this.updateAuthUI();
        this.showSuccessMessage('회원가입이 완료되었습니다!');
        this.showHomePage();
      } else {
        this.showErrorMessage(data.message || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      this.showErrorMessage('회원가입 중 오류가 발생했습니다.');
    }
  }
  
  setUser(user, token = null) {
    this.currentUser = user;
    this.isLoggedIn = true;
    this.updateAuthUI();
    
    const authData = { user };
    if (token) {
      authData.token = token;
    }
    
    localStorage.setItem('nana_auth', JSON.stringify(authData));
  }
  
  logout() {
    this.currentUser = null;
    this.isLoggedIn = false;
    this.cart = [];
    this.updateAuthUI();
    localStorage.removeItem('nana_auth');
    this.showSuccessMessage('로그아웃되었습니다.');
    this.showHomePage();
  }
  
  updateAuthUI() {
    const authSection = document.getElementById('authSection');
    const loggedOutLinks = authSection.querySelector('.logged-out');
    const loggedInLinks = authSection.querySelector('.logged-in');
    const userGreeting = document.getElementById('userGreeting');
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    
    if (this.isLoggedIn && this.currentUser) {
      loggedOutLinks.style.display = 'none';
      loggedInLinks.style.display = 'flex';
      
      // 사용자 이름 표시
      if (userGreeting) {
        const greetingText = `${this.currentUser.name}님`;
        // 구글 로그인 사용자의 경우 프로필 사진 추가
        if (this.currentUser.picture && this.currentUser.loginType === 'google') {
          userGreeting.innerHTML = `
            <img src="${this.currentUser.picture}" alt="Profile" style="width: 24px; height: 24px; border-radius: 50%; margin-right: 8px; vertical-align: middle;">
            ${greetingText}
          `;
        } else {
          userGreeting.textContent = greetingText;
        }
      }
      
      if (userName) userName.textContent = this.currentUser.name;
      if (userEmail) userEmail.textContent = this.currentUser.email;
    } else {
      loggedOutLinks.style.display = 'flex';
      loggedInLinks.style.display = 'none';
    }
    
    this.updateCartBadge();
  }
  
  showMyPage(activeTab = 'cart') {
    this.hideAllPages();
    const myPage = document.getElementById('myPage');
    if (myPage) {
      myPage.classList.add('active');
      this.setupMyPageTabs();
      this.setActiveMyPageTab(activeTab);
      this.loadCartItems();
      
      gsap.from('.mypage-header', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: "power2.out"
      });
      
      gsap.from('.mypage-content', {
        opacity: 0,
        y: 40,
        duration: 0.8,
        delay: 0.2,
        ease: "power2.out"
      });
    }
  }
  
  setupMyPageTabs() {
    const myPageTabs = document.querySelectorAll('.mypage-tab');
    const tabContents = document.querySelectorAll('.mypage-tab-content');
    
    myPageTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;
        this.setActiveMyPageTab(targetTab);
      });
    });
  }
  
  setActiveMyPageTab(tabName) {
    const myPageTabs = document.querySelectorAll('.mypage-tab');
    const tabContents = document.querySelectorAll('.mypage-tab-content');
    
    myPageTabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === tabName);
    });
    
    tabContents.forEach(content => {
      content.classList.toggle('active', content.id === tabName + 'Tab');
    });
  }
  
  loadCartItems() {
    const cartItemsList = document.getElementById('cartItemsList');
    const cartSummary = document.getElementById('cartSummary');
    const cartItemsCount = document.getElementById('cartItemsCount');
    
    if (this.cart.length === 0) {
      cartItemsList.innerHTML = `
        <div class="empty-cart">
          <div class="empty-icon">🛍️</div>
          <p>장바구니가 비어있습니다</p>
          <button class="shop-now-btn" onclick="window.nana.showCollection()">쇼핑하러 가기</button>
        </div>
      `;
      cartSummary.style.display = 'none';
    } else {
      const cartHTML = this.cart.map(item => this.createCartItemHTML(item)).join('');
      cartItemsList.innerHTML = cartHTML;
      cartSummary.style.display = 'block';
      this.updateCartSummary();
    }
    
    if (cartItemsCount) {
      cartItemsCount.textContent = this.cart.length;
    }
  }
  
  createCartItemHTML(item) {
    return `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item-image">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="cart-item-details">
          <h4>${item.name}</h4>
          <p class="cart-item-price">¥${item.price.toLocaleString()}</p>
          <div class="quantity-controls">
            <button onclick="window.nana.updateCartQuantity('${item.id}', ${item.quantity - 1})">-</button>
            <span>${item.quantity}</span>
            <button onclick="window.nana.updateCartQuantity('${item.id}', ${item.quantity + 1})">+</button>
          </div>
        </div>
        <button class="remove-item" onclick="window.nana.removeFromCart('${item.id}')">×</button>
      </div>
    `;
  }
  
  updateCartQuantity(itemId, newQuantity) {
    if (newQuantity <= 0) {
      this.removeFromCart(itemId);
      return;
    }
    
    const itemIndex = this.cart.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
      this.cart[itemIndex].quantity = newQuantity;
      this.loadCartItems();
      this.updateCartBadge();
    }
  }
  
  removeFromCart(itemId) {
    this.cart = this.cart.filter(item => item.id !== itemId);
    this.loadCartItems();
    this.updateCartBadge();
  }
  
  updateCartSummary() {
    const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = 500;
    const total = subtotal + shipping;
    
    document.getElementById('subtotal').textContent = `¥${subtotal.toLocaleString()}`;
    document.getElementById('totalAmount').textContent = `¥${total.toLocaleString()}`;
  }
  
  updateCartBadge() {
    const cartBadge = document.getElementById('cartBadge');
    if (cartBadge) {
      const totalItems = this.cart.reduce((total, item) => total + item.quantity, 0);
      cartBadge.textContent = totalItems;
      cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
  }
  
  showHomePage() {
    this.hideAllPages();
    const heroSection = document.getElementById('heroSection');
    if (heroSection) {
      heroSection.style.display = 'block';
    }
  }
  
  showAuthModal() {
    alert('장바구니를 사용하려면 로그인이 필요합니다.');
    this.showAuth();
  }
  
  showSuccessMessage(message) {
    const toast = document.createElement('div');
    toast.className = 'toast success';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    gsap.fromTo(toast, 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.3 }
    );
    
    setTimeout(() => {
      gsap.to(toast, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        onComplete: () => document.body.removeChild(toast)
      });
    }, 3000);
  }
  
  showErrorMessage(message) {
    const toast = document.createElement('div');
    toast.className = 'toast error';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    gsap.fromTo(toast, 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.3 }
    );
    
    setTimeout(() => {
      gsap.to(toast, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        onComplete: () => document.body.removeChild(toast)
      });
    }, 3000);
  }
  
  // Initialize authentication state from localStorage
  async initAuth() {
    // Check for JWT token from backend authentication
    const token = localStorage.getItem('nana_token');
    if (token) {
      await this.verifyToken(token);
      return;
    }
    
    // Fallback: Check for legacy auth data
    const savedAuth = localStorage.getItem('nana_auth');
    if (savedAuth) {
      try {
        const authData = JSON.parse(savedAuth);
        if (authData.token) {
          localStorage.setItem('nana_token', authData.token);
          await this.verifyToken(authData.token);
          localStorage.removeItem('nana_auth'); // Clean up old format
          return;
        }
      } catch (error) {
        console.error('Error parsing saved auth:', error);
        localStorage.removeItem('nana_auth');
      }
    }
    
    // Check legacy Google login (clean up if found)
    const namaUser = localStorage.getItem('nana_user');
    const namaLoginStatus = localStorage.getItem('nana_login_status');
    
    if (namaUser && namaLoginStatus === 'true') {
      localStorage.removeItem('nana_user');
      localStorage.removeItem('nana_login_status');
      // These will need to re-authenticate through the backend
    }
  }
  
  async verifyToken(token) {
    try {
      const response = await fetch('http://localhost:5001/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        this.logout();
      } else {
        const data = await response.json();
        if (data.status === 'success') {
          this.currentUser = data.data.user;
          this.isLoggedIn = true;
          this.updateAuthUI();
        }
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      this.logout();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.nana = new NanaMagazine();
});