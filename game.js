"use strict";

var ga = ga(1024, 1024, load);
var tiles0 = '#########.....####....####....#####..######..###################';
var map;
var player;
var playerSpeedMax = 2;
var gravity = 4;
var jumpSpeed = 32;

ga.start();
ga.scaleToWindow();
ga.fps = 60;

function load() {
	ga.state = game;
	map = createMap(tiles0, 8, 8, 32, 32);
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
	map.isWall = function(tx, ty) {
		return this.tiles[ty * this.nx + tx] == '#';
	};
	map.getTileXY = function(o) {
		var ptx = Math.floor(o.x / this.tx);
		var pty = Math.floor(o.y / this.ty);
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
			player.jumping = 1;
			player.standing = false;
		}
	};
}

function move(o) {
	ga.move(o);
	var pt = map.getTileXY(o);
	if (o.vx < 0) {
		if (map.isWall(pt.x, pt.y)) {
			var x = map.getX(pt.x + 1);
			o.x = x;
		}
	} else if (o.vx > 0) {
		if (map.isWall(pt.x + 1, pt.y)) {
			var x = map.getX(pt.x);
			o.x = x;
		}
	}
	if (o.vy > 0) {
		o.standing = false;
		if (map.isWall(pt.x, pt.y + 1)) {
			var y = map.getY(pt.y);
			o.y = y;
			o.jumping = 0;
			o.standing = true;
		}
	} else if (o.vy < 0) {
		if (map.isWall(pt.x, pt.y)) {
			var y = map.getY(pt.y + 1);
			o.y = y;
			o.jumping = 0;
		}
	}
}

function update() {
	if (player.jumping > 0 ) {
		player.vy = -jumpSpeed;
		player.jumping = 0;
	} else {
		player.vy = gravity;
	}
	move(player);
}

function game() {
	update();
}
