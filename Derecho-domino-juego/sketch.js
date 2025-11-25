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
let zyroIdleLeft;
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
let naveMoving = false; // Track if the ship is currently animating
let naveAnimationDone = false; // Track if animation already completed
let caminarIzq;
let caminarDer;
let currentAnimation = null;

// Dialogue and level system
let dialogueArray = [];
let currentDialogueIndex = 0;
let dialogueActive = false;
let prevEnterDown = false;
let levelBoxes = []; // sprites for levels
let completedLevels = [];
let sanLazaro; // background for level 1 (falls back to existing image)
let enterBuffer = 0; // frames during which a recent ENTER press is remembered
// --- Level 1 runtime state ---
let tourguideLeftImg;
let tourguideImg;
let pasilloSanImg, camaraImg, chairImg, manuscriptImg, balanzaImg;
let nivelUnoPhase = 0; // 0=not started,1=outside,2=corridor,3=camera,4=minigame
let nivelUnoDialog = [];
let nivelUnoDialogIndex = 0;
let nivelUnoDialogActive = false;
let nivelUnoGuide = null;
let nivelUnoTourFinished = false;
let levelOneProgress = 0;
let levelOneHealth = 5;
let minigameSpawnTimer = 0;
let minigameFalling = [];
let awaitingQuestion = false;
let currentQuestion = null;
let questionsPool = [];
let trophySprite = null;
let trophyFade = 0;
let levelOneCompleted = false;
let zyroMuertoImg;
// --- Level 2 (Judicial) runtime state ---
let nivelDosPhase = 0; // 0=not started, 1=outside, 2=corridor, 3=sala jueces, 4=minigame
let nivelDosDialog = [];
let nivelDosDialogIndex = 0;
let nivelDosDialogActive = false;
let nivelDosGuide = null;
let nivelDosTourAccepted = false;
let levelTwoProgress = 0;
let levelTwoHealth = 5;
let levelTwoCompleted = false;
let corteBg, pasilloCorteImg, salaJuecesImg;
let gavelImg; // mazo
let questionIndex = 0;
let judicialQuestions = [];
// --- Level 3 (Ejecutivo) runtime state ---
let nivelTresPhase = 0; // 0=not started, 1=outside, 2=corridor, 3=despacho, 4=pong1, 5=pong2, 6=pong3
let nivelTresDialog = [];
let nivelTresDialogIndex = 0;
let nivelTresDialogActive = false;
let nivelTresGuide = null;
let nivelTresTourAccepted = false;
let levelThreeCompleted = false;
let palacioNacionalBg, pasilloNacionalImg, despachoOvalImg;
let presidenteSprite, agente1Sprite, agente2Sprite;
let viejoSprite = null; // el viejo acompaña en nivel 3
let pongBall, pongPaddleZyro, pongPaddleEnemy;
let pongScoreZyro = 0, pongScoreEnemy = 0;
let pongTarget = 3; // puntos necesarios
let pongRound = 1; // 1=agente1, 2=agente2, 3=presidente
let ejecutivoQuestions = [];
let pongQuestionActive = false;
let pongCurrentQuestion = null;
// Trofeos
let trofeoPin, trofeoMazo, trofeoBanda;
let showReturnDialog = false;
let returnDialogIndex = 0;

// Preload assets
function preload() { //corre 1 vez antes de todo, prepara todo

	font = loadFont("assets/Arimo-Italic-VariableFont_wght.ttf");
	tierraInicio = loadImage("assets/tierra zyro ya x fa vor.png");
	lunaInicio = loadImage("assets/luna zyro 1.png");
	crasheo = loadSound("assets/car-crash-sound-effect-376874.wav");
	crasheo.volume = 0.4;
	fondoJardin = loadImage("assets/fondoJardinsolito.png");
	zyroIdle = loadImage("assets/alien_green/zyroIdle1.png");
	zyroIdleLeft = loadImage("assets/alien_green/zyroIdle2.png");
	
	// Load walk animations
	caminarDer = loadAnimation("assets/alien_green/caminarderecha1.png", "assets/alien_green/caminarderecha2.png", "assets/alien_green/caminarderecha3.png", "assets/alien_green/caminarderecha4.png", "assets/alien_green/caminarderecha5.png", "assets/alien_green/caminarderecha6.png");
	caminarIzq = loadAnimation("assets/alien_green/caminarizq1.png", "assets/alien_green/caminarizq2.png", "assets/alien_green/caminarizq3.png", "assets/alien_green/caminarizq4.png", "assets/alien_green/caminarizq5.png", "assets/alien_green/caminarizq6.png");

	// Try to load a San Lázaro background; fall back to jardín if missing
	sanLazaro = loadImage("assets/sanlazaro.png");

	// Level 1 specific images
	tourguideLeftImg = loadImage("assets/tourguideleft.png");
	tourguideImg = loadImage("assets/tourguide.png");
	pasilloSanImg = loadImage("assets/pasillo san lazaro.png");
	camaraImg = loadImage("assets/camara.png");
	chairImg = loadImage("assets/chair.png");
	manuscriptImg = loadImage("assets/manuscript.png");
	balanzaImg = loadImage("assets/balanza.png");
	zyroMuertoImg = loadImage("assets/muerto.png");
	
	// Level 2 (Judicial) assets - se crearán en setup()
	// Level 3 (Ejecutivo) assets - se crearán en setup()
	// Trofeos - se crearán en setup()
	
	// Pool de preguntas judiciales
	judicialQuestions = [
		{q: '¿Cuál es la función principal de la Suprema Corte?', opts: ['Crear leyes', 'Interpretar y aplicar la Constitución', 'Elegir al presidente', 'Administrar el presupuesto'], correct: 1},
		{q: '¿Cuántos ministros integran la Suprema Corte de México?', opts: ['5', '7', '11', '15'], correct: 2},
		{q: '¿Quién nombra a los ministros de la Suprema Corte?', opts: ['El pueblo vota', 'El Senado propone y el Presidente nombra', 'El Presidente propone y el Senado aprueba', 'Los jueces se eligen entre sí'], correct: 2},
		{q: '¿Cuánto dura el cargo de un ministro?', opts: ['4 años', '6 años', '15 años', 'Vitalicio'], correct: 2},
		{q: '¿Qué tipo de controversias resuelve la Suprema Corte?', opts: ['Solo casos penales', 'Conflictos entre poderes y controversias constitucionales', 'Disputas familiares', 'Problemas de tránsito'], correct: 1},
		{q: '¿Qué es un amparo?', opts: ['Un tipo de ley', 'Un recurso para proteger derechos fundamentales', 'Un cargo político', 'Un documento oficial'], correct: 1},
		{q: '¿La Suprema Corte puede declarar una ley inconstitucional?', opts: ['No, nunca', 'Sí, si viola la Constitución', 'Solo con permiso del presidente', 'Solo si el Congreso está de acuerdo'], correct: 1},
		{q: '¿Qué poder del Estado representa la Suprema Corte?', opts: ['Ejecutivo', 'Legislativo', 'Judicial', 'Municipal'], correct: 2},
		{q: '¿Qué significa que un juicio de amparo sea procedente?', opts: ['Que se rechaza', 'Que se acepta para revisión', 'Que se pospone', 'Que se cancela'], correct: 1},
		{q: '¿Los ministros pueden ser reelectos?', opts: ['Sí, indefinidamente', 'No, el cargo es único', 'Sí, una sola vez', 'Solo si el Senado aprueba'], correct: 1},
		{q: '¿Qué documento rige el funcionamiento de la Suprema Corte?', opts: ['Código Civil', 'La Constitución Política', 'Código Penal', 'Reglamento interno'], correct: 1},
		{q: '¿Cuál es el símbolo del poder judicial?', opts: ['Una espada', 'Una balanza', 'Un escudo', 'Una corona'], correct: 1}
	];
	
	// Pool de preguntas ejecutivas (3 niveles de dificultad)
	ejecutivoQuestions = [
		// Nivel 1 - Agente 1 (fáciles)
		{q: '¿Quién es el jefe del Poder Ejecutivo en México?', opts: ['El Senador', 'El Presidente', 'El Juez', 'El Gobernador'], correct: 1, level: 1},
		{q: '¿Cuánto dura el mandato presidencial?', opts: ['4 años', '6 años', '8 años', '5 años'], correct: 1, level: 1},
		{q: '¿Dónde reside el Presidente de México?', opts: ['En el Congreso', 'En la Suprema Corte', 'En el Palacio Nacional', 'En Los Pinos'], correct: 2, level: 1},
		{q: '¿El Presidente puede ser reelecto?', opts: ['Sí, indefinidamente', 'No, nunca', 'Sí, una vez', 'Solo después de 12 años'], correct: 1, level: 1},
		// Nivel 2 - Agente 2 (medias)
		{q: '¿Qué es el gabinete presidencial?', opts: ['Un mueble', 'El conjunto de secretarios de Estado', 'Una sala del palacio', 'Un partido político'], correct: 1, level: 2},
		{q: '¿Quién aprueba los nombramientos del gabinete?', opts: ['El pueblo', 'El Senado', 'La Suprema Corte', 'Los gobernadores'], correct: 1, level: 2},
		{q: '¿El Presidente puede vetar leyes aprobadas por el Congreso?', opts: ['No, debe aceptarlas', 'Sí, puede vetarlas', 'Solo con permiso de la Corte', 'Solo en emergencias'], correct: 1, level: 2},
		{q: '¿Cuál es una función exclusiva del Presidente?', opts: ['Crear leyes', 'Dirigir la política exterior', 'Juzgar delitos', 'Aprobar el presupuesto'], correct: 1, level: 2},
		{q: '¿Qué requisito NO es necesario para ser Presidente?', opts: ['Ser mexicano por nacimiento', 'Tener al menos 35 años', 'Ser abogado', 'Residir en el país'], correct: 2, level: 2},
		// Nivel 3 - Presidente (difíciles)
		{q: '¿Qué artículo constitucional establece las facultades del Presidente?', opts: ['Artículo 1', 'Artículo 89', 'Artículo 123', 'Artículo 3'], correct: 1, level: 3},
		{q: '¿El Presidente puede declarar la guerra?', opts: ['Sí, cuando quiera', 'No, solo el Congreso puede', 'Sí, con aprobación del Senado', 'Solo en caso de invasión'], correct: 1, level: 3},
		{q: '¿Quién sustituye al Presidente en caso de falta absoluta?', opts: ['El Senado elige', 'El Secretario de Gobernación temporalmente, luego el Congreso elige', 'El vicepresidente', 'La Suprema Corte decide'], correct: 1, level: 3},
		{q: '¿Qué es un decreto presidencial?', opts: ['Una ley permanente', 'Una disposición administrativa del Ejecutivo', 'Una orden judicial', 'Un voto popular'], correct: 1, level: 3},
		{q: '¿El Presidente puede modificar la Constitución?', opts: ['Sí, cuando quiera', 'No, solo puede proponer reformas', 'Sí, con aprobación de la Corte', 'Solo en estados de emergencia'], correct: 1, level: 3}
	];
}

