"use strict";

var ga = ga(1024, 1024, load);
var tiles0 = '#########.....####....####....#####..######..###################';
var map;
var player;
var playerSpeedMax = 2;

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
	return ga.rectangle(32, 32, 'red', 'black', 1, 32, 32);
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
}

function move(o) {
	var pt0 = map.getTileXY(player);
	ga.move(o);
	var pt1 = map.getTileXY(player);
	if (player.vx < 0) {
		if (map.isWall(pt1.x, pt1.y)) {
			var x = map.getX(pt1.x + 1);
			player.x = x;
		}
	} else if (player.vx > 0) {
		if (map.isWall(pt1.x + 1, pt1.y)) {
			var x = map.getX(pt1.x);
			player.x = x;
		}
	}
}

function update() {
	move(player);
}

function game() {
	update();
}
