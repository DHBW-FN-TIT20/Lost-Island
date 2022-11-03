import {GLTFLoader} from '../../../lib/three/examples/jsm/loaders/GLTFLoader.js';
import{AnimationMixer, Object3D} from 'three';

class BallBuilder{
    constructor(){
        this.soccerBall = new Object3D();
    }

    async loadSoccerBall(x, y, z, rotationY){
        const loader = new GLTFLoader();
        const data = await loader.loadAsync('/assets/models/soccer-ball.gltf');
        
        this.soccerBall = this.setUpModel(data);

        this.soccerBall.position.x = x;
        this.soccerBall.position.y = y;
        this.soccerBall.position.z = z;
        this.soccerBall.rotation.y = rotationY;

        this.soccerBall.tick = (delta) => this.move(0, 0.01, -0.05);

        return this.soccerBall;
    }

    move(xStep, yStep, zStep){
        this.soccerBall.position.x = this.soccerBall.position.x + xStep;
        if(this.soccerBall.position.y == 20){
            this.soccerBall.position.y = this.soccerBall.position.y - yStep;
        }else{
            this.soccerBall.position.y = this.soccerBall.position.y + yStep;
        }
        this.soccerBall.position.z = this.soccerBall.position.z + zStep;
    }

    setUpModel(data){
        const model = data.scene;
        model.scale.set(15,15,15);
        return model;
    }
}

export {BallBuilder};