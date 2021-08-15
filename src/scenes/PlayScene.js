import Phaser from 'phaser';


//variables
const PIPES_RENDER = 4;



class PlayScene extends Phaser.Scene
{
   
  //properties
  constructor(config)
    { 
        super('PlayScene');
        
        this.config = config;

        this.bird = null;

        this.pipes = null;

        this.pipeHorizontalDistance = 0;
        this.pipeDistanceRange = [150, 250];
        this.pipeHorizontalDistanceRange = [100,150];

        this.flapVelocity = 250;
    }

   //loading assets such as images, music animations etc.
   preload()
   {
     this.load.image('sky','assets/sky.png');
     this.load.image('bird', 'assets/bird.png');
     this.load.image('pipe', 'assets/pipe.png');


   }

   create()
   {
      
     this.add.image(0, 0,'sky').setOrigin(0,0);
     

     // place sprite on certain position ans set the origin of it.
     this.bird = this.physics.add.sprite(this.config.startPosition.x, this.config.startPosition.y, 'bird').setOrigin(0);
     this.bird.body.gravity.y = 400; // set bird velocity

     this.pipes = this.physics.add.group();


     for(let i = 0; i < PIPES_RENDER; i ++)
    
     {
       const upperPipe = this.pipes.create (0,0,'pipe').setOrigin(0,1);
       const lowerPipe = this.pipes.create (0,0,'pipe').setOrigin(0,0);
      
      this.PlacePipes(upperPipe,lowerPipe);
   
     }

     this.pipes.setVelocityX(-200);


    // bird.body.gravity.y = 200;

    // bird.body.velocity.x = VELOCITY;

    this.input.on('pointerdown', this.flap,this);

    this.input.keyboard.on('keydown-SPACE', this.flap,this);

     debugger

   }

  
   

   





update(time,delta)
{
  if(this.bird.y > this.config.height || this.bird.y < 0)
  {
    //alert('You Lose!');

    this.restartPlayerPosition();

    
  }

  this.recyclePipes();

}


PlacePipes(upPipe,lowPipe)
{
  
  for(let i = 0; i < PIPES_RENDER; i ++)
    
  {
    
   //pipeHorizontalDistance += 100;

   const rightMostX = this.GetRightMostPipe();
         
   const pipeVerticalDistance = Phaser.Math.Between(...this.pipeDistanceRange);
   const pipeVerticalPosition = Phaser.Math.Between(0 + 20, this.config.height -20 - pipeVerticalDistance);
   const pipeHorizontalDistance = Phaser.Math.Between(...this.pipeHorizontalDistanceRange);

   upPipe.x = rightMostX + pipeHorizontalDistance;
   upPipe.y = pipeVerticalPosition;
   
   lowPipe.x = upPipe.x
   lowPipe.y = upPipe.y + pipeVerticalDistance;
   
  //  upPipe.body.velocity.x = -200;

  //  lowPipe.body.velocity.x = -200;


  }

}

recyclePipes()
{
    const tempPipes = [];

    this.pipes.getChildren().forEach(pipe => 
      {
        if(pipe.getBounds().right <= 0)
        {
            // recycle pipe
            tempPipes.push(pipe);
            if(tempPipes.length == 2)
            {
               this.PlacePipes(...tempPipes);
            }
        }
    
      })
}

GetRightMostPipe()
{
  let rightMostX = 0;

  this.pipes.getChildren().forEach(function(pipe)
  {
    rightMostX = Math.max(pipe.x, rightMostX);
  })
 
   return rightMostX;

}

restartPlayerPosition()
{
  this.bird.x = this.config.startPosition.x;
  this.bird.y = this.config.startPosition.y;
  this.bird.body.velocity.y = 0;

}


flap()
{
   this.bird.body.velocity.y = -this.flapVelocity;
}



}

export default PlayScene;

























