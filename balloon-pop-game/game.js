const gameArea = document.getElementById("gameArea")
const player = document.getElementById("player")

const scoreText = document.getElementById("score")
const highscoreText = document.getElementById("highscore")

const startBtn = document.getElementById("startBtn")
const restartBtn = document.getElementById("restartBtn")

const startScreen = document.getElementById("startScreen")
const gameOverScreen = document.getElementById("gameOverScreen")

const popSound = document.getElementById("popSound")

let score = 0
let speed = 3
let gameOver = false

let highscore = localStorage.getItem("balloonHighscore") || 0
highscoreText.innerText = "High Score: " + highscore

/* start game */

startBtn.onclick = startGame
restartBtn.onclick = () => location.reload()

function startGame(){

startScreen.style.display="none"

spawnLoop()
difficultyLoop()
cloudLoop()

}

/* mobile movement */

gameArea.addEventListener("touchmove",(e)=>{

let rect = gameArea.getBoundingClientRect()
let x = e.touches[0].clientX - rect.left

player.style.left = x - 20 + "px"

})

/* mouse movement */

gameArea.addEventListener("mousemove",(e)=>{

let rect = gameArea.getBoundingClientRect()
let x = e.clientX - rect.left

player.style.left = x - 20 + "px"

})

/* spawn balloons */

function spawnLoop(){

setInterval(()=>{

if(gameOver) return

createBalloon()

},1000)

}

/* create balloon */

function createBalloon(){

const balloon = document.createElement("div")

balloon.className="balloon"

const type = Math.random()

if(type < 0.7){
balloon.innerHTML="🎈"
balloon.dataset.type="normal"
}
else if(type < 0.9){
balloon.innerHTML="⭐"
balloon.dataset.type="bonus"
}
else{
balloon.innerHTML="💣"
balloon.dataset.type="bomb"
}

let currentTop = -40; // Start slightly above the view to animate smoothly
balloon.style.left=Math.random()*90+"%"
balloon.style.top=currentTop+"px"

gameArea.appendChild(balloon)

balloon.onclick = () => handleBalloonClick(balloon)

let fall = setInterval(()=>{

currentTop += speed;
balloon.style.top = currentTop + "px"

/* catch by player */

if(
currentTop > gameArea.offsetHeight-90 &&
balloon.offsetLeft < player.offsetLeft+50 &&
balloon.offsetLeft+30 > player.offsetLeft
){
handleBalloonClick(balloon)
clearInterval(fall)
}

/* ground hit */

if(currentTop > gameArea.offsetHeight-20){

if (balloon.dataset.type !== "bomb") {
endGame()
} else {
balloon.remove()
}
clearInterval(fall)

}

},30)

}

/* balloon click */

function handleBalloonClick(balloon){

if(balloon.dataset.type === "bomb"){
endGame()
return
}

if(balloon.dataset.type === "bonus"){
score += 50
}
else{
score += 10
}

scoreText.innerText="Score: "+score

popSound.currentTime=0
popSound.play()

createExplosion(balloon)

balloon.remove()

}

/* explosion animation */

function createExplosion(balloon){

let boom = document.createElement("div")

boom.className="explosion"
boom.innerHTML="💥"

boom.style.left=balloon.style.left
boom.style.top=balloon.style.top

gameArea.appendChild(boom)

setTimeout(()=>{

boom.remove()

},400)

}

/* difficulty increase */

function difficultyLoop(){

setInterval(()=>{

speed += 0.5

},5000)

}

/* clouds */

function cloudLoop(){

setInterval(()=>{

const cloud=document.createElement("div")

cloud.className="cloud"
cloud.innerHTML="☁"

cloud.style.left="-50px"
cloud.style.top=Math.random()*200+"px"

gameArea.appendChild(cloud)

let move=setInterval(()=>{

cloud.style.left = cloud.offsetLeft + 1 + "px"

if(cloud.offsetLeft > 500){

cloud.remove()
clearInterval(move)

}

},30)

},4000)

}

/* game over */

function endGame(){

gameOver=true

if(score > highscore){

localStorage.setItem("balloonHighscore",score)

}

gameOverScreen.style.display="block"

}