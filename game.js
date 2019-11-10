//* Initialize webGL with camera and lights
const canvas1 = document.getElementById("mycanvas");

const renderer1 = new THREE.WebGLRenderer({ canvas: canvas1 });

renderer1.setClearColor('rgb(255,255,255)');
// create scene and camera
const scene = new THREE.Scene();
const camera1 = new THREE.PerspectiveCamera(90, canvas1.width / canvas1.height,
    0.1, 1000);
camera1.position.z = 10;
camera1.position.y = 10;

const ambientLight = new THREE.AmbientLight(0x909090);
scene.add(ambientLight);
const light = new THREE.DirectionalLight(0x444444);
light.position.set(1.5, 1, 1);
scene.add(light);

const variables = {
    planeWidth: 6,
    planeLength: 5.9,
    planeThickness: 1,
    lineLength: 0.05,
    cushionLength: 12,
    cushionWidth: 0.2,
    cushionHeight: 0.5,
    racketWidth: 1,
    racketHeight: 0.5,
    racketLength: 0.2,
    ballRadius: 0.3,
    speed: 2
}

let boundary1 = variables.planeWidth / 2 - variables.ballRadius;
let boundary2 = variables.planeLength + variables.lineLength / 2 - variables.ballRadius;
let boundary3 = 0.5;
let boundary4 = 0.5;
let boundary5 = -0.5;
let boundary6 = 0.5;


const n = new THREE.Vector3(0, 0, 1);
const n1 = new THREE.Vector3(1, 0, 0);
let vin = new THREE.Vector3(variables.speed, 0, variables.speed);

const clock = new THREE.Clock();

setField();

const ball = createBall();
const racket = createRacket();


//make switch between single and multiplayer, render basic field set up when choice has not been made
let choice = 0;

function single() {
    if (choice == 0) {
        singlePlayer();
        choice = 1;
    }
}

function multi() {
    if (choice == 0) {
        multiPlayer();
        choice = 2;
    }
}

const controls = new THREE.TrackballControls(camera1, canvas1);

function render() {
    controls.update();
    renderer1.render(scene, camera1);
}
render();

function setField() {

    //create the field and all it's elements
    //field (two planes with a "white line" between them")
    const geometry1 = new THREE.PlaneGeometry(variables.planeWidth, variables.planeLength, variables.planeThickness);
    const material1 = new THREE.MeshBasicMaterial({ color: 0x32a852, side: THREE.DoubleSide });
    const plane1 = new THREE.Mesh(geometry1, material1);
    scene.add(plane1)

    plane1.position.z = - (variables.planeLength / 2 + variables.lineLength);
    plane1.rotation.x = Math.PI / 2;

    const geometry2 = new THREE.PlaneGeometry(variables.planeWidth, variables.planeWidth, variables.planeThickness);
    const plane2 = new THREE.Mesh(geometry2, material1);
    scene.add(plane2)

    plane2.position.z = (variables.planeLength / 2 + variables.lineLength);
    plane2.rotation.x = Math.PI / 2;

    //white line
    const geometry3 = new THREE.PlaneGeometry(variables.planeWidth, variables.lineLength, variables.planeThickness);
    const material3 = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    const line = new THREE.Mesh(geometry3, material3);
    scene.add(line)

    line.rotation.x = Math.PI / 2;

    //2 cushions
    const geometry4 = new THREE.BoxGeometry(variables.cushionWidth, variables.cushionHeight, variables.cushionLength);
    const material4 = new THREE.MeshBasicMaterial({ color: 0x087526 });
    const cushionRigth = new THREE.Mesh(geometry4, material4);
    scene.add(cushionRigth);

    cushionRigth.position.x = variables.planeWidth / 2 + variables.cushionWidth / 2;
    cushionRigth.position.y = variables.cushionHeight / 2;

    const geometry5 = new THREE.BoxGeometry(variables.cushionWidth, variables.cushionHeight, variables.cushionLength);
    const cushionLeft = new THREE.Mesh(geometry5, material4);
    scene.add(cushionLeft);

    cushionLeft.position.x = -(variables.planeWidth / 2 + variables.cushionWidth / 2);
    cushionLeft.position.y = variables.cushionHeight / 2;

    const controls = new THREE.TrackballControls(camera1, canvas1);
}