// Helper para crear imágenes de placeholder
function createPlaceholderImage(w, h, col) {
	let img = createGraphics(w, h);
	img.background(col);
	return img;
}

// Dialogue & Level helper functions
function initializeDialogue() {
	dialogueArray = [
		{ speaker: 'otro', text: 'hey! que haces aqui? que no ves que es mi patio?' },
		{ speaker: 'zyro', text: 'soy zyro, tambien eres un alien de la luna?' },
		{ speaker: 'otro', text: 'si, pero ahora vivo una vida pacifica aqui. me gusta mas poder respirar libremente que ener que vivir en una capsula el resto de mi vida' },
		{ speaker: 'zyro', text: 'me gustaria vivir aqui tambien, pero vengo por algo mas importante: quiero conquistar el mundo' },
		{ speaker: 'otro', text: 'ha! si sabes donde stas verdad? esto es mexicus, no sabes como son las reglas aqui' },
		{ speaker: 'zyro', text: 'hm.. sabes donde puedo encontrar al responsable de este lugar?' },
		{ speaker: 'otro', text: 'no se trata de solo uno, el poder en mexicus y la mayoria de lugares de este planeta esta dividido en 3 partes: el poder legislativo, precedido por los senadores y diputados, el poder judicial, predecido por los jueces, y finalmente el poder ejecutivo, a cargo del presidente.' },
		{ speaker: 'zyro', text: 'entonces, para comandar a este pais, tendre que aprender de estos dichosos 3 poderes. sabes donde puedo empezar?' },
		{ speaker: 'otro', text: 'hmm... podrías empezar yendo a los lugares donde residen cada uno de los poderes y aprendiendo más sobre ellos.' },
		{ speaker: 'otro', text: 'mira, aquí tengo 3 portales que me traje de la luna, usalos sabiamente.' },
		{ speaker: 'zyro', text: 'gracias, usaré el primero ahora' }
	];
	currentDialogueIndex = 0;
	dialogueActive = true;
	prevEnterDown = false;
}

function displayDialogue() {
	if (currentDialogueIndex < 0) currentDialogueIndex = 0;
	let d = dialogueArray[currentDialogueIndex];
	if (!d) return;

	// top dialogue box
	push();
	noFill();
	// outline color by speaker
	if (d.speaker === 'zyro') stroke('#4CAF50');
	else stroke('#9E9E9E');
	strokeWeight(4);
	fill(0, 200);
	let boxY = 110;
	rect(width/2, boxY, width * 0.9, 160, 10);

	// text: color by speaker
	noStroke();
	if (d.speaker === 'zyro') fill('#4CAF50'); else fill('#9E9E9E');
	uiText(18);
	textAlign(LEFT, TOP);
	let pad = 30;
	text(d.text, width/2 - width*0.9/2 + pad, boxY - 70, width*0.9 - pad*2, 130);

	// hint
	uiText(14);
	textAlign(RIGHT);
	fill('white');
	text('Presiona ENTER para continuar', width/2 + width*0.9/2 - 20, boxY + 50);
	pop();
}

function createLevelBoxes() {
	// Clear any existing
	for (let lb of levelBoxes) {
		if (lb.sprite) lb.sprite.pos = {x: -5000, y: -5000};
	}
	levelBoxes = [];

	let centerX = width/2;
	let y = height/2 - 120; // move boxes higher so they don't block Zyro
	let spacing = 260;

	let labels = [
		'nivel uno: legislativo',
		'nivel dos: judicial',
		'nivel tres: ejecutivo'
	];

	for (let i = 0; i < 3; i++) {
		// level boxes - reduced to 0.8 size
		let sp = new Sprite(centerX + (i-1)*spacing, y, 224, 160, 's');
		sp.text = labels[i];
		sp.textSize = 16;
		sp.textColor = '#2a2a2a';
		// hide default sprite drawing; we'll draw styled boxes manually
		sp.opacity = 0;
		sp.color = '#BFBFBF';
		sp.physics = 's';
		sp.scale = 1;

		let unlocked = (i === 0) || completedLevels.includes(i-1);

		levelBoxes.push({ sprite: sp, unlocked: unlocked, index: i, entered: false });
	}
}

function enterLevel(index) {
	// mark as completed and unlock next
	if (!completedLevels.includes(index)) completedLevels.push(index);
	if (index + 1 < 3) {
		// unlock next
		for (let lb of levelBoxes) {
			if (lb.index === index + 1) lb.unlocked = true;
		}
	}

	// COMPLETELY remove level box sprites so they don't block anything
	for (let lb of levelBoxes) {
		lb.sprite.remove();
	}
	levelBoxes = [];

	// switch to level screen
	screen = 3;
	
	// Initialize the appropriate level based on index
	if (index === 0) {
		startNivelUno();
	} else if (index === 1) {
		startNivelDos();
	} else if (index === 2) {
		startNivelTres();
	}
}

// Draw custom styled level boxes and handle collisions + Enter to enter
function displayLevelBoxes() {
	for (let lb of levelBoxes) {
		let sp = lb.sprite;
		let x = sp.pos.x;
		let y = sp.pos.y;
		let w = sp.width || 224;
		let h = sp.height || 160;

		// draw drop shadow (larger, softer)
		push();
		noStroke();
		fill(0, 80);
		rect(x + 8, y + 10, w + 4, h + 4, 20);

		// main box color depending on lock state with gradient-like effect
		if (lb.unlocked) {
			fill(76, 175, 80); // darker green
			stroke(40, 140, 60);
		} else {
			fill(200, 200, 200); // light gray
			stroke(100, 100, 100);
		}
		strokeWeight(4);
		rect(x, y, w, h, 20);

		// star icon on the left
		noStroke();
		let starX = x - w/2 + 50;
		if (lb.unlocked) {
			fill(255, 200, 50); // gold star for unlocked
		} else {
			fill(150); // gray star for locked
		}
		drawStar(starX, y, 40, 48, 5); // draw a larger 5-pointed star

		// label text: draw on the right side of the box and fit/wrap to its area
		fill('#fff');
		textStyle(BOLD);
		let textBoxW = w - 160;
		let textBoxCx = x + 40; // center of the right-side text area
		drawFittedWrappedText(lb.sprite.text, textBoxCx, y - 5, textBoxW, h - 20, 30, 16, 18);
		textStyle(NORMAL);
		
		// Draw trophy if level is completed
		let isCompleted = completedLevels.includes(lb.index);
		if (isCompleted) {
			push();
			imageMode(CENTER);
			let trophyImg = null;
			if (lb.index === 0 && trofeoPin) trophyImg = trofeoPin;
			else if (lb.index === 1 && trofeoMazo) trophyImg = trofeoMazo;
			else if (lb.index === 2 && trofeoBanda) trophyImg = trofeoBanda;
			
			if (trophyImg) {
				image(trophyImg, x, y + h/2 - 30, 50, 50);
			}
			imageMode(CORNER);
			
			// Show "COMPLETADO" text
			fill('#FFD700');
			uiText(14);
			textAlign(CENTER);
			text('COMPLETADO', x, y + h/2 - 60);
			pop();
		}

		// If Zyro collides, show hint and allow Enter to enter if unlocked and not completed
		if (zyro.collides(sp)) {
			push();
			fill('white');
			uiText(14);
			textAlign(CENTER);
			
			if (isCompleted) {
				text('Nivel completado', x, y - h/2 - 22);
			} else if (lb.unlocked) {
				text('Presiona ENTER', x, y - h/2 - 22);
			} else {
				text('Bloqueado', x, y - h/2 - 22);
			}
			pop();

			// Allow a single recent ENTER press to trigger entry once per collision
			// Only allow entry if unlocked AND not completed
			if (lb.unlocked && !isCompleted && enterBuffer > 0 && !lb.entered) {
				lb.entered = true; // mark as entered to avoid re-triggering
				enterLevel(lb.index);
				enterBuffer = 0;
			}
		} else {
			// reset entered flag when not colliding
			lb.entered = false;
		}

		pop();
	}
}

// Helper function to draw a 5-pointed star
function drawStar(x, y, innerRadius, outerRadius, points) {
	let angle = TWO_PI / points;
	beginShape();
	for (let i = 0; i < TWO_PI; i += angle) {
		let sx = x + cos(i - PI / 2) * outerRadius;
		let sy = y + sin(i - PI / 2) * outerRadius;
		vertex(sx, sy);
		sx = x + cos(i - PI / 2 + angle / 2) * innerRadius;
		sy = y + sin(i - PI / 2 + angle / 2) * innerRadius;
		vertex(sx, sy);
	}
	endShape(CLOSE);
}

