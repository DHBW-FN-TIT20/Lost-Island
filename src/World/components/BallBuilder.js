import { GLTFLoader } from '../../../lib/three/examples/jsm/loaders/GLTFLoader.js';
import { Object3D, Raycaster, Vector3 } from 'three';

import { GRAVITY } from "../World.js";

/**
 * Helper class to build a ball.
 */
class BallBuilder {
    constructor() {
        this.soccerBall = new Object3D();
    }

    /**
     * Creates a ball.
     * @param {Number} x Position in x axis
     * @param {Number} y Position in y axis
     * @param {Number} z Position in z axis
     * @param {Number} rotationY Rotation in y axis
     * @returns THREE.Object3D
     */
    async loadSoccerBall(x, y, z, rotationY) {
        const loader = new GLTFLoader();
        const data = await loader.loadAsync('/assets/models/soccer-ball.gltf');

        this.soccerBall = this.setUpModel(data);

        this.soccerBall.position.x = x;
        this.soccerBall.position.y = y;
        this.soccerBall.position.z = z;
        this.soccerBall.rotation.y = rotationY;
        this.yRaycaster = new Raycaster(this.soccerBall.position.clone(), new Vector3(0, -1, 0), 0, 30);

        this.soccerBall.weight = 10;
        this.soccerBall.GRAVITY = GRAVITY.clone();
        this.soccerBall.acceleration = new Vector3();
        this.soccerBall.velocity = new Vector3();
        this.soccerBall.kicked = false;
        this.soccerBall.kick = this.kick;
        this.soccerBall.applyForce = this.applyForce;
        this.soccerBall.update = this.update;
        this.soccerBall.setInteractionText = this.setText;

        this.soccerBall.tick = (delta) => this.soccerBall.update();

        return this.soccerBall;
    }

    /**
     * Kick the ball in that direction
     * @param {THREE.Vector3} direction
     */
    kick(direction) {
        if (!this.kicked) {
            direction.normalize();
            this.applyForce(direction.multiplyScalar(10));
            this.kicked = true;
        }
    }

    /**
     * Apply a force to the ball
     * @param {THREE.Vector3} force 
     */
    applyForce(force) {
        const vector = force.clone();
        vector.divideScalar(this.weight);
        this.acceleration.add(vector);
    }

    /**
     * Update the position of the ball
     */
    update() {
        this.applyForce(this.GRAVITY);

        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);

        this.acceleration.multiplyScalar(0);
    }

    /**
     * Set the text of the interaction
     */
    setText() {
        let div = document.getElementById("info");
        div.innerHTML = "E - Schießen";
    }

    /**
     * Set the Animations and Scale of the Ball
     * @param {THREE.Object3D} data 
     * @returns THREE.Object3D
     */
    setUpModel(data) {
        const model = data.scene;
        //Set castShadow to true for all children
        for(let i = 0; i < model.children.length; i++) {
            model.children[i].castShadow = true;
            model.children[i].receiveShadow = true;
            if(model.children[i].children.length > 0) {
                for(let j = 0; j < model.children[i].children.length; j++) {
                    model.children[i].children[j].castShadow = true;
                    model.children[i].children[j].receiveShadow = true;
                }
            }
        }
        model.scale.set(15, 15, 15);
        return model;
    }

}

export { BallBuilder };