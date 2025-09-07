const startBtn = document.getElementById("start-btn");
const canvas = document.getElementById("canvas");
const startScreen = document.querySelector(".start-screen");
const checkpointScreen = document.querySelector(".checkpoint-screen");
const checkpointMessage = document.querySelector(".checkpoint-screen > p");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

const gravity = 0.5;
let isCheckpointCollisionDetectionActive = true;
let score = 0;
let animationId;

// Background layers
const bgLayers = [
  { x: 0, y: 0, speed: 0.2, color: "#87CEFA" }, // sky
  { x: 0, y: canvas.height - 150, speed: 0.5, color: "#90EE90" }, // hills
];

// Helper
const proportionalSize = (size) =>
  innerHeight < 500 ? Math.ceil((size / 500) * innerHeight) : size;

// AABB collision detection
function isColliding(rectA, rectB) {
  return (
    rectA.position.x < rectB.position.x + rectB.width &&
    rectA.position.x + rectA.width > rectB.position.x &&
    rectA.position.y < rectB.position.y + rectB.height &&
    rectA.position.y + rectA.height > rectB.position.y
  );
}

class Player {
  constructor() {
    this.position = { x: proportionalSize(10), y: proportionalSize(400) };
    this.velocity = { x: 0, y: 0 };
    this.width = proportionalSize(40);
    this.height = proportionalSize(40);
  }
  draw() {
    // Visual animation feedback based on state
    if (this.velocity.y < 0) {
      ctx.fillStyle = "#1E90FF"; // jumping = blue
    } else if (this.velocity.x !== 0) {
      ctx.fillStyle = "#32CD32"; // moving = green
    } else {
      ctx.fillStyle = "#FF4500"; // idle = orange/red
    }
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      if (this.position.y < 0) {
        this.position.y = 0;
        this.velocity.y = gravity;
      }
      this.velocity.y += gravity;
    } else {
      this.velocity.y = 0;
    }

    if (this.position.x < this.width) this.position.x = this.width;
    if (this.position.x >= canvas.width - this.width * 2)
      this.position.x = canvas.width - this.width * 2;
  }
}