// Draw text inside a centered rectangle (cx,cy) with width w and height h.
// Tries sizes from maxSize down to minSize and wraps words to fit width.
function drawFittedWrappedText(txt, cx, cy, w, h, maxSize = 30, minSize = 16, padding = 18) {
	textAlign(CENTER, TOP);
	// normalize text
	let words = txt.split(/\s+/);

	for (let size = maxSize; size >= minSize; size--) {
		uiText(size);
		let lineHeight = size * 1.2;
		let maxLineWidth = w - padding * 2;

		// build lines
		let lines = [];
		let cur = words[0] || '';
		for (let i = 1; i < words.length; i++) {
			let test = cur + ' ' + words[i];
			if (textWidth(test) <= maxLineWidth) {
				cur = test;
			} else {
				lines.push(cur);
				cur = words[i];
			}
		}
		if (cur.length) lines.push(cur);

		// check height
		if (lines.length * lineHeight <= (h - padding * 2)) {
			// draw centered vertically
			let totalH = lines.length * lineHeight;
			let startY = cy - totalH / 2;
			for (let i = 0; i < lines.length; i++) {
				text(lines[i].toUpperCase(), cx, startY + i * lineHeight, maxLineWidth);
			}
			return; // drawn
		}
	}

	// fallback: draw with minSize and allow overflow
	uiText(minSize);
	text(txt.toUpperCase(), cx, cy - (h/2) + padding, w - padding * 2, h - padding * 2);
}

// UI scaling helpers: scale UI fonts based on canvas width.
function uiScale() {
	// baseline width tuned for typical desktop canvas; clamp to reasonable range
	return constrain(width / 1280, 0.6, 1.15);
}

function uiTextSize(base) {
	return Math.max(12, Math.round(base * uiScale()));
}

function uiText(base) {
	textSize(uiTextSize(base));
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
	
	// Create placeholder images for levels 2 and 3
	corteBg = createPlaceholderImage(width, height, color(30, 100, 200));
	pasilloCorteImg = createPlaceholderImage(width, height, color(40, 120, 220));
	salaJuecesImg = createPlaceholderImage(width, height, color(50, 140, 240));
	gavelImg = createPlaceholderImage(60, 60, color(139, 69, 19));
	
	palacioNacionalBg = createPlaceholderImage(width, height, color(20, 80, 180));
	pasilloNacionalImg = createPlaceholderImage(width, height, color(35, 110, 200));
	despachoOvalImg = createPlaceholderImage(width, height, color(45, 130, 220));
	
	trofeoPin = createPlaceholderImage(40, 40, color(255, 215, 0));
	trofeoMazo = createPlaceholderImage(40, 40, color(139, 69, 19));
	trofeoBanda = createPlaceholderImage(40, 40, color(0, 104, 71));
	
	// Screen 0 is drawn in update(), not here
	screen = 0;

}

function draw(){
	update();
	drawHints();
}

function update(){ // corre en loop, AQUÍ VA LA LÓGICA DEL JUEGO
	// centralized ENTER handling: remember single presses for a short window
	let enterDown = keyIsDown(ENTER);
	let enterEdge = enterDown && !prevEnterDown;
	if (enterEdge) enterBuffer = 10; // ~10 frames buffer
	if (enterBuffer > 0) enterBuffer--;

	// Level screen rendering - determine which level loop to run
	if (screen === 3) {
		if (nivelUnoPhase > 0) {
			nivelUnoLoop();
		} else if (nivelDosPhase > 0) {
			nivelDosLoop();
		} else if (nivelTresPhase > 0) {
			nivelTresLoop();
		}
		return;
	}
	
	// Screen 0: Title/Spaceship animation
	if (screen == 0) {
		// clear background each frame
		background("#000000");
		fill("#f7f1ed");
		textAlign(CENTER);
		uiText(50);
		text("Marcianito Presidente", width - 280, height/2 + 30);
		uiText(35);
		text("Zyro conoce el Estado\n y el Derecho", width - 250, height/2 + 80);
		uiText(15);
		textAlign(RIGHT);
		text("Castillo Morales Ana Zoé", width - 50, height - 100);
		text("Otero Vazquez Kathia Paola", width - 50, height - 80);
		text("Tutor: Mtro. Irvin Uriel Colin Aguilar", width - 50, height - 60);
		image(tierraInicio, width/2 - 700, height - 300);
		
		// Draw stars
		fill("#f7f1ed");
		ellipse(70, 50, 10, 10);
		ellipse(80, 150, 15, 15);
		ellipse(135, 230, 10, 10);
		ellipse(40, 270, 15, 15);
		ellipse(200, 100, 15, 15);
		ellipse(250, 180, 10, 10);
		ellipse(350, 60, 10, 10);
		ellipse(370, 260, 15, 15);
		ellipse(400, 150, 15, 15);
		
		// Draw button and spacecraft
		naveInicio.draw();
		lunaInicio.draw();
		botonInicio.draw();
	}
	
	if (botonInicio.mouse.presses() && screen == 0){
		naveAnimationDone = false; // reset animation flag
		naveInicio.moveTo(80, height - 100, 10);
	}

	if (naveInicio.pos.x == 80 && screen == 0 && !naveAnimationDone) {
		naveAnimationDone = true; // mark animation as done
		crasheo.play();
		naveInicio.pos.x = -13000;
		botonInicio.pos = {x: -1300, y: -1300};
		tierraInicio.pos = {x: -1000, y: -1000};
		lunaInicio.pos = {x: -2500, y: -2500};
		screen = 1;
	}	if(screen == 1){
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
		otroAlien.pos = {x: width - 200, y: height - 150};
		// show the controls hint the first time Zyro appears
		showTip = true;
		screen = 2;
	}

	if (screen == 2){
		background(fondoJardin);
		fill("black");
		textAlign(CENTER);
		uiText(30);
		// Don't allow Zyro movement while dialogue is active
		if (!dialogueActive && !showReturnDialog) controlesZyroBase();
		dudaotroAlien = true;
		
		// Show return dialog after completing a level
		if (showReturnDialog && !dialogueActive) {
			if (returnDialogIndex === 0) {
				// Set up the return dialog based on which level was just completed
				if (levelOneCompleted && !levelTwoCompleted && !levelThreeCompleted) {
					dialogueArray = [
						{ speaker: 'otro', text: '¡Zyro! ¿Realmente fuiste y lo hiciste?' },
						{ speaker: 'zyro', text: 'Sí, los senadores me regalaron este pin.' },
						{ speaker: 'otro', text: '¡Increíble! Ahora deberías visitar la Suprema Corte.' },
						{ speaker: 'otro', text: 'He abierto el segundo portal para ti.' }
					];
				} else if (levelTwoCompleted && !levelThreeCompleted) {
					dialogueArray = [
						{ speaker: 'otro', text: '¡¿Qué fue ese escándalo?! ¿Un helicóptero?' },
						{ speaker: 'zyro', text: 'Los jueces me enviaron de regreso así.' },
						{ speaker: 'otro', text: 'Bueno... al menos veo que completaste el segundo nivel.' },
						{ speaker: 'otro', text: 'Sabes, siempre he querido visitar el Palacio Nacional...' },
						{ speaker: 'otro', text: '¿Me acompañarías?' },
						{ speaker: 'zyro', text: '¡Claro! Vamos juntos.' },
						{ speaker: 'otro', text: '¡Genial! He abierto el tercer portal.' }
					];
				}
				currentDialogueIndex = 0;
				dialogueActive = true;
			}
			
			if (dialogueActive) {
				displayDialogue();
				if (enterBuffer > 0) {
					currentDialogueIndex++;
					enterBuffer = 0;
					if (currentDialogueIndex >= dialogueArray.length) {
						dialogueActive = false;
						showReturnDialog = false;
						returnDialogIndex = 0;
						createLevelBoxes(); // Refresh boxes with new unlocks
					}
				}
				prevEnterDown = enterDown;
				return;
			}
		}

		if (dudaotroAlien == true && !levelOneCompleted){
			uiText(50);
			fill("black");
			textAlign(CENTER);
			textWeight(700);
			textImage("❓", otroAlien.pos.x, otroAlien.pos.y - 110);
		}

		// Start a dialogue when Zyro collides with otroAlien (initial dialogue only)
		if (!dialogueActive && !showReturnDialog && zyro.collides(otroAlien) && levelBoxes.length === 0) {
			dudaotroAlien = false;
			initializeDialogue();
		}

		// If a dialogue is active, render it and handle Enter to advance
		if (dialogueActive && !showReturnDialog) {
			displayDialogue();
			if (enterBuffer > 0) {
				currentDialogueIndex++;
				enterBuffer = 0; // consume the buffered press
				if (currentDialogueIndex >= dialogueArray.length) {
					// dialogue finished, create level boxes
					dialogueActive = false;
					createLevelBoxes();
				}
			}
		}

		// If level boxes exist (after dialogue), draw them and handle interactions
		if (levelBoxes.length > 0) {
			displayLevelBoxes();
		}

		// update prevEnterDown at end of frame so edge detection works next frame
		prevEnterDown = enterDown;

	}
}

//funciones 

function drawHints(){
	if (showTip == true){
		uiText(18);
		fill("black");
		textAlign(CENTER);
		textWeight(400);
		text("Usa las flechas para mover a Zyro", zyro.pos.x + 10, zyro.pos.y - 150);
	}
}

