 var trex,trex_running
 var ground,groundimage
 var invisibleGround
 var cloudImage
 var PLAY=1
 var END=0
 var gameState=PLAY
 var gameOver
 var restart
 var gameOverimage
 var restartimage
 var score=0
 var jump
 var die
 var checkpoint
  localStorage["HighestScore"]=0
 var  obstacle1,obstacle2,obstacle3,obstacle4,obstacle5,obstacle6,ObstaclesGroup
 function preload(){
   trex_running=loadAnimation("trex1.png","trex3.png","trex4.png")
   trex_collided=loadImage("trex_collided.png")
   groundimage=loadImage("ground2.png")
   cloudImage=loadImage("cloud.png")
   obstacle1=loadImage("obstacle1.png")
   obstacle2=loadImage("obstacle2.png")
   obstacle3=loadImage("obstacle3.png")
   obstacle4=loadImage("obstacle4.png")
   obstacle5=loadImage("obstacle5.png")
   obstacle6=loadImage("obstacle6.png")
   gameOverimage=loadImage("gameOver.png")
   restartimage=loadImage("restart.png")
   jump=loadSound("jump.mp3")
   die=loadSound("die.mp3")
   checkpoint=loadSound("checkPoint.mp3")
 }
function setup() {
  createCanvas(600, 200);
  trex=createSprite(50,160,10,40);
  trex.addAnimation("running",trex_running)
  trex.addAnimation("collided",trex_collided)
  trex.scale=0.5;
  
  ground=createSprite(300,180,600,10)
  ground.addImage(groundimage)
  invisibleGround=createSprite(300,190,600,10  )
  invisibleGround.visible=false
  
  gameOver=createSprite(350,80,20,20)
  gameOver.addImage(gameOverimage)
  gameOver.scale=0.5
  restart=createSprite(350,120,20,20)
  restart.addImage(restartimage)
  restart.scale=0.5 
  
  gameOver.visible=false
  restart.visible=false
  ObstaclesGroup=createGroup()
  CloudsGroup=createGroup()
}

function draw() {
  background(255);
  text("score: "+score,500,50)
  text("High Score: "+localStorage["HighestScore"],400,50)
  if (gameState===PLAY){
    
score=score+Math.round(getFrameRate()/60)  
  if(score>0&&score%100===0){
    checkpoint.play() 
  }  
  if(keyDown("space")&&trex.y>150){
    trex.velocityY=-12  
    jump.play()
  }
  trex.velocityY=trex.velocityY+0.8
   
  ground.velocity.x=-5           
  if (ground.x<0){
    ground.x=ground.width/2
  }
  spawnClouds();
  spawnObstacles();
    if (ObstaclesGroup.isTouching(trex)){
      gameState=END
      die.play()
    }
  }
  else if(gameState===END){
    gameOver.visible=true
    restart.visible=true
    ground.velocityX=0;
    ObstaclesGroup.setVelocityXEach(0)
    CloudsGroup.setVelocityXEach(0)
    trex.changeAnimation("collided",trex_collided)
    ObstaclesGroup.setLifetimeEach(-1)
    CloudsGroup.setLifetimeEach(-1)
    trex.velocityY=0
    
  }
  trex.collide(invisibleGround)
  if(mousePressedOver(restart)) {
    reset();
  }

  camera.position.x = trex.x
  camera.position.y = trex.y
  drawSprites();
}
function spawnClouds(){
  if(frameCount%60===0){
    var cloud=createSprite(600,150,10,10)
    cloud.y=random(80,120)
    cloud.addImage(cloudImage)
    cloud.velocity.x=-4
    cloud.scale=0.5
    CloudsGroup.add(cloud)
  }
}
function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = -6;
    
    //generate random obstacles
    var rand =Math.round( random(1,6));
    switch(rand){
      case 1:obstacle.addImage(obstacle1);
        break;
        case 2:obstacle.addImage(obstacle2);
        break;
        case 3:obstacle.addImage(obstacle3);
        break;
        case 4:obstacle.addImage(obstacle4);
        break;
        case 5:obstacle.addImage(obstacle5);
        break;
        case 6:obstacle.addImage(obstacle6);
        break;
        default:break;
    }
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 150;
    //add each obstacle to the group
    ObstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState=PLAY
  ObstaclesGroup.destroyEach()
  CloudsGroup.destroyEach()
  gameOver.visible=false
  restart.visible=false
  trex.changeAnimation("running",trex_running)
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"]=score
  }
  score=0
}