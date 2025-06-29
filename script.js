// Global Variables
let isUserInteracting = false
let mouseTrail = []
const particles = []
let matrixCanvas, matrixCtx

// DOM Content Loaded
document.addEventListener("DOMContentLoaded", () => {
  initializePortfolio()
})

// Initialize Portfolio
function initializePortfolio() {
  setupNavigation()
  setupHeroInteractions()
  setupScrollEffects()
  setupFormHandling()
  setupAnimations()
  setupMatrixRain()
  setupParticleSystem()
  setupTypingEffect()
  setupCounterAnimations()
  setupProgressBars()

  // Mark as loaded after a short delay
  setTimeout(() => {
    document.body.classList.add("loaded")
  }, 1000)
}

// Navigation Setup
function setupNavigation() {
  const navToggle = document.getElementById("nav-toggle")
  const navMenu = document.getElementById("nav-menu")
  const navLinks = document.querySelectorAll(".nav-link")

  // Mobile menu toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active")
      navToggle.classList.toggle("active")
    })
  }

  // Close mobile menu when clicking on links
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active")
      navToggle.classList.remove("active")
    })
  })

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })
}

// Scroll Effects
function setupScrollEffects() {
  const navbar = document.querySelector(".navbar")
  const backToTopBtn = document.getElementById("backToTop") || createBackToTopButton()

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY

    // Navbar background change
    if (scrollY > 50) {
      navbar.classList.add("scrolled")
    } else {
      navbar.classList.remove("scrolled")
    }

    // Back to top button
    if (scrollY > 300) {
      backToTopBtn.classList.add("visible")
    } else {
      backToTopBtn.classList.remove("visible")
    }

    // Active navigation highlighting
    updateActiveNavLink()

    // Parallax effect for hero
    const hero = document.querySelector(".hero")
    if (hero && scrollY < window.innerHeight) {
      const rate = scrollY * -0.3
      hero.style.transform = `translateY(${rate}px)`
    }
  })

  // Back to top functionality
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  })
}

// Create Back to Top Button
function createBackToTopButton() {
  const btn = document.createElement("button")
  btn.id = "backToTop"
  btn.className = "back-to-top"
  btn.innerHTML = '<i class="fas fa-arrow-up"></i>'
  btn.title = "Back to top"
  document.body.appendChild(btn)
  return btn
}

// Update Active Navigation Link
function updateActiveNavLink() {
  const sections = document.querySelectorAll("section")
  const navLinks = document.querySelectorAll(".nav-link")

  let current = ""
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100
    const sectionHeight = section.clientHeight
    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute("id")
    }
  })

  navLinks.forEach((link) => {
    link.classList.remove("active")
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active")
    }
  })
}

// Hero Interactions
function setupHeroInteractions() {
  const rotatingCage = document.getElementById("rotatingCage")

  if (rotatingCage) {
    setupCageInteraction(rotatingCage)
    setupCageFaceClicks()
  }

  setupMouseTrail()
  setupOrbitItemHovers()
}

