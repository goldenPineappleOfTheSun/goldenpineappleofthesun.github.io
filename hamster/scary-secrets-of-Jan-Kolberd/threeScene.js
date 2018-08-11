'use strict'


let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;

//--- Most important ---//
let scene = new THREE.Scene();
let camera   = new THREE.PerspectiveCamera( 75, canvasWidth / canvasHeight, 0.1, 1000 );
    camera.position.z = 200;
let renderer = new THREE.WebGLRenderer();
    renderer.setSize( canvasWidth, canvasHeight );
    renderer.setClearColor( 0x111111, 1 );
    document.body.appendChild( renderer.domElement );

let light = new THREE.AmbientLight( 0xffffff ); // soft white light
scene.add( light );

//--- Functions ---//
function threeSceneRender() {
	renderer.render(scene, camera)
}