// SCENES
let currentScene = "welcome"

let playerOnePaddleY = 200
let playerTwoPaddleY = 200

let ballX = 400
let ballY = 400
let ballXSpeed = -3
let ballYSpeed = 2

let playerOneScore = 0
let playerTwoScore = 0

// Pixel monsters
let monsterOneY = 60
let monsterTwoY = 60

let monsterSpeedOne = 1.2
let monsterSpeedTwo = 1.5

let monsterTop = 30
let monsterBottom = 90

let resultMonsterY = 120
let resultMonsterSpeed = 2

// ball trail
let trailLength = 20
let trailX = new Array(trailLength)
let trailY = new Array(trailLength)

// press to move
let wPressed = false
let sPressed = false
let oPressed = false
let kPressed = false

// Welcome monsters
let welcomeMonsterY = 230
let welcomeMonsterSpeed = 1.5

// ballSpeedControl
let maxSpeed = 8
let speedIncrease = 0.4

function setup() {
  const c = createCanvas(800, 800)
  c.parent("sketch-holder")

  for (let i = 0; i < trailLength; i++) {
    trailX[i] = ballX
    trailY[i] = ballY
  }
}

function draw() {
  fill(0, 40)
  noStroke()
  rect(0, 0, width, height)

  if (currentScene === "welcome") runWelcome()
  if (currentScene === "game") runGame()
  if (currentScene === "results") runResults()
}

// WELCOME
function runWelcome() {
  drawEdgePixels()
  updateWelcomeMonsters()
  displayWelcome()
  handleWelcomeInput()
}

function displayWelcome() {
  fill(255)
  textSize(30)
  text("Hi! Welcome!", 330, 180)

  noFill()
  stroke(255)
  rect(315, 450, 200, 100, 20)

  noStroke()
  fill(255)
  text("PLAY", 385, 510)

  push()
  translate(340, welcomeMonsterY + 60)
  scale(2)
  drawPixelMonster(0, 0)
  pop()

  push()
  translate(440, welcomeMonsterY + 60)
  scale(2)
  drawPixelMonster(0, 0)
  pop()
}

function handleWelcomeInput() {
  const isWithinX = mouseX > 315 && mouseX < 515
  const isWithinY = mouseY > 450 && mouseY < 550

  if (isWithinX && isWithinY && mouseIsPressed) {
    currentScene = "game"
    resetBall()
  }
}

// GAME
function runGame() {
  displayGame()
  handleGameInput()
  handleScoring()
  updateBall()
  updateMonsters()
}

function displayGame() {
  fill(255)
  noStroke()
  rect(100, playerOnePaddleY, 20, 150)
  rect(700, playerTwoPaddleY, 20, 150)

  for (let i = 0; i < trailLength; i++) {
    const alpha = map(i, 0, trailLength - 1, 20, 180)
    fill(0, 255, 120, alpha)
    square(trailX[i], trailY[i], 10)
  }

  fill(255)
  square(ballX, ballY, 10)

  stroke(255, 120)
  fill(255, 100)
  for (let i = 0; i < 17; i++) rect(400, i * 50, 10, 30)

  noStroke()
  fill(255)
  textSize(30)
  text(playerOneScore, 150, 50)
  text(playerTwoScore, 650, 50)

  drawPixelMonster(200, monsterOneY)
  drawPixelMonster(582, monsterTwoY)
}

function handleGameInput() {
  if (wPressed) playerOnePaddleY -= 6
  if (sPressed) playerOnePaddleY += 6

  if (oPressed) playerTwoPaddleY -= 6
  if (kPressed) playerTwoPaddleY += 6

  playerOnePaddleY = constrain(playerOnePaddleY, 0, height - 150)
  playerTwoPaddleY = constrain(playerTwoPaddleY, 0, height - 150)
}

// BALL
function updateBall() {
  for (let i = 0; i < trailLength - 1; i++) {
    trailX[i] = trailX[i + 1]
    trailY[i] = trailY[i + 1]
  }
  trailX[trailLength - 1] = ballX
  trailY[trailLength - 1] = ballY

  ballX += ballXSpeed
  ballY += ballYSpeed

  if (ballY > height || ballY < 0) ballYSpeed = -ballYSpeed

  const hitP1 =
    ballX < 120 && ballX > 100 &&
    ballY > playerOnePaddleY &&
    ballY < playerOnePaddleY + 150

  const hitP2 =
    ballX < 710 && ballX > 690 &&
    ballY > playerTwoPaddleY &&
    ballY < playerTwoPaddleY + 150

  if (hitP1) {
    ballXSpeed = abs(ballXSpeed) + speedIncrease
    ballXSpeed = min(ballXSpeed, maxSpeed)
  }

  if (hitP2) {
    ballXSpeed = -abs(ballXSpeed) - speedIncrease
    ballXSpeed = max(ballXSpeed, -maxSpeed)
  }
}

