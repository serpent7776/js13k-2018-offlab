"use strict";

var ga = ga(480, 448, load, ['player.bmp', 'platform_on.bmp', 'platform_off.bmp', 'spikes.bmp', 'spikes2.bmp', 'small_spikes.bmp', 'small_spikes2.bmp']);
var levels = [
	// 0
	{
		t: '##########################################################################################################################################....#....####...#.....#...################',
		l: ['Hello. Press left and right arrow keys to move.', 'Press up arrow key to jump.'],
		f: function() {
			map.startPos = {x: 1, y: 10};
			createDoor(13, 10);
		},
	},
	// 1
	{
		t: '##########################################################################################################.............#####..........####...#...#...##............#################',
		l: ['', ''],
		f: function() {
			map.startPos = {x: 1, y: 10};
			createDoor(1, 7);
		},
	},
	// 2
	{
		t: '##########################################################################################################.............#####.#.#......##.........#...##............#################',
		l: ['You can turn the whole system on or off by pressing the space bar.', ''],
		f: function() {
			map.startPos = {x: 1, y: 10};
			createDoor(1, 7);
			createLaserV(5, 7, 1);
			createLaserV(7, 7, 1);
			createLaserV(10, 7, 2);
		},
	},
	// 3
	{
		t: '########################################....###########...############....##.............##.............##......#......##.............##.............##.............################',
		l: ['Platforms move when the power is on.', 'Turn the power off to stop them.'],
		f: function() {
			map.startPos = {x: 1, y: 10};
			createDoor(13, 2);
			createLaserV(9, 5, 6);
			createPlatformV(3, 9, 7);
			createPlatformV(11, 7, 2);
		},
	},
	// 4
	{
		t: '################################################...........##.............####.........####.............##.......##....####.........####...........####...........##################',
		l: ['Beware of the spikes! They will kill you on the slightest touch.', 'Turning the power off won\'t stop them from hurting you.'],
		f: function() {
			map.startPos = {x: 1, y: 10};
			createDoor(1, 4);
			createLaserV(2, 4, 1);
			createLaserV(2, 6, 2);
			createLaserV(12, 6, 2);
			createLaserV(12, 3, 2);
			createPlatformV(3, 10, 7);
			createPlatformH(6, 11, 8);
			createPlatformV(11, 7, 4);
			createPlatformH(9, 3, 4);
			createGroundSpikes(8, 6);
			createGroundSpikes(9, 6);
		},
	},
	// 5
	{
		t: '################.........#.####....####.#.####.....###...####.....###...#####....###.#.####.....###...####.....###...####....####.#.####.....###...####.....###.....################',
		l: ['', ''],
		f: function() {
			map.startPos = {x: 1, y: 10};
			createDoor(13, 10);
			createLaserH(1, 7, 5);
			createLaserH(1, 4, 5);
			createLaserH(1, 1, 9);
			createLaserV(10, 3, 2);
			createLaserV(10, 6, 2);
			createLaserV(10, 9, 2);
			createLaserH(9, 5, 1);
			createLaserH(11, 8, 1);
			createPlatformV(3, 10, 2);
			createPlatformV(9, 10, 2);
			createPlatformV(11, 10, 2);
		},
	},
	// 6
	{
		t: '################...#...###...##.......###..###...###.###...##...#...###...##...#...###...##...#...###...##...#.#####...##...#.........##...#.........##...#...###...################',
		l: ['', ''],
		f: function() {
			map.startPos = {x: 1, y: 9};
			createDoor(13, 1);
			createLaserV(4, 2, 1);
			createLaserV(9, 8, 2);
			createLaserH(5, 7, 1);
			createLaserH(7, 3, 1);
			createPlatformV(1, 10, 1);
			createPlatformV(2, 10, 1);
			createPlatformV(3, 10, 1);
			createPlatformV(12, 9, 1);
			createCeilingSpikes(1, 1);
			createCeilingSpikes(2, 1);
			createCeilingSpikes(3, 1);
			createGroundSpikes(5, 10);
			createGroundSpikes(6, 10);
			createGroundSpikes(7, 10);
			createGroundSpikes(11, 10);
			createGroundSpikes(12, 10);
			createGroundSpikes(13, 10);
			createSmallGroundSpikes(6, 2);
			createSmallGroundSpikes(6, 6);
			createSmallGroundSpikes(7, 6);
		},
	},
];

var time;
var deaths;
var playing;
var level = -1;
var map;
var titleLabel = [];
var levelLabel = [];
var endLabel = [];
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
	ga.state = nop;
	playing = false;
	var text = [
		'Welcome test unit 478.',
		'Your task is to reach a portal',
		'represented by white square on each floor.',
		'Try not to get destroyed while doing so. Good luck!',
		'Press space to proceed.'
	];
	for (var i = 0, len = text.length; i < len; i++) {
		titleLabel[i] = centeredLabel(text[i], '16px serif', 'black', 45 + 45 * i);
	}
	setupTitleControls();

}

