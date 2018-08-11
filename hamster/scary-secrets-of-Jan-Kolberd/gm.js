'use strict'

/*~~~~~~~~~~~~~~ MAIN ~~~~~~~~~~~~~~*/

let enableTHREEJS = true;
let unnamedSprites = [];
let unnamedObjects = {};
let unnamedStatics = {};
let objectsForDestroing = [];
let cachedAudio = {};
let pressedKeys = {};
let score = 0;
let health = 100;
let global = {
}
let background = {
	src: '',
	xSize: 100,
	ySize: 100,
	x: 0,
	y: 0
}
let gameScreen = document.querySelector('#screen');
let canvas = document.querySelector('#canvas');
let ctx = null;

requestAnimationFrame(step);

window.onload = function(){
	if (gameScreen) {
		gameScreen.style.position = 'fixed'
		gameScreen.style.overflow = 'hidden'
		gameScreen.style.width = '100vw'
		gameScreen.style.height = '100vh'
	}
	if (enableTHREEJS && canvas && scene){
		ctx = canvas.getContext("2d");
	}
}

function step() {

	if (onstep && typeof onstep === 'function')
		onstep();

	// вызываем бстеп у всех нестатичных объектов
	for (let item in unnamedObjects) {
		unnamedObjects[item].onBeforeStep();
	}

	// вызываем степ у всех нестатичных объектов
	for (let item in unnamedObjects) {
		unnamedObjects[item].onstep();
		unnamedObjects[item].onstep_base();
		unnamedObjects[item].ondraw();
		unnamedObjects[item].ondraw_base();
	}

	for (let item in unnamedStatics) {
		unnamedStatics[item].ondraw();
		unnamedStatics[item].ondraw_base();
	}

	// диспатчим событие для каждой нажатой кнопки
	for (let item in pressedKeys) {
		let keyEvent = new CustomEvent('keyboard', {detail: {code: item}});
		window.dispatchEvent(keyEvent);
	}

	for (let i=0; i<objectsForDestroing.length; i++)
		delete unnamedObjects[objectsForDestroing[i].id];

	this.checkColl = function(first, second){
		if (first === second){
			return;
		}

		if (!first.collider || !second.collider){
			return;
		}

		if (first.x + first.collider.x < second.x + second.collider.x + second.collider.w 
			&& first.x + first.collider.x + first.collider.w > second.x + second.collider.x 
			&& first.y + first.collider.y < second.y + second.collider.y + second.collider.h 
			&& first.y + first.collider.y + first.collider.h > second.y + second.collider.y) {
				if (first['collision_' + second.type])
					first['collision_' + second.type](second)
		}
	}	

	// события столкновений
	for (let f in unnamedObjects)
	for (let s in unnamedObjects){
		this.checkColl(unnamedObjects[f], unnamedObjects[s]);
	}

	// события столкновений
	for (let f in unnamedObjects)
	for (let s in unnamedStatics){
		this.checkColl(unnamedObjects[f], unnamedStatics[s]);
	}

	document.querySelector('body').style.background = 'url(' + background.src + ') 0 0 repeat';
	document.querySelector('body').style.background = background.src + ' repeat';
	//document.querySelector('body').style.backgroundSize = background.xSize + '% ' + background.ySize + '%';
	document.querySelector('body').style.backgroundPosition = background.x + 'px ' + background.y + 'px';

	requestAnimationFrame(step);
}

/*~~~~~~~~~~~~~~ GLOBAL METHODS ~~~~~~~~~~~~~~*/

// создать экземляр объекта
function createObject(type, element, x, y, name) {
	let result = new (objectsConstructors[type] || type)()

	result.id = 'x' + (Math.random() * (1 << 16) ^ 0).toString(16);
	result.type = type;
	if (element){
		result.element = element
	}
	else{
		let el = document.createElement('div');
		el.style.position = 'absolute';
		el.style.position = 'absolute';
		(gameScreen || document.querySelector('body')).appendChild(el);
		result.element = el;
	}
	if (!result.static) {
		unnamedObjects[name || result.id] = result;
	}
	else {
		unnamedStatics[name || result.id] = result;
	}
	result.x = x || 0;
	result.y = y || 0;
	result.z = 0;

	if (result.createModel){
		result.model = result.createModel();
		result.model.init();
	}
	result.oncreate();

	return result;
}

