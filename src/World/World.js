import { createPerspectiveCamera } from './components/camera.js';
import { createScene } from './components/scene.js';
import { createAmbientLight, createSpotLight } from './components/light.js';
import { createGround, createOcean, createSky, createSun, createGroundWithDisplacementMap, createRock } from './components/terrain.js';
import { Controller } from './components/Controller.js';
import { ColissionBoxBuilder } from './components/ColissionBoxBuilder.js';
import { BeachHouseBuilder } from './components/BeachHouseBuilder.js';
import { PierBuilder } from './components/PierBuilder.js';
import { BoatBuilder } from './components/BoatBuilder.js';
import { BallBuilder } from './components/BallBuilder.js';
import { VegetationBuilder } from './components/VegetationBuilder.js';
import { UmbrellaBuilder } from './components/UmbrellaBuilder.js';
import { ChairBuilder } from './components/ChairBuilder.js';
import { WolfBuilder } from './components/WolfBuilder.js';
import { SharkBuilder } from './components/SharkBuilder.js';
import { CrateBuilder } from './components/CrateBuilder.js';

import {
    PMREMGenerator,
    Vector3,
    ArrowHelper
} from 'three';

import Stats from './../../lib/three/examples/jsm/libs/stats.module.js';

import { createRenderer } from './systems/renderer.js';
import { Loop } from './systems/Loop.js';
import { InteractionHelper } from './systems/InteractionHelper.js';


//#region Debugger Helper
const origin = new Vector3(0, 0, 0);
const arrowHelperX = new ArrowHelper((new Vector3(1, 0, 0)).normalize(), origin, 300, 0xFF0000);
const arrowHelperY = new ArrowHelper((new Vector3(0, 1, 0)).normalize(), origin, 300, 0x00FF00);
const arrowHelperZ = new ArrowHelper((new Vector3(0, 0, 1)).normalize(), origin, 300, 0x0000FF);
//#endregion

const GRAVITY = new Vector3(0, -0.05, 0);

class World {
    #camera;
    #renderer;
    #scene;
    #light;
    #loop;
    #controller;
    #ocean;
    #ground;
    #interactionHelper;

