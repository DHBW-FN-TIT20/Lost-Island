import { Clock } from 'three';

class Loop {
    constructor(camera, scene, renderer, fpsControl){
        this.camera = camera;
        this.scene = scene;
        this.renderer = renderer;
        this.fpsControl = fpsControl;
    }

    start(){
        this.renderer.setAnimationLoop(() => {
            this.fpsControl.update(0.01);
            this.renderer.render(this.scene, this.camera);
          });
    }

    stop(){
        this.renderer.setAnimationLoop(null);
    }
}

export { Loop };