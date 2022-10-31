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
        this.objectsForCollision = [];

        this.acceleration = new Vector3(0, 0, 0);
        this.velocity = new Vector3(0, 0, 0);
        this.location = new Vector3(this.#camera.position.x, this.#camera.position.y, this.#camera.position.z);

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

    removeObjectForCollision(obj) {
        this.objectsForCollision.splice(this.objectsForCollision.indexOf(obj), 1);
    }


    /**
     * Add a force to the movement with weight of the object
     * @param {Vector3} force Some Forces
     */
    applyForce(force) {
        force.divideScalar(this.weight);
        this.acceleration.add(force);
    }

    update() {
        this.applyForce(GRAVITY);
        this.velocity.add(this.acceleration);
        this.kameraMove();

        this.checkYCollisions();

        this.location.add(this.velocity);

        this.#camera.position.x = this.location.x;
        this.#camera.position.y = this.location.y;
        this.#camera.position.z = this.location.z;

        this.checkOutOfWorld();

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

        if (this.keyBoardWatcher.moveForward || this.keyBoardWatcher.moveBackward) {
            movement.z -= direction.z * this.moveSpeed;
        }
        if (this.keyBoardWatcher.moveLeft || this.keyBoardWatcher.moveRight) {
            movement.x -= direction.x * this.moveSpeed;
        }

        this.moveRight(- movement.x);
        this.moveForward(- movement.z);
    }

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

    lock() {
        document.body.requestPointerLock();
    }

    unlock() {
        document.exitPointerLock();

    }

    lockChanged() {
        this.isLocked = !this.isLocked;
        console.log("Lock changed");
    }

    checkYCollisions() {
        //#region Check bottom
        this.yRaycaster.set(this.location, new Vector3(0, -1, 0));
        const intersectionsBottom = this.yRaycaster.intersectObjects(this.objectsForCollision, false);

        if (intersectionsBottom.length > 0) {
            const distance = intersectionsBottom[0].distance;
            this.location.y += this.height - distance;
            this.velocity.y = 0;
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

    checkOutOfWorld() {
        if (this.location.y < - 100) {
            this.location = new Vector3(0, 500, 0);
        }
    }
}

export { Controller };