    constructor(container) {
        this.stats = Stats();
        document.body.appendChild(this.stats.dom);

        this.#camera = createPerspectiveCamera(new Vector3(10, 20, 105));
        this.#scene = createScene();
        this.#renderer = createRenderer();

        this.#controller = new Controller(this.#camera);
        this.#interactionHelper = new InteractionHelper(this.#camera);
        
        container.append(this.#renderer.domElement);

        //#region Debugger Helper
        this.#scene.add(arrowHelperX);
        this.#scene.add(arrowHelperY);
        this.#scene.add(arrowHelperZ);
        //#endregion

        this.#scene.environment = pmremGenerator.fromScene(sky).texture;

        this.#loop = new Loop(this.#camera, this.#scene, this.#renderer, this);

        container.addEventListener("click", (ev) => {
            if (!this.#controller.isLocked) {
                this.#controller.lock();
            }
        });
    }

    /**
     * Die Methode wird von der Loop-Klasse aufgerufen, wenn ein neuer Frame berechnet werden soll. 
     * @param {Ladebalken} spinner 
     */
    async init(spinner) {

        //#region Start spinner for loading process
        this.setText("");
        spinner.style.display = "block";
        //#endregion

        //#region Create World
        this.#ground = createGround();
        this.#ocean = createOcean();
        this.#ocean.fog = this - this.#scene.fog !== undefined;
        const sky = createSky();
        const sun = createSun(sky);
        this.#light = createSpotLight(sun);
        //#endregion

        //#region Create Builder
        const beachHouseBuilder = new BeachHouseBuilder();
        const pierBuilder = new PierBuilder();
        const boatBuilder = new BoatBuilder();
        const ballBuilder = new BallBuilder(this.#ground);
        const vegetationBuilder = new VegetationBuilder();
        const umbrellaBuilder = new UmbrellaBuilder();
        const colissionBoxBuilder = new ColissionBoxBuilder();
        const chairBuilder = new ChairBuilder();
        const wolfBuilder = new WolfBuilder();
        const sharkBuilder = new SharkBuilder();
        const crateBuilder = new CrateBuilder();
        //#endregion

        //#region Create Objects for the World
        this.beachHouse = await beachHouseBuilder.load(0, 10, -50, 0);
        this.pier = await pierBuilder.load(10, -10, 158, 0, 15, 15, 40);
        this.bridge = await pierBuilder.load(18, -10, 25, 0, 15, 15, 30);

        this.rock = createRock(50,5,-20);

        this.boat = await boatBuilder.load(30, -26, 105, Math.PI);
        this.crate1 = await crateBuilder.load(30, 11, 105, 0);
        this.crate2 = await crateBuilder.load(20, 11, 102, Math.PI / 2);

        this.crate3 = await crateBuilder.load(-55, 11.5, 28, 0);
        this.crate4 = await crateBuilder.load(-55, 11.5, 30, 0);
        this.crate5 = await crateBuilder.load(-55, 11.5, 32, 0);
        this.crate6 = await crateBuilder.load(-55, 13.5, 30.5, 0);
        this.crate7 = await crateBuilder.load(-57, 11.5, 28.5, 0);

        this.soccerBall = await ballBuilder.loadSoccerBall(20, -6, -30, 0);
        
        this.umbrella = await umbrellaBuilder.load(110, -11, 60, 0);
        this.chairWithTowel = await chairBuilder.loadChairWithTowel(125, -11, 25, Math.PI / 2);

        this.shark = await sharkBuilder.load(170, 1, 25, Math.PI / 2);
        this.wolf = await wolfBuilder.load(-2, 12, -54, -Math.PI / 2);

        this.tree0 = await vegetationBuilder.loadTree(50, 11, -30, 0);
        this.tree1 = await vegetationBuilder.loadTree(-20, 11, -50, 0);
        this.palm = await vegetationBuilder.loadPalmWithCoconut(90, 10.8, 25, 0);
        this.acaiPalm1 = await vegetationBuilder.loadAcaiPalm(0, 8, 60, 0);
        this.acaiPalm2 = await vegetationBuilder.loadAcaiPalm(30, 8, 30, 0);
        this.datePalm1 = await vegetationBuilder.loadDatePalm(60, 8, 70, 0);
        this.datePalm2 = await vegetationBuilder.loadDatePalm(-20, 8, 40, 0);
        this.seaPlant = await vegetationBuilder.loadSeaPlant(10, 2, -5, 0);
        //#endregion

        //#region Create extra colission boxes for some objects
        this.beachHouseBox1 = await colissionBoxBuilder.loadBox(4, 15, -57, 10, 25, 20);
        this.beachHouseBox2 = await colissionBoxBuilder.loadBox(-5, 15, -64, 12, 25, 10);

        this.tree0Box0 = await colissionBoxBuilder.loadBox(50, 25, -30, 7, 15, 7);
        this.tree0Box1 = await colissionBoxBuilder.loadBox(50, 13, -30, 3, 10, 5);

        this.tree1Box0 = await colissionBoxBuilder.loadBox(-20, 25, -50, 7, 15, 7);
        this.tree1Box1 = await colissionBoxBuilder.loadBox(-20, 13, -50, 3, 10, 5);
        //#endregion

        //#region Add all Objects to the scene
        this.#scene.add(sky);
        this.#scene.add(this.#ocean);
        this.#scene.add(this.#ground);
        this.#scene.add(this.#light);

        this.#scene.add(this.palm);
        this.#scene.add(this.beachHouse);
        this.#scene.add(this.pier);
        this.#scene.add(this.bridge);
        this.#scene.add(this.boat);
        this.#scene.add(this.soccerBall);
        this.#scene.add(this.tree0);
        this.#scene.add(this.tree1);
        this.#scene.add(this.umbrella);
        this.#scene.add(this.chairWithTowel);
        this.#scene.add(this.wolf);
        this.#scene.add(this.wolf.box);
        this.#scene.add(this.acaiPalm1);
        this.#scene.add(this.acaiPalm2);
        this.#scene.add(this.datePalm1);
        this.#scene.add(this.datePalm2);
        this.#scene.add(this.seaPlant);
        this.#scene.add(this.shark);

        this.#scene.add(this.crate1);
        this.#scene.add(this.crate2);
        this.#scene.add(this.crate3);
        this.#scene.add(this.crate4);
        this.#scene.add(this.crate5);
        this.#scene.add(this.crate6);
        this.#scene.add(this.crate7);

        this.#scene.add(this.rock);
        //#endregion

        //#region Add objects for colission
        this.#controller.addObjectForCollision(this.palm.children[0]);
        this.#controller.addObjectForCollision(this.palm.children[1]);

        this.#controller.addObjectForCollision(this.tree0Box0);
        this.#controller.addObjectForCollision(this.tree0Box1);

        this.#controller.addObjectForCollision(this.tree1Box0);
        this.#controller.addObjectForCollision(this.tree1Box1);

        this.#controller.addObjectForCollision(this.rock.children[0]);

        this.#controller.addObjectForCollision(this.crate1.children);
        this.#controller.addObjectForCollision(this.crate2.children);
        this.#controller.addObjectForCollision(this.crate3.children);
        this.#controller.addObjectForCollision(this.crate4.children);
        this.#controller.addObjectForCollision(this.crate5.children);
        this.#controller.addObjectForCollision(this.crate6.children);
        this.#controller.addObjectForCollision(this.crate7.children);        

        this.#controller.addObjectForCollision(this.beachHouseBox1);
        this.#controller.addObjectForCollision(this.beachHouseBox2);
        
        this.#controller.addObjectForCollision(this.chairWithTowel.children[0].children);
        this.#controller.addObjectForCollision(this.pier.children);
        this.#controller.addObjectForCollision(this.bridge.children);
        this.#controller.addObjectForCollision(this.boat.children);
        this.#controller.addObjectForCollision(this.#ground);
        //#endregion Add objects for colission

        //#region Add object interactions
        // Palm
        let palmInteraction = (ev) => {
            switch (ev.code) {
                case 'KeyE':
                    this.#interactionHelper.removeInteraction(this.palm.children[2]);

                    this.palm.startAnimation();
                    this.setText("&#8982;");
            }
        };
        this.#interactionHelper.addInteraction(this.palm.children[2], this.palm.setInteractionText, "keydown", palmInteraction);

        // Soccer Ball
        const soccerBallInteraction = (ev) => {
            switch (ev.code) {
                case 'KeyE':
                    this.#interactionHelper.removeInteraction(this.soccerBall.children[0]);

                    this.#loop.updatables.push(this.soccerBall);
                    this.setText("&#8982;");
                    let direction = this.#camera.getWorldDirection(new Vector3());
                    direction.y = 1;
                    this.soccerBall.kick(direction);
            }
        };
        this.#interactionHelper.addInteraction(this.soccerBall.children[0], this.soccerBall.setInteractionText, "keydown", soccerBallInteraction);

        // Wolf
        this.#interactionHelper.addInteraction(this.wolf.box, this.wolf.sit);


        // Chair with towel
        this.#interactionHelper.addInteraction(this.chairWithTowel.children[0].children[0], this.chairWithTowel.setInteractionText, "keydown", (ev) => { 
            switch (ev.code) {
                case 'KeyE':
                    this.setText("&#8982;");
                    this.chairWithTowel.sitOnChair((newPosition, quaternion) => {this.#controller.setFixedPosition(newPosition, quaternion)});
            }
        });

        //#endregion Add object interactions

        //#region Some other init configs
        const pmremGenerator = new PMREMGenerator(this.#renderer);
        this.#scene.environment = pmremGenerator.fromScene(sky).texture;

        this.#loop = new Loop(this.#camera, this.#scene, this.#renderer, this);

        await this.wolf.startAnimation();
        await this.shark.startAnimation();

        this.#loop.updatables.push(this.palm);
        this.#loop.updatables.push(this.wolf);
        this.#loop.updatables.push(this.shark);

        this.#camera.lookAt(this.beachHouse.position);
        //#endregion

        // End loading spinner
        spinner.style.display = "none";
    }

    /**
     * Diese Methode wird aufgerufen, wenn der Benutzer die Taste "E" drückt. Der übergebene Text wird in der HTML-Datei anstelle des Fadenkreuzes angezeigt.
     * @param {Anzuzeigender Text} text 
     */
    setText(text) {
        let div = document.getElementById("info");
        div.innerHTML = text;
    }

    /**
     * Diese Methode wird von der Klasse Loop aufgreufen, wenn die Szene neu gezeichnet werden soll. Hier werden Interaktionen mit Objekten geprüft
     * und die Kamera aktualisiert. Außerdem wird hier die Kollisionsabfrage durchgeführt. Ebenfalls wird die Animation des Wassers gesteuert.
     */
    render() {

        this.#controller.update();
        this.#interactionHelper.checkInteractions();
        
        this.#ocean.material.uniforms['time'].value += 0.20 / 60.0;

        this.stats.update();
    }

    start() {
        this.#loop.start();
    }

    stop() {
        this.#loop.stop();
    }

}

export { World, GRAVITY };