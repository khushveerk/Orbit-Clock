# Orbit-Clock

A minimal live clock with a 3D procedural solar-system background. 
It's more like a Modern Calendar Clock.

## Features
🕒 Clock UI

-Circular rings showing month, day, and date, with live highlighting.
-Smooth analog clock hands (hour, minute, second).
-Fully responsive layout.

🌌 3D Background (Three.js)

-Interactive starfield and multiple rotating planets.

-Click anywhere to toggle fast-forward planetary motion.

-Resize handling ensures proper scaling on all screen sizes.

## 📁 Project Structure

### orbit-clock/

│

├── index.html        # Main entry file combining UI + 3D background

├── style.css         # Clock layout, rings, and general styling

├── clock.js          # Ring generation + clock logic (createRingItems, updateClock)

├── background.js     # Three.js planets, starfield, animation loop

├── screenshots/      

└── README.md

## 🧠 How It Works

#### Ring Logic

- createRingItems() generates .ring-item elements for months, days, dates.
- CSS transforms position these items in circular rings.

#### Clock Updates

- updateClock() reads real-time values and:

- Rotates each ring so the current value aligns at the top.

- Updates analog clock hands.

#### 3D Scene (Three.js)

- background.js creates:
- A responsive starfield
- A system of procedural planets, using the planetsData array
- animate() drives continuous or fast-forward motion.

## Customization ideas

- Adjust ring radii or fonts in style.css.
- Modify months/days/dates or visual behavior in clock.js.
- Tweak planets, colors, or speeds in background.js via the planetsData array.
