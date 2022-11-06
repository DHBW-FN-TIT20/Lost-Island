import {
    BoxGeometry,
    MeshBasicMaterial,
    Mesh
} from 'three';

class ColissionBoxBuilder {

    async load(x, y, z, width, height, depth, debug = false) {
        const geometry = new BoxGeometry(width, height, depth);
        geometry.translate(x, y, z);

        const material = new MeshBasicMaterial();
        material.transparent = true;
        if (debug) {
            material.color = 0x00ff00;
            material.opacity = 0.5;
        }
        else {
            material.opacity = 0.0;
        }
        
        const cube = new Mesh(geometry, material);


        return cube;
    }
}

export { ColissionBoxBuilder };