/*
@author: Zigao Wang
@title: Dino Game
@tags: ['game', 'jump', 'obstacle']
@addedOn: 2024-07-24
*/

// define the sprites in our game
const dino = "d";
const ground = "g";
const cactus = "c";
const sky = "s";

// assign bitmap art to each sprite
setLegend(
  [ dino, bitmap`
................
................
.....0000.......
....022220......
....022220......
....022220......
....022220......
....022220......
....022220......
....022220......
....022220......
....022220......
....011110......
.....0000.......
................
................`],
  [ ground, bitmap`
7777777777777777
7777777777777777
7777777777777777
7777777777777777
7777777777777777
7777777777777777
7777777777777777
7777777777777777
7777777777777777
7777777777777777
7777777777777777
7777777777777777
7777777777777777
7777777777777777
7777777777777777
7777777777777777`],
  [ cactus, bitmap`
................
....333.........
....333.........
....333.........
....333.........
....333.........
....333.........
....333.........
....333.........
....333.........
....333.........
....333.........
....333.........
....333.........
....333.........
....333.........`],
  [ sky, bitmap`
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111`]
);

(function() {
  const width = 16;
  const height = 8;
  const groundLevel = height - 2;

  // create the initial game map
  let gameMap = Array.from({ length: height }, (_, y) => {
    return Array.from({ length: width }, (_, x) => {
      if (y === groundLevel) return "g";
      else return "s";
    }).join("");
  }).join("\n");

  setMap(map`${gameMap}`);

  setSolids([ dino, ground ]); // other sprites cannot go inside of these sprites

  // Add the dino to the initial position
  addSprite(1, groundLevel - 1, dino);

  // Variables for game state
  let isJumping = false;
  let jumpHeight = 0;
  let jumpSpeed = 1;
  let gravity = 1;
  let score = 0;
  let gameOver = false;

  // Function to handle jump
  function jump() {
    if (!isJumping && !gameOver) {
      isJumping = true;
      jumpHeight = 4; // Set jump height
    }
  }

  // Function to add a new obstacle
  function addObstacle() {
    if (!gameOver) {
      addSprite(width - 1, groundLevel - 1, cactus);
    }
  }

  // Function to update game state
  function updateGame() {
    if (gameOver) return;

    const dinoSprite = getFirst(dino);

    // Handle jumping
    if (isJumping) {
      dinoSprite.y -= jumpSpeed;
      jumpHeight -= jumpSpeed;

      if (jumpHeight <= 0) {
        isJumping = false;
      }
    } else if (dinoSprite.y < groundLevel - 1) {
      // Apply gravity
      dinoSprite.y += gravity;
    }

    // Move obstacles
    getAll(cactus).forEach(cactusSprite => {
      cactusSprite.x -= 1;
      if (cactusSprite.x < 0) {
        cactusSprite.remove();
      }
    });

    // Check for collision
    if (tilesWith(dino, cactus).length > 0) {
      addText("Game Over!", { y: 4, color: color`3` });
      gameOver = true;
      clearInterval(gameInterval);
      clearInterval(obstacleInterval);
    } else {
      clearText();
      addText(`Score: ${score}`, { y: 1, color: color`3` });
    }
  }

  // Function to update score
  function updateScore() {
    if (!gameOver) {
      score += 1;
    }
  }

  // inputs for player movement control
  onInput("w", jump);

  // Game loop
  const gameInterval = setInterval(updateGame, 100);

  // Add obstacles at random intervals
  const obstacleInterval = setInterval(() => {
    addObstacle();
    // Randomize next obstacle interval between 800ms to 1200ms
    clearInterval(obstacleInterval);
    setTimeout(() => {
      obstacleInterval = setInterval(addObstacle, Math.random() * 400 + 800);
    }, Math.random() * 400 + 800);
  }, Math.random() * 400 + 800);

  // Update score every second
  setInterval(updateScore, 1000);
})();