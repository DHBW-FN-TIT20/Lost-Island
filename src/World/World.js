import { createPerspectiveCamera } from './components/camera.js';
import { createSphere, move } from './components/sphere.js';
import { createScene } from './components/scene.js';
import { createSpotLight } from './components/light.js';

import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/Resizer.js';


class World {
    #camera;
    #renderer;
    #scene;
    #light;

    constructor(container) {
        this.#camera = createPerspectiveCamera();
        this.#scene = createScene();
        this.#renderer = createRenderer();
        this.#light = createSpotLight();
        container.append(this.#renderer.domElement);
        container.addEventListener('mousemove', this.animate);

        const sphere = createSphere();
        this.#scene.add(sphere);

        const resizer = new Resizer(container, this.#camera, this.#renderer);
    }

    render() {
        this.#renderer.render(this.#scene, this.#camera);
    }

    animate(e) {
        move(e);
        this.#renderer.render(this.#scene, this.#camera);
    }

}

export { World };