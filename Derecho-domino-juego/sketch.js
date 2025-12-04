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
let levelBoxTouched = {}; // Track which level boxes have been touched
let sanLazaro; // background for level 1 (falls back to existing image)
let nivel1PasadoImg; // Victory background for level 1
let enterBuffer = 0; // frames during which a recent ENTER press is remembered
// --- Level 1 runtime state ---
let tourguideLeftImg;
let tourguideImg;
let guiaFemmImg;
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
let questionsAsked = []; // Nueva variable para rastrear preguntas ya usadas
let trophySprite = null;
let trophyFade = 0;
let levelOneCompleted = false;
let zyroMuertoImg;
let aplausosSound; // Nuevo: sonido de aplausos
// --- Level 2 (Judicial) runtime state ---
let nivelDosPhase = 0; // 0=not started, 1=outside, 2=corridor, 3=sala jueces, 4=minigame
let nivelDosDialog = [];
let nivelDosDialogIndex = 0;
let nivelDosDialogActive = false;
let nivelDosGuide = null;
let nivelDosTourAccepted = false;
let nivelDosTourFinished = false;
let levelTwoProgress = 0;
let levelTwoHealth = 3;
let levelTwoCompleted = false;
let corteBg, pasilloCorteImg, salaJuecesImg;
let nivel2BorrosoImg; // Fondo borroso para el minijuego breakout
let gavelImg; // mazo
let magistrada1Img, magistrada2Img, magistrada3Img; // imágenes de las magistradas
let gavelSprite = null; // sprite del mazo en la sala
let juezSprites = []; // sprites de los jueces
let questionIndex = 0;
let judicialQuestions = [];
let mazoGolpeado = false;
// Breakout game variables
let breakoutBall = null;
let breakoutPaddle = null; // Será un libro
let breakoutBlocks = [];
let breakoutQuestionBlocks = []; // Indices of blocks that trigger questions
let breakoutQuestionsAnswered = 0;
let breakoutGamePaused = false;
let libroImg; // imagen del libro (placeholder por ahora)
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
function preload() {
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
	nivel1PasadoImg = loadImage("assets/nivel1pasado.png");

	// Level 1 specific images
	tourguideLeftImg = loadImage("assets/tourguideleft.png");
	tourguideLeftImg = loadImage("assets/tourguideleft.png");
	tourguideImg = loadImage("assets/tourguide.png");
	pasilloSanImg = loadImage("assets/pasillo san lazaro.png");
	camaraImg = loadImage("assets/camara.png");
	chairImg = loadImage("assets/chair.png");
	manuscriptImg = loadImage("assets/manuscript.png");
	balanzaImg = loadImage("assets/balanza.png");
	zyroMuertoImg = loadImage("assets/muerto.png");
	
	// Level 2 (Judicial) assets
	guiaFemmImg = loadImage("assets/guiafemm.png");
	corteBg = loadImage("assets/supremacortefuera.png");
	pasilloCorteImg = loadImage("assets/supremacortepasillo.png");
	salaJuecesImg = loadImage("assets/supremacortenivel.png");
	nivel2BorrosoImg = loadImage("assets/nivel2borroso.png");
	magistrada1Img = loadImage("assets/magistrada1.png");
	magistrada2Img = loadImage("assets/magistrada2.png");
	magistrada3Img = loadImage("assets/magistrada3.png");
	gavelImg = loadImage("assets/mazo.png");
	
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
	// Check if returning after completing a level
	if (levelOneCompleted && !levelTwoCompleted && !levelThreeCompleted) {
		// Returning after level 1
		dialogueArray = [
			{ speaker: 'otro', text: '¡Zyro! ¿Realmente fuiste y lo hiciste?' },
			{ speaker: 'zyro', text: 'Sí, los senadores me regalaron este pin.' },
			{ speaker: 'otro', text: '¡Increíble! Ahora deberías visitar la Suprema Corte.' },
			{ speaker: 'otro', text: 'He abierto el segundo portal para ti.' }
		];
	} else if (levelTwoCompleted && !levelThreeCompleted) {
		// Returning after level 2
		dialogueArray = [
			{ speaker: 'otro', text: '¡¿Qué fue ese escándalo?! ¿Un helicóptero?' },
			{ speaker: 'zyro', text: 'Los jueces me enviaron de regreso así.' },
			{ speaker: 'otro', text: 'Bueno... al menos veo que completaste el segundo nivel.' },
			{ speaker: 'otro', text: 'Sabes, siempre he querido visitar el Palacio Nacional...' },
			{ speaker: 'otro', text: '¿Me acompañarías?' },
			{ speaker: 'zyro', text: '¡Claro! Vamos juntos.' },
			{ speaker: 'otro', text: '¡Genial! He abierto el tercer portal.' }
		];
	} else {
		// First time meeting otroAlien
		dialogueArray = [
			{ speaker: 'otro', text: 'Hey! ¿Qué haces aquí? ¿Qué no ves que es mi patio?' },
			{ speaker: 'zyro', text: 'Soy Zyro, ¿también eres un alien de la luna?' },
			{ speaker: 'otro', text: 'Sí, pero ahora vivo una vida pacífica aquí.' },
			{ speaker: 'otro', text: 'Me gusta más poder respirar libremente que tener que vivir en una cápsula el resto de mi vida.' },
			{ speaker: 'zyro', text: 'Me gustaría vivir aquí también, pero vengo por algo más importante: quiero conquistar el mundo.' },
			{ speaker: 'otro', text: '¡Ja! ¿Sí sabes dónde estás verdad? Esto es Mexicus.' },
			{ speaker: 'otro', text: 'No sabes cómo son las reglas aquí.' },
			{ speaker: 'zyro', text: 'Hm... ¿Sabes dónde puedo encontrar al responsable de este lugar?' },
			{ speaker: 'otro', text: 'No se trata de solo uno. El poder en Mexicus está dividido en 3 partes.' },
			{ speaker: 'otro', text: 'El poder legislativo, precedido por senadores y diputados.' },
			{ speaker: 'otro', text: 'El poder judicial, precedido por los jueces.' },
			{ speaker: 'otro', text: 'Y el poder ejecutivo, a cargo del presidente.' },
			{ speaker: 'zyro', text: 'Entonces, para comandar este país, tendré que aprender de estos 3 poderes.' },
			{ speaker: 'zyro', text: '¿Sabes dónde puedo empezar?' },
			{ speaker: 'otro', text: 'Podrías ir a los lugares donde residen cada uno de los poderes.' },
			{ speaker: 'otro', text: 'Aquí tengo 3 portales que me traje de la luna, úsalos sabiamente.' },
			{ speaker: 'zyro', text: 'Gracias, usaré el primero ahora.' }
		];
	}
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
		'nivel 1: legislativo',
		'nivel 2: judicial',
		'nivel 3: ejecutivo'
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

		// star icon - drawn first (behind text) with transparency
		noStroke();
		let starX = x - w/2 + 35; // moved more to center (was 50)
		if (lb.unlocked) {
			fill(255, 215, 0, 80); // transparent gold star (alpha 80)
		} else {
			fill(180, 180, 180, 60); // transparent gray star (alpha 60)
		}
		drawStar(starX, y, 20, 30, 5); // smaller star (was 40, 48)

		// Draw trophy as background if level is completed
		let isCompleted = completedLevels.includes(lb.index);
		if (isCompleted) {
			push();
			imageMode(CENTER);
			let trophyImg = null;
			if (lb.index === 0 && trofeoPin) trophyImg = trofeoPin;
			else if (lb.index === 1 && trofeoMazo) trophyImg = trofeoMazo;
			else if (lb.index === 2 && trofeoBanda) trophyImg = trofeoBanda;
			
			if (trophyImg) {
				// Draw trophy as semi-transparent background behind text
				tint(255, 255, 255, 30); // 30 alpha for much more transparency
				image(trophyImg, x, y, 140, 140); // Even larger size
				noTint();
			}
			imageMode(CORNER);
			pop();
		}

		// label text: EXTREMELY small - using textSize directly (drawn on top of trophy)
		fill('#fff');
		textAlign(CENTER, TOP);
		
		// Split text manually and use TINY fixed sizes with more spacing
		let parts = lb.sprite.text.split(':');
		if (parts.length === 2) {
			// Line 1: "NIVEL 1" - 30px
			textSize(30);
			text(parts[0].toUpperCase(), x, y - 50, w - 40);
			// Line 2: "LEGISLATIVO" - 30px with much more spacing (40px gap)
			textSize(30);
			text(parts[1].trim().toUpperCase(), x, y - 5, w - 40);
		} else {
			textSize(30);
			text(lb.sprite.text.toUpperCase(), x, y - 30, w - 40);
		}
		
		textStyle(NORMAL);

		// Show hint if box has been touched at least once OR currently colliding
		// PERO: solo marcar como touched si está desbloqueado
		let currentlyColliding = zyro.collides(sp);
		let showHint = (levelBoxTouched[lb.index] && lb.unlocked) || currentlyColliding;
		
		if (currentlyColliding && lb.unlocked) {
			// Mark this box as touched permanently SOLO SI ESTÁ DESBLOQUEADO
			if (!levelBoxTouched[lb.index]) {
				levelBoxTouched[lb.index] = true;
			}
		}
		
		if (showHint) {
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

			// Use edge detection for ENTER key - only trigger on new press
			let enterDown = keyIsDown(ENTER);
			let enterPressed = enterDown && !prevEnterDown;
			
			// IMPORTANTE: Solo entrar si está desbloqueado Y no completado
			if (lb.unlocked && !isCompleted && enterPressed) {
				enterLevel(lb.index);
				enterBuffer = 0;
				// Reset touched status after entering
				levelBoxTouched[lb.index] = false;
			}
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
	
	// Create placeholder images for level 3
	gavelImg = createPlaceholderImage(60, 60, color(139, 69, 19));
	
	palacioNacionalBg = createPlaceholderImage(width, height, color(20, 80, 180));
	pasilloNacionalImg = createPlaceholderImage(width, height, color(35, 110, 200));
	despachoOvalImg = createPlaceholderImage(width, height, color(45, 130, 220));
	
	trofeoPin = loadImage("assets/pinmexico.png");
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
		zyro.pos = {x: 200, y: height - 160};
		zyro.vel = {x: 0, y: 0};
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
		if (!dialogueActive) {
			controlesZyroBase();
		}
		
		dudaotroAlien = true;

		if (dudaotroAlien == true && !levelOneCompleted){
			uiText(50);
			fill("black");
			textAlign(CENTER);
			textWeight(700);
			text("❓", otroAlien.pos.x, otroAlien.pos.y - 110);
		}

		// Start a dialogue when Zyro gets close to otroAlien
		// First time: levelBoxes.length === 0 (before first dialog)
		// After level: showReturnDialog === true
		if (!dialogueActive && (levelBoxes.length === 0 || showReturnDialog)) {
			// Check if Zyro is to the LEFT of otroAlien and within range
			if (zyro.pos.x < otroAlien.pos.x && (otroAlien.pos.x - zyro.pos.x) < 170) {
				dudaotroAlien = false;
				showReturnDialog = false; // Clear the flag
				initializeDialogue(); // This function now handles different dialogues based on completed levels
			}
		}

		// If a dialogue is active, render it and handle Enter to advance
		if (dialogueActive) {
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
	zyro.pos = { x: 80, y: height - 140 };
	zyro.scale = 0.7;
	// Completely remove old guide if it exists
	if (nivelUnoGuide) {
		nivelUnoGuide.remove();
	}
	nivelUnoGuide = null;
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
		{ who: 'zyro', text: 'Hey! ¿Tú eres el encargado de este edificio?' },
		{ who: 'guia', text: '¡Hola! No, yo solo soy un guía de turistas.' },
		{ who: 'zyro', text: 'Llévame con tu amo, guía.' },
		{ who: 'guia', text: 'Oye, tranquilo, no tengo amo.' },
		{ who: 'guia', text: 'Aquí trabajan las personas más importantes del país: los legisladores y diputados.' },
		{ who: 'zyro', text: 'Legisladores y diputados... poder... ¡Llévame con ellos!' },
		{ who: 'guia', text: '¡Ja! ¿Con ellos? ¿Sabes al menos qué hacen?' },
		{ who: 'zyro', text: 'Ehhhh no realmente.' },
		{ who: 'guia', text: 'Te voy a dar un recorrido. Podemos hablar de lo que hacen.' },
		{ who: 'guia', text: 'Y vemos si puedes conocer a alguno.' },
		{ who: 'zyro', text: 'Está bien.' }
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
			
			// Use edge detection: only advance on NEW press, not while held
			let enterDown = keyIsDown(ENTER);
			let enterPressed = enterDown && !prevEnterDown;
			if (enterPressed) {
				nivelUnoDialogIndex++;
				if (nivelUnoDialogIndex >= nivelUnoDialog.length) {
					// dialog finished: remove guide completely
					nivelUnoDialogActive = false;
					if (nivelUnoGuide && nivelUnoGuide.remove) {
						nivelUnoGuide.remove();
					}
					nivelUnoGuide = null;
					// mark that the tour/outside dialog is finished so the player can enter
					nivelUnoTourFinished = true;
				}
			}
			prevEnterDown = enterDown;
			// Only return if dialog is still active after processing
			if (nivelUnoDialogActive) return;
		}

		// allow Zyro movement while approaching the guide
		controlesZyroBase();
		
		// Trigger dialogue when Zyro gets close or collides with the guide
		if (!nivelUnoDialogActive && nivelUnoGuide) {
			let dx = abs(zyro.pos.x - nivelUnoGuide.pos.x);
			if (dx < 80) {
				nivelUnoDialogActive = true;
				// change guide image when dialogue starts
				if (tourguideImg) nivelUnoGuide.image = tourguideImg;
				nivelUnoDialogIndex = 0;
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
		// place Zyro near bottom right (guide position set in startCorridor)
		zyro.pos = { x: width - 250, y: height - 120 };
		if (zyro) zyro.draw();
		if (nivelUnoGuide) nivelUnoGuide.draw();

		// dialogue for corridor: single long sequence, advance with ENTER
		// Only initialize dialog once when entering this phase
		if (nivelUnoDialogIndex === 0 && !nivelUnoDialogActive) {
			nivelUnoDialog = [
				{ who: 'guia', text: 'Este edificio es el Palacio Legislativo de San Lázaro.' },
				{ who: 'guia', text: 'Es la sede del Congreso de la Unión.' },
				{ who: 'guia', text: 'Aquí se reúne uno de los pilares del poder: el poder legislativo.' },
				{ who: 'guia', text: 'Crean y modifican leyes para tener sana convivencia y justicia.' },
				{ who: 'guia', text: 'Pero como no cabemos todos, hay dos grupos de representantes.' },
				{ who: 'guia', text: 'Se llaman diputados y senadores.' },
				{ who: 'zyro', text: '¿Cuántos senadores y diputados hay?' },
				{ who: 'guia', text: 'Hay 128 senadores que representan a los estados.' },
				{ who: 'guia', text: 'Y 500 diputados que representan a la población.' },
				{ who: 'guia', text: 'Trabajan en el mismo edificio, pero sus funciones son diferentes.' },
				{ who: 'guia', text: 'Los diputados proponen leyes.' },
				{ who: 'guia', text: 'Los senadores revisan y modifican esas propuestas.' },
				{ who: 'zyro', text: '¿Y cómo se ponen de acuerdo?' },
				{ who: 'guia', text: 'Aunque son cámaras diferentes, ambas siguen la Constitución.' },
				{ who: 'guia', text: 'Los diputados trabajan en el presupuesto federal.' },
				{ who: 'guia', text: 'Los senadores revisan los nombramientos del presidente.' },
				{ who: 'zyro', text: '¿Y aquí está el presidente?' },
				{ who: 'guia', text: 'No, no. Él está en otro edificio.' },
				{ who: 'guia', text: 'El período de trabajo puede variar.' },
				{ who: 'guia', text: 'Un diputado dura 3 años en el cargo.' },
				{ who: 'guia', text: 'Un senador puede durar hasta 6 años y ser reelegido.' },
				{ who: 'zyro', text: '¿Crees que algún día podría llegar a ser legislador?' },
				{ who: 'guia', text: 'Siempre es bueno soñar.' },
				{ who: 'guia', text: 'Cuando cumplas la mayoría de edad y los requisitos constitucionales, ¡lo veremos!' },
				{ who: 'guia', text: 'El tour ha acabado, pero veo que estás muy interesado.' },
				{ who: 'guia', text: 'Están en sesión ahora. Te dejaré pasar a dar un vistazo.' },
				{ who: 'zyro', text: '¡Muchas gracias!' }
			];
			nivelUnoDialogActive = true;
		}

		if (nivelUnoDialogActive) {
			drawLevelDialog(nivelUnoDialog[nivelUnoDialogIndex]);
			// Show prompt to continue
			push(); uiText(14); fill('white'); textAlign(CENTER); text('Presiona ENTER para continuar', width/2, height - 40); pop();
			
			// Use edge detection: only advance on NEW press
			let enterDown = keyIsDown(ENTER);
			let enterPressed = enterDown && !prevEnterDown;
			if (enterPressed) {
				nivelUnoDialogIndex++;
				if (nivelUnoDialogIndex >= nivelUnoDialog.length) {
					nivelUnoDialogActive = false;
					// Remove guide after dialog ends
					if (nivelUnoGuide && nivelUnoGuide.remove) {
						nivelUnoGuide.remove();
					}
					nivelUnoGuide = null;
					// Go to camera phase (NOT minigame yet)
					startCamera();
				}
			}
			prevEnterDown = enterDown;
			if (nivelUnoDialogActive) return;
		}
	}
	else if (nivelUnoPhase === 3) {
		// Camera screen: set background to camara and position zyro at left
		if (camaraImg) image(camaraImg, 0, 0, width, height);
		else background(80);
		// Draw zyro
		if (zyro) zyro.draw();

		// Primer diálogo: pensamiento inicial de Zyro
		if (nivelUnoDialogActive && nivelUnoDialogIndex === 0 && nivelUnoDialog.length === 1) {
			drawLevelDialog(nivelUnoDialog[nivelUnoDialogIndex]);
			push(); uiText(14); fill('white'); textAlign(CENTER); 
			text('Presiona ENTER para continuar', width/2, height - 40); pop();
			
			let enterDown = keyIsDown(ENTER);
			let enterPressed = enterDown && !prevEnterDown;
			if (enterPressed) {
				// Terminar diálogo inicial y dar control de movimiento
				nivelUnoDialogActive = false;
				nivelUnoDialogIndex = 0;
				
				// Preparar diálogo del senador (pero NO activarlo aún)
				nivelUnoDialog = [
					{ who: 'senator', text: '¡HEY TÚ! ¿QUIÉN OSA INTERRUMPIR A ESTA CÁMARA?' },
					{ who: 'zyro', text: 'Hola, eh, perdón, solo estaba intentando ver qué...' },
					{ who: 'senator', text: '¿Cómo te atreves? ¡Estamos trabajando y vienes de metiche!' },
					{ who: 'zyro', text: 'Bueno ya me vo...' },
					{ who: 'senator', text: '¡Ni lo creas! ¡Pagarás por haber entrado sin anunciarte!' },
					{ who: 'senator', text: 'Te lanzaremos documentos y sillas.' },
					{ who: 'senator', text: 'Debes recoger SOLO los manuscritos y responder las preguntas.' },
					{ who: 'senator', text: 'Esquiva las sillas o perderás vida.' },
					{ who: 'senator', text: '¡Responde 10 preguntas correctamente para ganar!' }
				];
			}
			prevEnterDown = enterDown;
			return; // No permitir movimiento durante este diálogo
		}

		// Dar control de movimiento después del diálogo inicial
		if (!nivelUnoDialogActive) {
			controlesZyroBase();
			
			// Trigger diálogo del senador cuando Zyro llega al centro
			if (zyro.pos.x > width/2 - 20 && nivelUnoDialog.length > 1) {
				nivelUnoDialogActive = true;
				nivelUnoDialogIndex = 0;
			}
		}

		// Mostrar diálogo del senador (ya con control activado)
		if (nivelUnoDialogActive && nivelUnoDialog.length > 1) {
			drawLevelDialog(nivelUnoDialog[nivelUnoDialogIndex]);
			push(); uiText(14); fill('white'); textAlign(CENTER); 
			text('Presiona ENTER para continuar', width/2, height - 40); pop();
			
			let enterDown = keyIsDown(ENTER);
			let enterPressed = enterDown && !prevEnterDown;
			if (enterPressed) {
				nivelUnoDialogIndex++;
				if (nivelUnoDialogIndex >= nivelUnoDialog.length) {
					// start minigame
					nivelUnoDialogActive = false;
					startMinigame();
				}
			}
			prevEnterDown = enterDown;
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
		'juez': '#8B4513',
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
	let whoLabel = speaker === 'zyro' ? 'Zyro' : (speaker === 'guia' ? 'Guía' : (speaker === 'senator' ? 'Senador' : (speaker === 'juez' ? 'Juez' : speaker)));
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
	// Remove old guide completely
	if (nivelUnoGuide && nivelUnoGuide.remove) {
		nivelUnoGuide.remove();
	}
	nivelUnoGuide = null;
	// Create new guide sprite for corridor
	nivelUnoGuide = new Sprite(width - 170, height - 120, 60, 150, 's');
	nivelUnoGuide.image = tourguideImg;
	nivelUnoGuide.scale = 0.22;
}

function startCamera(){
	nivelUnoPhase = 3;
	nivelUnoDialogIndex = 0;
	nivelUnoDialogActive = true; // Activar diálogo inicial de Zyro
	// Position Zyro at left side
	zyro.pos = { x: 80, y: height - 140 };
	// Quitar suelo para que Zyro no se vea muy arriba
	if (pisoJardin) pisoJardin.pos = {x: -5000, y: -5000};
	
	// Diálogo inicial de Zyro al entrar (SOLO una línea)
	nivelUnoDialog = [
		{ who: 'zyro', text: 'Hmm.. espero que nadie vea que estoy aquí...' }
	];
}

function startMinigame(){
	nivelUnoPhase = 4;
	// prepare minigame
	levelOneProgress = 0;
	levelOneHealth = 5;
	minigameFalling = [];
	minigameSpawnTimer = 0;
	questionsAsked = [];
	
	// Crear pool de preguntas y mezclarlo
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
		{q: '¿Cuánto dura un senador en su cargo?', opts: ['2 años','3 años','6 años','12 años'], correct:2}
	];
	
	// Mezclar el pool de preguntas aleatoriamente
	for (let i = questionsPool.length - 1; i > 0; i--) {
		let j = floor(random(i + 1));
		let temp = questionsPool[i];
		questionsPool[i] = questionsPool[j];
		questionsPool[j] = temp;
	}
	
	awaitingQuestion = false;
}

function runMinigame(){
	// background keep camera
	if (camaraImg) image(camaraImg, 0, 0, width, height);
	else background(80);

	// shrink zyro and confine left-right movement
	zyro.scale = 0.6;
	if (keyIsDown(LEFT_ARROW)) {
		zyro.pos.x = max(40, zyro.pos.x - 5);
		if (zyroIdleLeft) zyro.image = zyroIdleLeft;
	}
	if (keyIsDown(RIGHT_ARROW)) {
		zyro.pos.x = min(width - 40, zyro.pos.x + 5);
		if (zyroIdle) zyro.image = zyroIdle;
	}
	zyro.pos.y = height - 70;
	zyro.draw();

	// spawn falling objects
	if (!awaitingQuestion) {
		minigameSpawnTimer++;
		if (minigameSpawnTimer > 120) {
			minigameSpawnTimer = 0;
			let isChair = random() < 0.66;
			let s = new Sprite(random(60, width-60), -40, 30, 50, 'k');
			s.collider = 'kinematic';
			s.vel = {x:0, y: isChair ? 8 : 7};
			s.bounciness = 0;
			s.rotationLock = true;
			s.imgType = isChair ? 'chair' : 'manuscript';
			s.image = isChair ? chairImg : manuscriptImg;
			s.scale = isChair ? 0.25 : 0.22;
			s.hasCollided = false;
			minigameFalling.push(s);
		}
	}

	// update and draw falling
	for (let i = minigameFalling.length - 1; i >= 0; i--) {
		let s = minigameFalling[i];
		
		if (!s || s.removed) {
			minigameFalling.splice(i, 1);
			continue;
		}
		
		if (awaitingQuestion && s && !s.removed) {
			s.vel.y = s.imgType === 'chair' ? 4 : 3.5;
		} else if (!awaitingQuestion && s && !s.removed && s.vel.y < 8) {
			s.vel.y = s.imgType === 'chair' ? 8 : 7;
		}
		
		if (s && !s.removed) {
			s.draw();
		}
		
		if (s && !s.removed && s.pos.y > height + 100) {
			s.remove();
			minigameFalling.splice(i, 1);
			continue;
		}

		// Detección de colisión
		if (!awaitingQuestion && !s.hasCollided && s && !s.removed) {
			let dx = abs(zyro.pos.x - s.pos.x);
			let dy = abs(zyro.pos.y - s.pos.y);
			
			let collisionRadius = (s.imgType === 'manuscript') ? 60 : 50;
			
			if (dx < collisionRadius && dy < collisionRadius) {
				s.hasCollided = true;
				
				if (s.imgType === 'chair') {
					levelOneHealth -= 1;
					
					if (s && !s.removed) {
						s.remove();
						minigameFalling.splice(i, 1);
					}
					
					if (levelOneHealth <= 0) {
						for (let obj of minigameFalling) {
							if (obj && !obj.removed) obj.remove();
						}
						minigameFalling = [];
						if (zyro) zyro.pos = {x: -5000, y: -5000};
						if (crasheo) crasheo.play();
						nivelUnoPhase = 99;
					}
				} else {
					// MANUSCRITO - usar siguiente pregunta del pool mezclado
					// Si ya se acabaron las preguntas, reiniciar el índice para reutilizarlas
					if (questionsAsked.length >= questionsPool.length) {
						questionsAsked = [];
					}
					
					currentQuestion = questionsPool[questionsAsked.length];
					questionsAsked.push(questionsAsked.length);
					awaitingQuestion = true;
					
					if (s && !s.removed) {
						s.remove();
						minigameFalling.splice(i, 1);
					}
				}
			}
		}
	}
	
	// Draw HUD
	push();
	fill(200);
	rect(120, 30, 220, 20, 6);
	fill('#F44336');
	let hw = map(levelOneHealth, 0, 5, 0, 220);
	rect(120 - 110 + hw/2, 30, hw, 20, 6);
	fill('white'); uiText(14); textAlign(LEFT); text('Vida: ' + levelOneHealth, 20, 26);
	
	fill(200);
	rect(width - 140, 30, 220, 20, 6);
	fill('#4CAF50');
	let pw = map(levelOneProgress, 0, 10, 0, 220);
	rect(width - 140 - 110 + pw/2, 30, pw, 20, 6);
	fill('white'); uiText(14); textAlign(RIGHT); text('Progreso: ' + levelOneProgress + '/10', width - 20, 26);
	pop();

	if (awaitingQuestion && currentQuestion) {
		drawQuestionOverlay(currentQuestion);
	}

	if (levelOneProgress >= 10) {
		for (let obj of minigameFalling) {
			obj.remove();
		}
		minigameFalling = [];
		
		if (zyro) zyro.pos = {x: -5000, y: -5000};
		
		if (aplausosSound && !aplausosSound.isPlaying()) {
			aplausosSound.play();
		}
		
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
	uiText(18);
	for (let i=0;i<q.opts.length;i++){
		text((i+1) + ") " + q.opts[i], width/2 - width*0.8/2 + 40, height/2 - height*0.6/2 + 120 + i*36);
	}
	uiText(14); textAlign(RIGHT); text('Presiona 1-4 para responder', width/2 + width*0.8/2 - 20, height/2 + height*0.6/2 - 20);
	pop();
}

function drawGameOverScreen() {
	background(0);
	if (zyroMuertoImg) {
		imageMode(CENTER);
		image(zyroMuertoImg, width/2, height/2 - 60, 150, 150);
		imageMode(CORNER);
	}
	fill('#00BCD4');
	textAlign(CENTER);
	uiText(48);
	text('¡Oh no, la jurisprudencia te venció!', width/2, height/2 + 120);
	fill('#00BCD4');
	rect(width/2, height - 100, 260, 60, 16);
	fill('white');
	uiText(28);
	text('Reintentar', width/2, height - 92);
	
	if (mouseIsPressed && mouseY > height - 130 && mouseY < height - 70 && mouseX > width/2 - 130 && mouseX < width/2 + 130) {
		startMinigame();
		nivelUnoPhase = 4;
	}
}

function drawVictoryUno() {
	if (nivel1PasadoImg) {
		image(nivel1PasadoImg, 0, 0, width, height);
	} else {
		for (let i = 0; i < height; i++) {
			let inter = map(i, 0, height, 0, 1);
			let c = lerpColor(color(76, 175, 80), color(33, 150, 243), inter);
			stroke(c);
			line(0, i, width, i);
		}
	}
	noStroke();
	
	fill('white');
	textAlign(CENTER);
	uiText(48);
	text('¡Felicidades!', width/2, height/2 - 100);
	uiText(32);
	text('Los senadores te regalan un pin de la bandera de México', width/2, height/2 - 40);
	
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
		if (!completedLevels.includes(0)) completedLevels.push(0);
		levelOneCompleted = true;
		
		if (aplausosSound && aplausosSound.isPlaying()) {
			aplausosSound.stop();
		}
		
		returnToGarden();
	}
}

// --- Level 2 (Judicial) functions ---
function startNivelDos() {
	nivelDosPhase = 1;
	levelTwoProgress = 0;
	levelTwoHealth = 3;
	nivelDosDialogIndex = 0;
	nivelDosDialogActive = false;
	nivelDosTourFinished = false;
	mazoGolpeado = false;
	
	// Position Zyro
	zyro.pos = { x: 80, y: height - 140 };
	zyro.scale = 0.7;
	// Quitar suelo en fase 1
	if (pisoJardin) pisoJardin.pos = {x: -5000, y: -5000};
	
	// Hide other alien
	if (otroAlien) otroAlien.pos = { x: -5000, y: -5000 };
	
	// Create guide sprite usando la imagen del nivel 1
	if (nivelDosGuide) nivelDosGuide.remove();
	nivelDosGuide = new Sprite(width - 190, height - 80, 60, 150, 's');
	nivelDosGuide.image = guiaFemmImg;
	nivelDosGuide.scale = 0.22;
	
	// Diálogo inicial simple
	nivelDosDialog = [
		{ who: 'zyro', text: '¿Este es el edificio de la Suprema Corte?' },
		{ who: 'guia', text: 'Así es. ¿Quieres un tour?' },
		{ who: 'zyro', text: '¡Sí, por favor!' }
	];
}

function nivelDosLoop() {
	if (nivelDosPhase === 1) {
		// FASE 1: Outside - Llegada al edificio
		if (corteBg && corteBg.width > 1) {
			image(corteBg, 0, 0, width, height);
		} else {
			background(30, 100, 200); // Fondo azul de respaldo
		}
		
		if (zyro) zyro.draw();
		if (nivelDosGuide) nivelDosGuide.draw();
		
		if (nivelDosDialogActive) {
			drawLevelDialog(nivelDosDialog[nivelDosDialogIndex]);
			push(); uiText(14); fill('white'); textAlign(CENTER); 
			text('Presiona ENTER para continuar', width/2, height - 40); pop();
			
			let enterDown = keyIsDown(ENTER);
			let enterPressed = enterDown && !prevEnterDown;
			if (enterPressed) {
				nivelDosDialogIndex++;
				if (nivelDosDialogIndex >= nivelDosDialog.length) {
					nivelDosDialogActive = false;
					nivelDosTourFinished = true;
					// Hacer desaparecer la guía
					if (nivelDosGuide && nivelDosGuide.remove) {
						nivelDosGuide.remove();
					}
					nivelDosGuide = null;
				}
			}
			prevEnterDown = enterDown;
			if (nivelDosDialogActive) return;
		}
		
		// Permitir movimiento
		controlesZyroBase();
		
		// Trigger diálogo cuando Zyro se acerca al guía
		if (!nivelDosDialogActive && nivelDosGuide && !nivelDosTourFinished) {
			let dx = abs(zyro.pos.x - nivelDosGuide.pos.x);
			if (dx < 120) {
				nivelDosDialogActive = true;
				// Cambiar a imagen mirando al frente cuando habla
				if (guiaFemmImg) nivelDosGuide.image = guiaFemmImg;
				nivelDosDialogIndex = 0;
			}
		}
		
		// Permitir entrar al edificio después del tour
		if (zyro.pos.x > width/2 - 200 && zyro.pos.x < width/2 - 100) {
			push(); uiText(20); fill('white'); textAlign(CENTER);
			if (nivelDosTourFinished) text('Entrar? Presiona ENTER', width/2 - 150, 80);
			else text('Habla con el guía primero', width/2, 80);
			pop();
			if (enterBuffer > 0 && nivelDosTourFinished) {
				enterBuffer = 0;
				startCorridorDos();
			}
		}
	}
	else if (nivelDosPhase === 2) {
		// FASE 2: Pasillo - Información sobre la Suprema Corte
		if (pasilloCorteImg && pasilloCorteImg.width > 1) {
			image(pasilloCorteImg, 0, 0, width, height);
		} else {
			background(50, 120, 220); // Fondo azul de respaldo
		}
		
		// Posicionar Zyro y guía
		zyro.pos = { x: width - 250, y: height - 120 };
		if (zyro) zyro.draw();
		if (nivelDosGuide) nivelDosGuide.draw();
		
		if (nivelDosDialogActive) {
			drawLevelDialog(nivelDosDialog[nivelDosDialogIndex]);
			push(); uiText(14); fill('white'); textAlign(CENTER); 
			text('Presiona ENTER para continuar', width/2, height - 40); pop();
			
			let enterDown = keyIsDown(ENTER);
			let enterPressed = enterDown && !prevEnterDown;
			if (enterPressed) {
				nivelDosDialogIndex++;
				if (nivelDosDialogIndex >= nivelDosDialog.length) {
					nivelDosDialogActive = false;
					// Remover guía y pasar a la sala de jueces
					if (nivelDosGuide && nivelDosGuide.remove) {
						nivelDosGuide.remove();
					}
					nivelDosGuide = null;
					startSalaJueces();
				}
			}
		}
	}
	else if (nivelDosPhase === 3) {
		// FASE 3: Sala de Jueces - Encuentro con el mazo y los jueces
		if (salaJuecesImg && salaJuecesImg.width > 1) {
			image(salaJuecesImg, 0, 0, width, height);
		} else {
			background(60, 140, 240); // Fondo azul de respaldo
		}
		
		// Mostrar diálogo inicial de Zyro (debe terminar antes de poder moverse)
		if (nivelDosDialogActive && !mazoGolpeado) {
			if (zyro) zyro.draw();
			drawLevelDialog(nivelDosDialog[nivelDosDialogIndex]);
			push(); uiText(14); fill('white'); textAlign(CENTER); 
			text('Presiona ENTER para continuar', width/2, height - 40); pop();
			
			let enterDown = keyIsDown(ENTER);
			let enterPressed = enterDown && !prevEnterDown;
			if (enterPressed) {
				nivelDosDialogIndex++;
				if (nivelDosDialogIndex >= nivelDosDialog.length) {
					nivelDosDialogActive = false;
					nivelDosDialogIndex = 0;
				}
			}
		} else if (!mazoGolpeado) {
			// Solo permitir movimiento después del diálogo inicial y antes de golpear el mazo
			zyro.pos.y = height - 80;
			controlesZyroBase();
		}
		
		if (zyro) zyro.draw();
		
		// Dibujar el mazo en el centro si no ha sido golpeado
		if (!mazoGolpeado && gavelSprite) {
			gavelSprite.draw();
			
			// Mostrar instrucciones en pantalla
			push();
			fill('white');
			uiText(20);
			textAlign(CENTER);
			text('Acércate al mazo en el centro', width/2, 60);
			pop();
			
			// Mostrar hint para golpear el mazo cuando Zyro esté cerca
			let dx = abs(zyro.pos.x - gavelSprite.x);
			if (dx < 150) {
				push(); 
				uiText(24); 
				fill('#FFD700');
				textAlign(CENTER);
				text('Presiona ENTER para golpear el mazo', width/2, 100);
				pop();
				
				if (enterBuffer > 0) {
					enterBuffer = 0;
					mazoGolpeado = true;
					// Crear jueces
					crearJueces();
				}
			}
		} else if (!mazoGolpeado) {
			// Si el mazo no existe, mostrarlo como rectángulo
			push();
			fill(139, 69, 19);
			rect(width/2, height/2, 60, 60);
			pop();
			
			push();
			fill('white');
			uiText(20);
			textAlign(CENTER);
			text('Acércate al mazo (cuadrado café)', width/2, 60);
			pop();
			
			let dx = abs(zyro.pos.x - width/2);
			if (dx < 150) {
				push(); 
				uiText(24); 
				fill('#FFD700');
				textAlign(CENTER);
				text('Presiona ENTER para golpear el mazo', width/2, 100);
				pop();
				
				if (enterBuffer > 0) {
					enterBuffer = 0;
					mazoGolpeado = true;
					crearJueces();
				}
			}
		}
		
		// Dibujar jueces si ya fueron creados
		if (mazoGolpeado) {
			for (let juez of juezSprites) {
				if (juez && !juez.removed) juez.draw();
			}
		}
		
		// Diálogo con los jueces
		if (nivelDosDialogActive && mazoGolpeado) {
			drawLevelDialog(nivelDosDialog[nivelDosDialogIndex]);
			push(); uiText(14); fill('white'); textAlign(CENTER); 
			text('Presiona ENTER para continuar', width/2, height - 40); pop();
			
			let enterDown = keyIsDown(ENTER);
			let enterPressed = enterDown && !prevEnterDown;
			if (enterPressed) {
				nivelDosDialogIndex++;
				if (nivelDosDialogIndex >= nivelDosDialog.length) {
					nivelDosDialogActive = false;
					// Iniciar el juego breakout
					startBreakoutGame();
				}
			}
			// No actualizar prevEnterDown aquí, se hace al final de nivelDosLoop
		}
	}
	else if (nivelDosPhase === 4) {
		// FASE 4: Minijuego Breakout
		runBreakoutGame();
	}
	else if (nivelDosPhase === 5) {
		// Victoria
		drawVictoryDos();
	}
	else if (nivelDosPhase === 99) {
		// Game Over
		drawGameOverDos();
	}
	
	prevEnterDown = keyIsDown(ENTER);
}

function startBreakoutGame() {
	nivelDosPhase = 4;
	levelTwoProgress = 0;
	levelTwoHealth = 3;
	breakoutQuestionsAnswered = 0;
	breakoutGamePaused = false;
	
	// Mover el piso fuera de la pantalla para que la pelota pueda rebotar
	if (pisoJardin) pisoJardin.pos = {x: -5000, y: -5000};
	
	// Limpiar y ocultar jueces
	for (let juez of juezSprites) {
		if (juez && !juez.removed) juez.remove();
	}
	juezSprites = [];
	
	// Ocultar a Zyro durante el juego
	if (zyro) {
		zyro.pos = {x: -5000, y: -5000};
		zyro.visible = false;
	}
	
	// Crear paddle (libro de leyes)
	if (breakoutPaddle) breakoutPaddle.remove();
	breakoutPaddle = new Sprite(width/2, height - 40, 120, 20, 'k');
	breakoutPaddle.color = '#8B4513'; // Color café como un libro
	breakoutPaddle.rotationLock = true;
	
	// Crear pelota (roja y circular)
	if (breakoutBall) breakoutBall.remove();
	breakoutBall = new Sprite(width/2, height - 70, 12, 'd');
	breakoutBall.diameter = 12; // Hacer circular
	breakoutBall.color = '#FF0000'; // Roja
	breakoutBall.bounciness = 1;
	breakoutBall.friction = 0;
	breakoutBall.vel = {x: 4, y: -6};
	breakoutBall.rotationLock = true;
	
	// Crear bloques (5 filas x 10 columnas = 50 bloques)
	breakoutBlocks = [];
	breakoutQuestionBlocks = [];
	
	let blockWidth = 70;
	let blockHeight = 25;
	let startX = (width - (blockWidth * 10)) / 2;
	let startY = 80;
	let colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
	
	for (let row = 0; row < 5; row++) {
		for (let col = 0; col < 10; col++) {
			let x = startX + col * blockWidth + blockWidth/2;
			let y = startY + row * blockHeight + blockHeight/2;
			let block = new Sprite(x, y, blockWidth - 4, blockHeight - 4, 's');
			block.color = colors[row];
			block.isQuestionBlock = false;
			breakoutBlocks.push(block);
		}
	}
	
	// Seleccionar 10 bloques aleatorios para preguntas
	let availableIndices = [];
	for (let i = 0; i < breakoutBlocks.length; i++) {
		availableIndices.push(i);
	}
	
	for (let i = 0; i < 10; i++) {
		let randomIdx = floor(random(availableIndices.length));
		let blockIdx = availableIndices[randomIdx];
		breakoutBlocks[blockIdx].isQuestionBlock = true;
		breakoutBlocks[blockIdx].color = '#7FFF00'; // Verde manzana para bloques de pregunta
		breakoutBlocks[blockIdx].text = '?';
		breakoutBlocks[blockIdx].textSize = 20;
		breakoutBlocks[blockIdx].textColor = 'white';
		breakoutQuestionBlocks.push(blockIdx);
		availableIndices.splice(randomIdx, 1);
	}
	
	// Resetear preguntas usadas
	questionIndex = 0;
	questionsAsked = []; // Usar el mismo sistema del nivel 1
}

function runBreakoutGame() {
	// Usar el fondo borroso para el minijuego
	if (nivel2BorrosoImg && nivel2BorrosoImg.width > 1) {
		image(nivel2BorrosoImg, 0, 0, width, height);
	} else {
		background(60, 140, 240); // Fondo azul claro de respaldo
	}
	
	if (!breakoutGamePaused) {
		// Control de la paleta (libro) con flechas
		if (keyIsDown(LEFT_ARROW) && breakoutPaddle) {
			breakoutPaddle.x -= 8;
			if (breakoutPaddle.x < breakoutPaddle.width/2) {
				breakoutPaddle.x = breakoutPaddle.width/2;
			}
		}
		if (keyIsDown(RIGHT_ARROW) && breakoutPaddle) {
			breakoutPaddle.x += 8;
			if (breakoutPaddle.x > width - breakoutPaddle.width/2) {
				breakoutPaddle.x = width - breakoutPaddle.width/2;
			}
		}
		
		if (breakoutBall) {
			// Rebote en paredes laterales
			if (breakoutBall.x <= breakoutBall.width/2 || breakoutBall.x >= width - breakoutBall.width/2) {
				breakoutBall.vel.x *= -1;
				// Reducir velocidad en 3 al rebotar en paredes
				let speed = sqrt(breakoutBall.vel.x * breakoutBall.vel.x + breakoutBall.vel.y * breakoutBall.vel.y);
				let newSpeed = max(3, speed - 3);
				let ratio = newSpeed / speed;
				breakoutBall.vel.x *= ratio;
				breakoutBall.vel.y *= ratio;
			}
			// Rebote en techo
			if (breakoutBall.y <= breakoutBall.height/2) {
				breakoutBall.vel.y *= -1;
				// Reducir velocidad en 3 al rebotar en techo
				let speed = sqrt(breakoutBall.vel.x * breakoutBall.vel.x + breakoutBall.vel.y * breakoutBall.vel.y);
				let newSpeed = max(3, speed - 3);
				let ratio = newSpeed / speed;
				breakoutBall.vel.x *= ratio;
				breakoutBall.vel.y *= ratio;
			}
		}
		
		// Detección de colisión con la paleta (libro)
		if (breakoutBall && breakoutPaddle && breakoutBall.collides(breakoutPaddle)) {
			// Calcular ángulo de rebote basado en dónde golpeó
			let hitPos = (breakoutBall.x - breakoutPaddle.x) / (breakoutPaddle.width/2);
			breakoutBall.vel.x = hitPos * 5;
			breakoutBall.vel.y = -abs(breakoutBall.vel.y);
			// Incrementar velocidad en 5 con cada rebote en la paleta
			let speed = sqrt(breakoutBall.vel.x * breakoutBall.vel.x + breakoutBall.vel.y * breakoutBall.vel.y);
			let newSpeed = speed + 5;
			let ratio = newSpeed / speed;
			breakoutBall.vel.x *= ratio;
			breakoutBall.vel.y *= ratio;
		}
		
		// Colisión con bloques
		for (let i = breakoutBlocks.length - 1; i >= 0; i--) {
			let block = breakoutBlocks[i];
			if (block && !block.removed && breakoutBall && !breakoutBall.removed) {
				// Usar overlapping para detección más precisa
				if (breakoutBall.overlaps(block)) {
					
					breakoutBall.vel.y *= -1;
					
					if (block.isQuestionBlock) {
						// Bloque de pregunta - pausar y mostrar pregunta
						breakoutGamePaused = true;
						
						// Guardar posición del bloque para regenerarlo
						let blockX = block.x;
						let blockY = block.y;
						let blockW = block.width;
						let blockH = block.height;
						
						// Seleccionar pregunta no usada
						let availableQuestions = [];
						for (let idx = 0; idx < judicialQuestions.length; idx++) {
							if (!questionsAsked.includes(idx)) {
								availableQuestions.push({
									question: judicialQuestions[idx], 
									originalIndex: idx
								});
							}
						}
						
						// Si ya se usaron todas, resetear
						if (availableQuestions.length === 0) {
							questionsAsked = [];
							for (let idx = 0; idx < judicialQuestions.length; idx++) {
								availableQuestions.push({
									question: judicialQuestions[idx], 
									originalIndex: idx
								});
							}
						}
						
						if (availableQuestions.length > 0) {
							let randomIdx = floor(random(availableQuestions.length));
							let selected = availableQuestions[randomIdx];
							currentQuestion = selected.question;
							questionsAsked.push(selected.originalIndex);
						}
						
						// Remover bloque viejo
						if (block && !block.removed) {
							block.remove();
						}
						breakoutBlocks.splice(i, 1);
						
						// Crear nuevo bloque de pregunta en la misma posición
						let newBlock = new Sprite(blockX, blockY, blockW, blockH, 's');
						newBlock.color = '#7FFF00'; // Verde manzana
						newBlock.isQuestionBlock = true;
						newBlock.text = '?';
						newBlock.textSize = 20;
						newBlock.textColor = 'white';
						breakoutBlocks.push(newBlock);
					} else {
						// Bloque normal - solo remover
						if (block && !block.removed) {
							block.remove();
						}
						breakoutBlocks.splice(i, 1);
					}
				}
			}
		}
		
		// Perder vida si la pelota cae al fondo
		if (breakoutBall && breakoutBall.y > height + 20) {
			levelTwoHealth--;
			if (levelTwoHealth <= 0) {
				// Game Over
				cleanupBreakout();
				if (crasheo) crasheo.play();
				nivelDosPhase = 99;
			} else {
				// Resetear pelota
				breakoutBall.x = width/2;
				breakoutBall.y = height - 70;
				breakoutBall.vel = {x: 4, y: -6};
			}
		}
	} // Fin de if (!breakoutGamePaused)
	
	// Dibujar sprites SIEMPRE (incluso si está pausado)
	if (breakoutPaddle && !breakoutPaddle.removed) breakoutPaddle.draw();
	if (breakoutBall && !breakoutBall.removed) breakoutBall.draw();
	for (let block of breakoutBlocks) {
		if (block && !block.removed) block.draw();
	}
	
	// HUD
	push();
	fill(200);
	rect(120, 30, 220, 20, 6);
	fill('#F44336');
	let hw = map(levelTwoHealth, 0, 3, 0, 220);
	rect(120 - 110 + hw/2, 30, hw, 20, 6);
	fill('white'); uiText(14); textAlign(LEFT); 
	text('Vidas: ' + levelTwoHealth, 20, 26);
	
	fill(200);
	rect(width - 140, 30, 220, 20, 6);
	fill('#4CAF50');
	let pw = map(breakoutQuestionsAnswered, 0, 10, 0, 220);
	rect(width - 140 - 110 + pw/2, 30, pw, 20, 6);
	fill('white'); uiText(14); textAlign(RIGHT); 
	text('Preguntas: ' + breakoutQuestionsAnswered + '/10', width - 20, 26);
	pop();
	
	// Mostrar pregunta si está pausado
	if (breakoutGamePaused && currentQuestion) {
		drawQuestionOverlay(currentQuestion);
	}
	
	// Victoria - cuando se responden 10 preguntas correctamente
	if (breakoutQuestionsAnswered >= 10) {
		cleanupBreakout();
		nivelDosPhase = 5; // Fase de victoria
		levelTwoCompleted = true;
	}
}

function cleanupBreakout() {
	if (breakoutBall) {
		breakoutBall.remove();
		breakoutBall = null;
	}
	if (breakoutPaddle) {
		breakoutPaddle.remove();
		breakoutPaddle = null;
	}
	for (let block of breakoutBlocks) {
		if (block && !block.removed) block.remove();
	}
	breakoutBlocks = [];
	breakoutQuestionBlocks = [];
}

function drawGameOverDos() {
	background(0);
	if (zyroMuertoImg) {
		imageMode(CENTER);
		image(zyroMuertoImg, width/2, height/2 - 60, 150, 150);
		imageMode(CORNER);
	}
	fill('#00BCD4');
	textAlign(CENTER);
	uiText(48);
	text('¡Oh no, te cayó todo el peso de la ley!', width/2, height/2 + 120);
	fill('#00BCD4');
	rect(width/2, height - 100, 260, 60, 16);
	fill('white');
	uiText(28);
	text('Reintentar', width/2, height - 92);
	
	if (mouseIsPressed && mouseY > height - 130 && mouseY < height - 70 && 
		mouseX > width/2 - 130 && mouseX < width/2 + 130) {
		// Reiniciar directamente el breakout (fase 4)
		startBreakoutGame();
	}
}

function startCorridorDos() {
	nivelDosPhase = 2;
	nivelDosDialogIndex = 0;
	nivelDosDialogActive = true; // Activar diálogo inmediatamente
	
	// Reposicionar guía
	if (nivelDosGuide && nivelDosGuide.remove) {
		nivelDosGuide.remove();
	}
	nivelDosGuide = new Sprite(width - 170, height - 120, 60, 150, 's');
	nivelDosGuide.image = guiaFemmImg;
	nivelDosGuide.scale = 0.22;
	
	// Diálogo extenso sobre la Suprema Corte
	nivelDosDialog = [
		{ who: 'guia', text: 'Este es el edificio de la Suprema Corte de Justicia.' },
		{ who: 'guia', text: 'Aquí trabaja el Poder Judicial de la Nación.' },
		{ who: 'zyro', text: '¿Y qué hace el Poder Judicial?' },
		{ who: 'guia', text: 'Su función principal es interpretar y aplicar la Constitución.' },
		{ who: 'guia', text: 'Resuelven controversias constitucionales y protegen derechos fundamentales.' },
		{ who: 'zyro', text: '¿Quiénes trabajan aquí?' },
		{ who: 'guia', text: 'La Suprema Corte está integrada por 11 ministros.' },
		{ who: 'guia', text: 'Son nombrados por el Presidente y aprobados por el Senado.' },
		{ who: 'zyro', text: '¿Cuánto tiempo trabajan aquí?' },
		{ who: 'guia', text: 'Cada ministro dura 15 años en su cargo.' },
		{ who: 'guia', text: 'Es un cargo muy importante y duradero.' },
		{ who: 'zyro', text: '¿Qué tipo de casos resuelven?' },
		{ who: 'guia', text: 'Resuelven conflictos entre poderes del Estado.' },
		{ who: 'guia', text: 'También pueden declarar leyes inconstitucionales.' },
		{ who: 'guia', text: 'Y atienden juicios de amparo para proteger derechos.' },
		{ who: 'zyro', text: 'Suena muy poderoso.' },
		{ who: 'guia', text: 'Es el máximo tribunal del país.' },
		{ who: 'guia', text: 'Su símbolo es la balanza, que representa la justicia.' },
		{ who: 'guia', text: 'Bueno, el tour ha terminado.' },
		{ who: 'guia', text: 'Te dejaré entrar a la sala. ¡Buena suerte!' }
	];
}

function startSalaJueces() {
	nivelDosPhase = 3;
	nivelDosDialogIndex = 0;
	nivelDosDialogActive = true; // Activar diálogo inicial
	mazoGolpeado = false;
	
	// Quitar suelo en fase 3
	if (pisoJardin) pisoJardin.pos = {x: -5000, y: -5000};
	
	// Posicionar a Zyro a la izquierda (más abajo sin suelo)
	zyro.pos = { x: 80, y: height - 80 };
	
	// Diálogo inicial de Zyro al entrar
	nivelDosDialog = [
		{ who: 'zyro', text: 'Ooooohhh... muy elegante, veo que hay ministros aquí, pero mira ese mazo...' }
	];
	
	// Crear sprite del mazo (95px más abajo y 110px a la izquierda del centro)
	if (gavelSprite) gavelSprite.remove();
	gavelSprite = new Sprite(width/2 - 110, height/2 + 95, 60, 60, 's');
	gavelSprite.rotationLock = true;
	// Si hay imagen de mazo, usarla
	if (gavelImg && gavelImg.width > 1) {
		gavelSprite.image = gavelImg;
		gavelSprite.scale = 0.15;
	} else {
		gavelSprite.color = color(139, 69, 19); // Color café/marrón por defecto
	}
}

function crearJueces() {
	// Limpiar jueces anteriores
	for (let juez of juezSprites) {
		if (juez && !juez.removed) juez.remove();
	}
	juezSprites = [];
	
	// Remover el sprite del mazo
	if (gavelSprite) {
		gavelSprite.remove();
		gavelSprite = null;
	}
	
	// Crear 3 jueces: 1 a la izquierda (bloqueando salida), 2 a la derecha
	let colors = ['#C8A882', '#BFA078', '#B8986E']; // Tonos cappuccino/café claro
	
	// Juez 1: Izquierda (bloqueando salida)
	let juez1 = new Sprite(150, height - 100, 's');
	juez1.w = 100;
	juez1.h = 200;
	juez1.color = colors[0];
	if (magistrada1Img && magistrada1Img.width > 1) {
		juez1.image = magistrada1Img;
		juez1.scale = 0.3; // Ajustar escala si es necesario
	}
	juezSprites.push(juez1);
	
	// Juez 2: Derecha centro (confrontando a Zyro)
	let juez2 = new Sprite(width - 200, height - 100, 's');
	juez2.w = 100;
	juez2.h = 200;
	juez2.color = colors[1];
	if (magistrada2Img && magistrada2Img.width > 1) {
		juez2.image = magistrada2Img;
		juez2.scale = 0.3;
	}
	juezSprites.push(juez2);
	
	// Juez 3: Derecha más alejado
	let juez3 = new Sprite(width - 350, height - 100, 's');
	juez3.w = 100;
	juez3.h = 200;
	juez3.color = colors[2];
	if (magistrada3Img && magistrada3Img.width > 1) {
		juez3.image = magistrada3Img;
		juez3.scale = 0.3;
	}
	juezSprites.push(juez3);
	
	// Iniciar diálogo con los jueces sobre la piña en la pizza
	nivelDosDialog = [
		{ who: 'juez', text: '¡Alto ahí! ¿Quién se atreve a golpear el mazo sagrado?' },
		{ who: 'zyro', text: 'Eh... yo solo quería...' },
		{ who: 'juez', text: '¿Tú eres el que quiere reformar la ley que prohíbe la piña en la pizza?' },
		{ who: 'zyro', text: '¿Qué? No, yo...' },
		{ who: 'juez', text: '¡Nosotros AMAMOS la pizza hawaiana!' },
		{ who: 'juez', text: 'Si quieres cambiar esa ley, tendrás que demostrarnos tu conocimiento.' },
		{ who: 'zyro', text: 'Pero yo no quiero cambiar ninguna ley de pizza...' },
		{ who: 'juez', text: '¡Silencio! Te desafiamos a un juego.' },
		{ who: 'juez', text: 'Toma este libro de leyes. Lo usarás como plataforma.' },
		{ who: 'juez', text: 'Deberás romper los bloques y responder preguntas.' },
		{ who: 'juez', text: '¡Que comience el juicio!' }
	];
	nivelDosDialogActive = true;
	nivelDosDialogIndex = 0;
}

function drawVictoryDos() {
	// Fondo azul claro (gradiente)
	for (let i = 0; i < height; i++) {
		let inter = map(i, 0, height, 0, 1);
		let c = lerpColor(color(135, 206, 250), color(173, 216, 230), inter);
		stroke(c);
		line(0, i, width, i);
	}
	noStroke();
	
	fill('white');
	textAlign(CENTER);
	uiText(48);
	text('¡Felicidades!', width/2, height/2 - 100);
	uiText(32);
	text('Los ministros te otorgan el mazo de la justicia', width/2, height/2 - 40);
	
	// Mostrar el mazo como trofeo
	if (trofeoMazo) {
		imageMode(CENTER);
		image(trofeoMazo, width/2, height/2 + 40, 80, 80);
		imageMode(CORNER);
	} else {
		// Dibujar mazo placeholder
		push();
		fill(139, 69, 19);
		rect(width/2, height/2 + 40, 60, 60);
		pop();
	}
	
	uiText(24);
	fill('#FFD700');
	text('🚁 Un helicóptero te llevará de regreso 🚁', width/2, height/2 + 120);
	fill('white');
	uiText(20);
	text('Presiona ENTER para regresar', width/2, height - 60);
	
	if (enterBuffer > 0) {
		enterBuffer = 0;
		if (!completedLevels.includes(1)) completedLevels.push(1);
		levelTwoCompleted = true;
		returnToGarden();
	}
}

// ==================== NIVEL TRES - STUB ====================
function startNivelTres() {
	nivelTresPhase = 1;
}

function nivelTresLoop() {
	background(200, 100, 100);
	fill('white');
	textAlign(CENTER);
	text('Nivel 3 en construcción', width/2, height/2);
}

// ==================== HELPER FUNCTIONS ====================
function returnToGarden() {
	// Limpiar objetos del nivel
	for (let obj of minigameFalling) {
		if (obj && !obj.removed) obj.remove();
	}
	minigameFalling = [];
	
	// Resetear fase del juego
	screen = 2;
	nivelUnoPhase = 0;
	nivelDosPhase = 0;
	nivelTresPhase = 0;
	awaitingQuestion = false;
	currentQuestion = null;
	
	// Reposicionar personajes - Zyro MÁS A LA IZQUIERDA para que pueda acercarse
	zyro.pos = { x: 150, y: height - 160 }; // Más cerca de otroAlien
	zyro.vel = {x: 0, y: 0};
	zyro.scale = 0.7;
	zyro.image = zyroIdle;
	zyro.visible = true;
	zyro.opacity = 1; // Asegurar que sea visible
	zyro.physics = 'd'; // Restaurar física dinámica
	zyro.collider = 'd'; // Restaurar collider dinámico
	
	otroAlien.pos = { x: width - 200, y: height - 150 };
	otroAlien.visible = true;
	otroAlien.opacity = 1;
	
	// Restaurar el suelo en el jardín
	if (pisoJardin) pisoJardin.pos = {x: width/2, y: height - 65};
	
	// IMPORTANTE: Activar el flag de diálogo de regreso
	showReturnDialog = true;
	returnDialogIndex = 0;
	
	// NO crear cajas de niveles inmediatamente - esperar al diálogo
	levelBoxes = [];
}

function keyPressed(){
	// NIVEL 1
	if (nivelUnoPhase === 4 && awaitingQuestion && currentQuestion) {
		let answer = -1;
		
		if (keyCode === 49 || key === '1') answer = 0;
		if (keyCode === 50 || key === '2') answer = 1;
		if (keyCode === 51 || key === '3') answer = 2;
		if (keyCode === 52 || key === '4') answer = 3;
		
		if (answer >= 0 && answer < 4) {
			if (answer === currentQuestion.correct) {
				levelOneProgress = min(10, levelOneProgress + 1);
			} else {
				levelOneHealth -= 1;
				
				if (levelOneHealth <= 0) {
					for (let obj of minigameFalling) {
						obj.remove();
					}
					minigameFalling = [];
					if (zyro) zyro.pos = {x: -5000, y: -5000};
					if (crasheo) crasheo.play();
					nivelUnoPhase = 99;
				}
			}
			
			awaitingQuestion = false;
			currentQuestion = null;
			return false;
		}
	}
	
	// NIVEL 2 - Breakout
	if (nivelDosPhase === 4 && breakoutGamePaused && currentQuestion) {
		let answer = -1;
		
		if (keyCode === 49 || key === '1') answer = 0;
		if (keyCode === 50 || key === '2') answer = 1;
		if (keyCode === 51 || key === '3') answer = 2;
		if (keyCode === 52 || key === '4') answer = 3;
		
		if (answer >= 0 && answer < 4) {
			if (answer === currentQuestion.correct) {
				// Respuesta correcta - incrementar progreso
				breakoutQuestionsAnswered++;
			} else {
				// Respuesta incorrecta - quitar vida
				levelTwoHealth--;
				if (levelTwoHealth <= 0) {
					cleanupBreakout();
					if (crasheo) crasheo.play();
					nivelDosPhase = 99;
				}
			}
			
			breakoutGamePaused = false;
			currentQuestion = null;
			return false;
		}
	}
}