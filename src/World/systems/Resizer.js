/**
 * #TODO - Add description of the class
 */
class Resizer {
    /**
     * @param {HTMLDivElement} container 
     * @param {THREE.Camera} camera 
     * @param {THREE.Renderer} renderer 
     */
    constructor(container, camera, renderer) {
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