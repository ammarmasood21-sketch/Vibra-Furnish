/* ==========================================================================
   VibraFurnish Core Logic & Interactions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Mouse Follower Cursor Glow
  const cursorGlow = document.getElementById('cursor-glow');
  document.addEventListener('mousemove', (e) => {
    // Offset the cursor glow by half its size (350px / 2 = 175px)
    cursorGlow.style.left = `${e.clientX}px`;
    cursorGlow.style.top = `${e.clientY}px`;
  });

  // 2. Header Scroll Effect
  const mainHeader = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      mainHeader.classList.add('scrolled');
    } else {
      mainHeader.classList.remove('scrolled');
    }
  });

  // 3. Mobile Navigation Drawer Toggle
  const menuBtn = document.getElementById('menu-btn');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  const openDrawer = () => {
    mobileDrawer.classList.add('open');
  };

  const closeDrawer = () => {
    mobileDrawer.classList.remove('open');
  };

  menuBtn.addEventListener('click', openDrawer);
  drawerCloseBtn.addEventListener('click', closeDrawer);
  mobileLinks.forEach(link => link.addEventListener('click', closeDrawer));

  // 4. Hero Slider Controller with Theme Changer
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  const sliderPrev = document.getElementById('slider-prev');
  const sliderNext = document.getElementById('slider-next');
  let currentSlide = 0;
  const slideCount = slides.length;
  let autoplayTimer;

  const updateSlider = (index) => {
    // Deactivate current slide and dot
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');

    // Update index
    currentSlide = index;

    // Activate new slide and dot
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');

    // Change body theme class to morph color scheme
    const activeTheme = slides[currentSlide].getAttribute('data-theme');
    document.body.className = `theme-${activeTheme}`;
  };

  const nextSlide = () => {
    let nextIndex = (currentSlide + 1) % slideCount;
    updateSlider(nextIndex);
  };

  const prevSlide = () => {
    let prevIndex = (currentSlide - 1 + slideCount) % slideCount;
    updateSlider(prevIndex);
  };

  // Click listeners for arrows
  sliderNext.addEventListener('click', () => {
    nextSlide();
    resetAutoplay();
  });
  sliderPrev.addEventListener('click', () => {
    prevSlide();
    resetAutoplay();
  });

  // Click listeners for dots
  dots.forEach((dot) => {
    dot.addEventListener('click', (e) => {
      const slideIndex = parseInt(e.target.getAttribute('data-slide'));
      updateSlider(slideIndex);
      resetAutoplay();
    });
  });

  // Autoplay functionality
  const startAutoplay = () => {
    autoplayTimer = setInterval(nextSlide, 7000); // Transitions every 7 seconds
  };

  const resetAutoplay = () => {
    clearInterval(autoplayTimer);
    startAutoplay();
  };

  startAutoplay();

  // 5. 3D Card Tilt Parallax Effect
  const tiltWrappers = document.querySelectorAll('.tilt-card-wrapper');
  
  tiltWrappers.forEach((wrapper) => {
    const card = wrapper.querySelector('.tilt-card');
    
    wrapper.addEventListener('mousemove', (e) => {
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left; // Mouse X relative to wrapper
      const y = e.clientY - rect.top;  // Mouse Y relative to wrapper
      
      // Calculate rotation angles based on offset from card center
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const deltaX = x - centerX;
      const deltaY = y - centerY;
      
      // Max rotation: 20 degrees
      const rotateX = -(deltaY / centerY) * 15;
      const rotateY = (deltaX / centerX) * 15;
      
      // Apply transforms directly to the card
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    wrapper.addEventListener('mouseleave', () => {
      // Smoothly reset tilt back to zero
      card.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
  });

  // 6. Product Grid Catalog Filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      // Remove active from all buttons and add to clicked
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');

      const filterValue = e.target.getAttribute('data-filter');

      productCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // 7. Stat Count-Up Scroll Trigger Animation
  const statNumbers = document.querySelectorAll('.stat-number');
  let animationTriggered = false;

  const countUp = (element) => {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // Easing function (easeOutQuad)
      const easeProgress = progress * (2 - progress);
      const currentValue = Math.floor(easeProgress * target);
      
      // Append '+' or '%' character indicators if they are part of layout
      if (element.nextElementSibling.textContent.includes('Countries')) {
        element.textContent = currentValue + "+";
      } else if (element.nextElementSibling.textContent.includes('Customers')) {
        element.textContent = currentValue + "K+";
      } else if (element.nextElementSibling.textContent.includes('Neutral')) {
        element.textContent = currentValue + "%";
      } else {
        element.textContent = currentValue;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Ensure final value is accurate
        if (element.nextElementSibling.textContent.includes('Countries')) {
          element.textContent = target + "+";
        } else if (element.nextElementSibling.textContent.includes('Customers')) {
          element.textContent = target + "K+";
        } else if (element.nextElementSibling.textContent.includes('Neutral')) {
          element.textContent = target + "%";
        } else {
          element.textContent = target;
        }
      }
    };

    requestAnimationFrame(animate);
  };

  // Intersection Observer for scroll trigger
  const statsSection = document.querySelector('.stats-bar');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animationTriggered) {
          statNumbers.forEach(num => countUp(num));
          animationTriggered = true;
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    statsObserver.observe(statsSection);
  }

  // 8. Interactive SVG Delivery Map Tooltip Details
  const mapPins = document.querySelectorAll('.map-pin');
  const mapTooltip = document.getElementById('map-tooltip');
  const tooltipTitle = document.getElementById('tooltip-title');
  const tooltipDelivery = document.getElementById('tooltip-delivery');
  const tooltipStatus = document.getElementById('tooltip-status');
  
  // Data for the pins on map
  const countryHubs = {
    uk: {
      title: "Main Operations HQ",
      location: "Florence-Milan, Italy",
      delivery: "Express Dispatch Hub",
      status: "Active - Core Logistics hub"
    },
    usa: {
      title: "North America Hub",
      location: "New York, NY, USA",
      delivery: "Transit: 24 - 48 Hours",
      status: "Active - Normal Operations"
    },
    brazil: {
      title: "South America Hub",
      location: "Rio de Janeiro, Brazil",
      delivery: "Transit: 48 - 72 Hours",
      status: "Active - Delivery Route Open"
    },
    safrica: {
      title: "African Footprint Hub",
      location: "Cape Town, South Africa",
      delivery: "Transit: 48 - 72 Hours",
      status: "Active - Delivery Route Open"
    },
    japan: {
      title: "East Asia Hub",
      location: "Tokyo, Japan",
      delivery: "Transit: 24 - 48 Hours",
      status: "Active - Normal Operations"
    },
    australia: {
      title: "Oceania Delivery Center",
      location: "Sydney, Australia",
      delivery: "Transit: 48 - 72 Hours",
      status: "Active - Route Operational"
    }
  };

  mapPins.forEach((pin) => {
    pin.addEventListener('mouseenter', (e) => {
      const countryCode = pin.getAttribute('data-country');
      const hubInfo = countryHubs[countryCode];
      
      if (hubInfo) {
        tooltipTitle.textContent = hubInfo.title;
        tooltipDelivery.innerHTML = `Location: <strong>${hubInfo.location}</strong><br>Timeframe: <strong>${hubInfo.delivery}</strong>`;
        tooltipStatus.innerHTML = `<span class="badge-dot status-active"></span> ${hubInfo.status}`;
        
        mapTooltip.classList.add('visible');
      }
    });

    pin.addEventListener('mousemove', (e) => {
      // Tooltip position offsets cursor to prevent mouse blocking
      const mapContainer = document.querySelector('.map-container');
      const containerRect = mapContainer.getBoundingClientRect();
      
      const x = e.clientX - containerRect.left + 20;
      const y = e.clientY - containerRect.top + 15;
      
      mapTooltip.style.left = `${x}px`;
      mapTooltip.style.top = `${y}px`;
    });

    pin.addEventListener('mouseleave', () => {
      mapTooltip.classList.remove('visible');
    });
  });

  // 9. Contact Form & Newsletter Forms Mockup Submission
  const contactForm = document.getElementById('furniture-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('form-name').value;
      const product = document.getElementById('form-product-interest').value;
      
      // Display a beautiful overlay alert
      alert(`Thank you, ${name}! Your design request regarding the '${product}' collection has been sent successfully. One of our design architects will reach out to your inbox shortly.`);
      contactForm.reset();
    });
  }

  const newsletterForm = document.getElementById('footer-newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterForm.querySelector('input').value;
      alert(`Welcome to VibraFurnish, ${email}! You have successfully subscribed to our premium Releases and Design Catalog updates.`);
      newsletterForm.reset();
    });
  }

  // 10. Nav-links active tracking on scroll
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    let currentActive = 'home';
    
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      // Triggers link activation slightly before reaching the element
      if (window.scrollY >= (sectionTop - 250)) {
        currentActive = section.getAttribute('id') || currentActive;
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentActive}`) {
        link.classList.add('active');
      } else if (currentActive === 'delivery-map' && link.getAttribute('href') === '#delivery-map') {
        link.classList.add('active');
      }
    });
  });

  // 11. Exploded View Toggle Listener
  const explodeBtns = document.querySelectorAll('.btn-explode');
  explodeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const activeSlide = document.querySelector('.slide.active');
      const container = activeSlide.querySelector('.exploded-container');
      if (container) {
        container.classList.toggle('exploded');
      }
    });
  });

  // 12. Blueprint Coordinate Tracking
  const blueprintCoords = document.getElementById('blueprint-coords');
  if (blueprintCoords) {
    document.addEventListener('mousemove', (e) => {
      const xStr = String(e.clientX).padStart(3, '0');
      const yStr = String(e.clientY).padStart(3, '0');
      blueprintCoords.textContent = `[X: ${xStr}, Y: ${yStr}]`;
    });
  }

  // 13. Blueprint Shopping Cart Interactivity
  const cartBtn = document.getElementById('cart-btn');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartDrawerClose = document.getElementById('cart-drawer-close');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartBadge = document.getElementById('cart-badge');
  const cartDrawerCount = document.getElementById('cart-drawer-count');
  const cartDrawerItems = document.getElementById('cart-drawer-items');
  const cartTotalPrice = document.getElementById('cart-total-price');
  const cartToast = document.getElementById('cart-toast');
  const btnCheckout = document.getElementById('btn-checkout');

  let cart = [];

  const openCart = () => {
    if (cartDrawer && cartOverlay) {
      cartDrawer.classList.add('open');
      cartOverlay.classList.add('open');
    }
  };

  const closeCart = () => {
    if (cartDrawer && cartOverlay) {
      cartDrawer.classList.remove('open');
      cartOverlay.classList.remove('open');
    }
  };

  if (cartBtn) cartBtn.addEventListener('click', openCart);
  if (cartDrawerClose) cartDrawerClose.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  const showToast = (message) => {
    if (!cartToast) return;
    cartToast.textContent = message;
    cartToast.classList.add('show');
    setTimeout(() => {
      cartToast.classList.remove('show');
    }, 3000);
  };

  const updateCartUI = () => {
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    if (cartBadge) {
      cartBadge.textContent = totalItems;
      cartBadge.classList.add('pulse');
      setTimeout(() => cartBadge.classList.remove('pulse'), 400);
    }
    if (cartDrawerCount) cartDrawerCount.textContent = totalItems;
    if (cartTotalPrice) cartTotalPrice.textContent = `$${totalPrice.toLocaleString()}`;

    if (!cartDrawerItems) return;

    if (cart.length === 0) {
      cartDrawerItems.innerHTML = `<p class="empty-cart-msg">Your blueprint shopping cart is currently empty.</p>`;
    } else {
      cartDrawerItems.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
          <img src="${item.img}" alt="${item.name}" class="cart-item-img">
          <div class="cart-item-details">
            <div class="cart-item-title">${item.name}</div>
            <div class="cart-item-price">$${item.price.toLocaleString()}</div>
            <div class="cart-item-qty">
              <button class="qty-btn" onclick="window.changeCartQty(${index}, -1)">-</button>
              <span class="qty-val">${item.qty}</span>
              <button class="qty-btn" onclick="window.changeCartQty(${index}, 1)">+</button>
            </div>
          </div>
          <button class="cart-item-remove" onclick="window.removeCartItem(${index})">&times;</button>
        </div>
      `).join('');
    }
  };

  window.changeCartQty = (index, delta) => {
    if (cart[index]) {
      cart[index].qty += delta;
      if (cart[index].qty <= 0) {
        cart.splice(index, 1);
      }
      updateCartUI();
    }
  };

  window.removeCartItem = (index) => {
    if (cart[index]) {
      const name = cart[index].name;
      cart.splice(index, 1);
      updateCartUI();
      showToast(`Removed '${name}' from cart.`);
    }
  };

  const addToCart = (name, price, img) => {
    const existingIndex = cart.findIndex(item => item.name === name);
    if (existingIndex > -1) {
      cart[existingIndex].qty += 1;
    } else {
      cart.push({ name, price: parseFloat(price), img, qty: 1 });
    }
    updateCartUI();
    showToast(`Added '${name}' to blueprint cart!`);
  };

  // Bind to product cards .btn-buy
  document.querySelectorAll('.product-card').forEach(card => {
    const buyBtn = card.querySelector('.btn-buy');
    if (buyBtn) {
      buyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const name = card.querySelector('.product-name').textContent.trim();
        const priceStr = card.querySelector('.product-price').textContent.replace('$', '').replace(',', '').trim();
        const img = card.querySelector('.product-img').getAttribute('src');
        addToCart(name, priceStr, img);
      });
    }
  });

  // Bind to direct showcase buttons .btn-add-cart-direct
  document.querySelectorAll('.btn-add-cart-direct').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-name');
      const price = btn.getAttribute('data-price');
      const img = btn.getAttribute('data-img');
      addToCart(name, price, img);
    });
  });

  if (btnCheckout) {
    btnCheckout.addEventListener('click', () => {
      if (cart.length === 0) {
        alert('Your shopping cart is empty! Add some blueprints first.');
      } else {
        alert(`Order Placed! Thank you for ordering from VibraFurnish. Your total is $${cart.reduce((sum, item) => sum + (item.price * item.qty), 0).toLocaleString()}. An architectural confirmation has been sent.`);
        cart = [];
        updateCartUI();
        closeCart();
      }
    });
  }

});