function createBall() {

    const geometry8 = new THREE.SphereGeometry(variables.ballRadius, 32, 32);
    const material8 = new THREE.MeshBasicMaterial({ color: 0xf2e994 });
    const ball = new THREE.Mesh(geometry8, material8);
    scene.add(ball);

    ball.position.y = variables.ballRadius;

    //set the ball on random position on the white line
    let check = 0;
    let position = Math.random() * 10;
    while (position > variables.planeWidth / 2 - variables.ballRadius) {
        position = Math.random() * 10; //get random number which does not exceed the width of the plane
        check++;
    }

    //put the ball either on the left or on the right side of the fiend randomly
    if (check % 2 == 0) {
        ball.position.x = position;
    } else {
        ball.position.x = - position;
    }

    return ball;
}

function createRacket() {

    const geometry7 = new THREE.BoxGeometry(variables.racketWidth, variables.racketHeight, variables.racketLength);
    const material7 = new THREE.MeshBasicMaterial({ color: 0xdb4c17 });
    const racket = new THREE.Mesh(geometry7, material7);
    scene.add(racket);

    racket.position.z = variables.planeLength + variables.lineLength / 2 + variables.cushionWidth / 2;

    document.onkeydown = checkKey;


    //prototype of the function checkKe was found od stackOverflow
    function checkKey(e) {

        e = e || window.event;

        if (e.keyCode == '37') {
            // left arrow
            if (racket.position.x > -(variables.planeWidth / 2 - variables.racketWidth / 2)) { //set the boundary so that the racket wouldn't go outside the field

                racket.position.x += -0.5; //move the racket by 0.5 when arrow key is pressed

                boundary3 = racket.position.x - 0.5;
                boundary4 = racket.position.x + 0.5;
            }
        }
        else if (e.keyCode == '39') {
            // right arrow
            if (racket.position.x < variables.planeWidth / 2 - variables.racketWidth / 2) { //set the boundary so that the racket wouldn't go outside the field

                racket.position.x += 0.5;//move the racket by 0.5 when arrow key is pressed

                boundary3 = racket.position.x - 0.5;
                boundary4 = racket.position.x + 0.5;
            }
        }
    }
    return racket;
}

function singlePlayer() {

    document.getElementById('buttons').style.visibility = 'hidden';//hide buttons once the choice is made

    //back cushion
    const backCushionWidth = variables.planeWidth + variables.cushionWidth * 2;

    const geometry6 = new THREE.BoxGeometry(backCushionWidth, variables.cushionHeight, variables.cushionWidth);
    const material4 = new THREE.MeshBasicMaterial({ color: 0x087526 });
    const backCushion = new THREE.Mesh(geometry6, material4);
    scene.add(backCushion);

    backCushion.position.z = -(variables.planeLength + variables.lineLength / 2 + variables.cushionWidth / 2);
    backCushion.position.y = variables.cushionHeight / 2;

    //* Render loop
    const controls = new THREE.TrackballControls(camera1, canvas1);

    function render() {
        requestAnimationFrame(render);

        const h = clock.getDelta();

        //make ball move
        ball.position.z += vin.z * h;
        ball.position.x += vin.x * h;

        //make ball reflect from side cushions
        if (ball.position.x > boundary1 || ball.position.x < -boundary1) {

            vin = specRef(vin, n);
        }

        else if (ball.position.z > boundary2) {
            //make ball reflect from the racket, else game over
            if (ball.position.x > boundary3 && ball.position.x < boundary4) {

                vin = specRef(vin, n1);
            }
            else {
                alert("Game over!");
                window.location.reload();

            }
        }
        //make ball reflect from the back cushion
        else if (ball.position.z < -boundary2) {

            vin = specRef(vin, n1);

        }
        controls.update();
        renderer1.render(scene, camera1);
    }

    render();

}

