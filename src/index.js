import Phaser from 'phaser';


// setup the screen size

const config =
{
  // WebGL Web Graphics Lib JS api for rendering 2D and 3D graphics
  
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics:
  {
    //Arcade physics plugin, manages physics simulation
    default:'arcade',
   
    arcade:
    {
       debug:true,        // add debug ray to the object with gravity
       gravity: {y:400}  // gravity according y direction
    }

  },

  scene:
  {
      preload,
      create,
      update
     // update: update

  }

}


//loading assets such as images, music animations etc.
function preload()
{
    //'this' cintext - scene
    //contains functions and properties we can use
    
    this.load.image('sky','assets/sky.png');
    this.load.image('bird', 'assets/bird.png');
}


// Variables
const VELOCITY = 200;

let bird = null;
let totalDelta = null;
let flapVelocity = 300;


function create()
{
     //x - 400

     //y - 300

     //key of the image

     //this.add.image(config.width / 2, config.height / 2,'sky');

     this.add.image(0, 0,'sky').setOrigin(0,0);
    
     // place sprite on certain position ans set the origin of it.
     bird = this.physics.add.sprite(config.width / 10, config.height / 2, 'bird').setOrigin(0);

    // bird.body.gravity.y = 200;

    // bird.body.velocity.x = VELOCITY;

    this.input.on('pointerdown', flap);

    this.input.keyboard.on('keydown-SPACE', flap);


     debugger
}

//to = 0 px/s
//t1 = 200 px/s
//t2 = 400 px/s
//t3 = 600 px/s

//60fps
//60fps *16ms = 1000 ms


// if bird position x is sam eor larger than width of canvas go back to the left.
// if bird position x is smaller or equal to 0 then move back to the right.

function update(time,delta)
{
  // totalDelta += delta;

  limitSpriteMovement();

}

function flap()
{
   bird.body.velocity.y = -flapVelocity;
}

function limitSpriteMovement()
{
  if(bird.x >= config.width - bird.width)
  {
     bird.body.velocity.x = -VELOCITY;
  }
  
  else if(bird.x <= 0)
  {
    bird.body.velocity.x = VELOCITY;
  }
   
}

//...

new Phaser.Game(config);