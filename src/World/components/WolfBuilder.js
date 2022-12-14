import { GLTFLoader } from '../../../lib/three/examples/jsm/loaders/GLTFLoader.js';
import { AnimationMixer, Object3D, LoopOnce, LoopRepeat, Color, BoxGeometry, Mesh, MeshBasicMaterial } from 'three';

/**
 * Helper class to build a wolf.
 */
class WolfBuilder {
    #mixer;
    actions = [];

    constructor() {
        this.wolf = new Object3D();
    }

    /**
     * Create a wolf
     * @param {Number} x Position in x axis
     * @param {Number} y Position in y axis
     * @param {Number} z Position in z axis
     * @param {Number} rotationY Rotation in y axis
     * @returns THREE.Object3D
     */
    async load(x, y, z, rotationY) {
        const loader = new GLTFLoader();
        const data = await loader.loadAsync('/assets/models/wolf.gltf');

        this.wolf = this.setUpModel(data);
        this.wolf.tick = (delta) => this.#mixer.update(delta);
        this.wolf.startAnimation = () => this.startAnimation();
        this.wolf.sit = () => this.sit();
        this.wolf.idle = () => this.idle();
        this.wolf.setInteractionText = this.setText;
        this.wolf.position.x = x;
        this.wolf.position.y = y;
        this.wolf.position.z = z;
        this.wolf.rotation.y = rotationY;
        this.wolf.isSit = false;
        const geometry = new BoxGeometry(2, 2, 2);
        const material = new MeshBasicMaterial({ color: 0x000000, opacity: 0.0, transparent: true });
        const cube = new Mesh(geometry, material);
        geometry.translate(x, y + 3, z);
        this.wolf.box = cube;
        return this.wolf;
    }

    /**
     * Start the Animation of the wolf
     */
    async startAnimation() {
        let action = this.actions[0];
        action.play();
    }

    /**
     * Start the sit animation
     */
    sit() {
        let action = this.actions[1];
        action.clampWhenFinished = true;
        action.setLoop(LoopOnce);
        action.stop().play();
    }

    /**
     * Start the idle animation
     * @param {THREE.AnimationMixer} mixer
     */
    idle(mixer) {
        let action = mixer.clipAction(this.clip);
        action.play();
    }

    /**
     * Set the Animations and Scale of the wolf
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
        model.scale.set(7, 7, 7);
        this.clip = data.animations[3];
        this.sitClip = data.animations[4];
        this.#mixer = new AnimationMixer(model);
        this.#mixer.addEventListener('finished', () => {
            this.idle(this.#mixer);
        });
        this.actions.push(this.#mixer.clipAction(this.clip));
        this.actions.push(this.#mixer.clipAction(this.sitClip));
        return model;
    }
}

export { WolfBuilder };