function startGame() {
	for (var i = 0, len = titleLabel.length; i < len; i++) {
		ga.stage.removeChild(titleLabel[i]);
	}
	playing = true;
	time = 0;
	deaths = 0;
	ga.state = game;
	player = createPlayer();
	for (var i = 0, len = 2; i < len; i++) {
		levelLabel[i] = ga.text('', '16px serif', 'white', 8, 392 + 32 * i);
	}
	setupPlayerControls();
	nextLevel();
}

function clear() {
	ga.stage.removeChild(map);
	ga.stage.removeChild(map.doors);
	ga.stage.removeChild(map.lasers);
	ga.stage.removeChild(map.platforms);
	ga.stage.removeChild(map.spikes);
}

function centeredLabel(content, font, color, y) {
	var label = ga.text(content, font, color, 1, y);
	ga.canvas.ctx.font = font;
	label.x = (ga.stage.width - label.width) * 0.5;
	return label;
}

function endGame() {
	playing = false;
	clear();
	ga.stage.removeChild(player);
	for (var i = 0, len = levelLabel.length; i < len; i++) {
		ga.stage.removeChild(levelLabel[i]);
	}
	var text = [
		'Thanks for playing!',
		'Your time was: ' + time.toFixed(2) + 's',
		'You died: ' + deaths + ' times',
		'Refresh page to play again.'
	];
	var color = sysOn ? 'black' : 'white';
	for (var i = 0, len = text.length; i < len; i++) {
		var y = 45 + 45 * i;
		endLabel[i] = centeredLabel(text[i], '21px serif', color, y);
	}
	ga.state = nop;
}

function nextLevel() {
	level++;
	var l = levels[level];
	if (!l) {
		return endGame();
	}
	if (map) {
		clear();
	}
	map = createMap(l.t, 15, 12, 32, 32);
	for (var i = 0, len = l.l.length; i < len; i++) {
		levelLabel[i].content = l.l[i];
	}
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
	map.spikes = ga.group();
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
	var p = ga.sprite('player.bmp');
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

function killPlayer(p) {
	resetPlayer(p);
	deaths += 1;
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
	var p = ga.sprite('platform_on.bmp');
	map.platforms.addChild(p);
	p.x = map.getX(tx);
	p.ty0 = ty0;
	p.ty1 = ty1;
	p.dt = 0;
	p.platformType = 'v';
	return p;
}

function createPlatformH(tx0, tx1, ty) {
	var p = ga.sprite('platform_on.bmp');
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

function createGroundSpikes(tx, ty) {
	var s = ga.sprite('spikes.bmp');
	s.x = map.getX(tx);
	s.y = map.getY(ty) + 6;
	map.spikes.addChild(s);
}

function createCeilingSpikes(tx, ty) {
	var s = ga.sprite('spikes2.bmp');
	s.x = map.getX(tx);
	s.y = map.getY(ty);
	map.spikes.addChild(s);
}

function createSmallGroundSpikes(tx, ty) {
	var s = ga.sprite('small_spikes.bmp');
	s.x = map.getX(tx) + 3;
	s.y = map.getY(ty) + 20;
	map.spikes.addChild(s);
}

function createSmallCeilingSpikes(tx, ty) {
	var s = ga.sprite('small_spikes2.bmp');
	s.x = map.getX(tx) + 3;
	s.y = map.getY(ty);
	map.spikes.addChild(s);
}

function switchSys(on) {
	sysOn = on;
	map.lasers.visible = sysOn;
	ga.backgroundColor = on ? '#d0d0d0' : '#4d4d4d';
	for (var i = 0, len = map.platforms.children.length; i < len; i++) {
		var p = map.platforms.children[i];
		p.setTexture(on ? 'platform_on.bmp' : 'platform_off.bmp');
	}
	for (var i = 0, len = levelLabel.length; i < len; i++) {
		levelLabel[i].fillStyle = on ? "black" : "white";
	}
	if (!playing) {
		for (var i = 0, len = endLabel.length; i < len; i++) {
			endLabel[i].fillStyle = on ? 'black' : 'white';
		}
	}
}

function setupTitleControls() {
	ga.key.space.press = function() {
		startGame();
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
	p.delta = Math.cos(p.dt);
	var a = 1 - (p.delta + 1) / 2;
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
		return true;
	}
	return false;
}

function checkDead(p) {
	if (sysOn) {
		for (var i = 0, len = map.lasers.children.length; i < len; i++) {
			var l = map.lasers.children[i];
			var hit = ga.hitTestRectangle(p, l, true);
			if (hit) {
				return true;
			}
		}
	}
	for (var i = 0, len = map.spikes.children.length; i < len; i++) {
		var s = map.spikes.children[i];
		var hit = ga.hitTestRectangle(p, s, false);
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
	if (checkDead(player)) {
		killPlayer(player);
	}
}

function nop() {
}

function game() {
	time += 1 / ga.fps;
	update();
}
