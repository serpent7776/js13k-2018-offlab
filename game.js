"use strict";

var ga = ga(1024, 1024, load);
var tiles0 = '#########......###.....###.....####...#####..###################';
var map;
var player;
var playerSpeedMax = 2;
var gravity = 4;
var jumpSteps = 4;
var jumpSpeed = 32 / 4;

ga.start();
ga.scaleToWindow();
ga.fps = 60;

function load() {
	ga.state = game;
	map = createMap(tiles0, 8, 8, 32, 32);
	createLaserV(6, 1, 3);
	createLaserH(4, 1, 3);
	player = createPlayer();
	setupPlayerControls();
}

function createMap(tiles, nx, ny, width, height) {
	var map = ga.group();
	for (var i = 0, len = nx * ny; i < len; i++) {
		var x = (i % nx) * width;
		var y = Math.floor(i / nx) * height;
		if (tiles[i] == '#') {
			var tile = ga.rectangle(width, height, 'grey', 'black', 1, x, y);
			map.addChild(tile);
		}
	}
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
	var p = ga.rectangle(32, 32, 'red', 'black', 1, 32, 32);
	p.jumping = 0;
	return p;
}

function createLaserV(tx, ty, len) {
	var b = ga.rectangle(4, map.ty * len, 'red', 'orange', 1, map.getX(tx) + map.htx, map.getY(ty));
	return b;
}

function createLaserH(tx, ty, len) {
	var b = ga.rectangle(map.tx * len, 4, 'red', 'orange', 1, map.getX(tx), map.getY(ty) + map.hty);
	return b;
}

function setupPlayerControls() {
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
	ga.key.upArrow.press = function() {
		if (player.jumping == 0 && player.standing) {
			player.jumping = jumpSteps;
			player.standing = false;
		}
	};
}

function move(o) {
	ga.move(o);
	var pt = map.getTileXY(o.centerX, o.centerY);
	var cx = o.centerX;
	var cy = o.centerY;
	var hx = map.tx / 2;
	var hx2 = map.tx / 3;
	var hy = map.ty / 2;
	if (o.vx < 0) {
		if (map.isWall(cx - hx, cy)) {
			var x = map.getX(pt.x);
			o.x = x;
		}
	} else if (o.vx > 0) {
		if (map.isWall(cx + hx, cy)) {
			var x = map.getX(pt.x);
			o.x = x;
		}
	}
	if (o.vy > 0) {
		o.standing = false;
		if (map.isWall(cx - hx2, cy + hy) || map.isWall(cx + hx2, cy + hy)) {
			var y = map.getY(pt.y);
			o.y = y;
			o.jumping = 0;
			o.standing = true;
		}
	} else if (o.vy < 0) {
		if (map.isWall(cx, cy - hy)) {
			var y = map.getY(pt.y);
			o.y = y;
			o.jumping = 0;
		}
	}
}

function update() {
	if (player.jumping > 0 ) {
		player.vy = -jumpSpeed;
		player.jumping--;
	} else {
		player.vy = gravity;
	}
	move(player);
}

function game() {
	update();
}
