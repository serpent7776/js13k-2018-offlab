"use strict";

var ga = ga(1024, 1024, load);
var map0 = '#########.....####....####....#####..######..###################';
var map;
var player;

ga.start();
ga.scaleToWindow();
ga.fps = 60;

function load() {
	ga.state = game;
	map = createMap(map0, 8, 8, 32, 32);
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

function game() {
}
