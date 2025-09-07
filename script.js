const startBtn = document.getElementById("start-btn");
const canvas = document.getElementById("canvas");
const startScreen = document.querySelector(".start-screen");
const checkpointScreen = document.querySelector(".checkpoint-screen");
const checkpointMessage = document.querySelector(".checkpoint-screen > p");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

let gravity = 1;
let isCheckpointCollisionDetectionActive = true;
let animationId;

// ✅ Reusable AABB Collision Function
function isColliding(rectA, rectB) {
  return (
    rectA.position.x < rectB.position.x + rectB.width &&
    rectA.position.x + rectA.width > rectB.position.x &&
    rectA.position.y < rectB.position.y + rectB.height &&
    rectA.position.y + rectA.height > rectB.position.y
  );
}

// ✅ Player Class with Simple Rectangle Animation
class Player {
  constructor() {
    this.position = { x: 100, y: 100 };
    this.velocity = { x: 0, y: 1 };
    this.width = 30;
    this.height = 30;
    this.speed = 5;
    this.color = "#FF4500"; // default color
  }

  draw() {
    // Change color based on state (simple animation)
    if (this.velocity.y < 0) {
      this.color = "#1E90FF"; // Jumping = Blue
    } else if (this.velocity.y > 1) {
      this.color = "#FFD700"; // Falling = Yellow
    } else if (this.velocity.x !== 0) {
      this.color = "#32CD32"; // Moving = Green
    } else {
      this.color = "#FF4500"; // Idle = Red-Orange
    }

    ctx.fillStyle = this.color;
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // Gravity
    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity;
    }

    this.draw();
  }
}

// ✅ Platform Class
class Platform {
  constructor(x, y, width, height) {
    this.position = { x, y };
    this.width = width;
    this.height = height;
  }
  draw() {
    ctx.fillStyle = "#654321";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

// ✅ Enemy Class
class Enemy {
  constructor(x, y, width, height, speed) {
    this.position = { x, y };
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.direction = 1;
  }
  draw() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
  update() {
    this.position.x += this.speed * this.direction;

    // Bounce at canvas edges
    if (this.position.x <= 0 || this.position.x + this.width >= canvas.width) {
      this.direction *= -1;
    }
    this.draw();
  }
}

// ✅ Checkpoint Class
class Checkpoint {
  constructor(x, y, width, height) {
    this.position = { x, y };
    this.width = width;
    this.height = height;
    this.claimed = false;
  }
  draw() {
    ctx.fillStyle = this.claimed ? "gray" : "yellow";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
  claim() {
    this.claimed = true;
  }
}

// ✅ Initialize Game Objects
let player = new Player();
let platforms = [new Platform(0, canvas.height - 50, canvas.width, 50)];
let enemies = [new Enemy(400, canvas.height - 80, 30, 30, 2)];
let checkpoints = [
  new Checkpoint(600, canvas.height - 80, 30, 30),
  new Checkpoint(1200, canvas.height - 80, 30, 30),
];

// ✅ Keyboard Controls
const keys = { ArrowRight: { pressed: false }, ArrowLeft: { pressed: false } };

function movePlayer(key, velocity, isPressed) {
  if (key in keys) {
    keys[key].pressed = isPressed;
    if (key === "ArrowRight") player.velocity.x = isPressed ? velocity : 0;
    if (key === "ArrowLeft") player.velocity.x = isPressed ? -velocity : 0;
  }
}

// ✅ Animate Loop
function animate() {
  animationId = requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  player.update();
  platforms.forEach((platform) => platform.draw());
  enemies.forEach((enemy) => enemy.update());
  checkpoints.forEach((checkpoint) => checkpoint.draw());

  // ✅ Platform Collision
  platforms.forEach((platform) => {
    if (
      player.position.x < platform.position.x + platform.width &&
      player.position.x + player.width > platform.position.x &&
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >=
        platform.position.y
    ) {
      player.velocity.y = 0;
      player.position.y = platform.position.y - player.height;
    }
  });

  // ✅ Checkpoint Collision
  if (isCheckpointCollisionDetectionActive) {
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
            showCheckpointScreen("✅ You reached a checkpoint!");
          }
        }
      }
    });
  }
}

// ✅ Show Checkpoint Messages
function showCheckpointScreen(message) {
  checkpointMessage.textContent = message;
  checkpointScreen.style.display = "flex";
  setTimeout(() => (checkpointScreen.style.display = "none"), 2000);
}

// ✅ Controls
addEventListener("keydown", ({ key }) => {
  if (key === "ArrowRight") movePlayer(key, player.speed, true);
  if (key === "ArrowLeft") movePlayer(key, player.speed, true);
  if (key === "ArrowUp" && player.velocity.y === 0) player.velocity.y -= 20;
});
addEventListener("keyup", ({ key }) => {
  if (key === "ArrowRight" || key === "ArrowLeft") movePlayer(key, 0, false);
});

// ✅ Start Game
startBtn.addEventListener("click", () => {
  startScreen.style.display = "none";
  animate();
});
