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
    #registerdEvents;
    #raycaster;
    #camera;
    #pointer;

    /**
     * @param {THREE.Camera} camera 
     */
    constructor(camera) {
        this.#registerdObjects = [];
        this.#registerdFunctions = {};
        this.#registerdEvents = {};
        this.#camera = camera;
        this.#raycaster = new Raycaster(new Vector3(), new Vector3(1, 0, 0), 0, 10);
        this.#pointer = new Vector2(0, 0);
    }

    /**
     * Add Object and Funktion to check
     * @param {THREE.MESH} object Mesh for Raycast
     * @param {function} func Executed if the camera is near the object
     * @param {String} event If set, add a Listener to the body with given name for example "keydown". Default to null.
     * @param {function} eventFunc Function of the Event to add. Default to null.
     */
    addInteraction(object, func, event = null, eventFunc = null) {
        this.#registerdObjects.push(object);
        this.#registerdFunctions[object.uuid] = func;
        this.#registerdEvents[object.uuid] = {
            "name": event,
            "func": eventFunc,
            "isSet": false
        };
    }

    /**
     * Remove Object to check
     * @param {THREE.MESH} object Mesh for Raycast
     */
    removeInteraction(object) {
        delete this.#registerdFunctions[object.uuid];
        delete this.#registerdEvents[object.uuid];

        const index = this.#registerdObjects.indexOf(object);
        if (index >= 0) {
            this.#registerdObjects.splice(index, 1);
        }
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

        // In range for intersection
        if (intersects.length > 0) {

            // Check if the Object for intersetc is the same (on multiple intersects)
            const res = intersects.filter(function (res) {
                return res && res.object;
            })[0];

            if (res && res.object) {
                // Execute the function
                this.#registerdFunctions[res.object.uuid]();

                // Add Eventlistener if needed
                if (this.#registerdEvents[res.object.uuid]["name"] && !this.#registerdEvents[res.object.uuid]["isSet"]) {
                    document.body.addEventListener(this.#registerdEvents[res.object.uuid]["name"], this.#registerdEvents[res.object.uuid]["func"]);
                }
            }
        }

        // Remove all Eventlistener from other objects
        for (const key in this.#registerdEvents) {
            if (this.#registerdEvents[key]["isSet"]) {
                removeEventListener(this.#registerdEvents[key]["name"], this.#registerdEvents[key]["func"], false);
            }
        }
    }
}

export { InteractionHelper };