const ges = ( sketch ) => {

  let gesTimeSlider;
let paris_r = 0;
let font_legend_glacier;

  let easing = 0.10;
  let current_ges = 0;
  let current_proj_1990_1999 = 0;
  let current_proj_2000_2020 = 0;
  let margin_radius = 140;
  let ellise_top_margin = -20;

  let yellow_color = "#FFD57E";
  let grey_shade = 182;
  let black_text_shade = 32;
  let timeslider_margin = 200;
  let isLooping = false;
  let canvas;


  sketch.preload = () => {
    font_bold = sketch.loadFont('fonts/Poppins/Poppins-Bold.ttf');
    font_regular = sketch.loadFont('fonts/Poppins/Poppins-Regular.ttf');
    font_semi = sketch.loadFont('fonts/Poppins/Poppins-SemiBold.ttf');
    font_light = sketch.loadFont('fonts/Poppins/Poppins-Light.ttf');
  }

  sketch.setup = () => {
    sketch.got_data = false;

    sketch.max_ges = 0
    sketch.min_ges = Infinity
    sketch.idx = 0
    sketch.all_ges = []
    sketch.trend_1990_1999 = []
    sketch.trend_2000_2020 = []
    sketch.years = []
    sketch.start = true;
    sketch.last_ges_radius  = 0;
    sketch.current_alpha_proj_2000_2020 = 0;
    sketch.target_alpha_proj_2000_2020 = 0;

    sketch.current_alpha_proj_1990_1999 = 255;
    sketch.target_alpha_proj_1990_1999 = 255;

    // ges
    sketch.current_r = 0;
    sketch.target_r = 0;

    // projected based on 1990-1999
    sketch.current_r_proj_1990_1999 = 0;
    sketch.target_r_proj_1990_1999 = 0;
    
    // projected based on 2000-2020
    sketch.current_r_proj_2000_2020 = 0;
    sketch.target_r_proj_2000_2020 = 0;


    sketch.margin_legend = 600
    sketch.canvas_w = document.querySelector("#p5sketchges").offsetWidth;
    sketch.canvas_h = 700
    
    sketch.year_slider = 0;

    sketch.background_color = 255
    let container = sketch.select("#p5sketchges");
    canvas = sketch.createCanvas(sketch.canvas_w, sketch.canvas_h);
    container.child(canvas);

    sketch.background(sketch.background_color)
    sketch.slider_loaded = false;
    sketch.loadJSON('/gesParisLinReg' , sketch.dataReceived);

    sketch.noStroke()
    sketch.fill(255,0,0,96)
    sketch.textSize(18)

  }


  sketch.getIndexFromVal = (year) => {
    found = false;
    for (let i = 0; i < sketch.years.length; i++) {
      if(sketch.years[i] == year){
              found = true;
              return i;
          }
        }
        if(found == false){
          // console.log(sketch.str("not found!!!! year="+year));
        }
    }

    
    sketch.mapRadius = (p_ges) => {
      let result = sketch.map(p_ges, 0, sketch.max_ges, 0, sketch.height - margin_radius);
      return result;
    }

    sketch.setLineDash = (list) => {
      sketch.drawingContext.setLineDash(list);
    }

    sketch.setLineSolid = () => {
      sketch.drawingContext.setLineDash([]);
    }

    // sketch.mouseWheel = (event) => {
    //   let bounds = canvas.elt.getBoundingClientRect();
    //   if (bounds.bottom > 0 && bounds.top <= sketch.windowHeight) {

    //     if (!isLooping) {
    //       isLooping = true;
    //       sketch.loop();
    //       // console.log("ges loop");

    //     }
    //   } else if (isLooping) {
    //     isLooping = false;
    //     sketch.noLoop();
    //     // console.log("ges noLoop");

    //   }
    // }
   
    sketch.draw = () => {
      sketch.background(sketch.background_color)

      if(sketch.slider_loaded == true){
        gesTimeSlider.update();
        gesTimeSlider.display_as_line();
    
      if(sketch.year_slider != gesTimeSlider.getPos()){
        if( gesTimeSlider.getPos() >= 2000 && sketch.year_slider < 2000){
          sketch.target_alpha_proj_2000_2020 = 255;
          sketch.target_alpha_proj_1900_1999 = 80;
        }
        if( gesTimeSlider.getPos() < 2000 && sketch.year_slider >= 2000){
          sketch.target_alpha_proj_2000_2020 = 80;
          sketch.target_alpha_proj_1900_1999 = 255;
        }

        sketch.year_slider = gesTimeSlider.getPos();
        sketch.idx = sketch.getIndexFromVal(sketch.year_slider);   
        if(sketch.year_slider <= 2020){
          current_ges = sketch.all_ges[sketch.idx];
        }
        current_proj_1990_1999 = sketch.trend_1990_1999[sketch.idx];
        current_proj_2000_2020 = sketch.trend_2000_2020[sketch.idx];

      }

    sketch.target_r = sketch.mapRadius(current_ges)
    if(sketch.start){
      sketch.current_r = sketch.target_r;
    }

    let dx = sketch.target_r - sketch.current_r;
    let inc = dx * easing;

    // We only update the radius when needed
      if(Math.abs(dx) > 0.1){
      sketch.current_r += inc;
      }

    
    current_proj_1990_1999 = sketch.trend_1990_1999_2030;
    sketch.current_r_proj_1990_1999 = sketch.mapRadius(current_proj_1990_1999) 
    current_proj_2000_2020 = sketch.trend_2000_2020_2030;
    sketch.current_r_proj_2000_2020 = sketch.mapRadius(current_proj_2000_2020) 


      sketch.noStroke()
      sketch.fill(215)   
      sketch.ellipse(sketch.width/2, sketch.height/2 + ellise_top_margin,sketch.current_r,sketch.current_r)
      
      // draw PROJECTED 1990-1999 ellipse  //////////////////////////////////////////////////////////////////////////////////////
      sketch.stroke(0,126,157,sketch.current_alpha_proj_1990_1999)  
      sketch.setLineDash([10, 10]);
      sketch.noFill()
      sketch.ellipse(sketch.width/2, sketch.height/2 + ellise_top_margin,sketch.current_r_proj_1990_1999,sketch.current_r_proj_1990_1999)
      

      // draw PROJECTED 2000-2020 ellipse  //////////////////////////////////////////////////////////////////////////////////////
      sketch.stroke(85,118,71,sketch.current_alpha_proj_2000_2020)  
      sketch.setLineDash([10, 10]);
      sketch.noFill()
      sketch.push();
      sketch.translate(sketch.width/2, sketch.height/2 + ellise_top_margin);
      sketch.ellipse(0,0,sketch.current_r_proj_2000_2020,sketch.current_r_proj_2000_2020)
      sketch.pop();
         

    let dx_alpha_proj_1990_1999 = sketch.target_alpha_proj_1900_1999 - sketch.current_alpha_proj_1990_1999;
    let inc_proj_alpha_1990_1999 = dx_alpha_proj_1990_1999 * easing;

    if(Math.abs(dx_alpha_proj_1990_1999) > 0.1){
      sketch.current_alpha_proj_1990_1999 += inc_proj_alpha_1990_1999;
      }


    let dx_alpha_proj_2000_2020 = sketch.target_alpha_proj_2000_2020 - sketch.current_alpha_proj_2000_2020;
    let inc_proj_alpha_2000_2020 = dx_alpha_proj_2000_2020 * easing;

    if(Math.abs(dx_alpha_proj_2000_2020) > 0.1){
      sketch.current_alpha_proj_2000_2020 += inc_proj_alpha_2000_2020;
      }

    
    sketch.setLineDash([]);
    sketch.stroke(32)
    let pointer_line_1_y1 = -150;
    let pointer_line_1_x1 =  Math.sqrt(Math.pow(sketch.current_r/2.0,2) - Math.pow(pointer_line_1_y1,2)) + 5;
    let pointer_line_1_x2 = pointer_line_1_x1 + 120;
    let pointer_line_1_y2 = pointer_line_1_y1 - 60;
    let pointer_line_1_x3 = pointer_line_1_x2 + 60;
    let pointer_line_1_y3 = pointer_line_1_y2;

    sketch.push();
    sketch.translate(sketch.width/2, sketch.height/2 + ellise_top_margin);
    sketch.line(pointer_line_1_x1, pointer_line_1_y1, pointer_line_1_x2, pointer_line_1_y2);
    sketch.line(pointer_line_1_x2, pointer_line_1_y2, pointer_line_1_x3, pointer_line_1_y3);
    sketch.fill(120);
    sketch.noStroke()
    sketch.textSize(14);
    sketch.textFont(font_regular);
    sketch.textAlign(sketch.CENTER);
    offset_text_ges = 120; 
    offset_text_ges_y = 25; 
    if(sketch.year_slider <= 2020){
      sketch.text("TOTAL GES EMISSIONS EN " + sketch.str(sketch.year_slider), pointer_line_1_x3 + offset_text_ges, pointer_line_1_y3-offset_text_ges_y);
    }else{
      sketch.text("EMISSIONS TOTALES DE GES EN 2020", pointer_line_1_x3 + offset_text_ges, pointer_line_1_y3-offset_text_ges_y);
    }

    sketch.textFont(font_bold);
    sketch.textSize(16);
    sketch.text( sketch.str(current_ges.toFixed(2)) + " TONNES", pointer_line_1_x3 + offset_text_ges, pointer_line_1_y3-offset_text_ges_y+15);
    sketch.textAlign(sketch.LEFT);
    sketch.pop();

    sketch.stroke(32)
    let pointer_line_3_x1 = sketch.width/2 - 100;
    let pointer_line_3_y1 = sketch.height/2 + ellise_top_margin + 100;
    let pointer_line_3_x2 = sketch.width/2 - 250;
    let pointer_line_3_y2 = sketch.height/2 + ellise_top_margin + 200;
    let pointer_line_3_x3 = pointer_line_3_x2 - 100;
    let pointer_line_3_y3 = sketch.height/2 + ellise_top_margin + 200;


    sketch.line(pointer_line_3_x1, pointer_line_3_y1, pointer_line_3_x2, pointer_line_3_y2);
    sketch.line(pointer_line_3_x2, pointer_line_3_y2, pointer_line_3_x3, pointer_line_3_y3);
    sketch.fill(193,39,45);
    sketch.noStroke()
    sketch.textSize(14);
    sketch.textFont(font_regular);
    sketch.textAlign(sketch.CENTER);
    sketch.text("OBJECTIF ACCORD", pointer_line_3_x3 - 100, pointer_line_3_y3-20);
    sketch.text("DE PARIS POUR 2030", pointer_line_3_x3 - 100, pointer_line_3_y3-5);

    sketch.textFont(font_bold);
    sketch.textSize(16);
    sketch.fill(193,39,45);
    sketch.text( sketch.str(sketch.str(sketch.paris_ges.toFixed(2))) + " TONNES", pointer_line_3_x3 - 100, pointer_line_3_y3+10);
    sketch.textAlign(sketch.LEFT);

    sketch.stroke(32,sketch.current_alpha_proj_2000_2020)
    let pointer_line_2_y1 = -100;
    let pointer_line_2_x1 = - Math.sqrt( Math.pow(sketch.current_r_proj_2000_2020/2.0,2) - Math.pow(pointer_line_2_y1,2) ) - 5;
    let pointer_line_2_x2 = pointer_line_2_x1 - 120;
    let pointer_line_2_y2 = pointer_line_2_y1 - 60;
    let pointer_line_2_x3 = pointer_line_2_x2 - 60;
    let pointer_line_2_y3 = pointer_line_2_y2;

    sketch.push();
    sketch.translate(sketch.width/2, sketch.height/2 + ellise_top_margin);
    sketch.line(pointer_line_2_x1, pointer_line_2_y1, pointer_line_2_x2, pointer_line_2_y2);
    sketch.line(pointer_line_2_x2, pointer_line_2_y2, pointer_line_2_x3, pointer_line_2_y3);
    sketch.pop();

    sketch.fill(85,118,71,sketch.current_alpha_proj_2000_2020);
    sketch.noStroke()
    sketch.textSize(14);
    sketch.textFont(font_regular);
    sketch.textAlign(sketch.CENTER);
    sketch.push();
    sketch.translate(sketch.width/2, sketch.height/2 + ellise_top_margin);
    let offset_text_2022 = 160;
    sketch.text("EMISSIONS DE GES PREVUES POUR 2030", pointer_line_2_x3 - offset_text_2022, pointer_line_2_y3-20);
    sketch.text("SUR LA BASE DE LA TENDANCE 2000-2020", pointer_line_2_x3 - offset_text_2022, pointer_line_2_y3-5);

    sketch.textFont(font_bold);
    sketch.textSize(16);
    sketch.text( sketch.str(sketch.str(current_proj_2000_2020.toFixed(2))) + " TONNES", pointer_line_2_x3- offset_text_2022, pointer_line_2_y3+10);
    sketch.pop();


    sketch.textAlign(sketch.LEFT);

    sketch.stroke(32,sketch.current_alpha_proj_1990_1999)
    let pointer_line_4_y1 = +100;
    let pointer_line_4_x1 =  Math.sqrt( Math.pow(sketch.current_r_proj_1990_1999/2.0,2) - Math.pow(pointer_line_4_y1,2) ) + 5;

    let pointer_line_4_x2 = pointer_line_4_x1 + 70;
    let pointer_line_4_y2 = pointer_line_4_y1 - 50;
    let pointer_line_4_x3 = pointer_line_4_x2 + 70;
    let pointer_line_4_y3 = pointer_line_4_y2;


    sketch.push();
    sketch.translate(sketch.width/2, sketch.height/2 + ellise_top_margin);
    sketch.line(pointer_line_4_x1, pointer_line_4_y1, pointer_line_4_x2, pointer_line_4_y2);
    sketch.line(pointer_line_4_x2, pointer_line_4_y2, pointer_line_4_x3, pointer_line_4_y3);
 
    sketch.fill(0,126,157,sketch.current_alpha_proj_1990_1999);
    sketch.noStroke()
    sketch.textSize(14);
    sketch.textFont(font_light);
    sketch.textAlign(sketch.CENTER);

    let offset_text_9099 = 155;

    sketch.text("EMISSIONS DE GES PREVUES POUR 2030", pointer_line_4_x3 + offset_text_9099, pointer_line_4_y3-20);
    sketch.text("SUR LA BASE DE LA TENDANCE 1990-1999", pointer_line_4_x3 + offset_text_9099, pointer_line_4_y3-5);


    sketch.textFont(font_bold);
    sketch.textSize(16);
    sketch.text( sketch.str(sketch.str(current_proj_1990_1999.toFixed(2))) + " TONNES", pointer_line_4_x3 + offset_text_9099, pointer_line_4_y3+10);
    sketch.textAlign(sketch.LEFT);
    sketch.pop();


    sketch.fill(black_text_shade);
    sketch.noStroke()
    sketch.textSize(16);
    sketch.textFont(font_semi);
    sketch.text(sketch.str(sketch.years[0]), timeslider_margin-50, sketch.height-80-10);    
    sketch.fill(black_text_shade);
    sketch.noStroke()
    sketch.textSize(16);
    sketch.textFont(font_semi);
    sketch.text(sketch.str(sketch.years[sketch.years.length-1]), sketch.width-timeslider_margin+10, sketch.height-80-10);    
      
  }

  // ellipse PARIS AGREEMENT ////////////////////////////////////////
  sketch.noFill()   
  sketch.stroke(193,39,45);
  sketch.strokeWeight(2);
  sketch.setLineDash([10, 10]);
  sketch.ellipse(sketch.width/2, sketch.height/2 + ellise_top_margin,paris_r,paris_r)
  sketch.setLineDash([]);


  // year
  sketch.fill(black_text_shade);
  sketch.noStroke();
  sketch.textSize(40);
  sketch.textAlign(sketch.CENTER);
  sketch.textFont(font_bold);
  sketch.text(sketch.str(sketch.year_slider), sketch.width/2, -ellise_top_margin-30);


  // legend
  sketch.textSize(16);
  sketch.textFont(font_regular);
  sketch.textAlign(sketch.LEFT, sketch.TOP);
  sketch.noStroke();
  sketch.fill(0);
 
  sketch.text("Visualisation 4. Emissions de gaz à effet de serre de la Suisse 1990-2020. Emissions en millions de tonnes équivalent CO2 correspondant à la somme des gaz. Source des données : BAFU", 25 , sketch.height - 40, sketch.canvas_w);

  if(sketch.start){
    sketch.start = false;
    }

}
  
  
  
  sketch.dataReceived = (data) => {

    // console.log("gotData");
      let idx_2020 = 0;
      for(let i = 0; i < Object.keys(data["year"]).length; i++) {

          if(data['year'][i] <= 2020  ){
          sketch.years[i] = data['year'][i];
          sketch.all_ges[i] = data['all_ges'][i]; 
          sketch.trend_1990_1999[i] = data['trend_1990_1999'][i]; 
          sketch.trend_2000_2020[i] = data['trend_2000_2020'][i]; 

          if(data['all_ges'][i] > sketch.max_ges){
            sketch.max_ges = data['all_ges'][i];
          }
          if(data['all_ges'][i] < sketch.min_ges && data['all_ges'][i] != -1000 ){
            sketch.min_ges = data['all_ges'][i];
          }

        }

        }

        sketch.paris_ges = data['paris_agreement'][Object.keys(data["year"]).length-1]
        sketch.paris_ges = data['paris_agreement'][Object.keys(data["year"]).length-1]
        sketch.trend_1990_1999_2030 = data['trend_1990_1999'][Object.keys(data["year"]).length-1]
        sketch.trend_2000_2020_2030 = data['trend_2000_2020'][Object.keys(data["year"]).length-1]

        if(sketch.paris_ges < sketch.min_ges){
          sketch.min_ges =sketch.paris_ges;
        }
        
      
        gesTimeSlider = new HScrollbar(sketch, timeslider_margin, sketch.height-80, sketch.canvas_w - (timeslider_margin*2.0), 12, 12, sketch.years[0], sketch.years[sketch.years.length-1], sketch.years[0]);

        sketch.year_slider = gesTimeSlider.getPos();
        sketch.idx = sketch.getIndexFromVal(sketch.year_slider);   
        sketch.slider_loaded = true;
        current_ges = sketch.all_ges[sketch.idx];
        current_proj_1990_1999 = sketch.trend_1990_1999[sketch.idx];
        current_proj_2000_2020 = sketch.trend_2000_2020[sketch.idx];
        sketch.last_ges_radius = sketch.mapRadius(sketch.all_ges[idx_2020]); 
        paris_r =  sketch.mapRadius(sketch.paris_ges)
        sketch.got_data = true;

    }
  };
  
   
  
  