function pantallaContexto(){
		background("black");
		textAlign(CENTER);
		uiText(20);
		fill("white");
		text("Mexicus, 20XX", width/2, height/2 - 200);
		uiText(40);
		text("La invasión alienígena comienza.", width/2, height/2 - 100);
}

function controlesZyroBase(){
	if(keyIsDown(LEFT_ARROW)){
		zyro.pos.x -= 2;
		zyro.image = zyroIdleLeft; // Face left using left-facing sprite
		currentAnimation = "left";
	}
	else if(keyIsDown(RIGHT_ARROW)){
		zyro.pos.x += 2;
		zyro.image = zyroIdle; // Face right using right-facing sprite
		currentAnimation = "right";
	}
	else if(keyIsDown(UP_ARROW)){
		zyro.vel.y = -5;
	}
	else if(keyIsDown(DOWN_ARROW)){
		zyro.vel.y = 5;
	}
	else {
		// No keys pressed - just stay idle facing last direction
		currentAnimation = null;
	}

	if(keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW) || keyIsDown(UP_ARROW) || keyIsDown(DOWN_ARROW)) {
		showTip = false;
	}
}

// ------------------ Nivel Uno functions ------------------
function startNivelUno(){
	// setup outside scene
	nivelUnoPhase = 1;
	levelOneProgress = 0;
	levelOneHealth = 5;
	minigameFalling = [];
	awaitingQuestion = false;
	nivelUnoDialogIndex = 0;
	// start with dialog inactive; it will trigger when Zyro approaches the guide
	nivelUnoDialogActive = false;
	// place Zyro left, guide right
	zyro.pos = { x: 120, y: height - 140 };
	zyro.scale = 0.7;
	if (nivelUnoGuide) nivelUnoGuide.remove();
	// start guide further to the left for better framing
	nivelUnoGuide = new Sprite(width - 190, height - 150, 60, 150, 's');
	nivelUnoGuide.image = tourguideLeftImg;
	// make the guide much smaller
	nivelUnoGuide.scale = 0.22;
	nivelUnoTourFinished = false;

	// hide the other alien while in this level
	if (otroAlien) otroAlien.pos = { x: -5000, y: -5000 };
	// dialogue sequence for outside
	nivelUnoDialog = [
		{ who: 'zyro', text: 'hey! tu eres el encargado de este edificio?' },
		{ who: 'guia', text: 'hola! no, yo solo soy un guia de turistas' },
		{ who: 'zyro', text: 'llevame con tu amo, guia' },
		{ who: 'guia', text: 'oye, tranquilo, no tengo amo, pero aqui trabajan de las personas mas importantes del pais: los legisladores y diputados' },
		{ who: 'zyro', text: 'legisladores y diputados... poder... llevame con ellos!' },
		{ who: 'guia', text: 'ha! con ellos? sabes al menos que hacen?' },
		{ who: 'zyro', text: 'ehhhh no realmente' },
		{ who: 'guia', text: 'venga pues, te voy a dar un recorrido, podemos hablar de lo que hacen y vemos si puedes conocer a alguno' },
		{ who: 'zyro', text: 'esta bien' }
	];
	nivelUnoDialogIndex = 0;
}

function nivelUnoLoop(){
	// Phase handling
	if (nivelUnoPhase === 1) {
		// always draw sanlazaro background for outside
		if (sanLazaro && sanLazaro.width > 1) image(sanLazaro, 0, 0, width, height);
		else background(fondoJardin);
		// draw Zyro and guide sprites
			if (zyro) zyro.draw();
			if (nivelUnoGuide) nivelUnoGuide.draw();
	// allow movement to approach guide only if no dialog active or awaiting
	if (nivelUnoDialogActive) {
		drawLevelDialog(nivelUnoDialog[nivelUnoDialogIndex]);
		// Show prompt to continue
		push(); uiText(14); fill('white'); textAlign(CENTER); text('Presiona ENTER para continuar', width/2, height - 40); pop();
		if (enterBuffer > 0) {
			enterBuffer = 0; // consume buffer first
			nivelUnoDialogIndex++;
			if (nivelUnoDialogIndex >= nivelUnoDialog.length) {
				// dialog finished: guide disappears
				nivelUnoDialogActive = false;
				nivelUnoGuide.pos = { x: -5000, y: -5000 };
				// mark that the tour/outside dialog is finished so the player can enter
				nivelUnoTourFinished = true;
			}
		}
		// Only return if dialog is still active after processing
		if (nivelUnoDialogActive) return;
	}

	// allow Zyro movement while approaching the guide
	controlesZyroBase();		// Trigger dialogue when Zyro gets close or collides with the guide
		if (!nivelUnoDialogActive && nivelUnoGuide) {
			let dx = abs(zyro.pos.x - nivelUnoGuide.pos.x);
			if (zyro.collides(nivelUnoGuide) || dx < 120) {
				nivelUnoDialogActive = true;
				// change guide image when dialogue starts
				if (tourguideImg) nivelUnoGuide.image = tourguideImg;
				nivelUnoDialogIndex = 0;
				// don't return here; let the dialog rendering below handle advancement
			}
		}
		// draw hint to go to center (only allow entering after the tour dialog finished)
		if (zyro.pos.x > width/2 - 50 && zyro.pos.x < width/2 + 50) {
			push(); uiText(20); fill('white'); textAlign(CENTER);
			if (nivelUnoTourFinished) text('Entrar? Presiona ENTER', width/2, 80);
			else text('Habla con el guía antes de entrar', width/2, 80);
			pop();
			if (enterBuffer > 0 && nivelUnoTourFinished) {
				enterBuffer = 0;
				// go to corridor
				startCorridor();
			}
		}
	}
	else if (nivelUnoPhase === 2) {
		// corridor
		if (pasilloSanImg) image(pasilloSanImg, 0, 0, width, height);
		else background(30);
		// place Zyro and guide near bottom right and draw them
		zyro.pos = { x: width - 220, y: height - 120 };
		if (nivelUnoGuide) nivelUnoGuide.pos = { x: width - 170, y: height - 120 };
		if (zyro) zyro.draw();
		if (nivelUnoGuide) nivelUnoGuide.draw();

		// dialogue for corridor: single long sequence, advance with ENTER
		if (!nivelUnoDialogActive && nivelUnoDialogIndex === 0) {
			nivelUnoDialog = [
				{ who: 'guia', text: 'ok, este edificio es el palacio legislativo de san lazarus, sede del congreso de la union. aqui se reune uno de los pilares del poder de mexicus, el poder legislativo, a crear y modificar leyes con el fin de tener una sana convivencia y justicia para todos.' },
				{ who: 'guia', text: 'pero como aqui no caben los chorromil mexicusanos q somos, hay dos grupos de personas que se encargan de representar a los estados y a la poblacion de mexicus, se llaman diputados y senadores.' },
				{ who: 'zyro', text: 'cuantos senadores y diputados hay?' },
				{ who: 'guia', text: 'hay 128 senadores que representan a los estados, y 500 diputados que representan a la poblacion. aunque los dos trabajan en el mismo edificio, sus funciones son diferentes, pues los diputados se encargan de proponer leyes, y los senadores son quienes revisan y modifican esas propuestas.' },
				{ who: 'zyro', text: 'y como le hacen para ponerse de acuerdo?' },
				{ who: 'guia', text: 'mira, aunque son camaras diferentes, ambas estan guiadas por la constitucion politica del pais, y como tienen diferentes funciones, mientras los diputados se hacen bolas con la propuesta para el presupuesto federal, los senadores revisan los nombramientos del presidente, el representante del poder ejecutivo' },
				{ who: 'zyro', text: 'y aqui esta el presidente?' },
				{ who: 'guia', text: 'no, no. el esta en otro edificio,' },
				{ who: 'guia', text: 'pero que bueno que me recuerdas, porque algo en lo que se diferencia del presidente es que su periodo puede variar, por ejemplo, un diputado solo dura 3 años en el cargo, pero un senador puede durar hasta 6 y luego ser reelegido!' },
				{ who: 'zyro', text: 'hmmm... crees que algun dia podria llegar a ser legislador?' },
				{ who: 'guia', text: 'siempre es bueno soñar, cuando cumplas la mayoria de edad y cumplas algunos requisitos adicionales constitucionales, lo veremos!' },
				{ who: 'guia', text: 'pero por ahora, el tour ha acabado, pero como veo que estas muy interesado en estas labores...' },
				{ who: 'guia', text: 'mira, ahorita estan en sesion, pero te voy a dejar pasar a dar un vistazo a ver que escuchas, vale?' },
				{ who: 'zyro', text: 'muchas gracias!' }
			];
			nivelUnoDialogIndex = 0;
			nivelUnoDialogActive = true;
		}

		if (nivelUnoDialogActive) {
			drawLevelDialog(nivelUnoDialog[nivelUnoDialogIndex]);
			// Show prompt to continue
			push(); uiText(14); fill('white'); textAlign(CENTER); text('Presiona ENTER para continuar', width/2, height - 40); pop();
			if (enterBuffer > 0) {
				enterBuffer = 0;
				nivelUnoDialogIndex++;
				if (nivelUnoDialogIndex >= nivelUnoDialog.length) {
					nivelUnoDialogActive = false;
					// guide disappears, allow entering camera
					nivelUnoGuide.pos = { x: -5000, y: -5000 };
				}
			}
			return;
		}

		// prompt to enter
		push(); uiText(20); fill('white'); textAlign(CENTER); text('Presiona ENTER para entrar al hemiciclo', width/2, 80); pop();
		if (enterBuffer > 0) {
			enterBuffer = 0;
			startCamera();
		}
	}
	else if (nivelUnoPhase === 3) {
		// Camera screen: set background to camara and position zyro at left
		if (camaraImg) image(camaraImg, 0, 0, width, height);
		else background(80);
		// place zyro left
		zyro.pos = { x: 80, y: height - 140 };
		if (zyro) zyro.draw();

		// Voiceover dialogues when Zyro moves to middle
		if (!nivelUnoDialogActive && nivelUnoDialogIndex === 0) {
			nivelUnoDialog = [
				{ who: 'senator', text: 'HEY TÚ? QUIÉN OSA INTERRUMPIR A ESTA CÁMARA?' },
				{ who: 'zyro', text: 'hola, eh, perdon, solo estaba intentando ver que estab...' },
				{ who: 'senator', text: 'como te atreves? estamos trabajando y vienes de metiche?' },
				{ who: 'zyro', text: 'bueno ya me vo...' },
				{ who: 'senator', text: 'ni lo creas, pagaras por haber entrado sin anunciarte!' }
			];
			nivelUnoDialogIndex = 0;
			nivelUnoDialogActive = false; // will trigger when Zyro reaches middle
		}

		controlesZyroBase();
		if (zyro.pos.x > width/2 - 20 && !nivelUnoDialogActive) {
			// trigger voiceover
			nivelUnoDialogActive = true;
		}

		if (nivelUnoDialogActive) {
			drawLevelDialog(nivelUnoDialog[nivelUnoDialogIndex]);
			// Show prompt to continue
			push(); uiText(14); fill('white'); textAlign(CENTER); text('Presiona ENTER para continuar', width/2, height - 40); pop();
			if (enterBuffer > 0) {
				enterBuffer = 0;
				nivelUnoDialogIndex++;
				if (nivelUnoDialogIndex >= nivelUnoDialog.length) {
					// start minigame
					nivelUnoDialogActive = false;
					startMinigame();
				}
			}
			return;
		}
	}
	else if (nivelUnoPhase === 4) {
		// run minigame loop
		runMinigame();
	}
	else if (nivelUnoPhase === 5) {
		// Victory!
		drawVictoryUno();
	}
	else if (nivelUnoPhase === 99) {
		drawGameOverScreen();
	}
	// Update prevEnterDown at end of frame for proper edge detection
	prevEnterDown = keyIsDown(ENTER);
}

