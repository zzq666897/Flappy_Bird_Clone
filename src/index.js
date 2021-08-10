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
    default:'arcade'
  },

  scene:
  {
      preload,
      create,
     // update: update

  }

}


//loading assets such as images, music animations etc.
function preload()
{
    //'this' cintext - scene
    //contains functions and properties we can use
    
    this.load.image('sky','assets/sky.png');
}



function create()
{
     //x - 400

     //y - 300

     //key of the image

     //this.add.image(config.width / 2, config.height / 2,'sky');

     this.add.image(0, 0,'sky').setOrigin(0,0);
     this.add.sprite(config.width / 2, config.height / 2, 'bird').setOrigin(0);
}

//...

new Phaser.Game(config);