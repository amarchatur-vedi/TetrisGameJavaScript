document.addEventListener('DOMContentLoaded', () =>{
    const grid = document.querySelector('.grid');
    let squares =Array.from(document.querySelectorAll('.grid div '));
    const scoreDisplay = document.querySelector('#score');
    const startBtn = document.querySelector('#start-button');
    const width = 10 ;
    let nextRandom = 0;
    let timerId;


  //The Tetrominoes
  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2]
  ]

  const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1]
  ]

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1]
  ]

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
  ]

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
  ]

  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

  random = Math.floor(Math.random()*5);//3
  currentRotation = 0;
  let current = theTetrominoes[random][currentRotation];

  //move the Tetromino moveDown
  let currentPosition = 4;


  function control(e){
      if(e.keyCode === 37){
        moveLeft();
      }
      if(e.keyCode === 38){
        rotate();
      }
      if(e.keyCode === 39){
        moveRight();
      }
      if(e.keyCode === 40){
        moveDown();
      }
  }

  document.addEventListener('keyup',control);

   //draw the shape
   function draw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tetromino');
    });
  }

  
  //Add event Listener on Start button to start the game
  startBtn.addEventListener('click', pauseGame);

  let j=1;
  let temp;

  //function to pause the Game
  function pauseGame(){
    if(j===0){
    clearInterval(temp);
    j=1;
  } else{
    temp = setInterval(moveDown,500);
      j=0;
     }
      
  }

  //move tetrise down

    function moveDown(){
      unDraw();
      currentPosition+=width;
      draw(); 
      freez();
      addScore();
  }

  function unDraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tetromino');
    });
  }


  function freez(){
      if(current.some(index => squares[currentPosition+index+width].classList.contains('taken'))){
          current.forEach(index => squares[currentPosition+index].classList.add('taken'));
          random = nextRandom;//3
          nextRandom = Math.floor(Math.random()*5);//3
          current = theTetrominoes[random][currentRotation];//[3][0]
          currentPosition=4;    
          draw();
          smallShape();
          gameOver();
      }
  }

  function moveLeft(){
      unDraw();
      const isAtLeftEdge = current.some(index => (currentPosition + index)%width === 0);

      if(!isAtLeftEdge) currentPosition-=1;

      if(current.some(index => squares[currentPosition+index+width].classList.contains('taken'))){
          currentPosition+=1;
      }
      draw();
  }

  function moveRight(){
    unDraw();
    const isAtLeftEdge = current.some(index => (currentPosition + index)%width === width-1);

    if(!isAtLeftEdge) currentPosition+=1;

    if(current.some(index => squares[currentPosition+index+width].classList.contains('taken'))){
        currentPosition-=1;
    }
    draw();
}

//rotate function

function rotate(){
    unDraw();
    currentRotation++;
    if(currentRotation === 4){
        currentRotation = 0;
    }
    current = theTetrominoes[random][currentRotation];
    draw();
}

const smallSquares = document.querySelectorAll(".small-grid div");
const smallWidth = 4;
let smallIndex = 0;

const upNextTetrominoes = [
  [1, smallWidth + 1, smallWidth * 2 + 1, 2],
  [0, smallWidth, smallWidth + 1, smallWidth * 2 + 1],
  [1, smallWidth, smallWidth + 1, smallWidth + 2],
  [0, 1, smallWidth, smallWidth + 1],
  [1, smallWidth + 1, smallWidth * 2 + 1, smallWidth * 3 + 1],
];

function smallShape(){
  smallSquares.forEach(square => square.classList.remove('tetromino'));
  upNextTetrominoes[nextRandom].forEach(index =>{
    smallSquares[smallIndex + index].classList.add('tetromino');
  });
};

let score = parseInt(document.getElementById('score').innerHTML);

function addScore(){
  for(i = 0; i < 199; i+=width){
    const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];
    if(row.every(index => squares[index].classList.contains('taken'))){
      score+=10;
      document.getElementById('score').innerHTML = score;
      row.forEach(index => {
        squares[index].classList.remove('taken');
        squares[index].classList.remove('tetromino');
      });
    const removedSquare = squares.splice(i, width);
    squares = removedSquare.concat(squares);
    squares.forEach((cell) => {
      grid.appendChild(cell);
    });
    }
  }
}

function gameOver(){
  if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
  document.getElementById('score').innerHTML = 'end';
  current.forEach(index => squares[currentPosition + index].classList.add('end'))
  clearInterval(temp);
  }
}

});