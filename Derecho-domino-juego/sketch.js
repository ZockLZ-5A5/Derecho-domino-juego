// variables
let font;
let botonInicio;
let naveInicio;
let tierraInicio;
let lunaInicio;
let screen = 0;
let crasheo;
let botonContexto;
let fondoJardin;
let zyroIdle;
let zyro;
let showTip = false; // whether to show the "use arrows" text above Zyro
let showDialogOtroAlien = false; // keep dialogue box visible after collision
let pisoJardin;
let paredIzq;
let paredDer;
let paredArr;
let paredAbj;
let otroAlien;
let dudaotroAlien = false;

function preload() { //corre 1 vez antes de todo, prepara todo

	font = loadFont("assets/Arimo-Italic-VariableFont_wght.ttf");
	tierraInicio = loadImage("assets/tierra zyro ya x fa vor.png");
	lunaInicio = loadImage("assets/luna zyro 1.png");
	crasheo = loadSound("assets/car-crash-sound-effect-376874.wav");
	crasheo.volume = 0.4;
	fondoJardin = loadImage("assets/fondoJardinsolito.png");
	zyroIdle = loadImage("assets/alien_green/zyroIdle1.png");
}

function setup(){ // corre 1 vez, CARGAR SPRITES AQUÍ!!!
	createCanvas();
	textFont(font);
	textAlign(CENTER);
	rectMode(CENTER);
	world.gravity.y = 9.81;

// inicio
	naveInicio = new Sprite();
	naveInicio.width = 100;
	naveInicio.height = 50;
	naveInicio.pos = {x: width - 215, y: height/2 - 160}
	naveInicio.physics = "k";
	naveInicio.image = "assets/navezyro-removebg-preview (1).png";
	naveInicio.rotate(170, 100);

	lunaInicio = new Sprite();
	lunaInicio.image = "assets/luna zyro 1.png";
	lunaInicio.pos = {x: width - 215, y: height/2 - 160}
	lunaInicio.physics = "s";

	botonInicio = new Sprite(width/2, height/2 + 150, 180, 50, "k");
	botonInicio.color = "#41b5a0";
	botonInicio.textColor = "#2a2a2a";
	botonInicio.textSize = 30;
	botonInicio.text = "Iniciar juego";

// sprites contexto
	botonContexto = new Sprite(-5000,-5000, 200, 50, "k");
	botonContexto.color = "#41b5a0";
	botonContexto.textColor = "#2a2a2a";
	botonContexto.textSize = 30;
	botonContexto.text = "Continuar";

	zyro = new Sprite();
	zyro.w = 220 / 2;
	zyro.h = 430 / 2;
	zyro.image = zyroIdle;
	zyro.pos = {x: -5000, y: -5000};
	zyro.scale = 0.7;
	zyro.physics = "d";
	zyro.rotationLock = true;

	otroAlien = new Sprite();
	otroAlien.image = "assets/otroAlienvolteado.png";
	otroAlien.pos = {x: -5000, y: -5000};
	otroAlien.scale = 0.7;
	otroAlien.physics = "s";

	paredIzq = new Sprite(-50, height/2, 100, height, "s");
	paredDer = new Sprite(width + 50, height/2, 100, height, "s");
	paredArr = new Sprite(width/2, -50, width, 100, "s");
	paredAbj = new Sprite(width/2, height + 50, width, 100, "s");
	pisoJardin = new Sprite(-5000, -5000, width, 20, "s");
	pisoJardin.opacity = 0;
	
	background("#000000");
	fill("#f7f1ed");
	textAlign(CENTER);
	textSize(50);
	text("Marcianito Presidente", width - 280, height/2 + 30);
	textSize(35);
	text("Zyro conoce el Estado\n y el Derecho", width - 250, height/2 + 80);
	textSize(15);
	textAlign(RIGHT);
	text("Castillo Morales Ana Zoé", width - 50, height - 100);
	text("Otero Vazquez Kathia Paola", width - 50, height - 80);
	text("Tutor: Mtro. Irvin Uriel Colin Aguilar", width - 50, height - 60);
	image(tierraInicio, width/2 - 700, height - 300);
	
	//estrellas
	ellipse(70, 50, 10, 10);
	ellipse(80, 150, 15, 15);
	ellipse(135, 230, 10, 10);
	ellipse(40, 270, 15, 15);
	ellipse(200, 100, 15, 15);
	ellipse(250, 180, 10, 10);
	ellipse(350, 60, 10, 10);
	ellipse(370, 260, 15, 15);
	ellipse(400, 150, 15, 15);
	screen = 0;

}


