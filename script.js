// Пароль для входа (временный)
const PASSWORD = "Воспоминание17к1";

// Переменные для игры
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let attempts = 0;
let gameStarted = false;

// Переменные для фото-вьювера
let currentPhotoIndex = 0;
let currentPhotoList = [];
let photoViewerActive = false;

// Переменные для карты
let map = null;
let memories = [];

// Переменные для музыки
let currentTrack = 0;
let isPlaying = false;
let trackNames = ["Романтик 1", "Романтик 2", "Настроение", "Вместе", "Любовь", "Счастье"];
let tracks = [
    "audio/kaz.mp3",
    "audio/kaz2.mp3",
    "audio/kaz4.mp3",
    "audio/kaz5.mp3",
    "audio/kaz6.mp3",
    "audio/kaz7.mp3",
];

// Функция закрытия всех модальных окон
function closeAllModals() {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    if (modal) modal.style.display = 'none';
  });
  document.getElementById('photo-viewer')?.classList.remove('active');
}

// Инициализация карты
function initMap() {
  map = L.map('map').setView([53.194546, 45.01948], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const customIcon = new L.Icon({
    iconUrl: 'icons/dog.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });

  memories = [
    { coords: [53.232422, 44.934737], title: "💋 Первый поцелуй — Portal", text: "Need for Speed и It Takes Two", images: ["images/portal.jpg", "images/portal2.jpg"] },
    { coords: [53.196137, 45.015028], title: "🏠 Володарского 65", text: "Шаурма, мохито, курица, блины, пластилин", images: ["images/lizkhome.jpg", "images/lizkhome1.jpg","images/lizkhome2.jpg","images/lizkhome3.jpg","images/lizkhome4.jpg","images/lizkhome5.jpg"] },
    { coords: [53.223053, 44.982868], title: "🏢 Беляева 37", text: "Кальян, варган, Шкет, кроссворд", images: ["images/egrhome.jpg"] },
    { coords: [53.180711, 45.055614], title: "🚂 ГПЗ", text: "Собаки, велики, сломанный ключ, закат", images: ["images/gpz.jpg", "images/gpz1.jpg","images/gpz2.jpg","images/gpz3.jpg","images/gpz4.jpg","images/gpz5.jpg"], videos: ["videos/gpzv.MOV"] },
    { coords: [53.19816595573399,44.97101969582754], title: "🏛️ ДК", text: "Самокаты, Котя, салют", images: ["images/dom.jpg", "images/dom1.jpg","images/dom2.jpg","images/dom3.jpg"] },
    { coords: [53.19120897045183,44.971295358916365], title: "🌳 Западная", text: "Самовар, Авито, частный сектор", images: ["images/zap.jpg", "images/zap1.jpg","images/zap2.jpg","images/zap3.jpg","images/zap4.jpg","images/zap5.jpg","images/zap6.jpg","images/zap7.jpg","images/zap8.jpg"] },
    { coords: [53.222669115309245,44.8991732840078], title: "🧖‍♀️ ТЕРМОЛЕНД", text: "Банька, парилка, глина", images: ["images/term.jpg", "images/term1.jpg","images/term2.jpg","images/term3.jpg","images/term4.jpg"], videos: ["videos/term1.MOV","videos/termv.MOV"] },
    { coords: [55.704448, 37.653774], title: "🧖‍♀️ Хата в москве", text: "готовили храпу давали", videos: ["videos/zavod.mp4","videos/zavod2.mp4"] },
    { coords: [55.742651, 37.612721], title: "Гэс-2", text: "окультурились", images: ["images/gas.jpg", "images/gas1.jpg","images/gas2.jpg"], videos: ["videos/gasv.MOV","videos/gasv1.mp4"] },
    { coords: [55.708856, 37.626070], title: "Тусня", text: "бандерос, джон гарик", images: ["images/tusa.jpg", "images/tusa1.jpg","images/tusa2.jpg"], videos: ["videos/tusa.MOV","videos/tusa1.MOV"] },
    { coords: [55.714044, 37.670142], title: "Чумодан", text: "антиквариат", images: ["images/chum.jpg", "images/chum1.jpg","images/chum2.jpg"], videos: ["videos/chum.mp4","videos/chum1.mp4"] },
    { coords: [53.194939, 45.028584], title: "Набережная", text: "сидели пили вино", images: ["images/wine.jpg", "images/wine1.jpg","images/wine2.jpg","images/wine3.jpg"] },
    { coords: [55.844273, 37.633005], title: "Китайский парк", text: "китай да", images: ["images/china.jpg", "images/china1.jpg","images/china2.jpg","images/china3.jpg"] }
  ];

  memories.forEach((memory, index) => {
    const sliderId = 'swiper-' + index;

    const imagesHTML = memory.images?.length > 0 ? `
      <div class="${memory.images.length > 1 ? 'swiper-container' : 'media-container'}" id="${sliderId}">
        ${memory.images.length > 1 ? `
          <div class="swiper-wrapper">
            ${memory.images.map((img, imgIndex) => `
              <div class="swiper-slide" data-img-index="${imgIndex}" data-memory-index="${index}">
                <img src="${img}" alt="" class="clickable-photo" data-memory-index="${index}" data-img-index="${imgIndex}" />
              </div>`).join('')}
          </div>
          <div class="swiper-button-next"></div>
          <div class="swiper-button-prev"></div>
        ` : `
          <img src="${memory.images[0]}" alt="" class="clickable-photo" data-memory-index="${index}" data-img-index="0" />
        `}
      </div>
    ` : "";

    const videosHTML = memory.videos?.map(video => `
      <div class="media-container">
        <video controls>
          <source src="${video}" type="${video.endsWith('.MOV') ? 'video/quicktime' : 'video/mp4'}">
          Ваш браузер не поддерживает видео.
        </video>
      </div>
    `).join('') || "";

    const popupContent = `
      <div class="popup-content">
        <strong>${memory.title}</strong><br>
        <p>${memory.text}</p>
        ${imagesHTML}
        ${videosHTML}
      </div>
    `;

    const marker = L.marker(memory.coords, { icon: customIcon })
      .addTo(map)
      .bindPopup(popupContent);

    marker.on("popupopen", () => {
      if (memory.images?.length > 1) {
        new Swiper(`#${sliderId}`, {
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          },
          loop: true
        });
      }
      
      setTimeout(() => {
        const photos = document.querySelectorAll('.leaflet-popup-content .clickable-photo');
        photos.forEach(img => {
          img.addEventListener('click', function(e) {
            e.stopPropagation();
            const memoryIndex = parseInt(this.dataset.memoryIndex);
            const imgIndex = parseInt(this.dataset.imgIndex);
            if (memories[memoryIndex] && memories[memoryIndex].images) {
              closeAllModals();
              openPhotoViewer(memories[memoryIndex].images, imgIndex);
            }
          });
        });
      }, 200);
    });
  });
}

function openPhotoViewer(images, startIndex) {
  if (!images || images.length === 0) return;
  
  currentPhotoList = images;
  currentPhotoIndex = startIndex;
  photoViewerActive = true;
  
  const viewer = document.getElementById('photo-viewer');
  const viewerImg = document.getElementById('photo-viewer-img');
  const counter = document.querySelector('.photo-viewer-counter');
  
  viewerImg.src = images[currentPhotoIndex];
  counter.textContent = `${currentPhotoIndex + 1}/${images.length}`;
  viewer.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closePhotoViewer() {
  const viewer = document.getElementById('photo-viewer');
  viewer.classList.remove('active');
  photoViewerActive = false;
  document.body.style.overflow = '';
}

function changePhoto(direction) {
  if (!photoViewerActive) return;
  
  currentPhotoIndex += direction;
  
  if (currentPhotoIndex < 0) {
    currentPhotoIndex = currentPhotoList.length - 1;
  } else if (currentPhotoIndex >= currentPhotoList.length) {
    currentPhotoIndex = 0;
  }
  
  const viewerImg = document.getElementById('photo-viewer-img');
  const counter = document.querySelector('.photo-viewer-counter');
  
  viewerImg.src = currentPhotoList[currentPhotoIndex];
  counter.textContent = `${currentPhotoIndex + 1}/${currentPhotoList.length}`;
}

function updateDaysCounter() {
  const startDate = new Date('2025-02-19');
  const today = new Date();
  const diffTime = Math.abs(today - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  document.getElementById('days-count').textContent = diffDays;
}

// Игра "Найди пару"
function initGame() {
  const gameBoard = document.getElementById('game-board');
  
  const imagePairs = [
    ['images/krasni.jpg', 'images/krasni.jpg'],
    ['images/spim.jpg', 'images/spim.jpg'],
    ['images/new.jpg', 'images/new.jpg'],
    ['images/swag.jpg', 'images/swag.jpg'],
    ['images/swag2.jpg', 'images/swag2.jpg'],
    ['images/lizkokaska.jpg', 'images/lizkokaska.jpg']
  ];
  
  cards = [];
  imagePairs.forEach((pair, index) => {
    cards.push({ id: index, img: pair[0], matched: false });
    cards.push({ id: index, img: pair[1], matched: false });
  });
  
  cards = shuffleArray(cards);
  renderGameBoard();
  
  flippedCards = [];
  matchedPairs = 0;
  attempts = 0;
  document.getElementById('attempts').textContent = attempts;
  document.getElementById('game-message').textContent = '';
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function renderGameBoard() {
  const gameBoard = document.getElementById('game-board');
  gameBoard.innerHTML = '';
  
  cards.forEach((card, index) => {
    const cardElement = document.createElement('div');
    cardElement.className = 'card';
    if (card.matched) {
      cardElement.classList.add('matched');
      cardElement.innerHTML = `<img src="${card.img}" alt="memory" class="game-photo" data-index="${index}">`;
    }
    cardElement.dataset.index = index;
    cardElement.addEventListener('click', () => handleCardClick(index));
    gameBoard.appendChild(cardElement);
  });
  
  setTimeout(() => {
    document.querySelectorAll('.game-photo').forEach(img => {
      img.addEventListener('click', function(e) {
        e.stopPropagation();
        closeAllModals();
        const cardIndex = parseInt(this.dataset.index);
        const card = cards[cardIndex];
        const pairPhotos = cards.filter(c => c.id === card.id).map(c => c.img);
        openPhotoViewer(pairPhotos, 0);
      });
    });
  }, 100);
}

function handleCardClick(index) {
  const card = cards[index];
  const cardElement = document.querySelector(`.card[data-index="${index}"]`);
  
  if (card.matched || flippedCards.includes(index) || flippedCards.length === 2) {
    return;
  }
  
  cardElement.classList.add('flipped');
  cardElement.innerHTML = `<img src="${card.img}" alt="memory" class="game-photo" data-index="${index}">`;
  flippedCards.push(index);
  
  const newImg = cardElement.querySelector('img');
  if (newImg) {
    newImg.addEventListener('click', function(e) {
      e.stopPropagation();
      closeAllModals();
      const cardIndex = parseInt(this.dataset.index);
      const card = cards[cardIndex];
      const pairPhotos = cards.filter(c => c.id === card.id).map(c => c.img);
      openPhotoViewer(pairPhotos, 0);
    });
  }
  
  if (flippedCards.length === 2) {
    attempts++;
    document.getElementById('attempts').textContent = attempts;
    
    const card1 = cards[flippedCards[0]];
    const card2 = cards[flippedCards[1]];
    
    if (card1.id === card2.id) {
      card1.matched = true;
      card2.matched = true;
      matchedPairs++;
      
      setTimeout(() => {
        document.querySelectorAll('.card.flipped').forEach(card => {
          card.classList.remove('flipped');
          card.classList.add('matched');
        });
        flippedCards = [];
        
        if (matchedPairs === cards.length / 2) {
          document.getElementById('game-message').textContent = 'Поздравляю! Ты нашла все пары! ❤️';
          showFireworks();
        }
      }, 500);
    } else {
      setTimeout(() => {
        document.querySelectorAll('.card.flipped').forEach(card => {
          card.classList.remove('flipped');
          card.innerHTML = '';
        });
        flippedCards = [];
      }, 1000);
    }
  }
}

// Музыка
function loadTrack(index) {
  const bgMusic = document.getElementById('bgMusic');
  if (tracks[index]) {
    bgMusic.src = tracks[index];
    document.querySelector('.track-name').textContent = trackNames[index];
    
    bgMusic.addEventListener('loadedmetadata', () => {
      const duration = formatTime(bgMusic.duration);
      document.querySelector('.duration').textContent = duration;
    });
    
    if (isPlaying) {
      bgMusic.play().catch(() => {});
    }
  }
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function togglePlay() {
  const bgMusic = document.getElementById('bgMusic');
  const playBtn = document.querySelector('#playPauseTrack i');
  
  if (bgMusic.paused) {
    bgMusic.play();
    playBtn.className = 'fas fa-pause';
    isPlaying = true;
  } else {
    bgMusic.pause();
    playBtn.className = 'fas fa-play';
    isPlaying = false;
  }
}

function updateProgress() {
  const bgMusic = document.getElementById('bgMusic');
  const progress = document.querySelector('.progress-fill');
  const currentTime = document.querySelector('.current-time');
  
  if (bgMusic.duration) {
    const percent = (bgMusic.currentTime / bgMusic.duration) * 100;
    progress.style.width = percent + '%';
    currentTime.textContent = formatTime(bgMusic.currentTime);
  }
}

function setProgress(e) {
  const bgMusic = document.getElementById('bgMusic');
  const progressBar = document.querySelector('.progress-bar');
  const rect = progressBar.getBoundingClientRect();
  const pos = (e.clientX - rect.left) / rect.width;
  bgMusic.currentTime = pos * bgMusic.duration;
}

// Обработчик входа
document.addEventListener("DOMContentLoaded", () => {
  const loginScreen = document.getElementById("login-screen");
  const congratsScreen = document.getElementById("congrats-screen");
  const passwordInput = document.getElementById("password-input");
  const loginButton = document.getElementById("login-button");
  const errorMessage = document.getElementById("error-message");
  const continueBtn = document.getElementById("continue-to-map");
  const header = document.getElementById("header");
  const controlsPanel = document.querySelector(".controls-panel");
  const bgMusic = document.getElementById("bgMusic");

  loginButton.addEventListener("click", () => {
    const enteredPassword = passwordInput.value.trim();

    if (enteredPassword === PASSWORD) {
      loginScreen.style.opacity = 0;
      
      setTimeout(() => {
        loginScreen.style.display = "none";
        congratsScreen.style.display = "flex";
        startCelebration();
        
        if (tracks[0]) {
          bgMusic.src = tracks[0];
          bgMusic.play().catch(() => {});
          isPlaying = true;
          document.querySelector('#playPauseTrack i').className = 'fas fa-pause';
        }
        
        showFireworks();
        createBalloons(15);
        createConfetti(50);
        createFloatingHearts(20);
        
      }, 500);
    } else {
      errorMessage.textContent = "Неверный пароль. Попробуй еще.";
    }
  });

  continueBtn.addEventListener("click", () => {
    congratsScreen.style.opacity = 0;
    
    setTimeout(() => {
      congratsScreen.style.display = "none";
      header.style.display = "block";
      controlsPanel.style.display = "flex";
      document.getElementById("map").setAttribute("aria-hidden", "false");
      initMap();
      updateDaysCounter();
    }, 500);
  });

  passwordInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      loginButton.click();
    }
  });

  // Музыка
  setTimeout(() => {
    document.getElementById("playPauseTrack").addEventListener("click", togglePlay);
    
    document.getElementById("prevTrack").addEventListener("click", () => {
      currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
      loadTrack(currentTrack);
      if (isPlaying) {
        bgMusic.play();
      }
    });
    
    document.getElementById("nextTrack").addEventListener("click", () => {
      currentTrack = (currentTrack + 1) % tracks.length;
      loadTrack(currentTrack);
      if (isPlaying) {
        bgMusic.play();
      }
    });
    
    bgMusic.addEventListener('timeupdate', updateProgress);
    document.querySelector('.progress-bar').addEventListener('click', setProgress);
    
    document.getElementById('volumeSlider').addEventListener('input', (e) => {
      bgMusic.volume = e.target.value;
    });
    
    bgMusic.addEventListener('ended', () => {
      currentTrack = (currentTrack + 1) % tracks.length;
      loadTrack(currentTrack);
      bgMusic.play();
    });
  }, 1000);
  
  // Игра "Найди пару"
  const modal = document.getElementById('game-modal');
  const gameBtn = document.getElementById('show-game-btn');
  const closeBtn = document.querySelector('.close-btn');
  const resetBtn = document.getElementById('reset-game');
  
  if (gameBtn) {
    gameBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeAllModals();
      modal.style.display = 'block';
      if (!gameStarted) {
        initGame();
        gameStarted = true;
      }
    });
  }
  
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }
  
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      initGame();
    });
  }
  
  // Фото-вьювер
  const viewer = document.getElementById('photo-viewer');
  const viewerClose = document.querySelector('.photo-viewer-close');
  const viewerPrev = document.querySelector('.photo-viewer-prev');
  const viewerNext = document.querySelector('.photo-viewer-next');
  
  if (viewerClose) {
    viewerClose.addEventListener('click', closePhotoViewer);
  }
  
  if (viewerPrev) {
    viewerPrev.addEventListener('click', () => changePhoto(-1));
  }
  
  if (viewerNext) {
    viewerNext.addEventListener('click', () => changePhoto(1));
  }
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
      closePhotoViewer();
    }
    if (e.key === 'ArrowLeft' && photoViewerActive) {
      changePhoto(-1);
    }
    if (e.key === 'ArrowRight' && photoViewerActive) {
      changePhoto(1);
    }
  });
  
  if (viewer) {
    viewer.addEventListener('click', (e) => {
      if (e.target === viewer) {
        closePhotoViewer();
      }
    });
  }
  
  setInterval(updateDaysCounter, 86400000);
});

