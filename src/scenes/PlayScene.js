
import BaseScene from './BaseScene';

const PIPES_TO_RENDER = 4;

class PlayScene extends BaseScene {

  constructor(config) {
    super('PlayScene', config);

    this.bird = null;
    this.pipes = null;
    this.isPaused = false;

    this.pipeHorizontalDistance = 0;
   // this.pipeVerticalDistanceRange = [150, 250];
   // this.pipeHorizontalDistanceRange = [500, 550];
    this.flapVelocity = 300;

    this.score = 0;
    this.scoreText = '';


    this.currentDifficulty = 'easy';
    this.Difficulties =
    {
      'easy':
      {
                
        pipeHorizontalDistanceRange: [300, 350],
        pipeVerticalDistanceRange:[140, 190]
      },

      'normal':
      {
                
        pipeHorizontalDistanceRange:[280, 330],
        pipeVerticalDistanceRange:[150, 200]
      },

      'hard':
      {
                
        pipeHorizontalDistanceRange: [250, 310],
        pipeVerticalDistanceRange: [120, 170]
      },
    }

  
   // debugger
  }

  create() {
    this.currentDifficulty ='easy';

    super.create();
    this.createBird();
    this.createPipes();
    this.createColliders();
    this.createScore();
    this.createPause();
    this.handleInputs();
    this.ListenToEvents();
  }

  update() {
    this.checkGameStatus();
    this.recyclePipes();
  }

  //countdown event when click continue button (using resume function)

  ListenToEvents()
  {
    
if(this.PauseEvent)
{
   return;
}

    this.PauseEvent =
    
    this.events.on('resume',() =>
    {
        this.initialTime = 3;
        this.countDownText = this.add.text(...this.screenCenter,'Game Start in '+ this.initialTime,this.fontOptions).
        setOrigin(0.5);
        this.timeEvent = this.time.addEvent(
          {
            delay:1000,
            callback:this.CountDown,
            callbackScope: this,
            loop: true

          }
        )


    })
  }

  CountDown()
  {
     this.initialTime --;
     this.countDownText.setText('Game Start in '+ this.initialTime);
     if(this.initialTime <= 0)
     {
       this.isPaused = false;
       this.countDownText.setText('');
       this,this.physics.resume();
       this.timeEvent.remove(); // remove the time event
     }
  }

  createBG() {
    this.add.image(0, 0, 'sky').setOrigin(0);
  }

  createBird() {
    this.bird = this.physics.add.sprite(this.config.startPosition.x, this.config.startPosition.y, 'bird').setOrigin(0);
    this.bird.body.gravity.y = 600;
    this.bird.setCollideWorldBounds(true);
  }

  createPipes() {
    this.pipes = this.physics.add.group();

    for (let i = 0; i < PIPES_TO_RENDER; i++) {
      const upperPipe = this.pipes.create(0, 0, 'pipe')
        .setImmovable(true)
        .setOrigin(0, 1);
      const lowerPipe = this.pipes.create(0, 0, 'pipe')
        .setImmovable(true)
        .setOrigin(0, 0);

      this.placePipe(upperPipe, lowerPipe)
    }

    this.pipes.setVelocityX(-200);
  }

  createColliders() {
    this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);
  }

  createScore() {
    this.score = 0;
    const bestScore = localStorage.getItem('bestScore');
    this.scoreText = this.add.text(16, 16, `Score: ${0}`, { fontSize: '32px', fill: '#000'});
    this.add.text(16, 52, `Best score: ${bestScore || 0}`, { fontSize: '18px', fill: '#000'});
  }

  createPause() {

    this.isPaused = false;

    const pauseButton = this.add.image(this.config.width - 10, this.config.height -10, 'pause')
      .setInteractive()
      .setScale(3)
      .setOrigin(1);

    pauseButton.on('pointerdown', () => {

      this.isPaused = true;
      this.physics.pause();
      this.scene.pause();
      this.scene.launch('PauseScene');

     //pause playscene and launch pause scene


    })
  }

  handleInputs() {
    this.input.on('pointerdown', this.flap, this);
    this.input.keyboard.on('keydown_SPACE', this.flap, this);
  }

  checkGameStatus() {
    if (this.bird.getBounds().bottom >= this.config.height || this.bird.y <= 0) {
      this.gameOver();
    }
  }

  placePipe(uPipe, lPipe) {

    const Difficulty = this.Difficulties[this.currentDifficulty];

    const rightMostX = this.getRightMostPipe();
    const pipeVerticalDistance = Phaser.Math.Between(...Difficulty.pipeVerticalDistanceRange);
    const pipeVerticalPosition = Phaser.Math.Between(0 + 20, this.config.height - 20 - pipeVerticalDistance);
    const pipeHorizontalDistance = Phaser.Math.Between(...Difficulty.pipeHorizontalDistanceRange);

    uPipe.x = rightMostX + pipeHorizontalDistance;
    uPipe.y = pipeVerticalPosition;

    lPipe.x = uPipe.x;
    lPipe.y = uPipe.y + pipeVerticalDistance
  }

  recyclePipes() {
    const tempPipes = [];
    this.pipes.getChildren().forEach(pipe => {
      if (pipe.getBounds().right <= 0) {
        tempPipes.push(pipe);
        if (tempPipes.length === 2) {
          this.placePipe(...tempPipes);
          this.increaseScore();
          this.saveBestScore();
        }
      }
    })
  }

  getRightMostPipe() {
    let rightMostX = 0;

    this.pipes.getChildren().forEach(function(pipe) {
      rightMostX = Math.max(pipe.x, rightMostX);
    })

    return rightMostX;
  }

  saveBestScore() {
    const bestScoreText = localStorage.getItem('bestScore');
    const bestScore = bestScoreText && parseInt(bestScoreText, 10);

    if (!bestScore || this.score > bestScore) {
      localStorage.setItem('bestScore', this.score);
    }
  }

  gameOver() {
    this.physics.pause();
    this.bird.setTint(0xEE4824);

    this.saveBestScore();

    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.scene.restart();
      },
      loop: false
    })
  }

  flap() {

    if(this.isPaused){return;}
    this.bird.body.velocity.y = -this.flapVelocity;
  }

  increaseScore() {
    this.score++;
    this.scoreText.setText(`Score: ${this.score}`)
  }
}

export default PlayScene;
