import { createPerspectiveCamera } from './components/camera.js';
import { createScene } from './components/scene.js';
import { createSpotLight } from './components/light.js';
import { createGround } from './components/terrain.js';
import { createFirstPersonControls } from './components/firstpersoncontrols.js';

import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/Resizer.js';
import { Loop } from './systems/Loop.js';

class World {
    #camera;
    #renderer;
    #scene;
    #light;
    #loop;
    #fpsControl;

    constructor(container) {
        let gui = new dat.GUI({ name: 'My GUI' });
        const terrainFolder = gui.addFolder('Terrain');
        const cameraFolder = gui.addFolder('Camera');

        this.#camera = createPerspectiveCamera();
        this.#scene = createScene();
        this.#renderer = createRenderer();
        this.#light = createSpotLight();


        container.append(this.#renderer.domElement);

        const ground = createGround();
        this.#scene.add(ground);
        this.#scene.add(this.#light);
        this.#fpsControl = createFirstPersonControls(this.#camera, this.#renderer.domElement);
        this.#loop = new Loop(this.#camera, this.#scene, this.#renderer, this.#fpsControl);

        terrainFolder.add(ground.rotation, 'x').min(0).max(200);
        cameraFolder.add(this.#camera.position, 'x', 0, 1000);
        cameraFolder.add(this.#camera.position, 'y', 0, 1000);
        cameraFolder.add(this.#camera.position, 'z', 0, 1000);
        const resizer = new Resizer(container, this.#camera, this.#renderer);
    }

    render() {
        this.#renderer.render(this.#scene, this.#camera);
    }

    animate(e) {
        this.#renderer.render(this.#scene, this.#camera);
    }

    start() {
        this.#loop.start();
    }

    stop() {
        this.#loop.stop();
    }

}

export { World };