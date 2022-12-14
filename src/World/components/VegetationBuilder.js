import { GLTFLoader } from '../../../lib/three/examples/jsm/loaders/GLTFLoader.js';
import { AnimationMixer, Object3D, LoopOnce } from 'three';

/**
 * Helper class to build trees.
 */
class VegetationBuilder {

    #mixer;
    #action;

    constructor() {
        this.bush = new Object3D();
        this.acaiPalm = new Object3D();
        this.datePalm = new Object3D();
        this.palm = new Object3D();
        this.seaPlant = new Object3D();
    }

    /**
     * @param {Number} x x coordinate of object
     * @param {Number} y y coordinate of object
     * @param {Number} z z coordinate of object
     * @param {Number} rotationY rotationY of object
     * @returns {THREE.Object3D} smol-tree
     */
    async loadTree(x, y, z, rotationY) {
        const loader = new GLTFLoader();
        const data = await loader.loadAsync('/assets/models/smol-tree.gltf');
        const model = data.scene;
        await this.addCastShadowRecursive(model);
        this.bush = model;
        this.bush.position.x = x;
        this.bush.position.y = y;
        this.bush.position.z = z;
        this.bush.rotation.y = rotationY;
        return this.bush;
    }

    async addCastShadowRecursive(model) {
        //Set castShadow to true for all children
        for(let i = 0; i < model.children.length; i++) {
            model.children[i].castShadow = true;
            model.children[i].receiveShadow = true;
            if(model.children[i].children.length > 0) {
                await this.addCastShadowRecursive(model.children[i]);
            }
        }
    }


    /**
     * @param {Number} x x coordinate of object
     * @param {Number} y y coordinate of object
     * @param {Number} z z coordinate of object
     * @param {Number} rotationY rotationY of object
     * @returns {THREE.Object3D} acaiPalm
     */
    async loadAcaiPalm(x, y, z, rotationY) {
        const loader = new GLTFLoader();
        const data = await loader.loadAsync('/assets/models/acai_palm/scene.gltf');
        const model = data.scene;
        await this.addCastShadowRecursive(model);
        model.scale.set(4, 4, 4);
        this.acaiPalm = model;
        this.acaiPalm.position.x = x;
        this.acaiPalm.position.y = y;
        this.acaiPalm.position.z = z;
        this.acaiPalm.rotation.y = rotationY;
        return this.acaiPalm;
    }

    /**
     * @param {Number} x x coordinate of object
     * @param {Number} y y coordinate of object
     * @param {Number} z z coordinate of object
     * @param {Number} rotationY rotationY of object
     * @returns {THREE.Object3D} datePalm
     */
    async loadDatePalm(x, y, z, rotationY) {
        const loader = new GLTFLoader();
        const data = await loader.loadAsync('/assets/models/date_palm/scene.gltf');
        const model = data.scene;
        await this.addCastShadowRecursive(model);
        model.scale.set(4, 4, 4);
        this.datePalm = model;
        this.datePalm.position.x = x;
        this.datePalm.position.y = y;
        this.datePalm.position.z = z;
        this.datePalm.rotation.y = rotationY;
        return this.datePalm;
    }

    /**
     * @param {Number} x x coordinate of object
     * @param {Number} y y coordinate of object
     * @param {Number} z z coordinate of object
     * @param {Number} rotationY rotationY of object
     * @returns {THREE.Object3D} PalmWithCoconut
     */
    async loadPalmWithCoconut(x, y, z, rotationY) {
        const loader = new GLTFLoader();
        const data = await loader.loadAsync('/assets/models/palm-tree.gltf');
        this.palm = this.setUpModel(data);
        this.palm.tick = (delta) => this.#mixer.update(delta);
        this.palm.startAnimation = () => this.startAnimation();
        this.palm.stopAnimation = () => this.#action.stop();
        this.palm.setInteractionText = this.setText;
        this.palm.position.x = x;
        this.palm.position.y = y;
        this.palm.position.z = z;
        this.palm.rotation.y = rotationY;
        return this.palm;
    }

    /**
     * @param {Number} x x coordinate of object
     * @param {Number} y y coordinate of object
     * @param {Number} z z coordinate of object
     * @param {Number} rotationY rotationY of object
     * @returns {THREE.Object3D} seaPlant
     */
    async loadSeaPlant(x, y, z, rotationY) {
        const loader = new GLTFLoader();
        const data = await loader.loadAsync('/assets/models/sea-plant.gltf');
        const model = data.scene;
        await this.addCastShadowRecursive(model);
        model.scale.set(2, 2, 2);
        this.seaPlant = model;
        this.seaPlant.position.x = x;
        this.seaPlant.position.y = y;
        this.seaPlant.position.z = z;
        this.seaPlant.rotation.y = rotationY;
        return this.seaPlant;
    }


    /**
     * Set the text of the interaction text
     */
    setText() {
        let div = document.getElementById("info");
        div.innerHTML = "E - Pfl??cken";
    }

    /**
     * Start the animation
     */
    async startAnimation() {
        this.#action.play();
    }

    /**
     * Set the Animations and Scale of the object 
     * @param {THREE.Object3D} data 
     * @returns THREE.Object3D
     */
    setUpModel(data) {
        const model = data.scene;
        this.addCastShadowRecursive(model);
        const clip = data.animations[0];
        this.#mixer = new AnimationMixer(model);
        this.#action = this.#mixer.clipAction(clip);
        this.#action.clampWhenFinished = true;
        this.#action.setLoop(LoopOnce);
        return model;
    }

}

export { VegetationBuilder };