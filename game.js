/* eslint-disable no-plusplus */
/* eslint-disable no-use-before-define */
/* eslint-disable no-undef */
// Initialize webGL with camera and lights
const canvas1 = document.getElementById('mycanvas');
const renderer1 = new THREE.WebGLRenderer({ canvas: canvas1 });
renderer1.setClearColor('rgb(255,255,255)');

// create scene and camera
const scene = new THREE.Scene();
const camera1 = new THREE.PerspectiveCamera(
	90,
	canvas1.width / canvas1.height,
	0.1,
	1000
);
camera1.position.z = 10;
camera1.position.y = 10;
const ambientLight = new THREE.AmbientLight(0x909090);
const light = new THREE.DirectionalLight(0x444444);
light.position.set(1.5, 1, 1);
scene.add(light, ambientLight);

// variables and sizes of the pong board
const planeThickness = 1;
const racketWidth = 1;
const cushionHeight = 0.5;
const racketHeight = 0.5;
const cushionWidth = 0.2;
const racketLength = 0.2;
const planeWidth = 6;
const planeLength = 5.9;
const lineLength = 0.05;
const cushionLength = 12;
const ballRadius = 0.3;
let speed = 2;

// boundaries of the pong board
const boundary1 = planeWidth / 2 - ballRadius;
const boundary2 = planeLength + lineLength / 2 - ballRadius;

// vectors for specular reflections
const n = new THREE.Vector3(0, 0, 1);
const n1 = new THREE.Vector3(1, 0, 0);
let vin = new THREE.Vector3(speed, 0, speed);

const clock = new THREE.Clock();
const controls = new THREE.TrackballControls(camera1, canvas1);

createGameBoard();

// choice for single/multi player: 0 => choice has not been made yet
let choice = 0;

render = () => {
	controls.update();
	renderer1.render(scene, camera1);
};
render();

// create the game board and all it's elements
function createGameBoard() {
	// create board (two planes with a "white line" between them")
	const geometry1 = new THREE.PlaneGeometry(
		planeWidth,
		planeLength,
		planeThickness
	);
	const material1 = new THREE.MeshBasicMaterial({
		color: 0x32a852,
		side: THREE.DoubleSide,
	});
	const plane1 = new THREE.Mesh(geometry1, material1);
	const plane2 = new THREE.Mesh(geometry1, material1);
	plane1.position.z = -(planeLength / 2 + lineLength);
	plane1.rotation.x = Math.PI / 2;
	plane2.position.z = planeLength / 2 + lineLength;
	plane2.rotation.x = Math.PI / 2;

	// white line
	const geometry3 = new THREE.PlaneGeometry(
		planeWidth,
		lineLength,
		planeThickness
	);
	const material3 = new THREE.MeshBasicMaterial({
		color: 0xffffff,
		side: THREE.DoubleSide,
	});
	const line = new THREE.Mesh(geometry3, material3);
	line.rotation.x = Math.PI / 2;

	// 2 cushions
	const geometry4 = new THREE.BoxGeometry(
		cushionWidth,
		cushionHeight,
		cushionLength
	);
	const material4 = new THREE.MeshBasicMaterial({ color: 0x087526 });
	const cushionRigth = new THREE.Mesh(geometry4, material4);
	const cushionLeft = new THREE.Mesh(geometry4, material4);
	cushionRigth.position.x = planeWidth / 2 + cushionWidth / 2;
	cushionRigth.position.y = cushionHeight / 2;
	cushionLeft.position.x = -(planeWidth / 2 + cushionWidth / 2);
	cushionLeft.position.y = cushionHeight / 2;
	scene.add(plane1, plane2, line, cushionRigth, cushionLeft);
}

// create pong ball
function createBall() {
	const geometry8 = new THREE.SphereGeometry(ballRadius, 32, 32);
	const material8 = new THREE.MeshBasicMaterial({ color: 0xf2e994 });
	const ball = new THREE.Mesh(geometry8, material8);
	scene.add(ball);
	ball.position.y = ballRadius;

	// set the ball on random position on the white line
	let check = 0;
	let position = Math.random() * 10;
	while (position > planeWidth / 2 - ballRadius) {
		position = Math.random() * 10; // get random number which does not exceed the width of the plane
		check++;
	}

	// put the ball either on the left or on the right side of the field randomly
	if (check % 2 === 0) {
		ball.position.x = position;
	} else {
		ball.position.x = -position;
	}
	return ball;
}

