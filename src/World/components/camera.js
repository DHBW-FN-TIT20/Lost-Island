import { PerspectiveCamera } from 'three';

function createPerspectiveCamera() {
    const camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 100);
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 80;
    return camera;
}

export { createPerspectiveCamera };