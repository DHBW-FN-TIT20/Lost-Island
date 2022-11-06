import {
    Vector3,
    Euler,
    Raycaster
} from 'three';


const _euler = new Euler(0, 0, 0, 'YXZ');
const _PI_2 = Math.PI / 2;
const GRAVITY = new Vector3(0, -0.05, 0);


class KeyBoardWatcher {
    constructor(domElement = document.body) {
        this.domElement = domElement;

        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.jump = false;
        this.sprint = false;

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

                case 'Space':
                    this.jump = true;
                    break;

                case 'ShiftLeft':
                    this.sprint = true;
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

                case 'Space':
                    this.jump = false;
                    break;

                case 'ShiftLeft':
                    this.sprint = false;
                    break;
            }
        });

    }
}

class Controller {
    #camera;

    /**
     * Controller to manage these Camera.
     * @param {THREE.Camera} camera 
     * @param {number} height Min. disctance from the ground. Default to 5
     * @param {number} weight Weight for calculation of the forces. Default to 2
     * @param {number} moveSpeed Speed of the WASD-Movement. Default to 0.5
     * @param {number} sensitivity How sensitiv the mouse movement to the camera is. Default to 0.005
     */
    constructor(camera, height = 5, weight = 2, moveSpeed = 0.5, sensitivity = 0.005) {
        this.#camera = camera;
        this.height = height;
        this.weight = weight;
        this.moveSpeed = moveSpeed;
        this.sensitivity = sensitivity;
        this.objectsForCollision = [];
        this.canJump = true;

        this.acceleration = new Vector3(0, 0, 0);
        this.velocity = new Vector3(0, 0, 0);
        this.location = this.#camera.position.clone();

        this.keyBoardWatcher = new KeyBoardWatcher();
        this.isLocked = false;

        this.groundRaycaster = new Raycaster(this.location, new Vector3(1, 0, 0), 0, this.height);
        this.yRaycaster = new Raycaster(this.location, new Vector3(0, -1, 0), 0, this.height);

        document.addEventListener('mousemove', (ev) => {
            if (this.isLocked === false) {
                return;
            }
            this.mouseMove(ev);
        });

        document.addEventListener('pointerlockchange', (ev) => {
            this.lockChanged();
        }, false);

    }

    /**
     * Add the object to not pass through these objects with the camera.
     * @param {THREE.Mesh} obj
     */
    addObjectForCollision(obj) {
        const append = (item) => {
            if (this.objectsForCollision.indexOf(item) == -1) {
                this.objectsForCollision.push(item);
            }
            else {
                console.error("Object already in the array", item);
            }
        };

        if (Array.isArray(obj)) {
            obj.forEach(item => {
                append(item);
            });
        }
        else {
            append(obj);
        }

    }

    /**
     * Remove one object to not do object collision with it anymore.
     * @param {THREE.Mesh} obj 
     */
    removeObjectForCollision(obj) {
        this.objectsForCollision.splice(this.objectsForCollision.indexOf(obj), 1);
    }


    /**
     * Add a force to the movement with weight of the object
     * @param {Vector3} force Some Forces
     */
    applyForce(force) {
        const vector = force.clone();
        vector.divideScalar(this.weight);
        this.acceleration.add(vector);
    }

    /**
     * Need to be called each frame to update the position of the camera.
     */
    update() {
        if (this.canJump && this.keyBoardWatcher.jump) {
            this.applyForce(new Vector3(0, 1.5, 0));
            this.canJump = false;
            setTimeout(() => { this.canJump = true; }, 1000);
        }

        this.applyForce(GRAVITY);

        this.velocity.add(this.acceleration);
        this.acceleration.multiplyScalar(0);

        this.kameraMove();

        this.checkYCollisions();

        this.location.add(this.velocity);

        this.#camera.position.x = this.location.x;
        this.#camera.position.y = this.location.y;
        this.#camera.position.z = this.location.z;

        this.checkOutOfWorld();

    }


