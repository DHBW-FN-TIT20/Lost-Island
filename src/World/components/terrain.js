import { PlaneGeometry, TextureLoader, ImageLoader, RepeatWrapping, MeshPhongMaterial, MeshStandardMaterial, Mesh, Vector3, Group, SphereGeometry } from 'three';
import { Water } from '../../../lib/three/examples/jsm/objects/Water.js';
import { Sky } from '../../../lib/three/examples/jsm/objects/Sky.js';

/**
 * Create a terrain
 * @returns THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial>
 */
function createGround() {
    const loader = new TextureLoader();
    const texture = loader.load("../../assets/terrain_texture.png");
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.flatShading = true;

    const imageLoader = new ImageLoader();
    const planeGeom = new PlaneGeometry(256, 256, 24, 24);
    planeGeom.rotateX(Math.PI * -0.5);
    let plane = new Mesh(planeGeom, new MeshStandardMaterial({
        map: texture
    }));
    plane.position.y = -2;
    imageLoader.load("../../assets/heightmap2WithRiver.png", function (t) {
        var canvas = document.createElement("canvas");
        canvas.width = t.width;
        canvas.height = t.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(t, 0, 0, t.width, t.height);

        var wdth = planeGeom.parameters.widthSegments + 1;
        var hght = planeGeom.parameters.heightSegments + 1;
        var widthStep = t.width / wdth;
        var heightStep = t.height / hght;

        const positionAttribute = planeGeom.getAttribute('position');
        const vertex = new Vector3();
        // do something with vertex
        for (var h = 0; h < hght; h++) {
            for (var w = 0; w < wdth; w++) {
                var imgData = ctx.getImageData(Math.round(w * widthStep), Math.round(h * heightStep), 1, 1).data;
                var displacementVal = imgData[0] / 255.0;
                displacementVal *= 25;
                var idx = (h * wdth) + w;
                vertex.fromBufferAttribute(positionAttribute, idx);
                vertex.y = displacementVal;
                positionAttribute.setXYZ(idx, vertex.x, vertex.y, vertex.z); // write coordinates back
            }
        }
        planeGeom.verticesNeedUpdate = true;
    });
    plane.receiveShadow = true;
    return plane;
}


/**
 * Create the ocean
 * @returns Water
 */
function createOcean() {
    const geometry = new PlaneGeometry(10000, 10000);
    const loader = new TextureLoader();
    let water = new Water(
        geometry,
        {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: loader.load('./assets/textures/water-normals.jpg', function (texture) {

                texture.wrapS = texture.wrapT = RepeatWrapping;

            }),
            sunDirection: new Vector3(),
            sunColor: 0xffffff,
            waterColor: 0x001e0f,
            distortionScale: 3.7
        }
    );
    water.rotation.x = -Math.PI / 2;
    water.position.y = 6;
    return water;
}

/**
 * Create the sky
 * @returns Sky
 */
function createSky() {
    const sky = new Sky();
    sky.scale.setScalar(1000);
    return sky;
}

/**
 * Add a sun to the sky
 * @param {Sky} sky Sky where the sun is added
 * @returns Vector3
 */
function createSun(sky) {

    const sun = new Vector3();
    const theta = Math.PI * (0.49 - 0.53);
    const phi = 0.5 * Math.PI * (0.205 - 0.51);
    sun.x = Math.cos(phi);
    sun.y = Math.sin(phi) * Math.sin(theta);
    sun.z = Math.sin(phi) * Math.cos(theta);

    sky.material.uniforms['sunPosition'].value.copy(sun);

    return sun;
}

/**
 * Create a rock
 * @param {Number} positionX Position in x axis
 * @param {Number} positionY Position in y axis
 * @param {Number} positionZ Position in z axis
 * @returns THREE.Group
 */
function createRock(positionX, positionY, positionZ) {
    const rockGroup = new Group();
    const loader = new TextureLoader();
    const texture = loader.load("../../assets/textures/monochrome-rock-face.jpg");
    const normal = loader.load("../../assets/textures/normalmap_rock.jpg");
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    const bigRockSphereGeom = new SphereGeometry(6, 16, 16);
    bigRockSphereGeom.translate(positionX, positionY, positionZ);
    const bigRockSphereMaterial = new MeshPhongMaterial();
    bigRockSphereMaterial.map = texture;
    bigRockSphereMaterial.normalMap = normal;
    const bigRock = new Mesh(bigRockSphereGeom, bigRockSphereMaterial);
    bigRock.castShadow = true;
    bigRock.receiveShadow = true;
    rockGroup.add(bigRock);
    return rockGroup;
}

export { createGround, createOcean, createSky, createSun, createRock };