// Праздничное шоу
function startCelebration() {
  const title = document.querySelector('.congrats-title');
  if (title) title.style.animation = 'heartbeat 1.5s ease infinite';
}

function createBalloons(count) {
  const container = document.getElementById('celebration-container');
  if (!container) return;
  
  const colors = ['🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '❤️', '🧡', '💛', '💚', '💙', '💜'];
  
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const balloon = document.createElement('div');
      balloon.className = 'balloon';
      balloon.textContent = colors[Math.floor(Math.random() * colors.length)];
      balloon.style.left = Math.random() * 100 + '%';
      balloon.style.fontSize = (30 + Math.random() * 30) + 'px';
      balloon.style.animationDuration = (6 + Math.random() * 4) + 's';
      container.appendChild(balloon);
      setTimeout(() => balloon.remove(), 10000);
    }, i * 200);
  }
}

function createConfetti(count) {
  const container = document.getElementById('celebration-container');
  if (!container) return;
  
  const colors = ['#ff6b88', '#ff8e9e', '#ffb6c1', '#ff4757', '#ff6b88', '#ff9a9e'];
  
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.width = (5 + Math.random() * 10) + 'px';
      confetti.style.height = (10 + Math.random() * 20) + 'px';
      confetti.style.animationDuration = (2 + Math.random() * 3) + 's';
      confetti.style.animationDelay = Math.random() * 2 + 's';
      container.appendChild(confetti);
      setTimeout(() => confetti.remove(), 5000);
    }, i * 100);
  }
}

