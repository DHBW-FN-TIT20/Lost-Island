import { PerspectiveCamera } from 'three';

function createPerspectiveCamera() {
    const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
    camera.position.set(0, 0, 100);
    return camera;
}

export { createPerspectiveCamera };