// SCORE
function handleScoring() {
  if (ballX < 0) {
    playerTwoScore++
    resetBall()
  }

  if (ballX > width) {
    playerOneScore++
    resetBall()
  }

  if (playerOneScore === 3 || playerTwoScore === 3) {
    currentScene = "results"
  }
}

function resetBall() {
  ballX = 400
  ballY = 400
  ballXSpeed = random([ -3, 3 ])
  ballYSpeed = random([ -2, 2 ])
  if (ballYSpeed === 0) ballYSpeed = 2

  for (let i = 0; i < trailLength; i++) {
    trailX[i] = ballX
    trailY[i] = ballY
  }
}

// RESULTS
function runResults() {
  drawEdgePixels()

  fill(255)
  textSize(30)

  if (playerOneScore === 3) text("PLAYER ONE WINS!!!", 280, 400)
  else text("PLAYER TWO WINS!!!", 280, 400)

  noFill()
  stroke(255)
  rect(255, 430, 300, 100, 10)

  noStroke()
  fill(255)
  text("PLAY AGAIN?", 325, 490)

  updateResultMonster()
  drawHappyMonster(352, resultMonsterY + 90)

  handleResultsInput()
}

function handleResultsInput() {
  const isWithinX = mouseX > 250 && mouseX < 550
  const isWithinY = mouseY > 430 && mouseY < 530

  if (isWithinX && isWithinY && mouseIsPressed) {
    currentScene = "game"
    playerOneScore = 0
    playerTwoScore = 0
    resetBall()
  }
}

// KEY INPUT
function keyPressed() {
  if (key === "w" || key === "W") wPressed = true
  if (key === "s" || key === "S") sPressed = true
  if (key === "o" || key === "O") oPressed = true
  if (key === "k" || key === "K") kPressed = true
}

function keyReleased() {
  if (key === "w" || key === "W") wPressed = false
  if (key === "s" || key === "S") sPressed = false
  if (key === "o" || key === "O") oPressed = false
  if (key === "k" || key === "K") kPressed = false
}

function updateMonsters() {
  monsterOneY += monsterSpeedOne
  monsterTwoY += monsterSpeedTwo

  if (monsterOneY < monsterTop || monsterOneY > monsterBottom) {
    monsterSpeedOne = -monsterSpeedOne
  }

  if (monsterTwoY < monsterTop || monsterTwoY > monsterBottom) {
    monsterSpeedTwo = -monsterSpeedTwo
  }
}

function drawPixelMonster(x, y) {
  noStroke()

  fill(0, 255, 120)
  rect(x, y, 8, 8)
  rect(x + 8, y, 8, 8)
  rect(x + 16, y, 8, 8)

  rect(x, y + 8, 8, 8)
  rect(x + 8, y + 8, 8, 8)
  rect(x + 16, y + 8, 8, 8)
  rect(x + 8, y + 16, 8, 8)

  fill(0)
  rect(x + 4, y + 4, 3, 3)
  rect(x + 16, y + 4, 3, 3)
}

function updateResultMonster() {
  resultMonsterY += resultMonsterSpeed
  if (resultMonsterY < 100 || resultMonsterY > 160) {
    resultMonsterSpeed = -resultMonsterSpeed
  }
}

function drawHappyMonster(x, y) {
  const s = 32
  noStroke()

  fill(0, 255, 120)
  rect(x, y, s, s)
  rect(x + s, y, s, s)
  rect(x + s * 2, y, s, s)

  rect(x, y + s, s, s)
  rect(x + s, y + s, s, s)
  rect(x + s * 2, y + s, s, s)

  rect(x + s, y + s * 2, s, s)

  fill(0)
  textSize(28)
  text(">", x + s * 0.4, y + s * 1.5)
  text("<", x + s * 1.9, y + s * 1.5)
}

function drawEdgePixels() {
  noStroke()

  for (let i = 0; i < 25; i++) {
    const size = random(6, 12)
    const side = int(random(4))

    let x = 0
    let y = 0

    if (side === 0) {
      x = random(width)
      y = random(80)
    }
    if (side === 1) {
      x = random(width)
      y = random(height - 80, height)
    }
    if (side === 2) {
      x = random(80)
      y = random(height)
    }
    if (side === 3) {
      x = random(width - 80, width)
      y = random(height)
    }

    fill(0, 255, 120, random(10, 100))
    rect(x, y, size, size)
  }
}

function updateWelcomeMonsters() {
  welcomeMonsterY += welcomeMonsterSpeed
  if (welcomeMonsterY < 210 || welcomeMonsterY > 250) {
    welcomeMonsterSpeed = -welcomeMonsterSpeed
  }
}
