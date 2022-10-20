import { SphereGeometry, Mesh, MeshBasicMaterial } from 'three';
let sphere;

function createSphere() {
    // Create our geometry
    let sphereGeometry = new SphereGeometry(20, 25, 25);

    // A `normal` material uses the coordinates of an object to calculate its color
    let sphereMesh = new MeshBasicMaterial({
        color: 0x66FF00,
        wireframe: true
    });
    sphere = new Mesh(sphereGeometry, sphereMesh);
    return sphere
}

function move(e) {
    sphere.rotation.x = e.pageX * 0.01;
    sphere.rotation.y = -e.pageX * 0.01;
}

export { createSphere, move };