window.onload = function () {
  var select = document.getElementById("levelSelect");
  for (var i = 0; i < levels.length; i++) {
    var option = document.createElement("option");
    option.text = "Level " + (i + 1);
    option.value = i + 1;
    select.add(option);
  }
  nextLevel();
}

function heroDead() {
  setTimeout(restartLevel, 500);
}


function restartLevel() {
  console.log("called restart");
  loadLevel(document.getElementById("customLevel").value);
  canvas.height = (level.heigth - 1) * gridSize;
  canvas.width = level.width * gridSize;
  draw();
}

var levelId = 0;

function nextLevel() {
  document.getElementById("levelSelect").value = levelId + 1;
  document.getElementById("customLevel").value = levels[levelId];
  if (levelId >= levels.length) {
    levelId = 0;
  } else {
    restartLevel();
  }
  levelId++;
}

function selectLevel() {
  var l = document.getElementById("levelSelect").value;
  if (l == levels.length + 1) {
    randomLevel();
  } else {
    levelId = l - 1;
    nextLevel();
  }
}

/**
 * INPUT
 */

const keys = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  RESTART: 82,
}

function update(keycode) {

  // check for focus
  var inputbox = document.getElementById('customLevel');
  var isFocused = (document.activeElement === inputbox);
  if (isFocused) return true;

  if (hero.dead) {
    return false;
  }
  switch (keycode) {
    case keys.RESTART:
      restartLevel();
      break;
    case keys.LEFT:
      step(moves.GO_LEFT);
      break;
    case keys.RIGHT:
      step(moves.GO_RIGHT);
      break;
    case keys.UP:
      step(moves.GO_UP);
      break;
    case keys.DOWN:
      step(moves.GO_DOWN);
      break;
    default:
      return true;
  }
  if (hero.win) {
    nextLevel();
  }
  if (hero.dead) {
    heroDead();
  }
  draw();
  return false;
}

document.onkeydown = function (evt) {
  evt = evt || window.event;
  return update(evt.keyCode);
};

/**
 * Graphics
 */

heroImage = new Image;
heroImage.src = 'res/hero.png';
skullImage = new Image;
skullImage.src = 'res/skull.png';
coinImage = new Image;
coinImage.src = 'res/coin.png';
enemyImage = new Image;
enemyImage.src = 'res/enemy.png';
boxImage = new Image;
boxImage.src = 'res/box.png';
rockImage = new Image;
rockImage.src = 'res/rock.png';
floorImage = new Image;
floorImage.src = 'res/floor.png';
unstableFloorImage = new Image;
unstableFloorImage.src = 'res/unstable-floor.png';

var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");
const gridSize = 60;

function draw() {
  // draw the map
  c.clearRect(0, 0, canvas.width, canvas.height);
  for (var y = 0; y < level.grid.length; y++) {
    var ln = level.grid[y];
    for (var x = 0; x < ln.length; x++) {
      if (level.grid[y][x] == items.FRAGILE_FLOOR) {
        c.drawImage(unstableFloorImage, x * gridSize, y * gridSize);
      } else if (level.grid[y][x] == items.HOLE) {
        //draw nothing
      } else {
        c.drawImage(floorImage, x * gridSize, y * gridSize);
        switch (level.grid[y][x]) {
          case items.WALL:
            c.drawImage(rockImage, x * gridSize, y * gridSize);
            break;
          case items.BOX:
            c.drawImage(boxImage, x * gridSize, y * gridSize);
            break;
        }
      }
    }
  }
  drawIfPresent(coin, coinImage);
  drawIfPresent(enemy, enemyImage);
  // draw the hero
  c.drawImage(hero.dead ? skullImage : heroImage, hero.x * gridSize, hero.y * gridSize);
}

function drawIfPresent(item, img) {
  if (item) {
    c.drawImage(img, item.x * gridSize, item.y * gridSize);
  }
}
