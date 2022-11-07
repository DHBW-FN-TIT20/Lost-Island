import {GLTFLoader} from '../../../lib/three/examples/jsm/loaders/GLTFLoader.js';
import{AnimationMixer, Object3D, Raycaster, Vector3} from 'three';

class BallBuilder{
    constructor(ground){
        this.soccerBall = new Object3D();
        this.ground = ground;
    }
    
    async loadSoccerBall(x, y, z, rotationY){
        const loader = new GLTFLoader();
        const data = await loader.loadAsync('/assets/models/soccer-ball.gltf');
        
        this.soccerBall = this.setUpModel(data);
        
        this.soccerBall.position.x = x;
        this.soccerBall.position.y = y;
        this.soccerBall.position.z = z;
        this.soccerBall.rotation.y = rotationY;
        this.yRaycaster = new Raycaster(this.soccerBall.position.clone(), new Vector3(0, -1, 0), 0, 30);
        
        this.soccerBall.weight = 10;
        this.soccerBall.GRAVITY = new Vector3(0, -0.05, 0);
        this.soccerBall.acceleration = new Vector3();
        this.soccerBall.velocity = new Vector3();
        this.soccerBall.kicked = false;
        this.soccerBall.kick = this.kick;
        this.soccerBall.applyForce = this.applyForce;
        this.soccerBall.update = this.update;

        this.soccerBall.tick = (delta) => this.soccerBall.update();

        return this.soccerBall;
    }

    kick(direction){
        if (!this.kicked){
            direction.normalize();
            this.applyForce(direction.multiplyScalar(10));
            this.kicked = true;
        }
    }

    applyForce(force) {
        const vector = force.clone();
        vector.divideScalar(this.weight);
        this.acceleration.add(vector);
    }

    update(){
        this.applyForce(this.GRAVITY);

        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        
        this.acceleration.multiplyScalar(0);
    }

    setUpModel(data){
        const model = data.scene;
        model.scale.set(15,15,15);
        return model;
    }

}

export {BallBuilder};