function drawLevelDialog(entry) {
	if (!entry) return;
	// Color mapping per speaker
	let speaker = entry.who;
	let colorMap = {
		'zyro': '#4CAF50',
		'guia': '#FF9800',
		'senator': '#F44336',
		'otro': '#9E9E9E'
	};
	let c = colorMap[speaker] || '#FFFFFF';

	push();
	strokeWeight(4);
	stroke(c);
	fill(0, 200);
	rect(width/2, 120, width * 0.9, 140, 10);

	// Speaker name + text
	noStroke();
	uiText(16);
	textAlign(LEFT, TOP);
	fill(c);
	let whoLabel = speaker === 'zyro' ? 'Zyro' : (speaker === 'guia' ? 'Guía' : (speaker === 'senator' ? 'Senador' : speaker));
	text(whoLabel + ':', width/2 - width*0.9/2 + 20, 60);

	fill(255);
	uiText(18);
	text(entry.text, width/2 - width*0.9/2 + 20, 90, width*0.9 - 40, 120);
	pop();
}

function startCorridor(){
	nivelUnoPhase = 2;
	// reposition zyro and guide will be shown in loop
	nivelUnoDialogIndex = 0;
	nivelUnoDialogActive = false;
}

function startCamera(){
	nivelUnoPhase = 3;
	nivelUnoDialogIndex = 0;
	nivelUnoDialogActive = false;
}

function startMinigame(){
	nivelUnoPhase = 4;
	// prepare minigame
	levelOneProgress = 0;
	levelOneHealth = 5;
	minigameFalling = [];
	questionsPool = [
		{q: '¿Qué es el Poder Legislativo?', opts: ['El poder encargado de aplicar las leyes','El poder encargado de interpretar las leyes','El poder encargado de crear y modificar leyes','El poder que dirige a las Fuerzas Armadas'], correct:2},
		{q: '¿Dónde se reúnen?', opts: ['En el Palacio Nacional','En el Congreso de la Unión','En la Suprema Corte','En el Senado Internacional'], correct:1},
		{q: '¿Quiénes lo conforman?', opts: ['Presidentes y ministros','Gobernadores y alcaldes','Diputados y senadores','Jueces y magistrados'], correct:2},
		{q: '¿Cuántos representantes hay?', opts: ['128 senadores y 500 diputados','32 senadores y 100 diputados','200 senadores y 300 diputados','64 senadores y 250 diputados'], correct:0},
		{q: '¿Qué hace un diputado?', opts: ['Administra el presupuesto nacional','Representa a la población y propone leyes','Dicta sentencias','Dirige al Ejército'], correct:1},
		{q: '¿Qué hace un senador?', opts: ['Hace cumplir sentencias','Representa a los estados y revisa leyes','Supervisa escuelas públicas','Recauda impuestos'], correct:1},
		{q: '¿Qué se necesita para representar al Poder Legislativo?', opts: ['Ser mayor de edad y cumplir requisitos constitucionales','Ser militar activo','Ser abogado certificado','Ser alcalde o gobernador'], correct:0},
		{q: '¿Qué cámara inicia el proceso para aprobar el presupuesto federal?', opts: ['Cámara de Senadores','Cámara de Diputados','Suprema Corte','Presidencia'], correct:1},
		{q: '¿Qué cámara revisa los nombramientos que propone el Presidente?', opts: ['Diputados','Jueces','Senadores','Gobernadores'], correct:2},
		{q: '¿Cuánto dura un senador en su cargo?', opts: ['2 años','3 años','6 años','12 años'], correct:2},
		{q: '¿Qué documento guía el trabajo del Poder Legislativo?', opts: ['Constitución Política','Código Penal','Ley de Ingresos Estatal','Reglamento de Tránsito'], correct:0}
	];
	awaitingQuestion = false;
}

function runMinigame(){
	// background keep camera
	if (camaraImg) image(camaraImg, 0, 0, width, height);
	else background(80);

	// shrink zyro and confine left-right movement
	zyro.scale = 0.45;
	if (keyIsDown(LEFT_ARROW)) zyro.pos.x = max(30, zyro.pos.x - 6);
	if (keyIsDown(RIGHT_ARROW)) zyro.pos.x = min(width - 30, zyro.pos.x + 6);
	zyro.pos.y = height - 100;
	if (zyro) zyro.draw();

	// spawn falling objects periodically
	minigameSpawnTimer++;
	if (minigameSpawnTimer > 40) {
		minigameSpawnTimer = 0;
		// random choose chair or manuscript (chairs more common)
		let isChair = random() < 0.6;
		let s = new Sprite(random(40, width-40), -40, 40, 40, 'd');
		s.physics = 'k';
		s.collider = 'dynamic';
		s.vel = {x:0, y: isChair ? random(2,4) : random(1.5,3)};
		s.imgType = isChair ? 'chair' : 'manuscript';
		s.image = isChair ? chairImg : manuscriptImg;
		minigameFalling.push(s);
	}

	// update and draw falling
	for (let i = minigameFalling.length -1; i>=0; i--) {
		let s = minigameFalling[i];
			s.pos.y += s.vel.y;
			s.draw();
		// collision with zyro
		if (zyro.collides(s)) {
			if (s.imgType === 'chair') {
				levelOneHealth -= 1;
				// remove sprite
				s.remove();
				minigameFalling.splice(i,1);
				if (levelOneHealth <= 0) {
					// lose
					nivelUnoPhase = 99; // game over state
				}
			} else {
				// manuscript: trigger question
				// pick random question
				currentQuestion = random(questionsPool);
				awaitingQuestion = true;
				// remove manuscript from falling
				s.remove();
				minigameFalling.splice(i,1);
			}
		}
		// remove if offscreen
		else if (s.pos.y > height + 50) {
			s.remove();
			minigameFalling.splice(i,1);
		}
	}

	// Draw HUD: health and progress
	push();
	// health
	fill(200);
	rect(120, 30, 220, 20, 6);
	fill('#00BCD4');
	let hw = map(levelOneHealth, 0, 5, 0, 220);
	rect(120 - 110 + hw/2, 30, hw, 20, 6);
	fill('white'); uiText(14); textAlign(LEFT); text('Vida: ' + levelOneHealth, 20, 26);
	// progress
	fill(200);
	rect(width - 140, 30, 220, 20, 6);
	fill('#8BC34A');
	let pw = map(levelOneProgress, 0, 10, 0, 220);
	rect(width - 140 - 110 + pw/2, 30, pw, 20, 6);
	fill('white'); uiText(14); textAlign(RIGHT); text('Progreso: ' + levelOneProgress + '/10', width - 20, 26);
	pop();

	// If awaiting a question, pause spawning and show question overlay
	if (awaitingQuestion && currentQuestion) {
		drawQuestionOverlay(currentQuestion);
	}

	// win condition
	if (levelOneProgress >= 10) {
		// win sequence: show victory screen
		nivelUnoPhase = 5;
		levelOneCompleted = true;
	}
}

function drawQuestionOverlay(q) {
	push();
	fill(0,220);
	rect(width/2, height/2, width*0.8, height*0.6, 10);
	fill('white'); uiText(20); textAlign(LEFT);
	text(q.q, width/2 - width*0.8/2 + 20, height/2 - height*0.6/2 + 20, width*0.8 - 40, 120);
	// list options and number them 1-4
	uiText(18);
	for (let i=0;i<q.opts.length;i++){
		text((i+1) + ") " + q.opts[i], width/2 - width*0.8/2 + 40, height/2 - height*0.6/2 + 120 + i*36);
	}
	uiText(14); textAlign(RIGHT); text('Presiona 1-4 para responder', width/2 + width*0.8/2 - 20, height/2 + height*0.6/2 - 20);
	pop();
}