function createFloatingHearts(count) {
  const container = document.getElementById('celebration-container');
  if (!container) return;
  
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const heart = document.createElement('div');
      heart.className = 'floating-heart';
      heart.textContent = '❤️';
      heart.style.left = Math.random() * 100 + '%';
      heart.style.fontSize = (20 + Math.random() * 30) + 'px';
      heart.style.animationDuration = (3 + Math.random() * 3) + 's';
      heart.style.animationDelay = Math.random() * 2 + 's';
      container.appendChild(heart);
      setTimeout(() => heart.remove(), 6000);
    }, i * 300);
  }
}

function showFireworks() {
  let container = document.getElementById("firework-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "firework-container";
    container.style.position = "fixed";
    container.style.top = "0";
    container.style.left = "0";
    container.style.width = "100%";
    container.style.height = "100%";
    container.style.pointerEvents = "none";
    container.style.zIndex = "9999";
    document.body.appendChild(container);
  }

  const colors = ['#FF6B88', '#FFB6C1', '#FFD166', '#06D6A0', '#118AB2', '#073B4C', '#EF476F', '#FFC43D', '#1B9AAA', '#9C89B8'];
  const fireworksCount = 15;
  
  for (let i = 0; i < fireworksCount; i++) {
    setTimeout(() => {
      createFirework(
        container,
        colors[Math.floor(Math.random() * colors.length)],
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight * 0.5 + window.innerHeight * 0.25
      );
    }, i * 300);
  }

  setTimeout(() => {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  }, 5000);
}

