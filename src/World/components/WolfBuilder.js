import {GLTFLoader} from '../../../lib/three/examples/jsm/loaders/GLTFLoader.js';
import {CSS3DRenderer, CSS3DObject} from '../../../lib/three/examples/jsm/renderers/CSS3DRenderer.js';
import{AnimationMixer, Object3D, LoopOnce, LoopRepeat, Color, BoxGeometry, Mesh, MeshBasicMaterial} from 'three';

class WolfBuilder{
    #mixer;
    #action;

    constructor(){
        this.wolf = new Object3D();
    }

    async load(x, y, z, rotationY){
        const loader = new GLTFLoader();
        const data = await loader.loadAsync('/assets/models/wolf.gltf');
        
        this.wolf = this.setUpModel(data);
        this.wolf.tick = (delta) => this.#mixer.update(delta);
        this.wolf.startAnimation = () => this.startAnimation();
        this.wolf.stopAnimation = () => this.#action.stop();
        this.wolf.sit = () => this.sit();
        this.wolf.setInteractionText = this.setText;
        this.wolf.position.x = x;
        this.wolf.position.y = y;
        this.wolf.position.z = z;
        this.wolf.rotation.y = rotationY;
        this.wolf.isSit = false; 
        const geometry = new BoxGeometry( 1, 1, 1 );
        const material = new MeshBasicMaterial( {color: 0x000000, opacity: 1, transparent: true} );
        const cube = new Mesh( geometry, material );
        geometry.translate(x,y,z);
        this.wolf.box = cube;
        return this.wolf;
    }

    async startAnimation(){
        this.#action.play();
    }

    sit(){
                
        this.#action.stop();
        
        this.#action = this.#mixer.clipAction(this.sitClip);
        this.#action.clampWhenFinished = true;
        this.#action.setLoop(LoopOnce);
        if(!this.isSit){        
            this.wolf.position.y = this.wolf.position.y - 1;
            this.#action = this.#mixer.clipAction(this.clip);
            // this.#action.clampWhenFinished = false;
            this.#action.setLoop(LoopRepeat);
            this.#action.play();
        }
        this.#action.play();
        this.isSit = true;
        
    }

    setUpModel(data){
        const model = data.scene;
        model.scale.set(7,7,7);
        this.clip = data.animations[3];
        this.sitClip = data.animations[4];
        this.#mixer = new AnimationMixer(model);
        this.#action = this.#mixer.clipAction(this.clip);
        return model;
    }
}

export {WolfBuilder};