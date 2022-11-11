import { PerspectiveCamera } from 'three';
import { Vector3 } from 'three';


function createPerspectiveCamera(startPositon = new Vector3(0, 0, 0)) {
    const camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 500);
    camera.position.x = startPositon.x;
    camera.position.y = startPositon.y;
    camera.position.z = startPositon.z;
    return camera;
}

export { createPerspectiveCamera };