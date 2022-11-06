import { createPerspectiveCamera } from './components/camera.js';
import { createScene } from './components/scene.js';
import { createAmbientLight } from './components/light.js';
import { createGround, createOcean, createSky, createSun, createGroundWithDisplacementMap } from './components/terrain.js';
import { Controller } from './components/Controller.js';
import { PalmBuilder } from './components/PalmBuilder.js';
import { ColissionBoxBuilder } from './components/ColissionBoxBuilder.js';
import { BeachHouseBuilder } from './components/BeachHouseBuilder.js';
import { PierBuilder } from './components/PierBuilder.js';
import { BoatBuilder } from './components/BoatBuilder.js';
import { BallBuilder } from './components/BallBuilder.js';
import { VegetationBuilder } from './components/VegetationBuilder.js';
import { UmbrellaBuilder } from './components/UmbrellaBuilder.js';
import { ChairBuilder } from './components/ChairBuilder.js';

import {
    PMREMGenerator,
    Vector3,
    ArrowHelper
} from 'three';

import Stats from './../../lib/three/examples/jsm/libs/stats.module.js';

import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/Resizer.js';
import { Loop } from './systems/Loop.js';
import { InteractionHelper } from './systems/InteractionHelper.js';


//#region Debugger Helper
const origin = new Vector3(0, 10, 0);
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
    #interactionHelper;

    constructor(container) {
        this.stats = Stats();
        document.body.appendChild(this.stats.dom);

        this.#camera = createPerspectiveCamera(new Vector3(10, 18, -30));
        this.#scene = createScene();
        this.#renderer = createRenderer();
        this.#light = createAmbientLight();
        this.#controller = new Controller(this.#camera);
        this.#interactionHelper = new InteractionHelper(this.#camera);
        const pmremGenerator = new PMREMGenerator(this.#renderer);

        container.append(this.#renderer.domElement);

        const ground = createGround();
        this.#ocean = createOcean();
        this.#ocean.fog = this - this.#scene.fog !== undefined;
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
        const boatBuilder = new BoatBuilder();
        const ballBuilder = new BallBuilder();
        const vegetationBuilder = new VegetationBuilder();
        const umbrellaBuilder = new UmbrellaBuilder();
        const colissionBoxBuilder = new ColissionBoxBuilder();
        const chairBuilder = new ChairBuilder();

        this.palm1 = await palmBuilder.load(90, 10.5, 25, 0);
        this.beachHouse = await beachHouseBuilder.load(0, 10, -50, 0);
        // this.beachHouse.children[1].rotateY(Math.PI/2);
        this.pier = await pierBuilder.load(10, -10, 158, 0, 15, 15, 40);
        this.bridge = await pierBuilder.load(18, -10, 25, 0, 15, 15, 30);
        this.boat = await boatBuilder.load(30, -26, 105, Math.PI);
        this.soccerBall = await ballBuilder.loadSoccerBall(20, -6, -30, 0);
        this.tree = await vegetationBuilder.loadTree(50, 11, -30, 0);
        this.tree2 = await vegetationBuilder.loadTree(-50, 11, 40, 0);
        this.umbrella = await umbrellaBuilder.load(110, -11, 60, 0);
        this.chairWithTowel = await chairBuilder.loadChairWithTowel(125, -11, 25, Math.PI/2);
        this.beachHouseBox1 = await colissionBoxBuilder.load(4, 15, -57, 10, 25, 20);
        this.beachHouseBox2 = await colissionBoxBuilder.load(-5, 15, -63, 8, 25, 8);

        this.#loop.updatables.push(this.palm1);
        this.#scene.add(this.palm1);
        this.#scene.add(this.beachHouse);
        this.#scene.add(this.pier);
        this.#scene.add(this.bridge);
        this.#scene.add(this.boat);
        this.#scene.add(this.soccerBall);
        this.#scene.add(this.tree);
        this.#scene.add(this.tree2);
        this.#scene.add(this.umbrella);
        this.#scene.add(this.chairWithTowel);
        this.#scene.add(this.beachHouseBox1);
        this.#scene.add(this.beachHouseBox2);


        this.#camera.lookAt(this.palm1.position);

        //#region Add objects for colission
        this.#controller.addObjectForCollision(this.palm1.children[0]);
        this.#controller.addObjectForCollision(this.palm1.children[1]);
        this.#controller.addObjectForCollision(this.tree.children[0].children);
        this.#controller.addObjectForCollision(this.tree2.children[0].children);
        this.#controller.addObjectForCollision(this.umbrella.children[0].children);
        this.#controller.addObjectForCollision(this.chairWithTowel.children[0].children);
        
        this.#controller.addObjectForCollision(this.beachHouseBox1);
        this.#controller.addObjectForCollision(this.beachHouseBox2);

        this.#controller.addObjectForCollision(this.pier.children);
        this.#controller.addObjectForCollision(this.bridge.children);
        this.#controller.addObjectForCollision(this.boat.children);
        //#endregion Add objects for colission

        //#region Add object interactions
        this.#interactionHelper.addInteraction(this.palm1.children[1], () => {
            this.setText("E zum Pflücken");
            let palmInteraction = (ev) => {
                switch (ev.code) {

                    case 'KeyE':
                        this.#interactionHelper.removeInteraction(this.palm1.children[1]);
                        removeEventListener("keydown", palmInteraction, false);

                        this.palm1.startAnimation();
                        this.setText("&#8982;");
                }
            };
            document.body.addEventListener("keydown", palmInteraction);
        });


        this.#interactionHelper.addInteraction(this.soccerBall.children[0], () => {
            this.setText("E zum Schießen");
            let soccerBallInteraction = (ev) => {
                switch (ev.code) {

                    case 'KeyE':
                        this.#interactionHelper.removeInteraction(this.soccerBall.children[0]);
                        removeEventListener("keydown", soccerBallInteraction, false);

                        this.#loop.updatables.push(this.soccerBall);
                        this.setText("&#8982;");
                }
            };
            document.body.addEventListener("keydown", soccerBallInteraction);
        });
        //#endregion Add object interactions
    }

    setText(text) {
        let div = document.getElementById("info");
        div.innerHTML = text;
    }

    render() {

        this.#controller.update();
        this.#interactionHelper.checkInteractions();

        this.#ocean.material.uniforms['time'].value += 0.25 / 60.0;

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