// проверить, пуста ли точка
function placeIsEmpty(x, y, type) {
	return findInPlace(x, y, type) === null ? true : false;
}

// проверить, пуста ли точка
function areaIsEmpty(x1, y1, x2, y2, type) {
	return findInArea(x1, y1, x2, y2, type) === null ? true : false;
}

// найти объект в точке
function findInPlace(x, y, type) {
	for (let o in unnamedObjects) {
		obj = unnamedObjects[o];
		if ((type == undefined || obj.type == type)
			&& obj.x < x 
			&& obj.x + obj.sprite.width > x
			&& obj.y < y
			&& obj.y + obj.sprite.height > y)
			return obj;
	}
	return null;
}

// найти объект в прямоуг зоне
function findInArea(x1, y1, x2, y2, type) {
	for (let o in unnamedObjects) {
		obj = unnamedObjects[o];
		if ((type == undefined || obj.type == type)
			&& obj.x < x2
			&& obj.x + obj.sprite.width > x1
			&& obj.y < y2
			&& obj.y + obj.sprite.height > y1)
			return obj;
	}
	return null;
}

// случайное число
function randomNumber(n)
{
	return (Math.random() * n ^ 0) % n;
}

// шанс 1 к n, что true
function dice(n)
{
	return randomNumber(n) == 0;
}

//сыграть аудио
function playSound(src)
{
	if (!cachedAudio[src]){
		cachedAudio[src] = new Audio(src);
	}
	cachedAudio[src].play();
}

//сыграть залупленное аудио
function playMusic(src)
{
	if (!cachedAudio[src]){
		cachedAudio[src] = new Audio(src);
	}

	cachedAudio[src].addEventListener('ended', function() {
	    this.currentTime = 0;
	    this.play();
	}, false);
	cachedAudio[src].play();

	return cachedAudio[src];
}

//остановить залупленное аудио
function stopMusic(sound)
{
	if (!sound)
		return;
	sound.pause();
	sound.currentTime = 0;
}


/*~~~~~~~~~~~~~~ SPRITE ~~~~~~~~~~~~~~*/

function Sprite(src) {
	this.src = src;
	this.width = 100;
	this.height = 100;
}

/*~~~~~~~~~~~~~~ MOUSE ~~~~~~~~~~~~~~*/

var mouse = {x: 0, y:0, leftPressed: false, rigthPressed: false}

window.addEventListener('mousemove', function(event) {
	mouse.x = event.clientX;
	mouse.y = event.clientY;
})

/*~~~~~~~~~~~~~~ KEYBOARD ~~~~~~~~~~~~~~*/

window.addEventListener('keydown', function(event) {

	let keycode = getKeyboardChar(event.keyCode);
	pressedKeys[keycode] = true;
	keycode = 'keyDown_' + keycode;

	for (var item in unnamedObjects) {
		if (unnamedObjects[item] == undefined || unnamedObjects[item][keycode] == undefined)
			continue;
		unnamedObjects[item][keycode]();
	}
})

window.addEventListener('keyup', function(event) {

	let keycode = getKeyboardChar(event.keyCode);
	delete pressedKeys[keycode];
	keycode = 'keyUp_' + keycode;

	for (var item in unnamedObjects) {
		if (unnamedObjects[item] == undefined || unnamedObjects[item][keycode] == undefined)
			continue;
		unnamedObjects[item][keycode]();
	}
})

window.addEventListener('keyboard', function(event) {
	// кастомное событие
	let keycode = 'keyboard_' + event.detail.code;

	for (let item in unnamedObjects) {
		if (unnamedObjects[item] == undefined || unnamedObjects[item][keycode] == undefined)
			continue;
		unnamedObjects[item][keycode]();
	}
})