    /**
     * Call this function if the Mouse is moved to update the camera.
     * @param {MouseEvent} ev Fired Event
     */
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

    /**
     * Function that update the position of the camera if you pressed one of the movement keys.
     */
    kameraMove() {
        const direction = new Vector3(0, 0, 0);
        const movement = new Vector3(0, 0, 0);

        direction.z = Number(this.keyBoardWatcher.moveForward) - Number(this.keyBoardWatcher.moveBackward);
        direction.x = Number(this.keyBoardWatcher.moveRight) - Number(this.keyBoardWatcher.moveLeft);
        direction.normalize(); // this ensures consistent movements in all directions

        if (this.keyBoardWatcher.moveForward || this.keyBoardWatcher.moveBackward) {
            movement.z -= direction.z * this.moveSpeed;
        }
        if (this.keyBoardWatcher.moveLeft || this.keyBoardWatcher.moveRight) {
            movement.x -= direction.x * this.moveSpeed;
        }

        if (this.keyBoardWatcher.sprint) {
            movement.z = movement.z * 1.5;
            movement.x = movement.x * 1.5;
        }

        this.moveRight(- movement.x);
        this.moveForward(- movement.z);
    }

    /**
     * Move the camera to the right/left with the `distance`
     * @param {number} distance 
     */
    moveRight(distance) {
        const vector = new Vector3(0, 0, 0);

        vector.setFromMatrixColumn(this.#camera.matrix, 0);

        this.groundRaycaster.set(this.location.clone(), vector);
        const intersections = this.groundRaycaster.intersectObjects(this.objectsForCollision, false);


        this.location.addScaledVector(vector, distance);
        if (intersections.length > 0) {
            this.location.addScaledVector(vector, -distance);
        }
    }

    /**
     * Move the camera to the forward/back with the `distance`
     * @param {number} distance 
     */
    moveForward(distance) {
        const vector = new Vector3(0, 0, 0);

        vector.setFromMatrixColumn(this.#camera.matrix, 0);
        vector.crossVectors(this.#camera.up, vector);

        this.groundRaycaster.set(this.location.clone(), vector);
        const intersections = this.groundRaycaster.intersectObjects(this.objectsForCollision, false);


        this.location.addScaledVector(vector, distance);
        if (intersections.length > 0) {
            this.location.addScaledVector(vector, -distance);
        }
    };

    /**
     * Lock the Mouse-Pointer
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/requestPointerLock
     */
    lock() {
        document.body.requestPointerLock();
    }

    /**
     * Unlock the Mouse-Pointer
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/exitPointerLock
     */
    unlock() {
        document.exitPointerLock();

    }

    /**
     * Toggle the information if the Mouse is locked
     */
    lockChanged() {
        this.isLocked = !this.isLocked;
        console.log("Lock changed");
    }

    /**
     * Check the Colissions with the added objects from `addObjectForCollision(obj)`
     */
    checkYCollisions() {
        //#region Check bottom
        this.yRaycaster.set(this.location, new Vector3(0, -1, 0));
        const intersectionsBottom = this.yRaycaster.intersectObjects(this.objectsForCollision, false);

        if (intersectionsBottom.length > 0) {
            const distance = intersectionsBottom[0].distance;
            this.location.y += this.height - distance;
            this.velocity.y = Math.max(0, this.velocity.y);
        }
        //#endregion

        //#region Check top
        this.yRaycaster.set(this.location, new Vector3(0, 1, 0));
        const intersectionsTop = this.yRaycaster.intersectObjects(this.objectsForCollision, false);

        if (intersectionsTop.length > 0) {
            this.velocity.y = 0;
        }
        //#endregion
    }

    /**
     * Reset the Camera to 0, 1000, 0 if it is `y < 100`
     */
    checkOutOfWorld() {
        if (this.location.y < - 100) {
            this.location = new Vector3(10, 18, -30);
            this.velocity.y = 0;
        }
    }
}

export { Controller };
