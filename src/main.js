import * as THREE from 'three';

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(0, 0, 100);

const scene = new THREE.Scene();

// Create our geometry
let sphereGeometry = new THREE.SphereGeometry(20, 50, 50);

// A `normal` material uses the coordinates of an object to calculate its color
let sphereMesh = new THREE.MeshBasicMaterial({
    color: 0x66FF00,
    wireframe: true
});

// Combine both, and add it to the scene.
let sphere = new THREE.Mesh(sphereGeometry, sphereMesh);
scene.add(sphere);
var light = new THREE.SpotLight(0xFF0000);
light.position.set(50, 50, 150);
scene.add(light);

window.addEventListener('mousemove', move);

function move(e) {

    sphere.rotation.x = e.pageX * 0.01;
    sphere.rotation.y = -e.pageX * 0.01;
    renderer.render(scene, camera);
}

renderer.render(scene, camera);