function createFirework(container, color, x, y) {
  const particle = document.createElement("div");
  particle.style.position = "absolute";
  particle.style.width = "6px";
  particle.style.height = "6px";
  particle.style.borderRadius = "50%";
  particle.style.backgroundColor = color;
  particle.style.left = x + "px";
  particle.style.top = y + "px";
  particle.style.boxShadow = `0 0 10px ${color}, 0 0 20px ${color}`;
  container.appendChild(particle);

  const particlesCount = 50 + Math.floor(Math.random() * 30);
  const angleIncrement = (Math.PI * 2) / particlesCount;
  const duration = 1000 + Math.random() * 500;
  const distance = 50 + Math.random() * 100;

  setTimeout(() => {
    particle.parentNode.removeChild(particle);

    for (let i = 0; i < particlesCount; i++) {
      const angle = angleIncrement * i;
      const particleDistance = distance * (0.7 + Math.random() * 0.3);
      
      const p = document.createElement("div");
      p.style.position = "absolute";
      p.style.width = "4px";
      p.style.height = "4px";
      p.style.borderRadius = "50%";
      p.style.backgroundColor = color;
      p.style.left = x + "px";
      p.style.top = y + "px";
      p.style.boxShadow = `0 0 5px ${color}, 0 0 10px ${color}`;
      container.appendChild(p);

      const startTime = Date.now();
      const animate = () => {
        const time = Date.now() - startTime;
        const progress = time / duration;
        
        if (progress >= 1) {
          p.parentNode.removeChild(p);
          return;
        }
        
        const currentDistance = particleDistance * (1 - progress);
        const currentX = x + Math.cos(angle) * currentDistance;
        const currentY = y + Math.sin(angle) * currentDistance + (progress * progress * 200);
        
        p.style.transform = `translate(${currentX - x}px, ${currentY - y}px)`;
        p.style.opacity = 1 - progress;
        
        requestAnimationFrame(animate);
      };
      
      requestAnimationFrame(animate);
    }
  }, 500 + Math.random() * 300);
}

