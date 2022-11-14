import {
    Vector3,
    Box3,
    Box3Helper
} from 'three';

class ColissionBoxBuilder {


    /**
     * Create a Box for collision detection with manual parameters. For static objects only.
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     * @param {Number} width 
     * @param {Number} height 
     * @param {Number} depth 
     * @param {THREE.Scene} scene Add scene for debugging only
     * @returns {THREE.Box3}
     */
    async loadBox(x, y, z, width, height, depth, scene = null) {
        const box = new Box3();
        box.setFromCenterAndSize(new Vector3(x, y, z), new Vector3(width, height, depth));

        if (scene) {
            scene.add(new Box3Helper(box, 0x00ff00));
        }

        return box;
    }

    /**
     * Create a Box for collision detection from a given object in the world. For static objects only.
     * @param {THREE.MESH} obj 
     * @param {THREE.Scene} scene Add scene for debugging only
     * @returns {THREE.Box3}
     */
    async loadBoxFromObj(obj, scene = null) {
        const box = new Box3();
        box.setFromObject(obj, true);

        if (scene) {
            scene.add(new Box3Helper(box, 0x00ff00));
        }

        return box;
    }

}

export { ColissionBoxBuilder };