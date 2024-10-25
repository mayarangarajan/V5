// Variables
let gameTime; // Duration
let totalTargets = 0; // # of targets
let targetsClicked = 0; // # of targets clicked
let missedTargets = 0; // # of targets missed
let targetInterval = null; // Creates targets
let gameTimer = null; // Game timer
let remainingTime = gameTime; // Remaining time

// Start button, event listener
const startButton = document.getElementById('startGame');
startButton.addEventListener('click', startGame);

// Scoreboard elements
const totalTargetsDisplay = document.getElementById('totalTargets');
const targetsClickedDisplay = document.getElementById('targetsClicked');
const missedTargetsDisplay = document.getElementById('missedTargets');
const finalScoreDisplay = document.getElementById('finalScore');
const scoreboard = document.getElementById('scoreboard');
const gameArea = document.getElementById('gameArea');

/**
 * Starts the game.
 * @returns The UID of the {@link setTimeout game loop timeout}.
 */
function startGame() {
	console.log('Starting game...');
	resetGame(); // Resets the current game, if it exists
	gameTime = Number.parseInt(document.getElementById('gameTimeInput').value); // get the configured game time option

	// in case they say game time is less than 0, (shouldnt happen because of `min` attribute)
	// if (Number.isNaN(gameTime) || gameTime <= 0) {
	// 	alert('Please enter a valid game time.');
	// 	return;
	// }

	targetInterval = window.setInterval(spawnTarget, 1500);
	gameTimer = window.setInterval(updateTimer, 1000);
	return window.setTimeout(endGame, gameTime * 1000);
}

/**
 * Creates a target in a random position in {@link gameArea the game area}.
 */
function spawnTarget() {
	// Create a target
	totalTargets++;
	const target = document.createElement('div');
	target.classList.add('target', 'absolute', 'transition-transform');
	target.style.backgroundColor = 'red'; // target color
	target.style.width = '20px'; // target width
	target.style.height = '20px'; // target height

	// Randomizing target locations (dynamically)
	const gameAreaRect = gameArea.getBoundingClientRect();
	const x = Math.random() * (gameAreaRect.width - 50); // randomizes between 50 and x (game area - 50)
	const y = Math.random() * (gameAreaRect.height - 50); // randomizes between 50 and y (game area - 50)
	target.style.transform = `translate(${x}px, ${y}px) scale(1)`; // keep it at the original scale, and position it in the random position

	// Removing a target once clicked and adding it to makes
	target.addEventListener('click', () => {
		targetsClicked++;
		target.remove();
	});

	const animation = target.animate([
		{ transform: `translate(${x}px, ${y}px) scale(1)` },
		{ transform: `translate(${x}px, ${y}px) scale(4)` },
		{ transform: `translate(${x}px, ${y}px) scale(1)` },
	], {
		duration: 2000,
		easing: 'ease-in-out',
		fill: 'forwards',
	});

	animation.addEventListener('finish', () => {
		if (document.body.contains(target)) {
			missedTargets++;
			target.remove();
		}
	});

	console.log(`Spawning a target @ (${x}, ${y})`, target);
	gameArea.appendChild(target);
}

// Resetting Game
function resetGame() {
	console.log('Resetting game.')
	totalTargets = 0;
	targetsClicked = 0;
	missedTargets = 0;
	clearTargets();

	// Resetting Time
	remainingTime = gameTime;
	scoreboard.classList.add('hidden');
	document.getElementById('timerDisplay').textContent = `Time left: ${remainingTime}s`;
}

// Ending Games
function endGame() {
	console.log('Ending the game...', gameArea);
	if (targetInterval)
		clearInterval(targetInterval);
	if (gameTimer)
		clearInterval(gameTimer);
	clearTargets();
	document.getElementById('endGameAudio').play();
	displayScore();
}

// Clearing targets
function clearTargets() {
	console.log('Clearing targets...', gameArea);
	gameArea.innerHTML = '';
}

// Updating Timer Throughout Game
function updateTimer() {
	remainingTime--;
	document.getElementById('timerDisplay').textContent = `Time left: ${remainingTime}s`;

	// Ending Timer
	if (remainingTime <= 0)
		clearInterval(gameTimer);
}

// Score display
function displayScore() {
	totalTargetsDisplay.textContent = `Total targets: ${totalTargets}`;
	targetsClickedDisplay.textContent = `Targets clicked: ${targetsClicked}`;
	missedTargetsDisplay.textContent = `Missed targets: ${missedTargets}`;
	finalScoreDisplay.textContent = `Final score (out of 100): ${calculateScore()}`;
	scoreboard.classList.remove('hidden');
}

// Score Calculation
function calculateScore() {
	return Math.floor((100 * targetsClicked / totalTargets));
}