function singlePlayer() {
	document.getElementById('buttons').style.visibility = 'hidden'; // hide buttons once the choice is made

	// when single player, add back cushion
	const backCushionWidth = planeWidth + cushionWidth * 2;
	const geometry6 = new THREE.BoxGeometry(
		backCushionWidth,
		cushionHeight,
		cushionWidth
	);
	const material4 = new THREE.MeshBasicMaterial({ color: 0x087526 });
	const backCushion = new THREE.Mesh(geometry6, material4);
	scene.add(backCushion);

	backCushion.position.z = -(planeLength + lineLength / 2 + cushionWidth / 2);
	backCushion.position.y = cushionHeight / 2;

	const ball = createBall();

	// create racket
	const geometry7 = new THREE.BoxGeometry(
		racketWidth,
		racketHeight,
		racketLength
	);
	const material7 = new THREE.MeshBasicMaterial({ color: 0xdb4c17 });
	const racket = new THREE.Mesh(geometry7, material7);
	scene.add(racket);

	let boundary3 = -0.5;
	let boundary4 = 0.5;

	racket.position.z = planeLength + lineLength / 2 + cushionWidth / 2;
	document.onkeydown = checkKey;

	// make racket controlalbe with keyboard
	function checkKey(e) {
		e = e || window.event;
		// left arrow
		if (e.keyCode === 37) {
			// set the boundary so that the racket wouldn't go outside the field
			if (racket.position.x > -(planeWidth / 2 - racketWidth / 2)) {
				racket.position.x += -0.5; // move the racket by 0.5 when arrow key is pressed

				boundary3 = racket.position.x - 0.5;
				boundary4 = racket.position.x + 0.5;
			}
			// right arrow
		} else if (e.keyCode === 39) {
			// set the boundary so that the racket wouldn't go outside the field

			if (racket.position.x < planeWidth / 2 - racketWidth / 2) {
				racket.position.x += 0.5; // move the racket by 0.5 when arrow key is pressed

				boundary3 = racket.position.x - 0.5;
				boundary4 = racket.position.x + 0.5;
			}
		}
	}

	//* Render loop
	const controls = new THREE.TrackballControls(camera1, canvas1);

	function render() {
		requestAnimationFrame(render);
		const h = clock.getDelta();

		// make ball move
		ball.position.z += vin.z * h;
		ball.position.x += vin.x * h;

		// make ball reflect from side cushions
		if (ball.position.x > boundary1 || ball.position.x < -boundary1) {
			vin = specRef(vin, n);
		} else if (ball.position.z > boundary2) {
			// make ball reflect from the racket, else game over
			if (ball.position.x > boundary3 && ball.position.x < boundary4) {
				vin = specRef(vin, n1);
			} else {
				alert('Game over!');
				window.location.reload();
			}
		}
		// make ball reflect from the back cushion
		else if (ball.position.z < -boundary2) {
			vin = specRef(vin, n1);
		}
		controls.update();
		renderer1.render(scene, camera1);
	}
	render();
}

