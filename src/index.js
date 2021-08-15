import Phaser from 'phaser';
import PlayScene from './scenes/PlayScene';


// setup the screen size
const WIDTH = 800;
const HEIGHT = 600;
const BIRD_POSTION = {x: WIDTH * 0.1, y: HEIGHT/2};

const SHARED_CONFIG = 
{
  width: WIDTH,
  height: HEIGHT,
  startPosition: BIRD_POSTION
}

const config =
{
  // WebGL Web Graphics Lib JS api for rendering 2D and 3D graphics
  
  type: Phaser.AUTO,
  
   ...SHARED_CONFIG,

  physics:
  {
    //Arcade physics plugin, manages physics simulation
    default:'arcade',
   
    arcade:
    {
       debug:true,        // add debug ray to the object with gravity
     //  gravity: {y:400}  // gravity according y direction to global all objects
    }

  },

  scene:[new PlayScene(SHARED_CONFIG)]
  // {
  //     preload,
  //     create,
  //     update
  //    // update: update

  // }

}


//loading assets such as images, music animations etc.
function preload()
{
    //'this' cintext - scene
    //contains functions and properties we can use
    
    this.load.image('sky','assets/sky.png');
    this.load.image('bird', 'assets/bird.png');
    this.load.image('pipe', 'assets/pipe.png');
}


// Variables
const VELOCITY = 200;

let bird = null;
let pipes = null;



let pipeHorizontalDistance = 0;

const PIPES_RENDER = 4;

const initialBirdPosition = {x: config.width / 10, y: config.height / 2};

let flapVelocity = 300;

const pipeDistanceRange = [150, 250];
const pipeHorizontalDistanceRange = [100,150];

//let pipeVerticalDistance = Phaser.Math.Between(...pipeDistanceRange);

function create()
{

     this.add.image(0, 0,'sky').setOrigin(0,0);
     

     // place sprite on certain position ans set the origin of it.
     bird = this.physics.add.sprite(initialBirdPosition.x, initialBirdPosition.y, 'bird').setOrigin(0);
     bird.body.gravity.y = 400;

     pipes = this.physics.add.group();


     for(let i = 0; i < PIPES_RENDER; i ++)
    
     {
       const upperPipe = pipes.create (0,0,'pipe').setOrigin(0,1);
       const lowerPipe = pipes.create (0,0,'pipe').setOrigin(0,0);
      
      PlacePipes(upperPipe,lowerPipe);
   
     }

     pipes.setVelocityX(-200);


    // bird.body.gravity.y = 200;

    // bird.body.velocity.x = VELOCITY;

    this.input.on('pointerdown', flap);

    this.input.keyboard.on('keydown-SPACE', flap);


     //debugger
}

//to = 0 px/s
//t1 = 200 px/s
//t2 = 400 px/s
//t3 = 600 px/s

//60fps
//60fps *16ms = 1000 ms




function update(time,delta)
{
  // totalDelta += delta;

  limitSpriteMovement();

  recyclePipes();

}

function flap()
{
   bird.body.velocity.y = -flapVelocity;
}








// if bird position x is sam eor larger than width of canvas go back to the left.
// if bird position x is smaller or equal to 0 then move back to the right.

// if bird y position is small than 0 or greater than height of the canvas
// aler "you lose!"


function limitSpriteMovement()
{
  // if(bird.x >= config.width - bird.width)
  // {
  //    bird.body.velocity.x = -VELOCITY;
  // }
  
  // else if(bird.x <= 0)
  // {
  //   bird.body.velocity.x = VELOCITY;
  // }

  if(bird.y > config.height || bird.y < 0)
  {
    //alert('You Lose!');

    restartPlayerPosition();

    
  }

   
}

function restartPlayerPosition()
{
  bird.x = initialBirdPosition.x;
  bird.y = initialBirdPosition.y;
  bird.body.velocity.y = 0;

}

function PlacePipes(upPipe,lowPipe)
{
  
  for(let i = 0; i < PIPES_RENDER; i ++)
    
  {
    
   //pipeHorizontalDistance += 100;

   const rightMostX = GetRightMostPipe();
         
   const pipeVerticalDistance = Phaser.Math.Between(...pipeDistanceRange);
   const pipeVerticalPosition = Phaser.Math.Between(0 + 20, config.height -20 - pipeVerticalDistance);
   const pipeHorizontalDistance = Phaser.Math.Between(...pipeHorizontalDistanceRange);

   upPipe.x = rightMostX + pipeHorizontalDistance;
   upPipe.y = pipeVerticalPosition;
   
   lowPipe.x = upPipe.x
   lowPipe.y = upPipe.y + pipeVerticalDistance;
   
  //  upPipe.body.velocity.x = -200;

  //  lowPipe.body.velocity.x = -200;


  }

}

function recyclePipes()
{
    const tempPipes = [];

    pipes.getChildren().forEach(pipe => 
      {
        if(pipe.getBounds().right <= 0)
        {
            // recycle pipe
            tempPipes.push(pipe);
            if(tempPipes.length == 2)
            {
               PlacePipes(...tempPipes);
            }
        }
    
      })
}

function GetRightMostPipe()
{
  let rightMostX = 0;

  pipes.getChildren().forEach(function(pipe)
  {
    rightMostX = Math.max(pipe.x, rightMostX);
  })
 
   return rightMostX;

}

//...

new Phaser.Game(config);