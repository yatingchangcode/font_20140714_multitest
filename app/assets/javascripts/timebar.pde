
float w = 180;
float h = 16;
float fps = 20;
float x = 0.0;
float time = 10;
float margin = 0.2;
float canvasWidth;
float canvasHeight;
float outerWidth;
float outerHeight;
float innerWidth;
float innerHeight;
float marginPixel;
float step;
float changeBegin;
float changeEnd;
float scale;

void setup(){
  frameRate(fps);
  //setSize(w, h);
  noStroke();
  noLoop();  
}

void draw(){
  background(0);
  x = x + step;  

  if (x >= innerWidth) {
    x = 0;
    clearBar();
    return;
  }

  float green;

  fill(120);
  rect(0, 0, outerWidth, outerHeight, outerHeight / 2);
  if(x > innerWidth - changeEnd){
    green = 0;
  }else if(x >= changeBegin){
    green = 255 - (x - changeBegin) * scale;
  }else{
    green = 255;
  }
  fill(255, green ,0);
  if(innerWidth - x <= innerHeight){
    rect(marginPixel, marginPixel, innerHeight, innerHeight, innerHeight / 2, 0, 0, innerHeight / 2);
  }else if(x <= innerHeight / 2){
    rect(marginPixel, marginPixel, innerWidth - x, innerHeight, 
      innerHeight / 2, innerHeight / 2 - x, innerHeight / 2 - x, innerHeight / 2);
  }else{
    rect(marginPixel, marginPixel, innerWidth - x, innerHeight, innerHeight / 2, 0, 0, innerHeight / 2);
  }
  if(innerWidth - x <= innerHeight){
    float remainWidth = (innerWidth - x);
    float remainX = outerWidth - x;
    float outRadius = 0;
    if(innerWidth - x <= innerHeight / 2){
      outRadius = outerHeight / 2 - remainWidth;
    }
    fill(120);
    rect(remainX, 0, outerHeight, outerHeight, outRadius, 0, 0, outRadius);
  }  
}

void drawBar(boolean isEmpty){
  //float t = time;
  background(0);
  //fill(255,255,255,100);
  fill(120);
  rect(0, 0, outerWidth, outerHeight, outerHeight / 2);
  if(!isEmpty){
    fill(255, 255 ,0);
    rect(marginPixel, marginPixel, innerWidth, innerHeight, innerHeight / 2);
  }
}

void setSize(float width, float height){
  outerWidth = width;
  outerHeight = height;
  marginPixel = Math.min(outerWidth * margin, outerHeight * margin) / 2;
  innerWidth = outerWidth - marginPixel * 2;
  innerHeight = outerHeight - marginPixel * 2;
  size(outerWidth, outerHeight);
  step = innerWidth / (fps * time);
  changeBegin = innerWidth / 2;
  changeEnd = innerWidth / 4;
  scale = 255 / (changeBegin - changeEnd);
  drawBar();
}

void setSecond(int s){
  time = s || 10;
  step = (innerWidth || 200) / (fps * time);
}

void doStart(){
  loop();
}

void doStop(boolean toClear){
  noLoop();
  if(toClear){
    x = 0.0;
    drawBar(true);
  }
}

void resetBar(){
  noLoop();
  x = 0.0;
  drawBar(false);
}

void clearBar(){
  noLoop();
  x = 0.0;
  drawBar(true);
}