function update(){ // corre en loop, AQUÍ VA LA LÓGICA DEL JUEGO
	
	if (botonInicio.mouse.presses() && screen == 0){
		naveInicio.moveTo(80, height - 100, 10);

	}

	if (naveInicio.pos.x == 80) {
		crasheo.play();
		naveInicio.pos.x = -13000;
		botonInicio.pos = {x: -1300, y: -1300};
		tierraInicio.pos = {x: -1000, y: -1000};
		lunaInicio.pos = {x: -2500, y: -2500};
		screen = 1;
		}

	if(screen == 1){
	screen = 1.1;
}

	if (screen == 1.1){
		botonContexto.pos = {x: width/2, y: height/2 + 100};
		pantallaContexto();
}
	if (botonContexto.mouse.presses() && screen == 1.1){
		botonContexto.pos = {x: -5000, y: -5000}; 
		pisoJardin.pos = {x: width/2, y: height - 65};
		noStroke();
		zyro.pos = {x: width/2 - 200, y: height - 160};
		zyro.visible = true;
		otroAlien.pos = {x: width - 200, y: height - 150};
		otroAlien.visible = true;
		// show the controls hint the first time Zyro appears
		showTip = true;
		screen = 2;
	}

	if (screen == 2){
		background(fondoJardin);
		// Ensure sprites are drawn (p5play may need explicit draw call)
		drawSprites();
		fill("black");
		textAlign(CENTER);
		textSize(30);
		controlesZyroBase();
		dudaotroAlien = true;

		if (dudaotroAlien == true){
			textSize(50);
			fill("black");
			textAlign(CENTER);
			textWeight(700);
			textImage("❓", otroAlien.pos.x, otroAlien.pos.y - 110);
		}

		// If Zyro collides with otroAlien, set the dialog flag (only once)
		if (!showDialogOtroAlien && zyro.collides(otroAlien)) {
			dudaotroAlien = false;
			showDialogOtroAlien = true;
		}

		// Draw persistent dialogue box when triggered
		if (showDialog) {
			push();
			noStroke();
			fill(0, 220); // semi-opaque black
			// centered rect above mid-screen; adjust size as needed
			rect(width/2, height/2 - 300, width * 0.9, 180, 10);
			fill("white");
			textSize(20);
			textAlign(CENTER, CENTER);
			text("Hola, soy Zyro.\n¿Puedes ayudarme a entender qué es el Estado y el Derecho?", width/2, height/2 - 300, width * 0.85, 160);
			pop();
		}

	}
}

//funciones 

function pantallaContexto(){
		background("black");
		textAlign(CENTER);
		textSize(20);
		fill("white");
		text("Mexicus, 20XX", width/2, height/2 - 200);
		textSize(40);
		text("La invasión alienígena comienza.", width/2, height/2 - 100);
}

function controlesZyroBase(){

	if (showTip == true){
		textSize(18);
		fill("black");
		textAlign(CENTER);
		textWeight(400);
		text("Usa las flechas para mover a Zyro", zyro.pos.x + 10, zyro.pos.y - 150);
	}
	if(keyIsDown(LEFT_ARROW)){
		zyro.pos.x -= 5;
	}
	if(keyIsDown(RIGHT_ARROW)){
		zyro.pos.x += 5;
	}
	if(keyIsDown(UP_ARROW)){
		zyro.vel.y = -5;
	}
	if(keyIsDown(DOWN_ARROW)){
		zyro.vel.y = 5;
	}

	if(keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW) || keyIsDown(UP_ARROW) || keyIsDown(DOWN_ARROW)) {
		showTip = false;
	}


}

