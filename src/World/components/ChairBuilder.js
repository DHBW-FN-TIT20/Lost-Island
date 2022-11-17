import { GLTFLoader } from '../../../lib/three/examples/jsm/loaders/GLTFLoader.js';
import { Object3D } from 'three';

/**
 * Helper class to build a chair.
 */
class ChairBuilder {
    constructor() {
        this.chair = new Object3D();
    }

    /**
     * Create a chair with towel.
     * @param {Number} x Position in x axis
     * @param {Number} y Position in y axis
     * @param {Number} z Position in z axis
     * @param {Number} rotationY Rotation in y axis
     * @returns THREE.Object3D
     */
    async loadChairWithTowel(x, y, z, rotationY) {
        const loader = new GLTFLoader();
        const data = await loader.loadAsync('/assets/models/chair-2.gltf');

        this.chair = this.setUpModel(data);

        this.chair.position.x = x;
        this.chair.position.y = y;
        this.chair.position.z = z;
        this.chair.rotation.y = rotationY;
        this.chair.sitOnChair = this.sitOnChair;
        this.chair.setInteractionText = this.setText;

        return this.chair;
    }

    /**
     * Set the Animations and Scale of the Chair
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
        model.scale.set(20, 20, 20);
        return model;
    }

    /**
     * @param {function} setFunction Call these function that give it a Vector3 position and a Quaternion rotation
     */
    sitOnChair(setFunction) {
        const pos = this.position.clone();
        pos.y += 30;
        pos.x -= 25;
        setFunction(pos, this.quaternion.clone().invert());
    }

    /**
     * Set the text of the interaction text
     */
    setText() {
        const div = document.getElementById("info");
        div.innerHTML = "E zum Sitzen";
    }

}

export { ChairBuilder };