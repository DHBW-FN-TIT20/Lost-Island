import { createPerspectiveCamera } from './components/camera.js';
import { createSphere, move } from './components/sphere.js';
import { createScene } from './components/scene.js';
import { createSpotLight } from './components/light.js';
import { createGround, createOcean, createSky, createSun } from './components/terrain.js';
import { createFirstPersonControls } from './components/firstpersoncontrols.js';
import { loadPalm } from './components/palm.js';

import {PMREMGenerator} from 'three';

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
        let gui = new dat.GUI({name: 'My GUI'});
        const terrainFolder = gui.addFolder('Terrain');
        const cameraFolder = gui.addFolder('Camera');

        this.#camera = createPerspectiveCamera();
        this.#scene = createScene();
        this.#renderer = createRenderer();
        this.#light = createSpotLight();
        const pmremGenerator = new PMREMGenerator(this.#renderer);
        
        container.append(this.#renderer.domElement);
 
        const ground = createGround();
        const ocean = createOcean();
        const sky = createSky();
        const sun = createSun(sky);
        
        this.#scene.add(sky);
        this.#scene.add(ocean);
        this.#scene.add(ground);
        this.#scene.add(this.#light);
        this.#scene.environment = pmremGenerator.fromScene(sky).texture;
        // this.#fpsControl = createFirstPersonControls(this.#camera, this.#renderer.domElement);
        this.#loop = new Loop(this.#camera, this.#scene, this.#renderer);
        this.#loop.updatables.push(ocean);

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
        
        this.#loop.updatables.push(palm);
        this.#scene.add(palm);
      }

    render() {
        this.#renderer.render(this.#scene, this.#camera);
    }

    animate(e) {
        move(e);
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