function getKeyboardChar(keycode){
	let map = {
		37: 'Left', 38: 'Up', 39: 'Right', 40: 'Down',
		32: 'Space', 13: 'Enter', 16: 'Shift', 17: 'Ctrl',
		20: 'Caps', 27: 'Esc'
	}
	return map[keycode] || String.fromCharCode(keycode)
}

/*function getKeyboardKey(char){
	let map = {
		37: 'Left', 38: 'Top', 39: 'Right', 40: 'Bottom',
		32: 'Space', 13: 'Enter', 16: 'Shift', 17: 'Ctrl'
		20: 'Caps', 27: 'Esc'
	}
	for (var i in map){
		if (map[i] === char)
			return i;
	}
	return char.charCodeAt(0)
}*/

/*~~~~~~~~~~~~~~ GAME OBJECT ~~~~~~~~~~~~~~*/

function GameObject(sprite) {
	this.x = 0;
	this.y = 0;
	this.z = 0;
	this.xPrev = 0;
	this.yPrev = 0;
	this.zPrev = 0;
	this.rx = 0;
	this.ry = 0;
	this.rz = 0;
	this.hspeed = 0;
	this.vspeed = 0;
	this.element = null;
	this.sprite = sprite;
	this.xScale = 1;
	this.yScale = 1;
	this.rotation = 0;
	this.depth = 0;
	this.health = 100;
	this.static = false;
	this.collider = new Collider();
}

// при создании
GameObject.prototype.oncreate = function() {
}

// при уничтожении
GameObject.prototype.ondestroy = function() {
}

// в каждый кадр
GameObject.prototype.onstep = function() {
}

// в каждый кадр
GameObject.prototype.onBeforeStep = function() {
}

// в каждый кадр
GameObject.prototype.onstep_base = function() {
	this.xPrev = this.x;
	this.yPrev = this.y;
	this.zPrev = this.z;
	this.x += this.hspeed;
	this.y += this.vspeed;
}

// при отрисовке
GameObject.prototype.ondraw = function() {
}

// при отрисовке
GameObject.prototype.ondraw_base = function() {
	this.ondraw_base_element();
	this.ondraw_base_model();
}

GameObject.prototype.ondraw_base_model = function() {
	if (!this.model)
		return;

	this.model.draw();
}

GameObject.prototype.ondraw_base_element = function() {
	if (!this.element || !this.sprite)
		return;

	// вернуть
	/*this.element.style.position = 'absolute';
	this.element.style.left = this.x + 'px';
	this.element.style.top = this.y + 'px';
	this.element.style.width = this.sprite.width + 'px';
	this.element.style.height = this.sprite.height + 'px';
	this.element.style.transform = 'scale('+this.xScale+','+this.yScale+') rotate('+this.rotation+'deg)';
	this.element.style.background = 'url(' + this.sprite.src + ')';
	this.element.style.background = this.sprite.src;
	this.element.style.backgroundSize = this.sprite.width + 'px ' + this.sprite.height + 'px';
	this.element.style.zIndex = -this.depth;
	this.element.style.mixBlendMode = 'screen';*/
}

// запустить будильник
GameObject.prototype.alarm = function(key, timer) {
	setTimeout((this['alarm_' + key]).bind(this), timer)
}

// уничтожить объект
GameObject.prototype.destroy = function() {
	this.ondestroy();
	objectsForDestroing.push(this);
	/*if (this.element != null){
		let elem = this.element
		elem.parentElement.remove(elem)
	}*/
	this.element.hidden = true;
	this.element = null;
}

GameObject.prototype.animationSpeed = function(speed){
	this.model.base.animator.tileDisplayDuration = (speed == 0 ? 2e32 : 200 / speed)
}

function Collider(x, y, w, h){
	this.x = x || 0;
	this.y = y || 0;
	this.w = w || 0;
	this.h = h || 0;
} 