// Cage Interaction
function setupCageInteraction(cage) {
  let isDragging = false
  let startX, startY
  let currentRotationX = 0
  let currentRotationY = 0

  cage.addEventListener("mousedown", (e) => {
    isDragging = true
    isUserInteracting = true
    startX = e.clientX
    startY = e.clientY
    cage.style.animationPlayState = "paused"
    cage.style.cursor = "grabbing"
  })

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return

    const deltaX = e.clientX - startX
    const deltaY = e.clientY - startY

    currentRotationY += deltaX * 0.5
    currentRotationX -= deltaY * 0.5

    cage.style.transform = `rotateX(${currentRotationX}deg) rotateY(${currentRotationY}deg)`

    startX = e.clientX
    startY = e.clientY
  })

  document.addEventListener("mouseup", () => {
    if (isDragging) {
      isDragging = false
      isUserInteracting = false
      cage.style.cursor = "grab"

      // Resume animation after 2 seconds
      setTimeout(() => {
        if (!isUserInteracting) {
          cage.style.animationPlayState = "running"
          cage.style.transform = ""
        }
      }, 2000)
    }
  })

  // Touch events for mobile
  cage.addEventListener("touchstart", (e) => {
    isDragging = true
    isUserInteracting = true
    const touch = e.touches[0]
    startX = touch.clientX
    startY = touch.clientY
    cage.style.animationPlayState = "paused"
    e.preventDefault()
  })

  document.addEventListener("touchmove", (e) => {
    if (!isDragging) return

    const touch = e.touches[0]
    const deltaX = touch.clientX - startX
    const deltaY = touch.clientY - startY

    currentRotationY += deltaX * 0.5
    currentRotationX -= deltaY * 0.5

    cage.style.transform = `rotateX(${currentRotationX}deg) rotateY(${currentRotationY}deg)`

    startX = touch.clientX
    startY = touch.clientY
    e.preventDefault()
  })

  document.addEventListener("touchend", () => {
    if (isDragging) {
      isDragging = false
      isUserInteracting = false

      setTimeout(() => {
        if (!isUserInteracting) {
          cage.style.animationPlayState = "running"
          cage.style.transform = ""
        }
      }, 2000)
    }
  })
}

// Cage Face Clicks
function setupCageFaceClicks() {
  const cageFaces = document.querySelectorAll(".cage-face")

  cageFaces.forEach((face) => {
    face.addEventListener("click", function (e) {
      e.stopPropagation()

      // Create ripple effect
      createRippleEffect(this, e)

      // Show tech fact
      const skill = this.getAttribute("data-skill")
      showTechFact(skill)

      // Add click animation
      this.style.transform += " scale(0.95)"
      setTimeout(() => {
        this.style.transform = this.style.transform.replace(" scale(0.95)", "")
      }, 150)
    })
  })
}

// Create Ripple Effect
function createRippleEffect(element, event) {
  const ripple = document.createElement("div")
  const rect = element.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)
  const x = event.clientX - rect.left - size / 2
  const y = event.clientY - rect.top - size / 2

  ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(240, 147, 251, 0.6);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        z-index: 1000;
    `

  element.style.position = "relative"
  element.appendChild(ripple)

  setTimeout(() => {
    ripple.remove()
  }, 600)
}

// Show Tech Fact
function showTechFact(skill) {
  const facts = {
    "Python Programming": "Python: My go-to language for data analysis, machine learning, and automation!",
    "Database Management": "Databases: Experienced with SQL, data modeling, and database optimization.",
    "Data Analysis": "Analytics: Transforming raw data into actionable insights and visualizations.",
    "R Programming": "R: Statistical computing powerhouse for advanced data analysis and research.",
    "Machine Learning": "AI/ML: Passionate about building intelligent systems and predictive models.",
    "Software Development": "Development: Creating robust, scalable solutions with clean, efficient code.",
  }

  const fact = facts[skill] || "Technology enthusiast and lifelong learner!"
  showPopup(fact)
}

// Show Popup
function showPopup(message) {
  const popup = document.createElement("div")
  popup.className = "tech-popup"
  popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 20px 30px;
        border-radius: 15px;
        z-index: 10000;
        max-width: 400px;
        text-align: center;
        font-size: 1rem;
        line-height: 1.5;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        animation: popupShow 0.3s ease;
    `
  popup.textContent = message

  document.body.appendChild(popup)

  setTimeout(() => {
    popup.style.animation = "popupHide 0.3s ease forwards"
    setTimeout(() => popup.remove(), 300)
  }, 3000)
}

// Mouse Trail
function setupMouseTrail() {
  document.addEventListener("mousemove", (e) => {
    if (e.target.closest(".hero")) {
      mouseTrail.push({
        x: e.clientX,
        y: e.clientY,
        time: Date.now(),
      })

      // Keep only recent trail points
      mouseTrail = mouseTrail.filter((point) => Date.now() - point.time < 1000)

      // Create trail particle occasionally
      if (Math.random() < 0.1) {
        createTrailParticle(e.clientX, e.clientY)
      }
    }
  })
}