function multiPlayer() {

    //make second canvas appear
    document.getElementById('mycanvas2').height = '650';
    document.getElementById('mycanvas2').width = '650';
    document.getElementById('mycanvas2').style = 'border: 1px solid;';

    document.getElementById('buttons').style.visibility = 'hidden';//hide buttons once the choice is made

    //create second renderer and camera
    const canvas2 = document.getElementById("mycanvas2");
    const renderer2 = new THREE.WebGLRenderer({ canvas: canvas2 });
    renderer2.setClearColor('rgb(255,255,255)');
    const camera2 = new THREE.PerspectiveCamera(90, canvas2.width / canvas2.height,
        0.1, 1000);
    camera2.position.z = -10;
    camera2.position.y = 10;
    camera2.rotation.z = Math.PI;


    //2nd racket
    const geometry9 = new THREE.BoxGeometry(variables.racketWidth, variables.racketHeight, variables.racketLength);
    const material9 = new THREE.MeshBasicMaterial({ color: 0x00008e });
    const rocket2 = new THREE.Mesh(geometry9, material9);
    scene.add(rocket2);

    rocket2.position.z = -(variables.planeLength + variables.lineLength / 2 + variables.cushionWidth / 2);

    document.onkeydown = checkKey;

    function checkKey(e) {

        e = e || window.event;

        if (e.keyCode == '83') {
            // s
            if (rocket2.position.x > -(variables.planeWidth / 2 - variables.racketWidth / 2)) {

                rocket2.position.x += -0.5;

                boundary5 = rocket2.position.x - 0.5;
                boundary6 = rocket2.position.x + 0.5;

            }
        }
        else if (e.keyCode == '65') {
            // a
            if (rocket2.position.x < variables.planeWidth / 2 - variables.racketWidth / 2) {

                rocket2.position.x += 0.5;

                boundary5 = rocket2.position.x - 0.5;
                boundary6 = rocket2.position.x + 0.5;
            }
        }
        else if (e.keyCode == '37') {
            // left arrow
            if (racket.position.x > -(variables.planeWidth / 2 - variables.racketWidth / 2)) {

                racket.position.x += -0.5;

                boundary3 = racket.position.x - 0.5;
                boundary4 = racket.position.x + 0.5;

            }
        }
        else if (e.keyCode == '39') {
            // right arrow
            if (racket.position.x < variables.planeWidth / 2 - variables.racketWidth / 2) {

                racket.position.x += 0.5;

                boundary3 = racket.position.x - 0.5;
                boundary4 = racket.position.x + 0.5;
            }
        }
    }

    //* Render loop
    const controls1 = new THREE.TrackballControls(camera1, canvas1);
    const controls2 = new THREE.TrackballControls(camera2, canvas2);

    function render() {
        requestAnimationFrame(render);

        const h = clock.getDelta();

        ball.position.z += vin.z * h;
        ball.position.x += vin.x * h;

        //make ball jump off walls
        if (ball.position.x >= boundary1 || ball.position.x <= -boundary1) {

            vin = specRef(vin, n);
        }
        //make ball jump off racket, else game over
        else if (ball.position.z >= boundary2) {
            if (ball.position.x >= boundary3 && ball.position.x <= boundary4) {

                vin = specRef(vin, n1);
            }
            else {
                alert("Game over! Blue won.");
                window.location.reload();
            }
        }
        //make ball jump off 2nd racket, else game over
        else if (ball.position.z <= - boundary2) {
            if (ball.position.x >= boundary5 && ball.position.x <= boundary6) {

                vin = specRef(vin, n1);
            }
            else {
                alert("Game over! Red won.");
                window.location.reload();
            }
        }

        controls1.update();
        controls2.update();
        renderer1.render(scene, camera1);
        renderer2.render(scene, camera2);
    }

    render();

}

function specRef(vin, n) {

    let vin1 = new THREE.Vector3();
    vin1.copy(vin);
    let n1 = new THREE.Vector3();
    n1.copy(n);

    console.log("n");
    console.log(n);
    console.log("n1");
    console.log(n1);
    console.log("vin");
    console.log(vin);
    console.log("vin1");
    console.log(vin1);
    console.log("--------");

    //1) get a projection of vin to n
    let vinProjection = new THREE.Vector3();
    let vinPerpendicular = new THREE.Vector3();
    let vout = new THREE.Vector3();

    //calculate scalar multiple
    let temp = 0;

    temp = (vin1.dot(n1) / n1.dot(n1))

    vinProjection = n1.multiplyScalar(temp);

    //2) calculate perpendicular
    vinPerpendicular = vin.sub(vinProjection);

    //3)calculate reflection
    vout = vinProjection.sub(vinPerpendicular);

    console.log("n");
    console.log(n);
    console.log("n1");
    console.log(n1);

    console.log("vin");
    console.log(vin);
    console.log("vin1");
    console.log(vin1);
    console.log("vout");
    console.log(vout);
    console.log("-----------------------------");

    return vout;

}