function drawGameOverScreen() {
    background(0);
    // Draw muerto Zyro in center
    if (zyroMuertoImg) {
        imageMode(CENTER);
        image(zyroMuertoImg, width/2, height/2 - 60, 220, 220);
        imageMode(CORNER);
    }
	fill('#00BCD4');
	textAlign(CENTER);
	uiText(48);
	text('¡Oh no, la jurisprudencia te venció!', width/2, height/2 + 120);
    // Cyan retry button
    fill('#00BCD4');
    rect(width/2, height - 100, 260, 60, 16);
	fill('white');
	uiText(28);
	text('Reintentar', width/2, height - 92);
    // Mouse click detection
    if (mouseIsPressed && mouseY > height - 130 && mouseY < height - 70 && mouseX > width/2 - 130 && mouseX < width/2 + 130) {
        startCamera();
        startMinigame();
        nivelUnoPhase = 4;
    }
}

function drawVictoryUno() {
	background(80);
	fill('white');
	textAlign(CENTER);
	uiText(48);
	text('¡Felicidades!', width/2, height/2 - 100);
	uiText(32);
	text('Los senadores te regalan un pin de México', width/2, height/2 - 40);
	
	// Draw trophy
	if (trofeoPin) {
		imageMode(CENTER);
		image(trofeoPin, width/2, height/2 + 40, 80, 80);
		imageMode(CORNER);
	}
	
	uiText(20);
	text('Te envían en limusina de regreso', width/2, height/2 + 120);
	text('Presiona ENTER para regresar', width/2, height - 60);
	
	if (enterBuffer > 0) {
		enterBuffer = 0;
		// Mark level as completed
		if (!completedLevels.includes(0)) completedLevels.push(0);
		levelOneCompleted = true;
		// Return to garden
		returnToGarden();
	}
}

// key handling for question answers and game-over retry
function keyPressed(){
    // Only allow number keys for question answers
    if (awaitingQuestion && currentQuestion) {
        if (keyCode === 49 || keyCode === 50 || keyCode === 51 || keyCode === 52) { // 1-4
            let sel = keyCode - 49;
            if (sel === currentQuestion.correct) {
                levelOneProgress = min(10, levelOneProgress + 1);
            }
            awaitingQuestion = false;
            currentQuestion = null;
        }
    }
	// retry after loss
	if (nivelUnoPhase === 99 && keyCode === ENTER) {
		// reset to corridor
		startCamera(); // send to camera so they can re-enter
		startMinigame();
	}
	
	// Nivel 2 - Judicial questions
	if (nivelDosPhase === 4 && currentQuestion) {
		if (keyCode === 49 || keyCode === 50 || keyCode === 51 || keyCode === 52) {
			let sel = keyCode - 49;
			if (sel === currentQuestion.correct) {
				levelTwoProgress++;
			} else {
				levelTwoHealth--;
			}
			currentQuestion = null;
			awaitingQuestion = false;
		}
	}
	
	// Nivel 3 - Ejecutivo pong questions
	if (pongQuestionActive && pongCurrentQuestion) {
		if (keyCode === 49 || keyCode === 50 || keyCode === 51 || keyCode === 52) {
			let sel = keyCode - 49;
			if (sel === pongCurrentQuestion.correct) {
				// Zyro answers correctly - enemy is confused
				pongScoreZyro++;
			} else {
				// Zyro answers wrong - Zyro is confused
				pongScoreEnemy++;
			}
			pongQuestionActive = false;
			pongCurrentQuestion = null;
		}
	}
}

// ==================== NIVEL DOS: PODER JUDICIAL ====================

function startNivelDos() {
	nivelDosPhase = 1;
	levelTwoProgress = 0;
	levelTwoHealth = 5;
	questionIndex = 0;
	awaitingQuestion = false;
	nivelDosDialogIndex = 0;
	nivelDosDialogActive = false;
	nivelDosTourAccepted = false;
	
	// Place Zyro outside
	zyro.pos = { x: 120, y: height - 140 };
	zyro.scale = 0.7;
	
	// Create guide
	if (nivelDosGuide) nivelDosGuide.remove();
	nivelDosGuide = new Sprite(width - 190, height - 150, 60, 150, 's');
	nivelDosGuide.image = tourguideLeftImg; // reuse same guide image
	nivelDosGuide.scale = 0.22;
	
	// Hide otroAlien
	if (otroAlien) otroAlien.pos = { x: -5000, y: -5000 };
}

function nivelDosLoop() {
	if (nivelDosPhase === 1) {
		// Outside Suprema Corte
		if (corteBg) image(corteBg, 0, 0, width, height);
		else background(30, 100, 200);
		
		if (zyro) zyro.draw();
		if (nivelDosGuide) nivelDosGuide.draw();
		
		// Show offer dialog
		if (!nivelDosDialogActive && nivelDosDialogIndex === 0) {
			nivelDosDialog = [
				{ who: 'guia', text: 'Bienvenido a la Suprema Corte de Justicia. ¿Te gustaría que te diera un recorrido?' },
				{ who: 'zyro', text: '...' }
			];
			nivelDosDialogIndex = 0;
			nivelDosDialogActive = true;
		}
		
		if (nivelDosDialogActive) {
			drawLevelDialog(nivelDosDialog[nivelDosDialogIndex]);
			push(); uiText(14); fill('white'); textAlign(CENTER); 
			text('Presiona ENTER para aceptar, ESPACIO para rechazar', width/2, height - 40); 
			pop();
			
			if (enterBuffer > 0) {
				nivelDosTourAccepted = true;
				nivelDosDialogActive = false;
				nivelDosGuide.image = tourguideImg;
				startCorridorDos();
				enterBuffer = 0;
			}
			if (keyIsDown(32)) { // SPACE key
				nivelDosTourAccepted = false;
				nivelDosDialogActive = false;
				nivelDosGuide.pos = { x: -5000, y: -5000 };
				startCorridorDos();
			}
			return;
		}
		
		controlesZyroBase();
	}
	else if (nivelDosPhase === 2) {
		// Corridor
		if (pasilloCorteImg) image(pasilloCorteImg, 0, 0, width, height);
		else background(40, 120, 220);
		
		zyro.pos = { x: width - 220, y: height - 120 };
		if (zyro) zyro.draw();
		
		if (nivelDosTourAccepted && nivelDosGuide) {
			nivelDosGuide.pos = { x: width - 170, y: height - 120 };
			nivelDosGuide.draw();
			
			if (!nivelDosDialogActive && nivelDosDialogIndex === 0) {
				nivelDosDialog = [
					{ who: 'guia', text: 'Este es el edificio de la Suprema Corte de Justicia, el máximo tribunal del país.' },
					{ who: 'guia', text: 'Aquí trabajan 11 ministros que se encargan de interpretar la Constitución y resolver conflictos legales importantes.' },
					{ who: 'zyro', text: '¿Qué tipo de casos ven?' },
					{ who: 'guia', text: 'Ven controversias constitucionales, amparos, y deciden si las leyes respetan la Constitución.' },
					{ who: 'guia', text: 'Los ministros son nombrados por el Presidente y aprobados por el Senado, y su cargo dura 15 años.' },
					{ who: 'zyro', text: 'Interesante...' },
					{ who: 'guia', text: 'La sala está vacía ahora, pero puedes echar un vistazo rápido.' }
				];
				nivelDosDialogIndex = 0;
				nivelDosDialogActive = true;
			}
			
		if (nivelDosDialogActive) {
			drawLevelDialog(nivelDosDialog[nivelDosDialogIndex]);
			push(); uiText(14); fill('white'); textAlign(CENTER); 
			text('Presiona ENTER para continuar', width/2, height - 40); 
			pop();
			
			if (enterBuffer > 0) {
				enterBuffer = 0;
				nivelDosDialogIndex++;
				if (nivelDosDialogIndex >= nivelDosDialog.length) {
					nivelDosDialogActive = false;
					nivelDosGuide.pos = { x: -5000, y: -5000 };
				}
			}
			return;
		}
	}		// Prompt to enter
		push(); uiText(20); fill('white'); textAlign(CENTER); 
		text('Presiona ENTER para entrar a la sala', width/2, 80); 
		pop();
		
		if (enterBuffer > 0) {
			enterBuffer = 0;
			startSalaJueces();
		}
	}
	else if (nivelDosPhase === 3) {
		// Sala de Jueces - Zyro toma el mazo
		if (salaJuecesImg) image(salaJuecesImg, 0, 0, width, height);
		else background(50, 140, 240);
		
		zyro.pos = { x: width/2, y: height - 140 };
		if (zyro) zyro.draw();
		
		// Draw gavel on table
		if (gavelImg) {
			imageMode(CENTER);
			image(gavelImg, width/2, height/2, 60, 60);
			imageMode(CORNER);
		}
		
		if (!nivelDosDialogActive && nivelDosDialogIndex === 0) {
			nivelDosDialog = [
				{ who: 'zyro', text: '¿Qué es esto? Un mazo...' },
				{ who: 'zyro', text: '*lo toma y golpea la mesa*' },
				{ who: 'zyro', text: 'Nada pasó... mejor me voy.' }
			];
			nivelDosDialogIndex = 0;
			nivelDosDialogActive = true;
		}
		
		if (nivelDosDialogActive) {
			drawLevelDialog(nivelDosDialog[nivelDosDialogIndex]);
			push(); uiText(14); fill('white'); textAlign(CENTER); 
			text('Presiona ENTER para continuar', width/2, height - 40); 
			pop();
			
			if (enterBuffer > 0) {
				enterBuffer = 0;
				nivelDosDialogIndex++;
				if (nivelDosDialogIndex >= nivelDosDialog.length) {
					nivelDosDialogActive = false;
					// Judges enter!
					startMinigameDos();
				}
			}
		}
	}
	else if (nivelDosPhase === 4) {
		// Minigame - Question contest
		runMinigameDos();
	}
	else if (nivelDosPhase === 99) {
		// Game over
		drawGameOverDos();
	}
	else if (nivelDosPhase === 100) {
		// Victory!
		drawVictoryDos();
	}
	// Update prevEnterDown at end of frame for proper edge detection
	prevEnterDown = keyIsDown(ENTER);
}

