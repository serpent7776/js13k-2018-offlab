"use strict";

var ga = ga(384, 288, load, ['player.png', 'platform_on.png', 'platform_off.png']);
var levels = [
	{
		t: '#####################################################...#########...######....#...##############',
		f: function() {
			map.startPos = {x: 2, y:6};
			createDoor(9, 6);
		},
	},
	{
		t: '######################################........######......#####...#...####.......###############',
		f: function() {
			map.startPos = {x: 2, y:6};
			createDoor(2, 3);
		},
	},
	{
		t: '#####################################################...#########...######........##############',
		f: function() {
			map.startPos = {x: 2, y:6};
			createDoor(9, 6);
			createLaserV(6, 4, 3);
		},
	},
	{
		t: '##########################.........###........####........####........###.........##############',
		f: function() {
			map.startPos = {x: 1, y:6};
			createDoor(10, 2);
			createLaserV(8, 2, 5);
			createPlatformV(3, 5, 2);
			createPlatformH(5, 9, 3);
		},
	},
	{
		t: '#############..........####.....#######.....#####..........####......####........###############',
		f: function() {
			map.startPos = {x: 1, y:6};
			createDoor(10, 1);
			createLaserV(2, 4, 1);
			createLaserV(2, 1, 1);
			createPlatformV(8, 6, 4);
			createPlatformH(8, 3, 4);
			createPlatformV(3, 4, 1);
			createPlatformH(3, 7, 1);
		},
	},
];
var level = -1;
var map;
var player;
var playerSpeedMax = 5;
var gravity = 4;
var jumpSteps = 12;
var jumpSpeed = 48 / jumpSteps;
var sysOn = true;

ga.start();
ga.fps = 60;

function load() {
	ga.backgroundColor = '#d0d0d0';
	ga.state = game;
	player = createPlayer();
	setupPlayerControls();
	nextLevel();
}

function nextLevel() {
	level++;
	var l = levels[level];
	if (map) {
		ga.stage.removeChild(map);
		ga.stage.removeChild(map.doors);
		ga.stage.removeChild(map.lasers);
		ga.stage.removeChild(map.platforms);
	}
	map = createMap(l.t, 12, 8, 32, 32);
	l.f();
	resetPlayer(player);
	switchSys(true);
}

function createTile(width, height, x, y) {
	var tile = ga.rectangle(width - 1, height - 1, '', '', 1, x, y);
	tile.renderOrg = tile.render;
	tile.render = function(ctx) {
		tile.fillStyle = sysOn ? '#e7e7e7' : '#0f0f0f';
		tile.strokeStyle = sysOn ? '#e0e0e0' : '#000000';
		tile.renderOrg(ctx);
	}
	return tile;
}

function createMap(tiles, nx, ny, width, height) {
	var map = ga.group();
	for (var i = 0, len = nx * ny; i < len; i++) {
		var x = (i % nx) * width;
		var y = Math.floor(i / nx) * height;
		if (tiles[i] == '#') {
			var tile = createTile(width, height, x, y);
			map.addChild(tile);
		}
	}
	map.lasers = ga.group();
	map.platforms = ga.group();
	map.startPos = {x:1, y:1};
	map.tiles = tiles;
	map.nx = nx; // number of tiles in x-axis
	map.ny = ny; // number of tiles in y-axis
	map.tx = width; // width of a tile
	map.ty = height; // height of a tile
	map.htx = width / 2; // half width of a tile
	map.hty = height / 2; // half height of a tile
	map.isWall = function(x, y) {
		var t = this.getTileXY(x, y);
		return this.tiles[t.y * this.nx + t.x] == '#';
	};
	map.getTileXY = function(x, y) {
		var ptx = Math.floor(x / this.tx);
		var pty = Math.floor(y / this.ty);
		return {x: ptx, y: pty};
	};
	map.getX = function(x) {
		return x * this.tx;
	};
	map.getY = function(y) {
		return y * this.ty;
	};
	return map;
}

function createPlayer() {
	var p = ga.sprite('player.png');
	p.standing = false;
	p.platforming = undefined;
	p.jumping = 0;
	p.platforming = undefined;
	return p;
}

function resetPlayer(p) {
	p.setPosition(map.getX(map.startPos.x), map.getY(map.startPos.y));
	p.standing = false;
	p.platforming = undefined;
	p.jumping = 0;
}

function createLaserV(tx, ty, len) {
	var b = ga.rectangle(3, map.ty * len, 'red', 'orange', 1, map.getX(tx) + map.htx, map.getY(ty));
	map.lasers.addChild(b);
	return b;
}

function createLaserH(tx, ty, len) {
	var b = ga.rectangle(map.tx * len, 3, 'red', 'orange', 1, map.getX(tx), map.getY(ty) + map.hty);
	map.lasers.addChild(b);
	return b;
}

function createPlatformV(tx, ty0, ty1) {
	var p = ga.sprite('platform_on.png');
	map.platforms.addChild(p);
	p.x = map.getX(tx);
	p.ty0 = ty0;
	p.ty1 = ty1;
	p.dt = 0;
	p.platformType = 'v';
	return p;
}

function createPlatformH(tx0, tx1, ty) {
	var p = ga.sprite('platform_on.png');
	map.platforms.addChild(p);
	p.y = map.getY(ty + 1);
	p.tx0 = tx0;
	p.tx1 = tx1;
	p.dt = 0;
	p.platformType = 'h';
	return p;
}

