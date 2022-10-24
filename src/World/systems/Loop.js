import { Clock } from 'three';

class Loop {
    constructor(world, renderer){
        this.world = world;
        this.renderer = renderer;
    }

    start(){
        this.renderer.setAnimationLoop(() => {
            this.world.render();
          });
    }

    stop(){
        this.renderer.setAnimationLoop(null);
    }
}

export { Loop };