/*~~~~~~~~~~~~~~ INHERITING GAME OBJECT ~~~~~~~~~~~~~~*/

let objectsConstructors = {};

function addGameObject(name, sprite) {
	let gameobject = new Function();
	let proto = new GameObject( sprite );

	gameobject.prototype = proto;

	gameobject.prototype.on = {
		create: (function(func) {
			this.oncreate = func;
			return this;
		}).bind(gameobject.prototype),
		destroy: (function(func) {
			this.ondestroy = func;
			return this;
		}).bind(gameobject.prototype),
		step: (function(func) {
			this.onstep = func;
			return this;
		}).bind(gameobject.prototype),
		beforeStep: (function(func) {
			this.onBeforeStep = func;
			return this;
		}).bind(gameobject.prototype),
		draw: (function(func) {
			this.ondraw = func;
			return this;
		}).bind(gameobject.prototype),
		keyDown: (function(key, func) {
			this['keyDown_' + key] = func;
			return this;
		}).bind(gameobject.prototype),
		keyUp: (function(key, func) {
			this['keyUp_' + key] = func;
			return this;
		}).bind(gameobject.prototype),
		keyboard: (function(key, func) {
			this['keyboard_' + key] = func;
			return this;
		}).bind(gameobject.prototype),
		alarm: (function(key, func) {
			this['alarm_' + key] = func;
			return this;
		}).bind(gameobject.prototype),
		collision: (function(key, func) {
			this['collision_' + key] = func;
			return this;
		}).bind(gameobject.prototype),
	}

	gameobject.prototype.isStatic = function(isit){
		this.static = isit || true;
		return this;
	}

	gameobject.prototype.collider = function(x, y, w, h){
		this.collider = new Collider(x, y, w, h)
		return this;
	}

	gameobject.prototype.registrate = function(name, func){
		if (this[name])
			console.error('the name '+name+' already defined');
		this[name] = func;
		return this;
	}

	gameobject.prototype.registrateModel = function(func){
		this.createModel = func;
		return this;
	}	

	gameobject.on = gameobject.prototype.on;

	objectsConstructors[name] = gameobject;
	objectsConstructors[name + '_proto'] = proto;

	return gameobject;
};

function addSprite(name, src, w, h) {
	let result = new Sprite(src); 
	result.width = w;
	result.height = h;
	return result;
}

/*~~~~~~~~~~~~~~ Model ~~~~~~~~~~~~~~*/

let cachedTextures = {};
let unnamedModels = {};

function loadTexture(src){
	if (!cachedTextures[src])
		cachedTextures[src] = THREE.ImageUtils.loadTexture(src);

	return cachedTextures[src];
}

function Mesh(obj, material, x, y, z, w, h, src, animator){
	this.material = material;
	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;
	this.rx = 0;
	this.ry = 0;
	this.rz = 0;
	this.opacity = 1;
	this.width = w || 1;
	this.height = h || 1;
	this.mesh = null;
	this.root = obj;
	this.src = src;
	this.animator = animator;

	this.init = function(){
		this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(this.width || 0, this.height || 0), this.material);
		this.mesh.position.set(this.x, this.y, this.z);
		scene.add(this.mesh);
	}

	this.dispose = function(){
		scene.remove(this.mesh);
	}

	this.draw = function(){
		if (this.mesh.material.map == null && this.src){
			this.mesh.material.map = cachedTextures[src];
			//this.mesh.material.needsUpdate()
			this.mesh.material.needsUpdate = true
		}

		this.mesh.position.x = this.root.x + this.x;
		this.mesh.position.y = this.root.y + this.y;
		this.mesh.position.z = this.root.z + this.z;
		this.mesh.rotation.x = this.root.rx + this.rx;
		this.mesh.rotation.y = this.root.ry + this.ry;
		this.mesh.rotation.z = this.root.rz + this.rz;
		//TODO: считать повороты относительно модели (через синусы и косинусы)

		if (this.animator)
			this.animator.update(30);
	}

	this.setRoot = function(obj){
		this.root = obj;
	}
}

