/**
 * This class is responsible for resizing the game canvas on startup.
 */
class Resizer {
    /**
     * @param {HTMLDivElement} container 
     * @param {THREE.Camera} camera 
     * @param {THREE.Renderer} renderer 
     */
    constructor(container, camera, renderer) {
        this.setSize(container, camera, renderer);
        window.addEventListener("resize", () => {
            // set the size again if a resize occurs
            this.setSize(container, camera, renderer);
        });
    }
    setSize(container, camera, renderer) {
        // Set the camera's aspect ratio
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        // update the size of the renderer AND the canvas
        renderer.setSize(container.clientWidth, container.clientHeight);
        // set the pixel ratio (for mobile devices)
        renderer.setPixelRatio(window.devicePixelRatio);
    }
}

export { Resizer };