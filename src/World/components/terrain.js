import { PlaneGeometry, TextureLoader, ImageLoader, RepeatWrapping, MeshPhongMaterial, MeshToonMaterial, MeshStandardMaterial, Mesh, Vector3 } from 'three';
import { Water } from '../../../lib/three/examples/jsm/objects/Water.js';
import {Sky} from '../../../lib/three/examples/jsm/objects/Sky.js';

function createGround() {
    
    
    const loader = new TextureLoader();
    const height = loader.load("../../assets/heightmap2.png");
    const normal = loader.load("../../assets/NormalMap.png");
    const texture = loader.load("../../assets/color2.png");
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.flatShading = true;

    const imageLoader = new ImageLoader();
    const planeJSGeom = new PlaneGeometry(256, 256, 2048, 2048);
    planeJSGeom.rotateX(Math.PI * -0.5);
    var planeJS = new Mesh(planeJSGeom, new MeshStandardMaterial({
        map: texture,
        normalMap: normal
    }));
    planeJS.position.x = -1;
    imageLoader.load("../../assets/heightmap2.png", function(t){       
        var canvas = document.createElement("canvas");
        canvas.width = t.width;
        canvas.height = t.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(t, 0, 0, t.width, t.height);

        var wdth = planeJSGeom.parameters.widthSegments + 1;
        var hght = planeJSGeom.parameters.heightSegments + 1;
        var widthStep = t.width / wdth;
        var heightStep = t.height / hght;
        console.log(wdth, hght, widthStep, heightStep);

        const positionAttribute = planeJSGeom.getAttribute('position');
        const vertex = new Vector3();
        // do something with vertex
        for (var h = 0; h < hght; h++) {
            for (var w = 0; w < wdth; w++) {
                var imgData = ctx.getImageData(Math.round(w * widthStep), Math.round(h * heightStep), 1, 1).data;
                var displacementVal = imgData[0] / 255.0;
                displacementVal *= 20;
                var idx = (h * wdth) + w;
                vertex.fromBufferAttribute( positionAttribute, idx);
                vertex.y = displacementVal;
                positionAttribute.setXYZ( idx, vertex.x, vertex.y, vertex.z ); // write coordinates back
            }
        }
        planeJSGeom.verticesNeedUpdate = true;
    });
    return planeJS;
}

function createGroundWithDisplacementMap() {    
    const geometry = new PlaneGeometry(256, 256, 1024, 1024);
    const loader = new TextureLoader();
    const height = loader.load("../../assets/heightmap2.png");
    const normal = loader.load("../../assets/NormalMap.png");
    const texture = loader.load("../../assets/color2.png");
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;

    const material = new MeshStandardMaterial({
        map: texture,
        normalMap: normal,
        displacementMap: height,
        displacementScale: 10
    });
    const mesh = new Mesh(geometry, material);
    mesh.rotation.x = -Math.PI/2;
    mesh.position.y = -1;
    return mesh;
}

function createOcean() {
    const geometry = new PlaneGeometry(1000, 1000);
    const loader = new TextureLoader();
    let water = new Water(
        geometry,
        {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: loader.load( './assets/textures/water-normals.jpg', function ( texture ) {

                texture.wrapS = texture.wrapT = RepeatWrapping;

            } ),
            sunDirection: new Vector3(),
            sunColor: 0xffffff,
            waterColor: 0x001e0f,
            distortionScale: 3.7
        }
    );
    water.rotation.x = -Math.PI/2;
    water.position.y = 1;
    return water;
}

function createSky() {
    const sky = new Sky();
    sky.scale.setScalar(1000);
    return sky;
}

function createSun(sky) {
   
    const sun = new Vector3();
    const theta = Math.PI * (0.49 - 0.5);
    const phi = 2 * Math.PI * (0.205 - 0.5);
    sun.x = Math.cos(phi);
    sun.y = Math.sin(phi) * Math.sin(theta);
    sun.z = Math.sin(phi) * Math.cos(theta);

    sky.material.uniforms['sunPosition'].value.copy(sun);
    
    return sun;
}

export { createGround, createOcean, createSky, createSun, createGroundWithDisplacementMap };