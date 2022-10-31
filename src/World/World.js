import { createPerspectiveCamera } from './components/camera.js';
import { createScene } from './components/scene.js';
import { createSpotLight, createAmbientLight } from './components/light.js';
import { createGround, createOcean, createSky, createSun, createGroundWithDisplacementMap } from './components/terrain.js';
import { Controller } from './components/Controller.js';
import { PalmBuilder} from './components/PalmBuilder.js';
import { BeachHouseBuilder } from './components/BeachHouseBuilder.js';
import { PierBuilder } from './components/PierBuilder.js';
import { GrassBuilder } from './components/GrassBuilder.js';

import {
    PMREMGenerator,
    Vector3,
    ArrowHelper
} from 'three';

import Stats from './../../lib/three/examples/jsm/libs/stats.module.js';

import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/Resizer.js';
import { Loop } from './systems/Loop.js';

const GRAVITY = new Vector3(0, -0.05, 0);

//#region Debugger Helper
const origin = new Vector3(0, 0, 0);
const arrowHelperX = new ArrowHelper((new Vector3(1, 0, 0)).normalize(), origin, 300, 0xFF0000);
const arrowHelperY = new ArrowHelper((new Vector3(0, 1, 0)).normalize(), origin, 300, 0x00FF00);
const arrowHelperZ = new ArrowHelper((new Vector3(0, 0, 1)).normalize(), origin, 300, 0x0000FF);
//#endregion

class World {
    #camera;
    #renderer;
    #scene;
    #light;
    #loop;
    #controller;
    #ocean;

    constructor(container) {
        this.stats = Stats();
        document.body.appendChild(this.stats.dom);

        this.#camera = createPerspectiveCamera(new Vector3(0, 500, 0));
        this.#scene = createScene();
        this.#renderer = createRenderer();
        this.#light = createAmbientLight();
        this.#controller = new Controller(this.#camera);
        const pmremGenerator = new PMREMGenerator(this.#renderer);
        
        container.append(this.#renderer.domElement);

        const ground = createGround();
        this.#ocean = createOcean();
        this.#ocean.fog = this-this.#scene.fog !== undefined;
        const sky = createSky();
        const sun = createSun(sky);

        this.#controller.addObjectForCollision(ground);
        
        this.#scene.add(sky);
        this.#scene.add(this.#ocean);
        this.#scene.add(ground);
        this.#scene.add(this.#light);

        //#region Debugger Helper
        this.#scene.add(arrowHelperX);
        this.#scene.add(arrowHelperY);
        this.#scene.add(arrowHelperZ);
        //#endregion
        
        this.#scene.environment = pmremGenerator.fromScene(sky).texture;

        this.#loop = new Loop(this.#camera, this.#scene, this.#renderer, this);

        const resizer = new Resizer(container, this.#camera, this.#renderer);

        container.addEventListener("click", (ev) => {
            if (!this.#controller.isLocked) {
                this.#controller.lock();
            }
        });
    }

    async init() {
        const palmBuilder = new PalmBuilder();
        const beachHouseBuilder = new BeachHouseBuilder();
        const pierBuilder = new PierBuilder();
        const grassBuilder = new GrassBuilder();

        this.palm1 = await palmBuilder.load(100,5,0, Math.PI/2);
        this.beachHouse = await beachHouseBuilder.load(0,-17,0,0);
        this.pier = await pierBuilder.load(10,-14,120, 0);
        this.grass = await grassBuilder.load(0,6.5,0,0);

        this.#loop.updatables.push(this.palm1);
        this.#scene.add(this.palm1);
        this.#scene.add(this.beachHouse);
        this.#scene.add(this.pier);
        this.#scene.add(this.grass);

        this.#camera.lookAt(this.palm1.position);
        this.#controller.addObjectForCollision(this.palm1.children[0]);
        this.#controller.addObjectForCollision(this.palm1.children[1]);
        this.#controller.addObjectForCollision(this.beachHouse.children[0].children);
        this.#controller.addObjectForCollision(this.pier.children);
      }

    render() {

        this.#controller.applyForce(GRAVITY);
        this.#controller.update();

        // #TODO: Berechnen wo der Boden ist (jetzt fix bei 20)
        this.#controller.applyGround(10);

        this.#ocean.material.uniforms[ 'time' ].value += 0.25 / 60.0;

        this.stats.update();
    }

    start() {
        this.#loop.start();
    }

    stop() {
        this.#loop.stop();
    }

}

export { World };