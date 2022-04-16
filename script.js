const hero = document.getElementById("hero");
const playArea = document.getElementById("main-play-area");
const monsters = [
  "imgs/monster01.png",
  "imgs/monster02.png",
  "imgs/monster03.png",
];
const gameInfo = document.querySelector(".game-info");
const startButton = document.querySelector(".game-start-button");

// sound

const gameMainMusic = document.getElementById("game-main-music");
const gameOverMusic = document.getElementById("game-over-music");
const gameShot = document.getElementById("game-shot");
const gameExplosion = document.getElementById("game-explosion");

// Ship Actions

let shipSpeed = 30;
let shootSpeed = 8;
let monsterSpeed = 4;
let monsterInterval;

let KEY = {
  W: 87, // up
  S: 83, // down
  D: 68, // shot
  arrowUp: 38,
  arrowDown: 40,
  space: 32,
};

function shipActions(event) {
  if (event.keyCode == KEY.W || event.keyCode == KEY.arrowUp) {
    event.preventDefault();
    moveUp();
  }
  if (event.keyCode == KEY.S || event.keyCode == KEY.arrowDown) {
    event.preventDefault();
    moveDown();
  }
  if (event.keyCode == KEY.D || event.keyCode == KEY.space) {
    event.preventDefault();
    shoot();
  }
}

function moveUp() {
  let topPosition = getComputedStyle(hero).top;
  if (parseInt(topPosition) !== 10) {
    hero.style.top = parseInt(topPosition) - shipSpeed + "px";
  }
}

function moveDown() {
  let topPosition = getComputedStyle(hero).top;
  if (parseInt(topPosition) !== 700) {
    hero.style.top = parseInt(topPosition) + shipSpeed + "px";
  }
}

function shoot() {
  let shoot = createShootElement();
  playArea.appendChild(shoot);
  gameShot.play();
  moveShoot(shoot);
}

function createShootElement() {
  let xPosition = parseInt(getComputedStyle(hero).left);
  let yPosition = parseInt(getComputedStyle(hero).top);
  let shoot = document.createElement("img");
  shoot.src = "imgs/shoot.png";
  shoot.classList.add("shoot");
  shoot.style.left = `${xPosition}px`;
  shoot.style.top = `${yPosition}px`;
  return shoot;
}

function moveShoot(shoot) {
  let shootInterval = setInterval(() => {
    const shootPosition = shoot.style.left;
    const monsters = document.querySelectorAll(".monster");
    const playAreaWidth = parseInt(getComputedStyle(playArea).width) - 350;

    if (parseInt(shootPosition) < playAreaWidth) {
      shoot.style.left = `${parseInt(shootPosition) + shootSpeed}px`;
      monsters.forEach((monster) => {
        if (checkCollision(shoot, monster)) {
          gameExplosion.play();
          monster.src = "imgs/explosion.png";
          monster.classList.remove("monster");
          monster.classList.add("dead-monster");
          shoot.remove();
          playArea.removeChild(shoot);
        }
      });
    } else {
      playArea.removeChild(shoot);
      clearInterval(shootInterval);
    }
  }, 10);
}

// Monsters

function createMonsters() {
  const playAreaWidth = parseInt(getComputedStyle(playArea).width) - 400;
  const playAreaHeight = parseInt(getComputedStyle(playArea).height) - 400;

  let monster = document.createElement("img");
  let monsterImg = monsters[Math.floor(Math.random() * monsters.length)];
  monster.src = monsterImg;
  monster.classList.add("monster");
  monster.classList.add("monster-transition");
  monster.style.left = `${playAreaWidth}px`;
  monster.style.top = `${Math.floor(Math.random() * playAreaHeight)}px`;
  playArea.appendChild(monster);
  moveMonster(monster);
}

function moveMonster(monster) {
  let moveMonsterInterval = setInterval(() => {
    let monsterPosition = parseInt(getComputedStyle(monster).left);
    if (monsterPosition <= 50) {
      if (Array.from(monster.classList).includes("dead-monster")) {
        monster.remove();
      } else {
        clearInterval(moveMonsterInterval);
        gameOver();
      }
    } else {
      monster.style.left = `${monsterPosition - monsterSpeed}px`;
    }
  }, 30);
}

// Collision

function checkCollision(shoot, monster) {
  let shootLeft = parseInt(shoot.style.left);
  let monsterLeft = parseInt(monster.style.left);

  let shootTop = parseInt(shoot.style.top);
  let monsterTop = parseInt(monster.style.top);

  let monsterHeight = parseInt(getComputedStyle(monster).height) - 20;

  let monsterBottom = monsterTop - monsterHeight;

  return (
    shootTop <= monsterTop &&
    shootTop >= monsterBottom &&
    shootLeft >= monsterLeft
  );
}

// Hero Color

function setHeroColor(color) {
  hero.src = `imgs/hero.${color}.png`;
}

// Start Game

function playGame() {
  gameOverMusic.pause();
  gameMainMusic.play();
  gameInfo.style.display = "none";
  window.addEventListener("keydown", shipActions);
  monsterInterval = setInterval(() => {
    createMonsters();
  }, 3000);
}

// Game Over

function gameOver() {
  clearInterval(monsterInterval);
  window.removeEventListener("keydown", shipActions);
  let monsters = document.querySelectorAll(".monster");
  monsters.forEach((monster) => monster.remove());
  let shoots = document.querySelectorAll(".shoot");
  shoots.forEach((shoot) => shoot.remove());
  setTimeout(() => {
    gameMainMusic.pause();
    gameOverMusic.play();
    alert("Game Over!");
    hero.style.top = "400px";
    gameInfo.style.display = "block";
  });
}

// Listeners
startButton.addEventListener("click", () => playGame());
window.addEventListener("keydown", shipActions);