function startCorridorDos() {
	nivelDosPhase = 2;
	nivelDosDialogIndex = 0;
	nivelDosDialogActive = false;
}

function startSalaJueces() {
	nivelDosPhase = 3;
	nivelDosDialogIndex = 0;
	nivelDosDialogActive = false;
}

function startMinigameDos() {
	nivelDosPhase = 4;
	levelTwoProgress = 0;
	levelTwoHealth = 5;
	questionIndex = 0;
	awaitingQuestion = false;
}

function runMinigameDos() {
	if (salaJuecesImg) image(salaJuecesImg, 0, 0, width, height);
	else background(50, 140, 240);
	
	zyro.pos = { x: width/2, y: height - 140 };
	zyro.scale = 0.6;
	if (zyro) zyro.draw();
	
	// Draw HUD
	push();
	fill(200);
	rect(120, 30, 220, 20, 6);
	fill('#00BCD4');
	let hw = map(levelTwoHealth, 0, 5, 0, 220);
	rect(120 - 110 + hw/2, 30, hw, 20, 6);
	fill('white'); uiText(14); textAlign(LEFT); text('Vida: ' + levelTwoHealth, 20, 26);
	
	fill(200);
	rect(width - 140, 30, 220, 20, 6);
	fill('#8BC34A');
	let pw = map(levelTwoProgress, 0, 10, 0, 220);
	rect(width - 140 - 110 + pw/2, 30, pw, 20, 6);
	fill('white'); uiText(14); textAlign(RIGHT); text('Progreso: ' + levelTwoProgress + '/10', width - 20, 26);
	pop();
	
	// Show question
	if (!awaitingQuestion && levelTwoProgress < 10 && levelTwoHealth > 0) {
		// Pick random question
		currentQuestion = random(judicialQuestions);
		awaitingQuestion = true;
	}
	
	if (awaitingQuestion && currentQuestion) {
		drawQuestionOverlay(currentQuestion);
	}
	
	// Check win/lose
	if (levelTwoProgress >= 10) {
		levelTwoCompleted = true;
		nivelDosPhase = 100; // victory
	}
	if (levelTwoHealth <= 0) {
		nivelDosPhase = 99; // game over
	}
}

function drawGameOverDos() {
	background(0);
	if (zyroMuertoImg) {
		imageMode(CENTER);
		image(zyroMuertoImg, width/2, height/2 - 60, 220, 220);
		imageMode(CORNER);
	}
	fill('#F44336');
	textAlign(CENTER);
	uiText(48);
	text('¡Los jueces te expulsaron!', width/2, height/2 + 120);
	fill('#F44336');
	rect(width/2, height - 100, 260, 60, 16);
	fill('white');
	uiText(28);
	text('Reintentar', width/2, height - 92);
	
	if (mouseIsPressed && mouseY > height - 130 && mouseY < height - 70 && mouseX > width/2 - 130 && mouseX < width/2 + 130) {
		startNivelDos();
	}
}

function drawVictoryDos() {
	background(50, 140, 240);
	fill('white');
	textAlign(CENTER);
	uiText(48);
	text('¡Felicidades!', width/2, height/2 - 100);
	uiText(32);
	text('Los jueces te regalan el mazo como trofeo', width/2, height/2 - 40);
	
	// Draw trophy
	if (trofeoMazo) {
		imageMode(CENTER);
		image(trofeoMazo, width/2, height/2 + 40, 80, 80);
		imageMode(CORNER);
	}
	
	uiText(20);
	text('Presiona ENTER para regresar', width/2, height - 60);
	
	if (enterBuffer > 0) {
		enterBuffer = 0;
		// Mark level as completed
		if (!completedLevels.includes(1)) completedLevels.push(1);
		levelTwoCompleted = true;
		// Return to garden
		returnToGarden();
	}
}

// ==================== NIVEL TRES: PODER EJECUTIVO ====================

function startNivelTres() {
	nivelTresPhase = 1;
	nivelTresDialogIndex = 0;
	nivelTresDialogActive = false;
	nivelTresTourAccepted = false;
	pongScoreZyro = 0;
	pongScoreEnemy = 0;
	pongRound = 1;
	pongTarget = 3;
	
	// Place Zyro and viejo outside
	zyro.pos = { x: 120, y: height - 140 };
	zyro.scale = 0.7;
	
	// Create viejo sprite (otroAlien accompanies now)
	if (viejoSprite) viejoSprite.remove();
	viejoSprite = new Sprite(200, height - 140, 60, 150, 's');
	viejoSprite.image = "assets/otroAlienvolteado.png";
	viejoSprite.scale = 0.6;
	
	// Create guide
	if (nivelTresGuide) nivelTresGuide.remove();
	nivelTresGuide = new Sprite(width - 190, height - 150, 60, 150, 's');
	nivelTresGuide.image = tourguideLeftImg;
	nivelTresGuide.scale = 0.22;
}

function nivelTresLoop() {
	if (nivelTresPhase === 1) {
		// Outside Palacio Nacional
		if (palacioNacionalBg) image(palacioNacionalBg, 0, 0, width, height);
		else background(20, 80, 180);
		
		if (zyro) zyro.draw();
		if (viejoSprite) viejoSprite.draw();
		if (nivelTresGuide) nivelTresGuide.draw();
		
		// Show offer dialog
		if (!nivelTresDialogActive && nivelTresDialogIndex === 0) {
			nivelTresDialog = [
				{ who: 'guia', text: 'Bienvenidos al Palacio Nacional. ¿Desean un recorrido?' },
				{ who: 'otro', text: '¡Sí, por favor!' },
				{ who: 'zyro', text: '...' }
			];
			nivelTresDialogIndex = 0;
			nivelTresDialogActive = true;
		}
		
		if (nivelTresDialogActive) {
			drawLevelDialog(nivelTresDialog[nivelTresDialogIndex]);
			push(); uiText(14); fill('white'); textAlign(CENTER); 
			text('Presiona ENTER para aceptar, ESPACIO para rechazar', width/2, height - 40); 
			pop();
			
			if (enterBuffer > 0) {
				nivelTresTourAccepted = true;
				nivelTresDialogActive = false;
			nivelTresGuide.image = tourguideImg;
			startCorridorTres();
			enterBuffer = 0;
		}
		if (keyIsDown(32)) {
			nivelTresTourAccepted = false;
			nivelTresDialogActive = false;
			startCorridorTres();
		}
		return;
	}		controlesZyroBase();
	}
	else if (nivelTresPhase === 2) {
		// Corridor
		if (pasilloNacionalImg) image(pasilloNacionalImg, 0, 0, width, height);
		else background(35, 110, 200);
		
		zyro.pos = { x: width/2, y: height - 120 };
		if (zyro) zyro.draw();
		
		if (viejoSprite) {
			viejoSprite.pos = { x: width/2 - 80, y: height - 120 };
			viejoSprite.draw();
		}
		
		if (nivelTresTourAccepted && nivelTresGuide) {
			nivelTresGuide.pos = { x: width - 170, y: height - 120 };
			nivelTresGuide.draw();
			
			if (!nivelTresDialogActive && nivelTresDialogIndex === 0) {
				nivelTresDialog = [
					{ who: 'guia', text: 'Este es el Palacio Nacional, sede del Poder Ejecutivo.' },
					{ who: 'guia', text: 'Aquí trabaja el Presidente de México, quien ejecuta las leyes y dirige el gobierno.' },
					{ who: 'zyro', text: '¿Qué hace exactamente?' },
					{ who: 'guia', text: 'El Presidente dirige la política exterior, nombra a su gabinete con aprobación del Senado, y puede vetar leyes.' },
					{ who: 'guia', text: 'Su mandato dura 6 años y no puede ser reelecto. Debe ser mexicano por nacimiento y tener al menos 35 años.' },
					{ who: 'otro', text: '¡Qué interesante!' }
				];
				nivelTresDialogIndex = 0;
				nivelTresDialogActive = true;
			}
			
			if (nivelTresDialogActive) {
				drawLevelDialog(nivelTresDialog[nivelTresDialogIndex]);
				push(); uiText(14); fill('white'); textAlign(CENTER); 
				text('Presiona ENTER para continuar', width/2, height - 40); 
				pop();
				
				if (enterBuffer > 0) {
					enterBuffer = 0;
					nivelTresDialogIndex++;
					if (nivelTresDialogIndex >= nivelTresDialog.length) {
						nivelTresDialogActive = false;
						// Agents approach
						startAgentsScene();
					}
				}
				return;
			}
		} else {
			// No tour accepted - agents come faster
			if (!nivelTresDialogActive) {
				startAgentsScene();
			}
		}
	}
	else if (nivelTresPhase === 3) {
		// Despacho Oval - presidente reveals
		if (despachoOvalImg) image(despachoOvalImg, 0, 0, width, height);
		else background(45, 130, 220);
		
		zyro.pos = { x: width/2 - 100, y: height - 140 };
		if (zyro) zyro.draw();
		
		// Draw presidente and agents (black boxes)
		fill(0);
		rect(width/2, height/2, 75, 50); // presidente
		rect(width/2 - 150, height/2, 75, 50); // agente 1
		rect(width/2 + 150, height/2, 75, 50); // agente 2
		
		if (!nivelTresDialogActive && nivelTresDialogIndex === 0) {
			nivelTresDialog = [
				{ who: 'presidente', text: 'Zyro... te he estado observando.' },
				{ who: 'presidente', text: 'Venciste al Congreso y a la Suprema Corte...' },
				{ who: 'zyro', text: '¿Quién eres?' },
				{ who: 'presidente', text: '¡Soy un marciano como tú! Bueno, de una raza rival.' },
				{ who: 'presidente', text: 'Y no pienso entregar mi cargo tan fácilmente.' },
				{ who: 'presidente', text: '¡Te reto a un duelo de conocimiento estilo pong!' }
			];
			nivelTresDialogIndex = 0;
			nivelTresDialogActive = true;
		}
		
		if (nivelTresDialogActive) {
			drawLevelDialog(nivelTresDialog[nivelTresDialogIndex]);
			push(); uiText(14); fill('white'); textAlign(CENTER); 
			text('Presiona ENTER para continuar', width/2, height - 40); 
			pop();
			
			if (enterBuffer > 0) {
				enterBuffer = 0;
				nivelTresDialogIndex++;
				if (nivelTresDialogIndex >= nivelTresDialog.length) {
					nivelTresDialogActive = false;
					startPongRound(1);
				}
			}
		}
	}
	else if (nivelTresPhase === 4 || nivelTresPhase === 5 || nivelTresPhase === 6) {
		// Pong rounds
		runPongGame();
	}
	else if (nivelTresPhase === 99) {
		// Game over
		drawGameOverTres();
	}
	else if (nivelTresPhase === 100) {
		// Final victory!
		drawFinalVictory();
	}
	// Update prevEnterDown at end of frame for proper edge detection
	prevEnterDown = keyIsDown(ENTER);
}