// Create Trail Particle
function createTrailParticle(x, y) {
  const particle = document.createElement("div")
  particle.className = "trail-particle"
  particle.style.left = x + "px"
  particle.style.top = y + "px"

  document.body.appendChild(particle)

  setTimeout(() => {
    particle.remove()
  }, 1000)
}

// Orbit Item Hovers
function setupOrbitItemHovers() {
  const orbitItems = document.querySelectorAll(".orbit-item")

  orbitItems.forEach((item) => {
    item.addEventListener("mouseenter", function () {
      const tech = this.getAttribute("data-tech")
      if (tech) {
        this.title = tech
      }
    })
  })
}

// Typing Effect
function setupTypingEffect() {
  const typingElement = document.getElementById("typing-text")
  if (!typingElement) return

  const texts = [
    "Mathematics & Economics Graduate",
    "Data Analyst & Researcher",
    "STEM Curriculum Developer",
    "Python & R Programming Expert",
    "Educational Technology Enthusiast",
  ]

  let textIndex = 0
  let charIndex = 0
  let isDeleting = false
  let typingSpeed = 100

  function typeText() {
    const currentText = texts[textIndex]

    if (isDeleting) {
      typingElement.textContent = currentText.substring(0, charIndex - 1)
      charIndex--
      typingSpeed = 50
    } else {
      typingElement.textContent = currentText.substring(0, charIndex + 1)
      charIndex++
      typingSpeed = 100
    }

    if (!isDeleting && charIndex === currentText.length) {
      setTimeout(() => {
        isDeleting = true
      }, 2000)
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false
      textIndex = (textIndex + 1) % texts.length
    }

    setTimeout(typeText, typingSpeed)
  }

  typeText()
}

// Counter Animations
function setupCounterAnimations() {
  const counters = document.querySelectorAll(".stat-number")
  const observerOptions = {
    threshold: 0.5,
    rootMargin: "0px 0px -100px 0px",
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target)
        counterObserver.unobserve(entry.target)
      }
    })
  }, observerOptions)

  counters.forEach((counter) => {
    counterObserver.observe(counter)
  })
}

// Animate Counter
function animateCounter(element) {
  const target = Number.parseInt(element.getAttribute("data-target"))
  const duration = 2000
  const increment = target / (duration / 16)
  let current = 0

  const updateCounter = () => {
    if (current < target) {
      current += increment
      element.textContent = Math.ceil(current)
      requestAnimationFrame(updateCounter)
    } else {
      element.textContent = target
    }
  }

  updateCounter()
}

// Progress Bars
function setupProgressBars() {
  const progressBars = document.querySelectorAll(".progress-fill")
  const observerOptions = {
    threshold: 0.5,
    rootMargin: "0px 0px -50px 0px",
  }

  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const progressBar = entry.target
        const width = progressBar.getAttribute("data-width")
        setTimeout(() => {
          progressBar.style.width = width
        }, 200)
        progressObserver.unobserve(progressBar)
      }
    })
  }, observerOptions)

  progressBars.forEach((bar) => {
    progressObserver.observe(bar)
  })
}

// Matrix Rain Effect
function setupMatrixRain() {
  matrixCanvas = document.getElementById("matrix-canvas")
  if (!matrixCanvas) return

  matrixCtx = matrixCanvas.getContext("2d")

  function resizeCanvas() {
    matrixCanvas.width = window.innerWidth
    matrixCanvas.height = window.innerHeight
  }

  resizeCanvas()
  window.addEventListener("resize", resizeCanvas)

  const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}"
  const matrixArray = matrix.split("")
  const fontSize = 10
  const columns = matrixCanvas.width / fontSize
  const drops = []

  for (let x = 0; x < columns; x++) {
    drops[x] = 1
  }

  function drawMatrix() {
    matrixCtx.fillStyle = "rgba(0, 0, 0, 0.04)"
    matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height)

    matrixCtx.fillStyle = "#0F3"
    matrixCtx.font = fontSize + "px monospace"

    for (let i = 0; i < drops.length; i++) {
      const text = matrixArray[Math.floor(Math.random() * matrixArray.length)]
      matrixCtx.fillText(text, i * fontSize, drops[i] * fontSize)

      if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
        drops[i] = 0
      }
      drops[i]++
    }
  }

  setInterval(drawMatrix, 35)
}

