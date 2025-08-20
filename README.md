# Platformer Game 🚀

A fun and interactive 2D platformer game built with **HTML, CSS, and JavaScript**. The player navigates through platforms, collects checkpoints, avoids enemies, and completes levels. This project demonstrates game development concepts in the browser using the Canvas API.

---

## 🎮 How to Play

1. Press the **Start Game** button to begin.
2. Use **Arrow Keys** or **Spacebar** to move:
   - `Arrow Right` → Move right
   - `Arrow Left` → Move left
   - `Arrow Up` / `Spacebar` → Jump
3. Reach checkpoints to score points.
4. Avoid enemies—colliding with them will reset your position.
5. Complete all checkpoints to finish the level.
6. Multiple stages with increasing difficulty and moving hazards are included.
7. Enjoy a visually engaging game with parallax scrolling and colorful elements.

---

## 🛠 Features & Improvements

- **Player Character:** Bright orange block for visibility.
- **Platforms:** Dark green platforms with collision detection.
- **Checkpoints:** Yellow blocks that disappear when claimed.
- **Enemies:** Moving red blocks as hazards.
- **Score System:** Points awarded for reaching checkpoints.
- **Multiple Stages:** Different levels with increasing difficulty.
- **Parallax Background:** Sky and hills for depth perception.
- **Responsive Design:** Game adjusts to the window size.
- **Game-friendly Colors:** High-contrast colors for better visibility.

---

## 💻 Concepts Learned

- **Canvas API:** Drawing and animating 2D graphics in the browser.
- **Object-Oriented Programming (OOP):** Classes for `Player`, `Platform`, `CheckPoint`, `Enemy`.
- **Collision Detection:** Platforms, checkpoints, and enemies.
- **Game Physics:** Gravity, jumping mechanics, and horizontal movement.
- **Animation Loop:** `requestAnimationFrame` for smooth gameplay.
- **Event Handling:** Keydown and keyup events for player movement.
- **Dynamic Arrays:** Mapping positions to platforms, checkpoints, and enemies.
- **UI Overlay:** Displaying checkpoint messages and score.

---

## 🗂 Project Structure

platformer-game/
│
├─ index.html # Main HTML file
├─ style.css # Game and UI styling
├─ script.js # Game logic
├─ assets/ # Images, background, icons (optional)
│
└─ README.md # Project documentation

---

## ⚡ Technologies Used

- **HTML5** – Structure and elements.
- **CSS3** – Styling and responsive layout.
- **JavaScript** – Game logic, physics, and animations.
- **Canvas API** – Rendering game elements.

---

## 📌 How Code Works

1. **Initialization:** Canvas, player, platforms, checkpoints, and enemies are created.
2. **Game Loop:** `animate()` updates game state, moves platforms/enemies, and checks collisions.
3. **Collision Detection:** Determines interactions with platforms, checkpoints, and enemies.
4. **Checkpoint Handling:** Player claims checkpoints and gets feedback via the overlay.
5. **Enemies Movement:** Enemies move automatically and bounce within boundaries.
6. **Player Movement:** Handled via event listeners and velocity changes.

---

## 🚀 Future Improvements

- Add **power-ups** (speed boost, invincibility).
- Add **sound effects** and **background music**.
- Implement **high-score system** with localStorage.
- Add more **levels and difficulty scaling**.
- Mobile-friendly **touch controls**.