class Platform {
  constructor(x, y) {
    this.position = { x, y };
    this.width = 200;
    this.height = proportionalSize(40);
  }
  draw() {
    ctx.fillStyle = "#556B2F";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

class CheckPoint {
  constructor(x, y, z) {
    this.position = { x, y };
    this.width = proportionalSize(40);
    this.height = proportionalSize(70);
    this.claimed = false;
  }
  draw() {
    if (!this.claimed) {
      ctx.fillStyle = "#FFD700";
      ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
  }
  claim() {
    this.claimed = true;
    score += 100;
  }
}

class Enemy {
  constructor(x, y, width, height, speed) {
    this.position = { x, y };
    this.width = width;
    this.height = height;
    this.speed = speed;
  }
  draw() {
    ctx.fillStyle = "#8B0000";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
  update() {
    this.position.x += this.speed;
    if (this.position.x < 0 || this.position.x + this.width > canvas.width * 2)
      this.speed *= -1;
    this.draw();
  }
}

let player = new Player();

const platforms = [
  { x: 500, y: proportionalSize(450) },
  { x: 700, y: proportionalSize(400) },
  { x: 850, y: proportionalSize(350) },
  { x: 900, y: proportionalSize(350) },
  { x: 1050, y: proportionalSize(150) },
  { x: 2500, y: proportionalSize(450) },
  { x: 2900, y: proportionalSize(400) },
  { x: 3150, y: proportionalSize(350) },
  { x: 3900, y: proportionalSize(450) },
  { x: 4200, y: proportionalSize(400) },
  { x: 4400, y: proportionalSize(200) },
  { x: 4700, y: proportionalSize(150) },
].map((p) => new Platform(p.x, p.y));

const checkpoints = [
  { x: 1170, y: proportionalSize(80), z: 1 },
  { x: 2900, y: proportionalSize(330), z: 2 },
  { x: 4800, y: proportionalSize(80), z: 3 },
].map((c) => new CheckPoint(c.x, c.y, c.z));

const enemies = [
  new Enemy(1500, proportionalSize(420), 50, 50, 2),
  new Enemy(3300, proportionalSize(370), 50, 50, 3),
];

// Game Reset
function resetGame() {
  player = new Player();
  checkpoints.forEach((cp) => (cp.claimed = false));
  isCheckpointCollisionDetectionActive = true;
  score = 0;
  animate();
}

const animate = () => {
  animationId = requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background
  bgLayers.forEach((layer) => {
    ctx.fillStyle = layer.color;
    ctx.fillRect(layer.x, layer.y, canvas.width, canvas.height);
  });

  platforms.forEach((platform) => platform.draw());
  checkpoints.forEach((checkpoint) => checkpoint.draw());
  enemies.forEach((enemy) => enemy.update());
  player.update();

  // Movement logic
  if (keys.rightKey.pressed && player.position.x < proportionalSize(400)) {
    player.velocity.x = 5;
  } else if (keys.leftKey.pressed && player.position.x > proportionalSize(100)) {
    player.velocity.x = -5;
  } else {
    player.velocity.x = 0;
    if (keys.rightKey.pressed && isCheckpointCollisionDetectionActive) {
      platforms.forEach((platform) => (platform.position.x -= 5));
      checkpoints.forEach((checkpoint) => (checkpoint.position.x -= 5));
      enemies.forEach((enemy) => (enemy.position.x -= 5));
    } else if (keys.leftKey.pressed && isCheckpointCollisionDetectionActive) {
      platforms.forEach((platform) => (platform.position.x += 5));
      checkpoints.forEach((checkpoint) => (checkpoint.position.x += 5));
      enemies.forEach((enemy) => (enemy.position.x += 5));
    }
  }

  // Platform collision
  platforms.forEach((platform) => {
    if (
      player.position.x < platform.position.x + platform.width &&
      player.position.x + player.width > platform.position.x &&
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >= platform.position.y
    ) {
      player.velocity.y = 0;
      player.position.y = platform.position.y - player.height;
    }
  });

  // Checkpoint collision
  checkpoints.forEach((checkpoint, index) => {
    if (
      isColliding(player, checkpoint) &&
      (index === 0 || checkpoints[index - 1].claimed)
    ) {
      if (!checkpoint.claimed) {
        checkpoint.claim();
        if (index === checkpoints.length - 1) {
          isCheckpointCollisionDetectionActive = false;
          showCheckpointScreen("🎉 You reached the final checkpoint!");
          movePlayer("ArrowRight", 0, false);
        } else {
          showCheckpointScreen("✔️ Checkpoint reached!");
        }
      }
    }
  });

  // Enemy collision
  enemies.forEach((enemy) => {
    if (isColliding(player, enemy)) {
      cancelAnimationFrame(animationId);
      showCheckpointScreen("💀 Game Over! Try Again.");
      setTimeout(() => resetGame(), 2000);
    }
  });
};

const keys = { rightKey: { pressed: false }, leftKey: { pressed: false } };

const movePlayer = (key, xVelocity, isPressed) => {
  if (!isCheckpointCollisionDetectionActive) {
    player.velocity.x = 0;
    player.velocity.y = 0;
    return;
  }
  switch (key) {
    case "ArrowLeft":
      keys.leftKey.pressed = isPressed;
      player.velocity.x = isPressed ? -xVelocity : 0;
      break;
    case "ArrowUp":
    case " ":
    case "Spacebar":
      player.velocity.y -= 8;
      break;
    case "ArrowRight":
      keys.rightKey.pressed = isPressed;
      player.velocity.x = isPressed ? xVelocity : 0;
      break;
  }
};

const startGame = () => {
  canvas.style.display = "block";
  startScreen.style.display = "none";
  animate();
};

const showCheckpointScreen = (msg) => {
  checkpointScreen.style.display = "block";
  checkpointMessage.textContent = msg;
  if (isCheckpointCollisionDetectionActive) {
    setTimeout(() => (checkpointScreen.style.display = "none"), 2000);
  }
};

startBtn.addEventListener("click", startGame);
window.addEventListener("keydown", ({ key }) => movePlayer(key, 8, true));
window.addEventListener("keyup", ({ key }) => movePlayer(key, 0, false));