function createDoor(tx, ty) {
	var d = ga.rectangle(map.tx - 2, map.ty - 2, 'azure', 'grey', 1, map.getX(tx), map.getY(ty));
	map.doors = d;
}

function switchSys(on) {
	sysOn = on;
	map.lasers.visible = sysOn;
	ga.backgroundColor = on ? '#d0d0d0' : '#4d4d4d';
	for (var i = 0, len = map.platforms.children.length; i < len; i++) {
		var p = map.platforms.children[i];
		p.setTexture(on ? 'platform_on.png' : 'platform_off.png');
	}
}

function setupPlayerControls() {
	ga.key.upArrow.press = function() {
		if (player.jumping == 0 && (player.standing || player.platforming)) {
			player.jumping = jumpSteps;
			player.standing = false;
		}
	};
	ga.key.rightArrow.press = function() {
		player.vx = playerSpeedMax;
	};
	ga.key.rightArrow.release = function() {
		if (!ga.key.leftArrow.isDown) {
			player.vx = 0;
		}
	};
	ga.key.leftArrow.press = function() {
		player.vx = -playerSpeedMax;
	};
	ga.key.leftArrow.release = function() {
		if (!ga.key.rightArrow.isDown) {
			player.vx = 0;
		}
	};
	ga.key.space.press = function() {
		switchSys(!sysOn);
	};
}

function isStandingOnPlatform(o, p) {
	if (!p) {
		return false;
	}
	var cx = o.centerX;
	var cy = o.centerY;
	var rect = {
		x: p.x,
		y: p.y - o.halfHeight,
		width: p.width,
		height: o.halfHeight + p.height * 2,
	};
	var leftFoot = {
		x: cx - o.halfWidth / 2,
		y: cy + o.halfHeight,
	};
	var rightFoot = {
		x: cx + o.halfWidth / 2,
		y: cy + o.halfHeight,
	};
	return ga.hitTestPoint(leftFoot, rect, false) || ga.hitTestPoint(rightFoot, rect, false);
}

function getPlatform(o) {
	var result = isStandingOnPlatform(o, o.platforming) ? o.platforming : undefined;
	for (var i = 0, len = map.platforms.children.length; i < len; i++) {
		var platform = map.platforms.children[i];
		if (result && (platform.y > result.y || platform.dir > 0)) {
			continue;
		}
		if (isStandingOnPlatform(o, platform)) {
			result = platform;
		}
	}
	return result;
}

function movePlayer(o) {
	ga.move(o);
	var pt = map.getTileXY(o.centerX, o.centerY);
	var cx = o.centerX;
	var cy = o.centerY;
	var hx2 = map.tx / 3;
	o.platforming = getPlatform(o);
	if (o.vx < 0) {
		if (map.isWall(cx - map.htx, cy)) {
			var x = map.getX(pt.x);
			o.x = x;
		}
	} else if (o.vx > 0) {
		if (map.isWall(cx + map.htx, cy)) {
			var x = map.getX(pt.x);
			o.x = x;
		}
	}
	if (o.vy > 0) {
		o.standing = false;
		if (o.platforming) {
			if (o.y + o.height > o.platforming.y) {
				o.y = o.platforming.y - o.height;
				o.jumping = 0;
				o.standing = true;
			}
		} else if (map.isWall(cx - hx2, cy + map.hty) || map.isWall(cx + hx2, cy + map.hty)) {
			var y = map.getY(pt.y);
			o.y = y;
			o.jumping = 0;
			o.standing = true;
		}
	} else if (o.vy < 0) {
		if (map.isWall(cx, cy - map.hty)) {
			var y = map.getY(pt.y);
			o.y = y;
			o.jumping = 0;
		}
	}
}

function movePlatform(p) {
	p.dt += 0.02;
	p.delta = Math.sin(p.dt);
	var a = (p.delta + 1) / 2;
	if (p.platformType == 'v') {
		var y = p.ty0 * (1 - a) + p.ty1 * a;
		p.y = map.getY(y + 1.0);
		p.dir = (p.ty1 - p.ty0) * Math.cos(p.dt);
	} else if (p.platformType == 'h') {
		var x = p.tx0 * (1 - a) + p.tx1 * a;
		p.x = map.getX(x);
		p.dir = (p.tx1 - p.tx0) * Math.cos(p.dt);
	}
}

function checkNextLevel(p) {
	if (ga.distance(p, map.doors) < map.htx) {
		nextLevel();
	}
}

function checkDead(p) {
	for (var i = 0, len = map.lasers.children.length; i < len; i++) {
		var l = map.lasers.children[i];
		var hit = ga.hitTestRectangle(p, l, true);
		if (hit) {
			return true;
		}
	}
	return false;
}

function update() {
	if (player.jumping > 0 ) {
		player.vy = -jumpSpeed;
		player.jumping--;
	} else {
		player.vy = gravity;
	}
	if (sysOn) {
		for (var i = 0, len = map.platforms.children.length; i < len; i++) {
			movePlatform(map.platforms.children[i]);
		}
	}
	movePlayer(player);
	if (checkNextLevel(player)) {
		return;
	}
	if (sysOn && checkDead(player)) {
		resetPlayer(player);
	}
}

function game() {
	update();
}
