import {
    Vector2,
    Vector3,
    Raycaster
} from 'three';

/**
 * Object that allows you to connect Functions and Object if the camera are near the object
 */
class InteractionHelper {

    #registerdObjects;
    #registerdFunctions;
    #raycaster;
    #camera;
    #pointer;

    /**
     * @param {THREE.Camera} camera 
     */
    constructor(camera) {
        this.#registerdObjects = [];
        this.#registerdFunctions = {};
        this.#camera = camera;
        this.#raycaster = new Raycaster(new Vector3(), new Vector3(1, 0, 0), 0, 10);
        this.#pointer = new Vector2(0, 0);
    }

    /**
     * Add Object and Funktion to check
     * @param {THREE.MESH} object Mesh for Raycast
     * @param {function} func Executed if the camera is near the object
     */
    addInteraction(object, func) {
        this.#registerdObjects.push(object);
        this.#registerdFunctions[object.uuid] = func;
    }

    /**
     * Remove Object to check
     * @param {THREE.MESH} object Mesh for Raycast
     */
    removeInteraction(object) {
        delete this.#registerdFunctions[object.uuid];
        this.#registerdObjects.splice(this.#registerdObjects.indexOf(object), 1);
    }


    /**
     * Needs to be called to check if the camera is near the object
     * @see https://github.com/mrdoob/three.js/blob/f021ec0c9051eb11d110b0c2b93305bffd0942e0/examples/webgl_raycaster_sprite.html#L138
     */
    checkInteractions() {
        this.#raycaster.setFromCamera(this.#pointer, this.#camera);
        const intersects = this.#raycaster.intersectObjects(this.#registerdObjects, false);

        let div = document.getElementById("info");
        div.innerHTML = "&#8982;";
        
        if (intersects.length > 0) {

            const res = intersects.filter(function (res) {
                return res && res.object;
            })[0];

            if (res && res.object) {
                const func = this.#registerdFunctions[res.object.uuid];
                func();
            }
        }
    }
}

export { InteractionHelper };