function Model(obj){
	//this.meshes = {};

	this.add = function(name, src, options){
		name = name || (Math.random() * Number.MAX_SAFE_INTEGER ^ 0);
		options = options || {};
		options.transparent = options.transparent || true;
		options.blending = options.blending || THREE.NormalBlending;
		options.side = options.side || THREE.DoubleSide;
		options.opacity = options.opacity || 1;

		let texture = cachedTextures[src]//loadTexture(src);
		let material = new THREE.MeshBasicMaterial({
			map: options.animator ? options.animator.texture : texture, 
			transparent: options.transparent, 
			side: options.side, 
			blending: options.blending, 
			opacity: options.opacity
		});
		let mesh = new Mesh(this.root, material, options.x, options.y, options.z, options.w, options.h, src, options.animator)

		this[name] = mesh;
	}

	this.init = function(){
		for (let i in this){
			if (typeof this[i] == 'function')
				continue;
			this[i].init();
		}
	}

	this.remove = function(name){
		scene.remove(this[name].mesh)
		delete this[name];
	}

	this.draw = function(){
		for (let i in this){
			if (typeof this[i] == 'function')
				continue;
			this[i].draw();
		}
	}

	this.setRoot = function(obj){
		for (let i in this){
			if (typeof this[i] == 'function')
				continue;
			this[i].setRoot(obj);
		}
	}

	/*this.setRoot = function(obj){
		this.meshes.forEach(function(item){item.setRoot(obj)})
	}*/

	/*this.create = function(obj){
		let result = new Model(this);
		return result;
	}*/
}

function createModel(name, src, w, h, options){
		options = options || {};
		options.w = w;
		options.h = h;
		return new ModelBuilder(name, src, options);
	}

function ModelBuilder(name, src, options){
	this.name = name
	this.result = new Model(null);

	// base mesh
	this.result.add('base', src, options);

	this.add = function(name, src, w, h, animator, options){
		options = options || {};
		options.w = w || 1;
		options.h = h || 1;
		options.animator = animator;
		this.result.add(name, src, options);
		return this;
	}

	this.root = function(obj){
		this.result.setRoot(obj);
		return this;
	}

	this.done = function(){
		unnamedModels[this.name] = this.result;
		return this.result;
	}
}

/*~~~~~~~~~~~~~~ Texture animator ~~~~~~~~~~~~~~*/

function TextureAnimator(texture, tilesHoriz, tilesVert, numTiles, tileDispDuration) 
{	
	this.texture = texture;
	// note: texture passed by reference, will be updated by the update function.
		
	this.tilesHorizontal = tilesHoriz;
	this.tilesVertical = tilesVert;
	// how many images does this spritesheet contain?
	//  usually equals tilesHoriz * tilesVert, but not necessarily,
	//  if there at blank tiles at the bottom of the spritesheet. 
	this.numberOfTiles = numTiles;
	this.texture.wrapS = this.texture.wrapT = THREE.RepeatWrapping; 
	this.texture.repeat.set( 1 / this.tilesHorizontal, 1 / this.tilesVertical );

	// how long should each image be displayed?
	this.tileDisplayDuration = tileDispDuration;

	// how long has the current image been displayed?
	this.currentDisplayTime = 0;

	// which image is currently being displayed?
	this.currentTile = 0;
		
	this.update = function( milliSec )
	{
		this.currentDisplayTime += milliSec;
		while (this.currentDisplayTime > this.tileDisplayDuration)
		{
			this.currentDisplayTime -= this.tileDisplayDuration;
			this.currentTile++;
			if (this.currentTile == this.numberOfTiles)
				this.currentTile = 0;
			var currentColumn = this.currentTile % this.tilesHorizontal;
			this.texture.offset.x = currentColumn / this.tilesHorizontal;
			var currentRow = Math.floor( this.currentTile / this.tilesHorizontal );
			this.texture.offset.y = currentRow / this.tilesVertical;
		}
	};
}	