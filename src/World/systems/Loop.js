import { Clock } from 'three';

const clock = new Clock();

/**
 * Calculate the Animation and render the scene
 */
class Loop {
    /**
     * @param {THREE.Camera} camera Camera of the world
     * @param {THREE.Scene} scene 
     * @param {THREE.Renderer} renderer 
     * @param {World} world 
     */
    constructor(camera, scene, renderer, world) {
        this.camera = camera;
        this.scene = scene;
        this.renderer = renderer;
        this.world = world;
        this.updatables = [];
    }

    /**
     * Start the animation loop
     */
    start() {
        this.renderer.setAnimationLoop(() => {
            this.tick();
            this.world.render();
            this.renderer.render(this.scene, this.camera);
        });
    }

    /**
     * Stop the animation loop
     */
    stop() {
        this.renderer.setAnimationLoop(null);
    }

    /**
     * Update the animation loop
     */
    tick() {
        const delta = clock.getDelta();
        for (const object of this.updatables) {
            object.tick(delta);
        }
    }
}

export { Loop };