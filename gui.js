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
  draw();
}

var levelId = -1;

function nextLevel() {
  levelId++;
  if (levelId >= levels.length) {
    levelId = 0;
  }
  document.getElementById("levelSelect").value = levelId;
  document.getElementById("customLevel").value = levels[levelId];
  restartLevel();
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

heroImage = loadImage('res/hero.png');
skullImage = loadImage('res/skull.png');
enemyImage = loadImage('res/enemy.png');
boxImage = loadImage('res/box.png');
boxInHoleImage = loadImage('res/box-inhole.png');
rockImage = loadImage('res/rock.png');
backgroundImage = loadImage('res/space-background.jpg');
cogImage = loadImage('res/machine-part.png');
machineImage = loadImage('res/machine.png');
//Floors
floor_base = loadImage('res/floor-base.png');
floor_base_weak = loadImage('res/floor-base-weak.png');
floor_edge_s1 = loadImage('res/floor-edges1.png');
floor_edge_s2 = loadImage('res/floor-edges2.png');
floor_edge_s3 = loadImage('res/floor-edges3.png');
floor_edge_s4 = loadImage('res/floor-edges4.png');
floor_edge_l1 = loadImage('res/floor-edgel1.png');
floor_edge_l2 = loadImage('res/floor-edgel2.png');
floor_edge_l3 = loadImage('res/floor-edgel3.png');
floor_edge_l4 = loadImage('res/floor-edgel4.png');
floor_edge_u1 = loadImage('res/floor-edgeu1.png');
floor_edge_u2 = loadImage('res/floor-edgeu2.png');
floor_edge_u3 = loadImage('res/floor-edgeu3.png');
floor_edge_u4 = loadImage('res/floor-edgeu4.png');
floor_edge_f = loadImage('res/floor-edgef.png');
floor_side1 = loadImage('res/floor-side1.png');
floor_side2 = loadImage('res/floor-side2.png');
floor_side3 = loadImage('res/floor-side3.png');
floor_side4 = loadImage('res/floor-side4.png');
floor_sidef1 = loadImage('res/floor-sidef1.png');
floor_sidef2 = loadImage('res/floor-sidef2.png');

function loadImage(src) {
  var img = new Image;
  img.src = src;
  return img;
}


var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");
const gridSize = 120;
var offx = 0;
var offy = 0;

function draw() {
  // draw the map
  c.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  offx = canvas.width / 2 - hero.x * gridSize;
  offy = canvas.height / 2 - hero.y * gridSize;


  for (var y = 0; y < level.grid.length; y++) {
    var ln = level.grid[y];
    for (var x = 0; x < ln.length; x++) {
      drawFloor(x, y);
      switch (level.grid[y][x]) {
        case items.MACHINE:
          drawTile(machineImage, x, y);
          break;
        case items.PART:
          drawTile(cogImage, x, y);
          break;
        case items.BOX_IN_HOLE:
          drawTile(boxInHoleImage,x,y);
          break;
        case items.WALL:
          drawTile(rockImage, x, y);
          break;
        case items.BOX:
          drawTile(boxImage, x, y);
          break;
      }
    }
  }
  drawIfPresent(enemy, enemyImage);
  // draw the hero
  drawTile(hero.dead ? skullImage : heroImage, hero.x, hero.y);
}

function drawFloor(x, y) {
  if (isHole(x, y)) {
    // draw nothing
    return;
  }
  if (level.grid[y][x] == items.FRAGILE_FLOOR) {
    c.drawImage(floor_base_weak, (x * gridSize) + offx, (y * gridSize) + offy);
  } else {
    c.drawImage(floor_base, (x * gridSize) + offx, (y * gridSize) + offy);
  }
  if (isHole(x, y - 1)) {
    c.drawImage(floor_side4, (x * gridSize) + offx + 20, (y * gridSize) + offy);
  } else {
    c.drawImage(floor_sidef1, (x * gridSize) + offx + 20, (y * gridSize) + offy);
  }
  if (isHole(x, y + 1)) {
    c.drawImage(floor_side2, (x * gridSize) + offx + 20, (y * gridSize) + offy + 100);
  } else {
    c.drawImage(floor_sidef1, (x * gridSize) + offx + 20, (y * gridSize) + offy + 100);
  }
  if (isHole(x - 1, y)) {
    c.drawImage(floor_side1, (x * gridSize) + offx, (y * gridSize) + offy + 20);
  } else {
    c.drawImage(floor_sidef2, (x * gridSize) + offx, (y * gridSize) + offy + 20);
  }
  if (isHole(x + 1, y)) {
    c.drawImage(floor_side3, (x * gridSize) + offx + 100, (y * gridSize) + offy + 20);
  } else {
    c.drawImage(floor_sidef2, (x * gridSize) + offx + 100, (y * gridSize) + offy + 20);
  }
  // up left
  var img;
  if (isHole(x - 1, y)) {
    if (isHole(x, y - 1)) {
      img = floor_edge_s4;
    } else {
      img = floor_edge_l1;
    }
  } else {
    if (isHole(x, y - 1)) {
      img = floor_edge_l4;
    } else if (isHole(x - 1, y - 1)) {
      img = floor_edge_u2;
    } else {
      img = floor_edge_f;
    }
  }
  c.drawImage(img, (x * gridSize) + offx, (y * gridSize) + offy);

  // up right
  var img;
  if (isHole(x + 1, y)) {
    if (isHole(x, y - 1)) {
      img = floor_edge_s3;
    } else {
      img = floor_edge_l3;
    }
  } else {
    if (isHole(x, y - 1)) {
      img = floor_edge_l4;
    } else if (isHole(x + 1, y - 1)) {
      img = floor_edge_u1
    } else {
      img = floor_edge_f;
    }
  }
  c.drawImage(img, (x * gridSize) + offx + 100, (y * gridSize) + offy);

  // down left
  var img;
  if (isHole(x - 1, y)) {
    if (isHole(x, y + 1)) {
      img = floor_edge_s1;
    } else {
      img = floor_edge_l1;
    }
  } else {
    if (isHole(x, y + 1)) {
      img = floor_edge_l2;
    } else if (isHole(x - 1, y + 1)) {
      img = floor_edge_u3
    } else {
      img = floor_edge_f;
    }
  }

  c.drawImage(img, (x * gridSize) + offx, (y * gridSize) + offy + 100);
  // down right
  var img;
  if (isHole(x + 1, y)) {
    if (isHole(x, y + 1)) {
      img = floor_edge_s2;
    } else {
      img = floor_edge_l3;
    }
  } else {
    if (isHole(x, y + 1)) {
      img = floor_edge_l2;
    } else if (isHole(x + 1, y + 1)) {
      img = floor_edge_u4;
    } else {
      img = floor_edge_f;
    }
  }
  c.drawImage(img, (x * gridSize) + offx + 100, (y * gridSize) + offy + 100);


}

function isHole(x, y) {
  if (x < 0 || y < 0 || x >= level.width || y >= level.height) {
    return true;
  }
  return level.grid[y][x] == items.HOLE || !level.grid[y][x];
}

function drawIfPresent(item, img) {
  if (item) {
    drawTile(img, item.x, item.y);
  }
}

function drawTile(img, x, y) {
  c.drawImage(img, (x * gridSize) + offx, (y * gridSize) + offy);
}
