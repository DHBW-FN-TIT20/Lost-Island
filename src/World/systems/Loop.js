import { Clock } from 'three';

const clock = new Clock();

class Loop {
    constructor(camera, scene, renderer){
        this.camera = camera;
        this.scene = scene;
        this.renderer = renderer;
        this.updatables = [];
        // this.fpsControl = fpsControl;
    }

    start(){
        this.renderer.setAnimationLoop(() => {
            // this.fpsControl.update(0.01);
            this.tick();
            this.renderer.render(this.scene, this.camera);
          });
    }

    stop(){
        this.renderer.setAnimationLoop(null);
    }

    tick(){
        const delta = clock.getDelta();
        for (const object of this.updatables) {
            object.tick(delta);
          }
    }
}

export { Loop };