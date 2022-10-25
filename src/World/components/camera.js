import { PerspectiveCamera } from 'three';

function createPerspectiveCamera() {
    const camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 100;
    return camera;
}

export { createPerspectiveCamera };