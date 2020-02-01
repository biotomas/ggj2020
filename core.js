var hero;
var level;
var enemy;
var coin;


const items = {
	WALL: "#",
	PLAYER: "@",
	BOX: "$",
	COIN: ".",
	FLOOR: " ",
	ENEMY: "E",
	FRAGILE_FLOOR: "x",
	HOLE: "X",
	MACHINE: "A",
	PART: "a",
	UNDEF: "-",
};

const moves = {
	GO_UP: "up", GO_DOWN: "down", GO_LEFT: "left", GO_RIGHT: "right"
};

function die() {
	console.log("Hero died");
	hero.dead = true;
}

function loadLevel(levstr) {
	// levstr = document.getElementById("customLevel").value
	level = new Level(levstr);
	var hloc = level.find(items.PLAYER);
	level.grid[hloc.y][hloc.x] = items.FLOOR;
	console.log(hloc);
	hero = new Hero(hloc.x, hloc.y);
	var cloc = level.find(items.COIN);
	if (cloc) {
		coin = new Coin(cloc.x, cloc.y);
	} else {
		coin = null;
	}
	var eloc = level.find(items.ENEMY);
	if (eloc) {
		enemy = new Spider(eloc.x, eloc.y);
	} else {
		enemy = null;
	}
	bomb = null;
}

function step(move) {
	var cx = hero.x;
	var cy = hero.y;
	var gx = cx;
	var gy = cy;
	switch (move) {
		case moves.GO_LEFT:
			gx--;
			break;
		case moves.GO_RIGHT:
			gx++;
			break;
		case moves.GO_UP:
			gy--;
			break;
		case moves.GO_DOWN:
			gy++;
			break;
		default:
			return;
	}

	hero.moveTo(gx, gy);
	if (hero.update()) {
		return;
	}
	if (enemy) {
		var gex = enemy.x - gx + cx;
		var gey = enemy.y - gy + cy;
		enemy.moveTo(gex, gey);
		if (enemy.update()) {
			return;
		}
	}
	if (hero.checkwin()) {
		return;
	}
};

class BaseGO {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	moveTo(x, y) {
		var oldx = this.x;
		var oldy = this.y;
		var nextx = 2 * x - oldx;
		var nexty = 2 * y - oldy;
		var isPlayer = oldx == hero.x && oldy == hero.y;
		
		const goalTile = level.grid[y][x];
		// walk to other floor
		if (goalTile == items.FLOOR || goalTile == items.FRAGILE_FLOOR) {
			this.x = x;
			this.y = y;
			level.collapse(oldx, oldy);
			return true;
		}

		// pickup part
		if (goalTile == items.PART && isPlayer) {
			this.x = x;
			this.y = y;
			hero.hasPart = true;
			level.collapse(oldx, oldy);
			level.grid[y][x] = items.FLOOR;
			return true;
		}

		// deliver part
		if (goalTile == items.MACHINE && isPlayer && hero.hasPart) {
			this.x = x;
			this.y = y;
			level.collapse(oldx, oldy);
			hero.win = true;
			return true;
		}


		// push box to floor
		if (goalTile == items.BOX && level.grid[nexty][nextx] == items.FLOOR) {
			level.grid[nexty][nextx] = items.BOX;
			level.grid[y][x] = items.FLOOR;
			level.grid[oldy][oldx] = items.FLOOR;
			this.x = x;
			this.y = y;
			return true;
		}
		// push box to hole
		if (goalTile == items.BOX && level.grid[nexty][nextx] == items.HOLE) {
			level.grid[nexty][nextx] = items.FLOOR;
			level.grid[y][x] = items.FLOOR;
			level.grid[oldy][oldx] = items.FLOOR;
			this.x = x;
			this.y = y;
			return true;
		}
		return false;
	}

}

class Hero extends BaseGO {
	constructor(x, y) {
		super(x, y)
		this.dead = false;
		this.win = false;
		this.hasPart = false;
	}

	checkwin() {
		if (this.dead == false && coin && this.x == coin.x && this.y == coin.y) {
			this.win = true;
			return true;
		}
	}

	update() {
		if (enemy && this.x == enemy.x && this.y == enemy.y) {
			die();
			return true;
		}
		return false;
	}
}


class Spider extends BaseGO {
	constructor(x, y) {
		super(x, y)
	}

	update() {
		if (this.x == hero.x && this.y == hero.y) {
			die();
			return true;
		}
		return false;
	}

}

class Coin extends BaseGO {
	constructor(x, y) {
		super(x, y)
	}
}


class Level {
	constructor(levelString) {
		this.grid = levelString.split("\n").map(function (x) { return x.split("") });
		this.heigth = this.grid.length;
		this.width = 0;
		for (var y = 0; y < this.grid.length; y++) {
			if (this.grid[y].length > this.width) {
				this.width = this.grid[y].length;
			}
		}
	}

	find(item) {
		for (var y = 0; y < this.grid.length; y++) {
			for (var x = 0; x < this.grid[y].length; x++) {
				if (this.grid[y][x] == item) {
					return { x, y };
				}
			}
		}
	}

	collapse(x, y) {
		var item = this.grid[y][x];
		if (this.grid[y][x] == items.FRAGILE_FLOOR) {
			this.grid[y][x] = items.HOLE;
		}
	}
}
