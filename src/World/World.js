import { createPerspectiveCamera } from './components/camera.js';
import { createSphere, move } from './components/sphere.js';
import { createScene } from './components/scene.js';
import { createSpotLight } from './components/light.js';

import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/Resizer.js';

let camera;
let renderer;
let scene;
let light;

class World {
    constructor(container) {
        camera = createPerspectiveCamera();
        scene = createScene();
        renderer = createRenderer();
        light = createSpotLight();
        container.append(renderer.domElement);
        container.addEventListener('mousemove', this.animate);

        const sphere = createSphere();
        scene.add(sphere);

        const resizer = new Resizer(container, camera, renderer);
    }
    render() {
        renderer.render(scene, camera);
    }
    animate(e) {
        move(e);
        renderer.render(scene, camera);
    }

}

export { World };