import { createPerspectiveCamera } from './components/camera.js';
import { createScene } from './components/scene.js';
import { createSpotLight } from './components/light.js';
import { createGround, createOcean, createSky, createSun } from './components/terrain.js';
import { Controller } from './components/Controller.js';
import { loadPalm } from './components/palm.js';

import {PMREMGenerator} from 'three';

import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/Resizer.js';
import { Loop } from './systems/Loop.js';

import { Vector3 } from 'three';


const GRAVITY = new Vector3(0, -0.05, 0);


class World {
    #camera;
    #renderer;
    #scene;
    #light;
    #loop;
    #controller;
    #ocean;

    constructor(container) {
        let gui = new dat.GUI({ name: 'My GUI' });
        const terrainFolder = gui.addFolder('Terrain');
        const cameraFolder = gui.addFolder('Camera');

        this.#camera = createPerspectiveCamera(new Vector3(0, 1000, 0));
        this.#scene = createScene();
        this.#renderer = createRenderer();
        this.#light = createSpotLight();
        this.#controller = new Controller(this.#camera);
        const pmremGenerator = new PMREMGenerator(this.#renderer);
        
        container.append(this.#renderer.domElement);

        const ground = createGround();
        this.#ocean = createOcean();
        this.#ocean.fog = this-this.#scene.fog !== undefined;
        const sky = createSky();
        const sun = createSun(sky);
        
        this.#scene.add(sky);
        this.#scene.add(this.#ocean);
        this.#scene.add(ground);
        this.#scene.add(this.#light);
        this.#scene.environment = pmremGenerator.fromScene(sky).texture;

        this.#loop = new Loop(this.#camera, this.#scene, this.#renderer, this);

        terrainFolder.add(ground.rotation, 'x').min(0).max(200);
        cameraFolder.add(this.#camera.position, 'x', 0, 1000);
        cameraFolder.add(this.#camera.position, 'y', 0, 1000);
        cameraFolder.add(this.#camera.rotation, 'y', 0, 1000);
        cameraFolder.add(this.#camera.position, 'z', 0, 1000);
        const resizer = new Resizer(container, this.#camera, this.#renderer);
    }

    async init() {
        // asynchronous setup here
        const palm =  await loadPalm();
        this.#camera.lookAt(palm.position);
        this.#loop.updatables.push(palm);
        this.#scene.add(palm);
      }

    render() {

        this.#controller.applyForce(GRAVITY);
        this.#controller.update();

        // #TODO: Berechnen wo der Boden ist (jetzt fix bei 20)
        this.#controller.applyGround(10);

        this.#ocean.material.uniforms[ 'time' ].value += 1.0 / 60.0;
    }

    start() {
        this.#loop.start();
    }

    stop() {
        this.#loop.stop();
    }

}

export { World };