function multiPlayer() {
	// make second canvas appear
	document.getElementById('mycanvas2').height = '650';
	document.getElementById('mycanvas2').width = '650';
	document.getElementById('mycanvas2').style = 'border: 1px solid;';

	document.getElementById('buttons').style.visibility = 'hidden'; // hide buttons once the choice is made

	// create second renderer and camera
	const canvas2 = document.getElementById('mycanvas2');
	const renderer2 = new THREE.WebGLRenderer({ canvas: canvas2 });
	renderer2.setClearColor('rgb(255,255,255)');
	const camera2 = new THREE.PerspectiveCamera(
		90,
		canvas2.width / canvas2.height,
		0.1,
		1000
	);
	camera2.position.z = -10;
	camera2.position.y = 10;
	camera2.rotation.z = Math.PI;

	// create 2nd racket
	const geometry9 = new THREE.BoxGeometry(
		racketWidth,
		racketHeight,
		racketLength
	);
	const material9 = new THREE.MeshBasicMaterial({ color: 0x00008e });
	const material10 = new THREE.MeshBasicMaterial({ color: 0xdb4c17 });

	const ball = createBall();
	const nu = Math.random();
	// make ball roll to one or another direction
	if (nu > 0.5) {
		speed = -2;
		vin = new THREE.Vector3(speed, 0, speed);
	}

	// create rackets
	const racket1 = new THREE.Mesh(geometry9, material10);
	const racket2 = new THREE.Mesh(geometry9, material9);
	scene.add(racket1);
	scene.add(racket2);

	racket1.position.z = planeLength + lineLength / 2 + cushionWidth / 2;
	racket2.position.z = -(planeLength + lineLength / 2 + cushionWidth / 2);

	let boundary3 = -0.5;
	let boundary4 = 0.5;
	let boundary5 = -0.5;
	let boundary6 = 0.5;
	document.onkeydown = checkKey;

	// add controls to both rackets
	function checkKey(e) {
		e = e || window.event;
		// s
		if (e.keyCode === 83) {
			if (racket2.position.x > -(planeWidth / 2 - racketWidth / 2)) {
				racket2.position.x += -0.5;
				boundary5 = racket2.position.x - 0.5;
				boundary6 = racket2.position.x + 0.5;
			}
			// a
		} else if (e.keyCode === 65) {
			if (racket2.position.x < planeWidth / 2 - racketWidth / 2) {
				racket2.position.x += 0.5;
				boundary5 = racket2.position.x - 0.5;
				boundary6 = racket2.position.x + 0.5;
			}
			// left arrow
		} else if (e.keyCode === 37) {
			if (racket1.position.x > -(planeWidth / 2 - racketWidth / 2)) {
				racket1.position.x += -0.5;
				boundary3 = racket1.position.x - 0.5;
				boundary4 = racket1.position.x + 0.5;
			}
			// right arrow
		} else if (e.keyCode === 39) {
			if (racket1.position.x < planeWidth / 2 - racketWidth / 2) {
				racket1.position.x += 0.5;
				boundary3 = racket1.position.x - 0.5;
				boundary4 = racket1.position.x + 0.5;
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

		// make ball jump off walls
		if (ball.position.x >= boundary1 || ball.position.x <= -boundary1) {
			vin = specRef(vin, n);
		}
		// make ball jump off racket, else game over
		else if (ball.position.z >= boundary2) {
			if (ball.position.x >= boundary3 && ball.position.x <= boundary4) {
				vin = specRef(vin, n1);
			} else {
				alert('Game over! Blue won.');
				window.location.reload();
			}
		}
		// make ball jump off 2nd racket, else game over
		else if (ball.position.z <= -boundary2) {
			if (ball.position.x >= boundary5 && ball.position.x <= boundary6) {
				vin = specRef(vin, n1);
			} else {
				alert('Game over! Red won.');
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

// function to calculate specular reflection
function specRef(vinS, nS) {
	const vinNew = new THREE.Vector3();
	vinNew.copy(vinS);
	const nNew = new THREE.Vector3();
	nNew.copy(nS);
	// 1) get a projection of vin to n
	let vinProjection = new THREE.Vector3();
	let vinPerpendicular = new THREE.Vector3();
	let vout = new THREE.Vector3();
	// calculate scalar multiple
	let temp = 0;
	temp = vinNew.dot(nNew) / nNew.dot(nNew);
	vinProjection = nNew.multiplyScalar(temp);
	// 2) calculate perpendicular
	vinPerpendicular = vinNew.sub(vinProjection);
	// 3)calculate reflection
	vout = vinProjection.sub(vinPerpendicular);
	return vout;
}

single = () => {
	if (choice === 0) {
		singlePlayer();
		choice = 1;
	}
};

multi = () => {
	if (choice === 0) {
		multiPlayer();
		choice = 2;
	}
};
