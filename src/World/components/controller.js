import {
    Vector3,
    Euler
} from 'three';


const _euler = new Euler(0, 0, 0, 'YXZ');
const _PI_2 = Math.PI / 2;

class KeyBoardWatcher {
    constructor(domElement = document.body) {
        this.domElement = domElement;

        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;

        this.domElement.addEventListener("keydown", (ev) => {
            switch (ev.code) {

                case 'ArrowUp':
                case 'KeyW':
                    this.moveForward = true;
                    break;

                case 'ArrowLeft':
                case 'KeyA':
                    this.moveLeft = true;
                    break;

                case 'ArrowDown':
                case 'KeyS':
                    this.moveBackward = true;
                    break;

                case 'ArrowRight':
                case 'KeyD':
                    this.moveRight = true;
                    break;
            }
        });

        this.domElement.addEventListener("keyup", (ev) => {
            switch (ev.code) {

                case 'ArrowUp':
                case 'KeyW':
                    this.moveForward = false;
                    break;

                case 'ArrowLeft':
                case 'KeyA':
                    this.moveLeft = false;
                    break;

                case 'ArrowDown':
                case 'KeyS':
                    this.moveBackward = false;
                    break;

                case 'ArrowRight':
                case 'KeyD':
                    this.moveRight = false;
                    break;

            }
        });

    }
}

class Controller {
    #camera;

    constructor(camera, height = 5, weight = 2, moveSpeed = 0.5, sensitivity = 0.005) {
        this.#camera = camera;
        this.height = height;
        this.weight = weight;
        this.moveSpeed = moveSpeed;
        this.sensitivity = sensitivity;

        this.acceleration = new Vector3(0, 0, 0);
        this.velocity = new Vector3(0, 0, 0);
        this.location = new Vector3(this.#camera.position.x, this.#camera.position.y, this.#camera.position.z);

        this.keyBoardWatcher = new KeyBoardWatcher();
        this.isLocked = false;


        document.addEventListener('mousemove', (ev) => {
            if (this.isLocked === false) {
                return;
            }
            this.mouseMove(ev);
        });

        document.addEventListener('pointerlockchange', (ev) => {
            this.lockChanged();
        }, false);

        document.addEventListener('pointerlockerror', this.lockError, false);


    }


    /**
     * Add a force to the movement with weight of the object
     * @param {Vector3} force Some Forces
     */
    applyForce(force) {
        force.divideScalar(this.weight);
        this.acceleration.add(force);
    }

    applyGround(minHeight) {
        if (this.location.y - this.height < minHeight) {
            this.location.y = minHeight + this.height;
            this.velocity.y = 0;
        }
    }

    update() {
        this.velocity.add(this.acceleration);
        this.location.add(this.velocity);

        this.#camera.position.x = this.location.x;
        this.#camera.position.y = this.location.y;
        this.#camera.position.z = this.location.z;

        this.kameraMove();
    }


    mouseMove(ev) {
        // Range is 0 to Math.PI radians
        this.minPolarAngle = 0; // radians
        this.maxPolarAngle = Math.PI; // radians

        this.pointerSpeed = 1.0;

        const scope = this;


        const movementX = ev.movementX;
        const movementY = ev.movementY;

        _euler.setFromQuaternion(this.#camera.quaternion);

        _euler.y -= movementX * this.sensitivity;
        _euler.x -= movementY * this.sensitivity;

        _euler.x = Math.max(_PI_2 - scope.maxPolarAngle, Math.min(_PI_2 - scope.minPolarAngle, _euler.x));

        this.#camera.quaternion.setFromEuler(_euler);

    }

    kameraMove() {
        const direction = new Vector3(0, 0, 0);
        const movement = new Vector3(0, 0, 0);

        direction.z = Number(this.keyBoardWatcher.moveForward) - Number(this.keyBoardWatcher.moveBackward);
        direction.x = Number(this.keyBoardWatcher.moveRight) - Number(this.keyBoardWatcher.moveLeft);
        direction.normalize(); // this ensures consistent movements in all directions

        if (this.keyBoardWatcher.moveForward || this.keyBoardWatcher.moveBackward) movement.z -= direction.z * this.moveSpeed;
        if (this.keyBoardWatcher.moveLeft || this.keyBoardWatcher.moveRight) movement.x -= direction.x * this.moveSpeed;

        this.moveRight(- movement.x);
        this.moveForward(- movement.z);
    }

    moveRight(distance) {
        const vector = new Vector3(0, 0, 0);
        
        vector.setFromMatrixColumn(this.#camera.matrix, 0);
        this.location.addScaledVector(vector, distance);
    }
    
    moveForward( distance ) {
        const vector = new Vector3(0, 0, 0);

        vector.setFromMatrixColumn( this.#camera.matrix, 0 );
        vector.crossVectors( this.#camera.up, vector );

        this.location.addScaledVector( vector, distance );

    };

    lock () {
        document.body.requestPointerLock();
    }
    
    unlock () {
        document.exitPointerLock();
        
    }
    
    lockChanged() {
        this.isLocked = !this.isLocked;
        console.log("Lock changed");
    }

    lockError(error){
        console.error(error);
    }
}

export { Controller };