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

function update() {
	ga.move(player);
}

function game() {
	update();
}