// Particle System
function setupParticleSystem() {
  const particleContainer = document.getElementById("tech-particles")
  if (!particleContainer) return

  function createParticle() {
    const particle = document.createElement("div")
    particle.className = "particle"
    particle.style.left = Math.random() * 100 + "%"
    particle.style.animationDuration = Math.random() * 3 + 2 + "s"
    particle.style.animationDelay = Math.random() * 2 + "s"

    particleContainer.appendChild(particle)

    setTimeout(() => {
      if (particle.parentNode) {
        particle.remove()
      }
    }, 5000)
  }

  // Create particles periodically
  setInterval(createParticle, 300)
}

// Form Handling
function setupFormHandling() {
  const contactForm = document.getElementById("contact-form")
  if (!contactForm) return

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault()

    const submitBtn = this.querySelector(".btn-submit")
    const formData = new FormData(this)

    // Show loading state
    submitBtn.classList.add("loading")
    submitBtn.disabled = true

    // Simulate form processing
    setTimeout(() => {
      // Get form data
      const name = formData.get("name")
      const email = formData.get("email")
      const subject = formData.get("subject")
      const message = formData.get("message")

      // Create mailto link
      const mailtoLink = `mailto:murungadaniel2002@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`

      // Open email client
      window.location.href = mailtoLink

      // Show success message
      showNotification("Thank you for your message! Your email client should open now.", "success")

      // Reset form and button
      this.reset()
      submitBtn.classList.remove("loading")
      submitBtn.disabled = false
    }, 1000)
  })
}

// Show Notification
function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === "success" ? "#27ae60" : "#3498db"};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        z-index: 10000;
        max-width: 300px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        animation: slideInRight 0.3s ease;
    `
  notification.textContent = message

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.3s ease forwards"
    setTimeout(() => notification.remove(), 300)
  }, 4000)
}

// Animations Setup
function setupAnimations() {
  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  }, observerOptions)

  // Observe elements for animation
  const animatedElements = document.querySelectorAll(`
        .skill-card, .education-card, .cert-card, .timeline-item,
        .contact-item, .award-item, .highlight-item
    `)

  animatedElements.forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(30px)"
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(el)
  })

  // Card hover effects
  const cards = document.querySelectorAll(".skill-card, .education-card, .cert-card")
  cards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-10px) scale(1.02)"
    })

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)"
    })
  })
}

// Additional CSS for new animations
const additionalStyles = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
    
    @keyframes popupShow {
        from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
        }
        to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
    }
    
    @keyframes popupHide {
        from {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        to {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
        }
    }
    
    .rotating-cage {
        cursor: grab;
    }
    
    .rotating-cage:active {
        cursor: grabbing;
    }
`

// Add additional styles to document
const styleSheet = document.createElement("style")
styleSheet.textContent = additionalStyles
document.head.appendChild(styleSheet)

// Window load event
window.addEventListener("load", () => {
  // Initialize any remaining functionality
  console.log("Portfolio fully loaded and interactive!")
})

// Handle page visibility changes
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    // Pause animations when page is not visible
    const cage = document.getElementById("rotatingCage")
    if (cage) {
      cage.style.animationPlayState = "paused"
    }
  } else {
    // Resume animations when page becomes visible
    setTimeout(() => {
      const cage = document.getElementById("rotatingCage")
      if (cage && !isUserInteracting) {
        cage.style.animationPlayState = "running"
      }
    }, 1000)
  }
})
