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

}


new Phaser.Game(config);





// Variables


//let pipeVerticalDistance = Phaser.Math.Between(...pipeDistanceRange);

//to = 0 px/s
//t1 = 200 px/s
//t2 = 400 px/s
//t3 = 600 px/s

//60fps
//60fps *16ms = 1000 ms


// if bird position x is sam eor larger than width of canvas go back to the left.
// if bird position x is smaller or equal to 0 then move back to the right.

// if bird y position is small than 0 or greater than height of the canvas
// aler "you lose!"



//...