// Игра "Наше сердце"
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(initHeartGame, 2000);
});

function initHeartGame() {
  const heartBtn = document.getElementById('heart-btn');
  const heartModal = document.getElementById('heart-modal');
  const closeHeart = document.querySelector('.close-heart');
  const heartGrid = document.getElementById('heart-grid');
  const heartMessage = document.getElementById('heart-message');
  const heartViewer = document.getElementById('heart-photo-viewer');
  const heartPhoto = document.getElementById('heart-photo-img');
  const heartCaption = document.getElementById('heart-photo-caption');
  const heartClose = document.querySelector('.heart-photo-close');
  
  if (!heartBtn) return;
  
  const heartPhotos = [
    { src: 'images/portal.jpg', caption: 'Первый поцелуй 💋' },
    { src: 'images/lizkhome.jpg', caption: 'Володарского 65 🏠' },
    { src: 'images/gpz.jpg', caption: 'ГПЗ, собачки 🐕' },
    { src: 'images/dom.jpg', caption: 'ДК, салют 🎆' },
    { src: 'images/zap.jpg', caption: 'Западная, самовар 🍵' },
    { src: 'images/term.jpg', caption: 'Термоленд, банька 🧖' },
    { src: 'images/gas.jpg', caption: 'ГЭС-2, культура 🎨' },
    { src: 'images/tusa.jpg', caption: 'Тусовка с друзьями 🎉' },
    { src: 'images/chum.jpg', caption: 'Чумодан, антиквариат 🏺' },
    { src: 'images/wine.jpg', caption: 'Набережная, вино 🍷' },
    { src: 'images/china.jpg', caption: 'Китайский парк 🏯' },
    { src: 'images/angel.jpg', caption: 'Наш ангел 😇' }
  ];
  
  heartBtn.addEventListener('click', () => {
    closeAllModals();
    heartModal.style.display = 'block';
    renderHeartGrid();
  });
  
  closeHeart.addEventListener('click', () => {
    heartModal.style.display = 'none';
  });
  
  function renderHeartGrid() {
    heartGrid.innerHTML = '';
    const shuffled = [...heartPhotos].sort(() => Math.random() - 0.5);
    
    shuffled.forEach((photo, index) => {
      const piece = document.createElement('div');
      piece.className = 'heart-piece';
      piece.style.setProperty('--i', index);
      
      const img = document.createElement('img');
      img.src = photo.src;
      img.alt = photo.caption;
      
      piece.appendChild(img);
      
      piece.addEventListener('click', () => {
        heartPhoto.src = photo.src;
        heartCaption.textContent = photo.caption;
        heartViewer.classList.add('active');
        document.body.style.overflow = 'hidden';
        heartMessage.textContent = `❤️ ${photo.caption} ❤️`;
        
        piece.style.animation = 'none';
        piece.offsetHeight;
        piece.style.animation = 'heartBeat 0.5s';
      });
      
      heartGrid.appendChild(piece);
    });
  }
  
  heartClose.addEventListener('click', () => {
    heartViewer.classList.remove('active');
    document.body.style.overflow = '';
  });
  
  heartViewer.addEventListener('click', (e) => {
    if (e.target === heartViewer) {
      heartViewer.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
  
  window.addEventListener('click', (e) => {
    if (e.target === heartModal) {
      heartModal.style.display = 'none';
    }
  });
}

// Игра "Лабиринт любви" - УПРОЩЕННАЯ ВЕРСИЯ
let mazeGame = {
  canvas: null,
  ctx: null,
  player: { x: 1, y: 1 },
  heart: { x: 8, y: 8 },
  cellSize: 60,
  cols: 10,
  rows: 10,
  character: 'egor',
  gameActive: false,
  startTime: null,
  timerInterval: null
};

const mazeLayout = [
  [0,0,0,0,0,0,0,0,0,0],
  [0,1,1,1,0,1,1,1,1,0],
  [0,1,0,1,0,1,0,0,1,0],
  [0,1,0,1,1,1,0,0,1,0],
  [0,1,0,0,0,1,0,0,1,0],
  [0,1,1,1,1,1,0,0,1,0],
  [0,0,0,1,0,0,0,0,1,0],
  [0,1,1,1,1,1,1,1,1,0],
  [0,1,0,0,0,0,0,0,1,0],
  [0,0,0,0,0,0,0,0,0,0]
];

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(initMazeGameSimple, 2000);
});

function initMazeGameSimple() {
  const mazeBtn = document.getElementById('maze-btn');
  const mazeModal = document.getElementById('maze-modal');
  const closeMaze = document.querySelector('.close-maze');
  const chooseEgor = document.getElementById('choose-egor');
  const chooseLiza = document.getElementById('choose-liza');
  const characterSelect = document.getElementById('character-select');
  const mazeGameDiv = document.getElementById('maze-game');
  const mazeWin = document.getElementById('maze-win');
  const resetMaze = document.getElementById('reset-maze');
  const playAgain = document.getElementById('play-again-maze');
  
  if (!mazeBtn || !mazeModal) return;
  
  mazeGame.canvas = document.getElementById('maze-canvas');
  if (mazeGame.canvas) {
    mazeGame.ctx = mazeGame.canvas.getContext('2d');
  }
  
  mazeBtn.addEventListener('click', () => {
    closeAllModals();
    mazeModal.style.display = 'block';
    characterSelect.style.display = 'block';
    mazeGameDiv.style.display = 'none';
    mazeWin.style.display = 'none';
  });
  
  closeMaze.addEventListener('click', () => {
    mazeModal.style.display = 'none';
    stopGameSimple();
  });
  
  if (chooseEgor) {
    chooseEgor.addEventListener('click', () => {
      startGameSimple('egor', 'Егор');
    });
  }
  
  if (chooseLiza) {
    chooseLiza.addEventListener('click', () => {
      startGameSimple('liza', 'Лиза');
    });
  }
  
  function startGameSimple(character, name) {
    mazeGame.character = character;
    mazeGame.player = { x: 1, y: 1 };
    mazeGame.heart = { x: 8, y: 8 };
    
    characterSelect.style.display = 'none';
    mazeGameDiv.style.display = 'block';
    mazeWin.style.display = 'none';
    
    document.getElementById('character-name-display').textContent = name;
    document.getElementById('character-controls-display').textContent = character === 'egor' ? ' (WASD)' : ' (Стрелочки)';
    
    mazeGame.gameActive = true;
    mazeGame.startTime = Date.now();
    startTimerSimple();
    
    drawMazeSimple();
    
    document.addEventListener('keydown', handleMazeKeySimple);
  }
  
  function drawMazeSimple() {
  if (!mazeGame.ctx) return;
  
  const ctx = mazeGame.ctx;
  const cellSize = mazeGame.cellSize;
  
  ctx.clearRect(0, 0, 400, 400);
  
  // Рисуем стены
  for (let row = 0; row < mazeGame.rows; row++) {
    for (let col = 0; col < mazeGame.cols; col++) {
      let x = col * cellSize;
      let y = row * cellSize;
      
      if (mazeLayout[row][col] === 0) {
        ctx.fillStyle = '#2a2a4a';
        ctx.fillRect(x, y, cellSize - 2, cellSize - 2);
        
        // Добавляем текстуру стен
        ctx.strokeStyle = '#4a4a6a';
        ctx.strokeRect(x, y, cellSize - 2, cellSize - 2);
      } else {
        // Рисуем пол
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(x, y, cellSize - 2, cellSize - 2);
        ctx.strokeStyle = '#2a2a4a';
        ctx.strokeRect(x, y, cellSize - 2, cellSize - 2);
      }
    }
  }
  
  // Рисуем сердечко (финиш)
  const heartX = mazeGame.heart.x * cellSize + cellSize/2;
  const heartY = mazeGame.heart.y * cellSize + cellSize/2 - 5;
  ctx.font = '30px Arial';
  ctx.fillStyle = '#ff6b88';
  ctx.fillText('❤️', heartX - 15, heartY + 10);
  
  // Рисуем игрока (ГОЛОВА!)
  const playerX = mazeGame.player.x * cellSize + 2;
  const playerY = mazeGame.player.y * cellSize + 2;
  const playerSize = cellSize - 4;
  
  // Создаем картинку для головы
  const img = new Image();
  img.src = mazeGame.character === 'egor' ? 'images/egor.jpg' : 'images/liza.jpg';
  
  // Рисуем круглую рамку под голову
  ctx.beginPath();
  ctx.arc(playerX + playerSize/2, playerY + playerSize/2, playerSize/2, 0, Math.PI * 2);
  ctx.fillStyle = mazeGame.character === 'egor' ? 'rgba(74, 144, 226, 0.3)' : 'rgba(255, 107, 136, 0.3)';
  ctx.fill();
  ctx.strokeStyle = mazeGame.character === 'egor' ? '#4a90e2' : '#ff6b88';
  ctx.lineWidth = 3;
  ctx.stroke();
  
  // Рисуем голову из картинки
  if (img.complete) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(playerX + playerSize/2, playerY + playerSize/2, playerSize/2 - 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img, playerX, playerY, playerSize, playerSize);
    ctx.restore();
  } else {
    // Если картинка не загрузилась, показываем эмодзи
    img.onload = function() {
      drawMazeSimple(); // перерисовываем когда загрузится
    };
    ctx.font = '30px Arial';
    ctx.fillStyle = mazeGame.character === 'egor' ? '#4a90e2' : '#ff6b88';
    ctx.fillText(mazeGame.character === 'egor' ? '👨' : '👩', playerX + 5, playerY + 30);
  }
}
  
  function handleMazeKeySimple(e) {
    if (!mazeGame.gameActive) return;
    
    const key = e.key.toLowerCase();
    let newX = mazeGame.player.x;
    let newY = mazeGame.player.y;
    
    if (key === 'arrowup' || key === 'w') newY--;
    else if (key === 'arrowdown' || key === 's') newY++;
    else if (key === 'arrowleft' || key === 'a') newX--;
    else if (key === 'arrowright' || key === 'd') newX++;
    else return;
    
    if (mazeLayout[newY] && mazeLayout[newY][newX] === 1) {
      mazeGame.player.x = newX;
      mazeGame.player.y = newY;
      drawMazeSimple();
      
      if (mazeGame.player.x === mazeGame.heart.x && mazeGame.player.y === mazeGame.heart.y) {
        winGameSimple();
      }
    }
  }
  
  function winGameSimple() {
    mazeGame.gameActive = false;
    stopTimerSimple();
    
    document.getElementById('maze-game').style.display = 'none';
    document.getElementById('maze-win').style.display = 'block';
    
    const winHeart = document.getElementById('win-heart');
    const winMessage = document.getElementById('win-message');
    
    winHeart.innerHTML = '❤️';
    winMessage.textContent = mazeGame.character === 'egor' ? 'Ты нашел сердечко! ❤️' : 'Ты нашла сердечко! ❤️';
  }
  
  function startTimerSimple() {
    mazeGame.timerInterval = setInterval(() => {
      if (!mazeGame.gameActive) return;
      
      const elapsed = Math.floor((Date.now() - mazeGame.startTime) / 1000);
      const minutes = Math.floor(elapsed / 60);
      const seconds = elapsed % 60;
      
      document.getElementById('maze-timer').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
  }
  
  function stopTimerSimple() {
    if (mazeGame.timerInterval) {
      clearInterval(mazeGame.timerInterval);
    }
  }
  
  function stopGameSimple() {
    mazeGame.gameActive = false;
    stopTimerSimple();
    document.removeEventListener('keydown', handleMazeKeySimple);
  }
  
  if (resetMaze) {
    resetMaze.addEventListener('click', () => {
      characterSelect.style.display = 'block';
      document.getElementById('maze-game').style.display = 'none';
      document.getElementById('maze-win').style.display = 'none';
      stopGameSimple();
    });
  }
  
  if (playAgain) {
    playAgain.addEventListener('click', () => {
      characterSelect.style.display = 'block';
      document.getElementById('maze-game').style.display = 'none';
      document.getElementById('maze-win').style.display = 'none';
      stopGameSimple();
    });
  }
  
  window.addEventListener('click', (e) => {
    if (e.target === mazeModal) {
      mazeModal.style.display = 'none';
      stopGameSimple();
    }
  });
}