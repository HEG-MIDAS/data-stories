class HScrollbar {
    
    constructor(sketch,xp, yp, sw, sh, l, min_value, max_value, value) {
      this.sketch = sketch;
  
      this.swidth = sw;
      this.sheight = sh;
      let widthtoheight = sw - sh;
      this.ratio = sw / widthtoheight;
      this.xpos = xp;
      this.ypos = yp;
      this.spos = this.xpos;
      this.newspos = this.spos;
      this.sposMin = this.xpos;
      this.sposMax = this.xpos + this.swidth - this.sheight;
      // this.sposMax = this.xpos + this.swidth;
      this.loose = l;
  
      this.min_value = this.sketch.int(min_value);
      this.max_value = this.sketch.int(max_value);
      this.value = this.sketch.int(value);
      // console.log(this.sketch.str("xpos="+this.xpos))
      // console.log(this.sketch.str("ypos="+this.ypos))
      // console.log(this.sketch.str("xpos+swidth="+(this.xpos+this.swidth)))
      // console.log(this.sketch.str("spos="+this.spos))
  
      // console.log(this.sketch.str("slider min_value="+this.min_value))
      // console.log(this.sketch.str("slider max_value="+this.max_value))
      // console.log(this.sketch.str("slider value="+this.value))
      // console.log(this.sketch.str("new HScrollbar!!!!"))
  
      this.over = false;
      this.locked = false;
    }
  
    update() {
      if (this.overEvent()) {
        this.over = true;
        // console.log("this.over="+this.sketch.str(this.over));
      } else {
        this.over = false;
      }
      if (this.sketch.mouseIsPressed && this.over) {
        this.locked = true;
      }
      if (!this.sketch.mouseIsPressed) {
        this.locked = false;
      }
      if (this.locked) {
        // this.newspos = this.sketch.constrain(this.sketch.mouseX-this.sheight/2, this.sposMin, this.sposMax);
        this.spos = this.sketch.constrain(this.sketch.mouseX-this.sheight/2, this.sposMin, this.sposMax);
      }
      // if (Math.abs(this.newspos - this.spos) > 1) {
      //   this.spos = this.spos + (this.newspos-this.spos)/this.loose;
      // }
      // console.log(this.sketch.str("spos="+this.spos))
      // console.log(this.sketch.str("xpos="+this.xpos))
      // console.log(this.sketch.str("xpos+swidth="+(this.xpos+this.swidth)))
  
      // this.value = this.sketch.int(this.sketch.map(this.spos, this.xpos, this.xpos+this.swidth, this.min_value, this.max_value));
      this.value = this.sketch.int(this.sketch.map(this.spos, this.xpos, this.xpos+this.swidth- this.sheight, this.min_value, this.max_value));

      // this.value = this.sketch.int(this.sketch.map(this.spos, this.xpos, this.xpos+this.swidth, this.min_value, this.max_value));
      // this.value = this.sketch.map(this.spos, this.xpos, this.xpos+this.swidth, this.min_val, this.max_value);
      // console.log(this.sketch.str("min_value="+this.min_value))
      // console.log(this.sketch.str("max_value="+this.max_value))
      // console.log(this.sketch.str("value="+this.value))
    }
  
    overEvent() {
      // console.log(this.sketch.str("xpos="+this.xpos+" ypos="+this.ypos));
      // console.log(this.sketch.str("this.sketch.mouseX="+this.sketch.mouseX+" this.sketch.mouseY="+this.sketch.mouseY));
      // if (this.sketch.mouseX > this.xpos && this.sketch.mouseX < this.xpos+this.swidth && this.sketch.mouseY > this.ypos && this.sketch.mouseY < this.ypos+this.sheight) {
      if (this.sketch.mouseX > this.xpos && this.sketch.mouseX < this.xpos+this.swidth && this.sketch.mouseY > this.ypos-(this.sheight/2.0) && this.sketch.mouseY < this.ypos+(this.sheight/2.0)) {
        return true;
      } else {
        return false;
      }
    }
  
    display() {
      this.sketch.noStroke();
      this.sketch.fill(204);
      this.sketch.rect(this.xpos, this.ypos, this.swidth, this.sheight);
  
      if (this.over || this.locked) {
        this.sketch.fill(0, 0, 0);
      } else {
        this.sketch.fill(102, 102, 102);
      }
      this.sketch.rect(this.spos, this.ypos, this.sheight, this.sheight);
    }

    display_as_line() {
      // this.sketch.noStroke();
      // this.sketch.stroke(204);
      // this.sketch.fill(204);
      this.sketch.stroke(32);
      this.sketch.fill(32);
      // this.sketch.rect(this.xpos, this.ypos, this.swidth, this.sheight);
      // this.sketch.line(this.xpos, this.ypos+(this.sheight/2.0), this.xpos+this.swidth, this.ypos+(this.sheight/2.0));
      this.sketch.line(this.xpos, this.ypos, this.xpos+this.swidth, this.ypos);

      // borders timeline
      // let timeline_edge_h = 5;
      let timeline_edge_h = 10;
      this.sketch.line(this.xpos, this.ypos-(timeline_edge_h/2.0), this.xpos, this.ypos+(timeline_edge_h/2.0));
      this.sketch.line(this.xpos+this.swidth, this.ypos-(timeline_edge_h/2.0), this.xpos+this.swidth, this.ypos+(timeline_edge_h/2.0));
  
      if (this.over || this.locked) {
        this.sketch.fill(0, 0, 0);
      } else {
        // this.sketch.fill(102);
        this.sketch.fill(32);
      }
      // this.sketch.rect(this.spos, this.ypos, this.sheight, this.sheight);
      // this.sketch.rect(this.spos, this.ypos, this.sheight, this.sheight);
      // this.sketch.rect(this.spos, this.ypos- (this.sheight/2.0), this.sheight-10, this.sheight);
      // this.sketch.rect(this.spos, this.ypos- (this.sheight/2.0), this.sheight-12, this.sheight);
      // this.sketch.rect(this.spos, this.ypos- (this.sheight/2.0), this.sheight, this.sheight);
      this.sketch.rect(this.spos, this.ypos- (this.sheight/2.0), this.sheight, this.sheight);
    }
  
    getPos() {
      // Convert spos to be values between
      // 0 and the total width of the scrollbar
      // return this.spos * this.ratio;
      return this.value;
    }
  }
  