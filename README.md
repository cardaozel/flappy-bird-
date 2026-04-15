# Flappy Bird (Browser Game)

A lightweight, vanilla JavaScript Flappy Bird clone built with HTML5 Canvas.

No frameworks, no build step, and no dependencies are required. Open the game in your browser and play.

## Demo

Run locally:

```bash
open index.html
```

Or serve with a local static server:

```bash
npx serve .
```

Then open the URL shown in your terminal (commonly `http://localhost:3000`).

## Gameplay

- Start the game with click/tap or `Space`
- Keep the bird in the air by flapping
- Pass through pipe gaps to increase score
- Game ends when you hit a pipe, the ceiling, or the ground

## Controls

- `Space`: flap / start / restart
- Mouse click on canvas: flap / start / restart
- Touch on canvas (mobile): flap / start / restart

## Project Structure

```text
.
├── index.html   # Page layout and canvas mount point
├── style.css    # UI styling
└── game.js      # Core game loop, physics, rendering, input
```

## Tech Stack

- HTML5
- CSS3
- JavaScript (ES6)
- Canvas API

## Tune Game Difficulty

Edit constants in `game.js`:

- `GRAVITY`
- `FLAP_FORCE`
- `PIPE_SPEED`
- `PIPE_GAP`
- `PIPE_WIDTH`
- `BIRD_SIZE`

## Notes

- The game runs fully in the browser.
- Google Fonts is loaded in `index.html` for the title/font style.