function startCorridorTres() {
	nivelTresPhase = 2;
	nivelTresDialogIndex = 0;
	nivelTresDialogActive = false;
}

function startAgentsScene() {
	nivelTresPhase = 3;
	nivelTresDialogIndex = 0;
	nivelTresDialogActive = false;
	// Viejo stays with guide, Zyro goes to despacho
	if (viejoSprite) viejoSprite.pos = { x: -5000, y: -5000 };
	if (nivelTresGuide) nivelTresGuide.pos = { x: -5000, y: -5000 };
}

function startPongRound(round) {
	pongRound = round;
	nivelTresPhase = 3 + round; // 4, 5, or 6
	pongScoreZyro = 0;
	pongScoreEnemy = 0;
	pongQuestionActive = false;
	
	if (round === 1) pongTarget = 3;
	else if (round === 2) pongTarget = 5;
	else pongTarget = 7;
	
	// Initialize pong elements
	if (!pongBall) {
		pongBall = { x: width/2, y: height/2, vx: 4, vy: 3 };
	} else {
		pongBall.x = width/2;
		pongBall.y = height/2;
		pongBall.vx = 4;
		pongBall.vy = 3;
	}
	
	if (!pongPaddleZyro) {
		pongPaddleZyro = { x: 50, y: height/2, h: 100 };
	} else {
		pongPaddleZyro.y = height/2;
	}
	
	if (!pongPaddleEnemy) {
		pongPaddleEnemy = { x: width - 50, y: height/2, h: 100 };
	} else {
		pongPaddleEnemy.y = height/2;
	}
}

function runPongGame() {
	if (despachoOvalImg) image(despachoOvalImg, 0, 0, width, height);
	else background(45, 130, 220);
	
	// Draw pong elements
	fill(255);
	rect(pongPaddleZyro.x, pongPaddleZyro.y, 10, pongPaddleZyro.h);
	rect(pongPaddleEnemy.x, pongPaddleEnemy.y, 10, pongPaddleEnemy.h);
	ellipse(pongBall.x, pongBall.y, 15, 15);
	
	// Draw scores
	uiText(32);
	textAlign(CENTER);
	text(pongScoreZyro + ' - ' + pongScoreEnemy, width/2, 50);
	uiText(16);
	text('Primero a ' + pongTarget, width/2, 80);
	
	// Control Zyro paddle
	if (keyIsDown(UP_ARROW)) pongPaddleZyro.y = max(pongPaddleZyro.h/2, pongPaddleZyro.y - 5);
	if (keyIsDown(DOWN_ARROW)) pongPaddleZyro.y = min(height - pongPaddleZyro.h/2, pongPaddleZyro.y + 5);
	
	// Simple AI for enemy
	if (pongBall.x > width/2) {
		if (pongBall.y < pongPaddleEnemy.y) pongPaddleEnemy.y -= 3;
		if (pongBall.y > pongPaddleEnemy.y) pongPaddleEnemy.y += 3;
	}
	
	// Move ball
	if (!pongQuestionActive) {
		pongBall.x += pongBall.vx;
		pongBall.y += pongBall.vy;
		
		// Bounce top/bottom
		if (pongBall.y < 0 || pongBall.y > height) pongBall.vy *= -1;
		
		// Collision with paddles
		if (pongBall.x < pongPaddleZyro.x + 20 && abs(pongBall.y - pongPaddleZyro.y) < pongPaddleZyro.h/2) {
			pongBall.vx *= -1;
			// Trigger question
			triggerPongQuestion();
		}
		if (pongBall.x > pongPaddleEnemy.x - 20 && abs(pongBall.y - pongPaddleEnemy.y) < pongPaddleEnemy.h/2) {
			pongBall.vx *= -1;
		}
		
		// Score points
		if (pongBall.x < 0) {
			pongScoreEnemy++;
			resetPongBall();
		}
		if (pongBall.x > width) {
			pongScoreZyro++;
			resetPongBall();
		}
	}
	
	// Show question overlay
	if (pongQuestionActive && pongCurrentQuestion) {
		drawQuestionOverlay(pongCurrentQuestion);
	}
	
	// Check win/lose
	if (pongScoreZyro >= pongTarget) {
		// Zyro wins this round
		if (pongRound < 3) {
			startPongRound(pongRound + 1);
		} else {
			// Final victory!
			nivelTresPhase = 100;
			levelThreeCompleted = true;
		}
	}
	if (pongScoreEnemy >= pongTarget) {
		// Zyro loses
		nivelTresPhase = 99;
	}
}

function triggerPongQuestion() {
	// Pick question based on round
	let pool = ejecutivoQuestions.filter(q => q.level === pongRound);
	if (pool.length > 0) {
		pongCurrentQuestion = random(pool);
		pongQuestionActive = true;
	}
}

function resetPongBall() {
	pongBall.x = width/2;
	pongBall.y = height/2;
	pongBall.vx = (random() > 0.5 ? 1 : -1) * 4;
	pongBall.vy = (random() > 0.5 ? 1 : -1) * 3;
}

function drawGameOverTres() {
	background(0);
	if (zyroMuertoImg) {
		imageMode(CENTER);
		image(zyroMuertoImg, width/2, height/2 - 60, 220, 220);
		imageMode(CORNER);
	}
	fill('#F44336');
	textAlign(CENTER);
	uiText(48);
	text('¡Fuiste expulsado del Palacio!', width/2, height/2 + 120);
	fill('#F44336');
	rect(width/2, height - 100, 260, 60, 16);
	fill('white');
	uiText(28);
	text('Reintentar', width/2, height - 92);
	
	if (mouseIsPressed && mouseY > height - 130 && mouseY < height - 70 && mouseX > width/2 - 130 && mouseX < width/2 + 130) {
		startNivelTres();
	}
}

function drawFinalVictory() {
	background(0);
	fill('#FFD700');
	textAlign(CENTER);
	uiText(56);
	text('¡VICTORIA FINAL!', width/2, height/2 - 150);
	uiText(32);
	fill('white');
	text('¡Has conquistado los tres poderes!', width/2, height/2 - 80);
	text('El Presidente te entrega la banda presidencial', width/2, height/2 - 40);
	
	// Draw trophy
	if (trofeoBanda) {
		imageMode(CENTER);
		image(trofeoBanda, width/2, height/2 + 40, 120, 120);
		imageMode(CORNER);
	}
	
	// Draw all three trophies
	if (trofeoPin) image(trofeoPin, width/2 - 100, height/2 + 120, 60, 60);
	if (trofeoMazo) image(trofeoMazo, width/2, height/2 + 120, 60, 60);
	if (trofeoBanda) image(trofeoBanda, width/2 + 100, height/2 + 120, 60, 60);
	
	uiText(24);
	text('FIN DEL JUEGO', width/2, height - 80);
	text('Presiona ENTER para volver al jardín', width/2, height - 50);
	
	if (enterBuffer > 0) {
		enterBuffer = 0;
		if (!completedLevels.includes(2)) completedLevels.push(2);
		returnToGarden();
	}
}

// Helper to return to garden after completing a level
function returnToGarden() {
	screen = 2;
	nivelUnoPhase = 0;
	nivelDosPhase = 0;
	nivelTresPhase = 0;
	zyro.pos = { x: width/2 - 200, y: height - 160 };
	zyro.scale = 0.7;
	otroAlien.pos = { x: width - 200, y: height - 150 };
	
	// Trigger return dialog if a level was just completed (not level 3 - that has final screen)
	if ((levelOneCompleted || levelTwoCompleted) && !levelThreeCompleted) {
		showReturnDialog = true;
		returnDialogIndex = 0;
	} else {
		createLevelBoxes(); // Recreate level boxes with updated unlock status
	}
}



