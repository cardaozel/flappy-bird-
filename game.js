const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startScreen = document.getElementById('startScreen');
const scoreDisplay = document.getElementById('scoreDisplay');

// Oyun ayarları
const GRAVITY = 0.5;
const FLAP_FORCE = -9;
const PIPE_SPEED = 3;
const PIPE_GAP = 150;
const PIPE_WIDTH = 60;
const BIRD_SIZE = 30;

// Oyun durumu
let bird = {
  x: 80,
  y: 250,
  velocity: 0
};

let pipes = [];
let score = 0;
let gameRunning = false;
let gameOver = false;
let frameCount = 0;

function init() {
  bird = { x: 80, y: 250, velocity: 0 };
  pipes = [];
  score = 0;
  gameRunning = false;
  gameOver = false;
  frameCount = 0;
  scoreDisplay.textContent = '0';
  startScreen.classList.remove('hidden');
  startScreen.querySelector('p').textContent = 'Click or press Space to start';
}

function startGame() {
  if (!gameOver) {
    gameRunning = true;
    startScreen.classList.add('hidden');
  } else {
    gameOver = false;
    init();
    startGame();
  }
}

function spawnPipe() {
  const minHeight = 80;
  const maxHeight = canvas.height - PIPE_GAP - 80;
  const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
  
  pipes.push({
    x: canvas.width,
    topHeight,
    passed: false
  });
}

function drawBird() {
  ctx.save();
  ctx.translate(bird.x, bird.y);
  
  // Kuş gövdesi (sarı)
  ctx.fillStyle = '#F1C40F';
  ctx.beginPath();
  ctx.ellipse(0, 0, BIRD_SIZE / 2, BIRD_SIZE, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Göz
  ctx.fillStyle = '#2C3E50';
  ctx.beginPath();
  ctx.arc(BIRD_SIZE / 4, -BIRD_SIZE / 6, 6, 0, Math.PI * 2);
  ctx.fill();
  
  // Göz parıltısı
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(BIRD_SIZE / 4 + 2, -BIRD_SIZE / 6 - 1, 2, 0, Math.PI * 2);
  ctx.fill();
  
  // Gaga
  ctx.fillStyle = '#E67E22';
  ctx.beginPath();
  ctx.moveTo(BIRD_SIZE / 2, 0);
  ctx.lineTo(BIRD_SIZE / 2 + 15, BIRD_SIZE / 6);
  ctx.lineTo(BIRD_SIZE / 2, BIRD_SIZE / 3);
  ctx.closePath();
  ctx.fill();
  
  ctx.restore();
}

function drawPipes() {
  pipes.forEach(pipe => {
    // Üst boru
    ctx.fillStyle = '#27AE60';
    ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
    
    ctx.strokeStyle = '#1E8449';
    ctx.lineWidth = 3;
    ctx.strokeRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
    
    // Boru ağzı (üst)
    ctx.fillStyle = '#229954';
    ctx.fillRect(pipe.x - 5, pipe.topHeight - 30, PIPE_WIDTH + 10, 30);
    
    // Alt boru
    const bottomY = pipe.topHeight + PIPE_GAP;
    const bottomHeight = canvas.height - bottomY;
    
    ctx.fillStyle = '#27AE60';
    ctx.fillRect(pipe.x, bottomY, PIPE_WIDTH, bottomHeight);
    
    ctx.strokeStyle = '#1E8449';
    ctx.strokeRect(pipe.x, bottomY, PIPE_WIDTH, bottomHeight);
    
    // Boru ağzı (alt)
    ctx.fillStyle = '#229954';
    ctx.fillRect(pipe.x - 5, bottomY, PIPE_WIDTH + 10, 30);
  });
}

function updateBird() {
  bird.velocity += GRAVITY;
  bird.y += bird.velocity;
  
  // Zemin/tavan kontrolü
  if (bird.y < BIRD_SIZE || bird.y > canvas.height - BIRD_SIZE) {
    endGame();
  }
}

function updatePipes() {
  if (frameCount % 90 === 0 && gameRunning) {
    spawnPipe();
  }
  
  pipes.forEach(pipe => {
    pipe.x -= PIPE_SPEED;
    
    // Skor (boruyu geçti mi?)
    if (!pipe.passed && pipe.x + PIPE_WIDTH < bird.x) {
      pipe.passed = true;
      score++;
      scoreDisplay.textContent = score;
    }
  });
  
  // Ekrandan çıkan boruları kaldır
  pipes = pipes.filter(pipe => pipe.x + PIPE_WIDTH > 0);
}

function checkCollision() {
  const birdLeft = bird.x - BIRD_SIZE / 2;
  const birdRight = bird.x + BIRD_SIZE / 2;
  const birdTop = bird.y - BIRD_SIZE;
  const birdBottom = bird.y + BIRD_SIZE;
  
  for (const pipe of pipes) {
    const pipeLeft = pipe.x;
    const pipeRight = pipe.x + PIPE_WIDTH;
    const pipeTopBottom = pipe.topHeight;
    const pipeBottomTop = pipe.topHeight + PIPE_GAP;
    
    if (birdRight > pipeLeft && birdLeft < pipeRight) {
      if (birdTop < pipeTopBottom || birdBottom > pipeBottomTop) {
        endGame();
      }
    }
  }
}

function endGame() {
  gameRunning = false;
  gameOver = true;
  startScreen.classList.remove('hidden');
  startScreen.querySelector('p').textContent = `Game Over! Score: ${score} — Click to play again`;
}

function draw() {
  // Arka plan
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#87CEEB');
  gradient.addColorStop(0.5, '#E0F6FF');
  gradient.addColorStop(1, '#90EE90');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Bulutlar
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.beginPath();
  ctx.arc(80, 80, 25, 0, Math.PI * 2);
  ctx.arc(110, 80, 35, 0, Math.PI * 2);
  ctx.arc(140, 80, 25, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(280, 120, 30, 0, Math.PI * 2);
  ctx.arc(320, 120, 40, 0, Math.PI * 2);
  ctx.arc(360, 120, 25, 0, Math.PI * 2);
  ctx.fill();
  
  // Çim
  ctx.fillStyle = '#27AE60';
  ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
  
  drawPipes();
  drawBird();
}

function gameLoop() {
  if (gameRunning) {
    updateBird();
    updatePipes();
    checkCollision();
  }
  
  draw();
  frameCount++;
  requestAnimationFrame(gameLoop);
}

// Kontroller
canvas.addEventListener('click', () => {
  if (!gameRunning) {
    startGame();
  } else {
    bird.velocity = FLAP_FORCE;
  }
});

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    if (!gameRunning) {
      startGame();
    } else {
      bird.velocity = FLAP_FORCE;
    }
  }
});

// Mobil: dokunma
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  if (!gameRunning) {
    startGame();
  } else {
    bird.velocity = FLAP_FORCE;
  }
});

init();
gameLoop();
