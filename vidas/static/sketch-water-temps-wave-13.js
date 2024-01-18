
const water = ( sketch ) => {

  let canvas_width = document.querySelector("#p5sketchwater").offsetWidth;
  let xspacing_1;
  let xspacing_2;
  let wave_width;              
  let visualization_width = (canvas_width - (20*2)) / 3 ; //460
  let legend_width = 0;
  let margin_in_bet = 20;
  let margin_width = 0;
  let ymargin = margin_width;
  
  
  let theta1;  
  let theta2;
  let theta3;
  let amplitude1 = 15.0;  
  let amplitude2 = 15.0;  
  let amplitude3 = 15.0;  
  
  let period1 = 600.0;  
  let period2 = 400.0;  
  let period3 = 2000.0;  
  let dx1;  
  let dx2;  
  let dx3;  
  
  let target_y1 =0;
  let target_y2 =0;
  let target_y3 =0;
  
  let x_start_1;
  let x_end_1;
  
  let x_start_2;
  let x_end_2;
  
  let x_start_3;
  let x_end_3;

  let y_start;
  let y_end;
  
  let num_visualizations = 3;

  let num_years_1 = 14;
  let num_years_2 = 14;
  let num_years_3 = 14;

  let colors_water_legend = [];
  let legend_values_rhone = [];
  let legend_values_arve = [];
  let legend_values_leman = [];
  let lerping_color = false;
  
  
  let yvalues1 = [];  
  let yvalues2 = []; 
  
  let gray_shade = 245;
  let lerp_transition = 0.0;
  const lerp_inc = 0.05;
  let font_uomo;
  let font_legend;
  let font_legend_thin;
  
  let waterTimeSlider;
  let isLooping = false;

  let canvas;

  let grey_shade = 182;
  let black_text_shade = 32;

  sketch.preload = () => {
    font_uomo = sketch.loadFont('fonts/Swiss 721 Thin BT.ttf');
    font_legend = sketch.loadFont('fonts/Poppins/Poppins-Regular.ttf');
    font_legend_thin = sketch.loadFont('fonts/Poppins/Poppins-Thin.ttf');
    font_semi = sketch.loadFont('fonts/Poppins/Poppins-SemiBold.ttf');
    font_bold = sketch.loadFont('fonts/Poppins/Poppins-Bold.ttf');
  }

  
  sketch.draw_legend_for_one = (p_x_start, water_id) => {

    let legend_margin_w = 6;
    let legend_text_margin_w = 18;
    let legend_text_margin_h = 10;
    let legend_square_w = 14;
    let legend_square_h = 12;

    sketch.textSize(12);
    sketch.noStroke();
    sketch.textAlign(sketch.LEFT, sketch.TOP);

    sketch.textFont(font_legend);
    let rect_x_start = x_end_1+margin_width+legend_margin_w;

    rect_x_start = p_x_start;
    let legend_y_start = target_y1 + 10.0;

    for(let i = 0; i < colors_water_legend.length; i++){
      let idx = i;
      sketch.fill(colors_water_legend[idx]);
      sketch.rect(rect_x_start+(legend_square_w*i)+39*i,y_start+visualization_width+ 10,legend_square_w,legend_square_h);
      sketch.noStroke();
      sketch.fill(0);
      if(water_id == 1)
        sketch.text(legend_values_rhone[idx].toFixed(1),rect_x_start-32+((legend_square_w+21)*(i+1))+(legend_text_margin_w*(i+1)), y_start+visualization_width+8);
      else if(water_id == 2)
        sketch.text(legend_values_arve[idx].toFixed(1),rect_x_start-32+((legend_square_w+21)*(i+1))+(legend_text_margin_w*(i+1)), y_start+visualization_width+8);
      else if(water_id == 3)
        sketch.text(legend_values_leman[idx].toFixed(1),rect_x_start-32+((legend_square_w+21)*(i+1))+(legend_text_margin_w*(i+1)), y_start+visualization_width+8);
      
      sketch.noStroke();
    }
    sketch.textSize(16);
    sketch.textFont(font_legend);
    sketch.textAlign(sketch.CENTER, sketch.CENTER);
    sketch.noStroke();
    sketch.fill(gray_shade);
  }


    sketch.setup = () => {
      
      theta1 = 0.0;  
      theta2 = sketch.PI/3.5;
      theta3 = 0.0;

      colors_water_legend.push(sketch.color(3,4,94), sketch.color(2, 62, 138), sketch.color(0, 119, 182), sketch.color(0, 150, 199), sketch.color(72, 202, 228), sketch.color(144, 224, 239), sketch.color(173, 232, 244));
      colors_water_legend = colors_water_legend.reverse();

      sketch.current_color_rhone = colors_water_legend[0];      
      sketch.current_color_arve = colors_water_legend[0];      
      sketch.current_color_leman = colors_water_legend[0];
      
      sketch.slider_side_margin = 80;
      sketch.canvas_w = canvas_width;
      // sketch.canvas_h = 640.0;
      sketch.canvas_h = 660.0;
      sketch.year_slider = 0;
      sketch.timeline_y = 40;

      sketch.moving_avg_arve = []
      sketch.moving_avg_rhone = []
      sketch.moving_avg_leman = []
      sketch.src_color_palette_idx_rhone = 0;
      sketch.src_color_palette_idx_arve = 0;
      sketch.src_color_palette_idx_leman = 0;

      sketch.dst_color_palette_idx_rhone = 0;
      sketch.dst_color_palette_idx_arve = 0;
      sketch.dst_color_palette_idx_leman = 0;

      sketch.years = []
      let container = sketch.select("#p5sketchwater");
      canvas = sketch.createCanvas(sketch.canvas_w, sketch.canvas_h);
      container.child(canvas);

      sketch.year_x = sketch.canvas_w/2 + 50;
      sketch.year_y = 6;

      wave_width = sketch.canvas_w+16;
    
      yvalues1 = new Array(num_years_1);
      yvalues2 = new Array(num_years_2);
      yvalues3 = new Array(num_years_3);

      xspacing_1 = visualization_width/num_years_1;
      xspacing_2 = visualization_width/num_years_2;
      xspacing_3 = visualization_width/num_years_3;
    
      dx1 = (sketch.TWO_PI / period1) * visualization_width/num_years_1;
      dx2 = (sketch.TWO_PI / period2) * visualization_width/num_years_2;
      dx3 = (sketch.TWO_PI / period3) * visualization_width/num_years_3;
    
      target_y1 = sketch.canvas_h - ymargin-(visualization_width/2.0) - 100;
      target_y2 = target_y1;
      target_y3 = target_y1;
     
      // y_start = ymargin + 90;
      y_start = ymargin + 110;
      y_end = y_start+visualization_width;
      
        x_start_1 = margin_width;
        x_end_1 = x_start_1 + visualization_width;
        
        x_start_2 = x_end_1 + margin_in_bet;
        x_end_2 = x_start_2 + visualization_width;

        x_start_3 = x_end_2 + margin_in_bet;
        x_end_3 = x_start_3 + visualization_width;
        sketch.slider_loaded = false;

        sketch.loadJSON('/getWaterTemps?name=water-temps' , sketch.dataReceived);

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

    sketch.renderWaves = () => {

      sketch.textSize(16);
      sketch.textFont(font_legend);
      sketch.textAlign(sketch.CENTER, sketch.CENTER);
      sketch.noStroke();
      sketch.fill(gray_shade);
      sketch.rect(x_start_1,y_start,visualization_width,visualization_width);
        sketch.beginShape();
        sketch.fill(sketch.current_color_rhone);
        sketch.noStroke();

        let i = 0;
        sketch.vertex(x_start_1,y_end);

        theta1 += 0.02;
        let x1 = theta1;
      
        i = 1;
       for (i = 1; i < yvalues1.length-1; i++) {
          if(i == 1){
            yvalues1[i] = sketch.sin(x1)*amplitude1;
            sketch.vertex(x_start_1, target_y1+yvalues1[i]);    
          }
          else if(i == yvalues1.length-2){
            yvalues1[i] = sketch.sin(x1)*amplitude1;
            sketch.vertex(x_end_1, target_y1+yvalues1[i]);          
          }
          else{
            yvalues1[i] = sketch.sin(x1)*amplitude1;
            sketch.vertex(x_start_1+i*xspacing_1, target_y1+yvalues1[i]);
          }
          x1+=dx1;
        }

      sketch.vertex(x_end_1,y_end);  
      sketch.endShape(sketch.CLOSE);
      sketch.fill(0);
      sketch.noStroke();
      sketch.textSize(20);

      sketch.text("RHONE", x_start_1 + visualization_width/2.0, y_start-25);
      sketch.draw_legend_for_one(x_start_1, 1);


      // ARVE
      sketch.noStroke();
      sketch.fill(gray_shade);
      sketch.rect(x_start_2,y_start,visualization_width,visualization_width);
      sketch.beginShape();
      sketch.fill(sketch.current_color_arve);
      sketch.noStroke();
      i = 0;
      sketch.vertex(x_start_2,y_end);
      theta2 += 0.02;
      let x2 = theta2;
    
     for (i = 1; i < yvalues2.length-1; i++) {
        if(i == 1){
          yvalues2[i] = sketch.sin(x2)*amplitude2;
          sketch.vertex(x_start_2, target_y2+yvalues2[i]);    
        }else if(i == yvalues2.length-2){
          yvalues2[i] = sketch.sin(x2)*amplitude2;
          sketch.vertex(x_end_2, target_y2+yvalues2[i]);    
        }else{
          yvalues2[i] = sketch.sin(x2)*amplitude2;
          sketch.vertex(x_start_2+i*xspacing_2, target_y2+yvalues2[i]);
        }
        x2+=dx2;
      }

      sketch.vertex(x_end_2,y_end);  
      sketch.endShape(sketch.CLOSE);
      sketch.fill(0);
      sketch.noStroke();
      sketch.textSize(20);
      sketch.text("ARVE", x_start_2 + visualization_width/2.0, y_start-25);
      sketch.draw_legend_for_one(x_start_2, 2);

      // LAC LEMAN
      sketch.noStroke();
      sketch.fill(gray_shade);
      sketch.rect(x_start_3,y_start,visualization_width,visualization_width);
      sketch.beginShape();
      sketch.fill(sketch.current_color_leman);
      sketch.noStroke();
      i = 0;
      sketch.vertex(x_start_3,y_end);
      theta3 += 0.02;
      let x3 = theta3;
    
     for (i = 1; i < yvalues3.length-1; i++) {
        if(i == 1){
          yvalues3[i] = sketch.sin(x3)*amplitude3;
          sketch.vertex(x_start_3, target_y3+yvalues3[i]);    
        }else if(i == yvalues3.length-2){
          yvalues3[i] = sketch.sin(x3)*amplitude3;
          sketch.vertex(x_end_3, target_y3+yvalues3[i]);    
        }else{
          yvalues3[i] = sketch.sin(x3)*amplitude3;
          sketch.vertex(x_start_3+i*xspacing_3, target_y3+yvalues3[i]);
        }
        x3+=dx3;
      }

      sketch.vertex(x_end_3,y_end);  
      sketch.endShape(sketch.CLOSE);
      sketch.fill(0);
      sketch.noStroke();
      sketch.textSize(20);
      sketch.text("LAC LEMAN", x_start_3 + visualization_width/2.0, y_start-25);
      sketch.draw_legend_for_one(x_start_3, 3);

      sketch.textSize(14);
      sketch.textFont(font_legend);
      sketch.textAlign(sketch.LEFT, sketch.TOP);
      sketch.fill(0);
      sketch.noStroke();
      sketch.text("Visualisation 3. Moyenne mobile de 4 ans des températures annuelles homogènes de l'eau en degrés Celsius (Rhône et Arve), et moyenne mobile de 4 ans des températures annuelle de l'eau du Lac Léman entre 150 et 155 mètres de profondeur (station SHL2). Sources des données : Division Hydrologie de l’OFEV (Rhône et Arve) et CIPEL (Lac Léman).", 0 , sketch.canvas_h - 70, canvas_width);

    }


    sketch.mouseWheel = (event) => {
      let bounds = canvas.elt.getBoundingClientRect();

      // if (bounds.bottom > 0 && bounds.top <= sketch.windowHeight) {

      //   if (!isLooping) {
      //     isLooping = true;
      //     sketch.loop();
      //     // console.log("water loop");

      //   }
      // } else if (isLooping) {
      //   isLooping = false;
      //   sketch.noLoop();
      //   // console.log("water noLoop");

      // }
    }

    sketch.draw = () => {
      sketch.background(255);

        if(sketch.slider_loaded == true){
          waterTimeSlider.update();
          waterTimeSlider.display_as_line();

          if(sketch.year_slider != waterTimeSlider.getPos()){

            sketch.year_slider = waterTimeSlider.getPos();
            sketch.src_color_palette_idx_rhone = sketch.int(sketch.map(sketch.moving_avg_rhone[sketch.idx], sketch.min(sketch.moving_avg_rhone), sketch.max(sketch.moving_avg_rhone), 0, colors_water_legend.length-1));
            sketch.src_color_palette_idx_arve = sketch.int(sketch.map(sketch.moving_avg_arve[sketch.idx], sketch.min(sketch.moving_avg_arve), sketch.max(sketch.moving_avg_arve), 0, colors_water_legend.length-1));
            sketch.src_color_palette_idx_leman = sketch.int(sketch.map(sketch.moving_avg_leman[sketch.idx], sketch.min(sketch.moving_avg_leman), sketch.max(sketch.moving_avg_leman), 0, colors_water_legend.length-1));

            lerping_color = true;

            sketch.idx = sketch.getIndexFromVal(sketch.year_slider);   

            current_mov_avg_rhone = sketch.moving_avg_rhone[sketch.idx];
            current_mov_avg_arve = sketch.moving_avg_arve[sketch.idx];
            current_mov_avg_leman = sketch.moving_avg_leman[sketch.idx];

            sketch.dst_color_palette_idx_rhone = sketch.int(sketch.map(current_mov_avg_rhone, sketch.min(sketch.moving_avg_rhone), sketch.max(sketch.moving_avg_rhone), 0, colors_water_legend.length-1));
            sketch.dst_color_palette_idx_arve = sketch.int(sketch.map(current_mov_avg_arve, sketch.min(sketch.moving_avg_arve), sketch.max(sketch.moving_avg_arve), 0, colors_water_legend.length-1));            
            sketch.dst_color_palette_idx_leman = sketch.int(sketch.map(current_mov_avg_leman, sketch.min(sketch.moving_avg_leman), sketch.max(sketch.moving_avg_leman), 0, colors_water_legend.length-1));
            
            initial_ms = sketch.millis();

        }

        if(lerping_color){

          lerp_transition += lerp_inc;
          sketch.current_color_rhone = sketch.lerpColor(colors_water_legend[sketch.src_color_palette_idx_rhone], colors_water_legend[sketch.dst_color_palette_idx_rhone], lerp_transition);
          sketch.current_color_arve = sketch.lerpColor(colors_water_legend[sketch.src_color_palette_idx_arve], colors_water_legend[sketch.dst_color_palette_idx_arve], lerp_transition);
          sketch.current_color_leman = sketch.lerpColor(colors_water_legend[sketch.src_color_palette_idx_leman], colors_water_legend[sketch.dst_color_palette_idx_leman], lerp_transition);

          if (lerp_transition >= 1.0){
            lerp_transition = 0.0;
            lerping_color = false;
          }
        }

        sketch.year_slider = waterTimeSlider.getPos();
      }

      if(sketch.got_data){
        sketch.renderWaves();

        sketch.textAlign(sketch.CENTER, sketch.CENTER);
        sketch.noStroke();
        sketch.fill(black_text_shade);
        sketch.textSize(20);
        sketch.textFont(font_bold);      
        sketch.text(sketch.str(sketch.year_slider-3)+"-"+sketch.str(sketch.year_slider), sketch.width/2.0,sketch.year_y);


        // timeline
        sketch.textAlign(sketch.LEFT,sketch.CENTER);
        sketch.noStroke()
        sketch.textSize(16);
        sketch.textFont(font_semi);    
        sketch.text(sketch.str(sketch.years[0]), 10, sketch.timeline_y-3);
        let year_end_x = sketch.width-sketch.slider_side_margin+20;
        let year_end_y = sketch.timeline_y;
        sketch.text(sketch.str(sketch.years[sketch.years.length-1]), year_end_x, year_end_y-3);

      }

    }

    // Reply back from flask server
    sketch.dataReceived = (codata) => {
      sketch.got_data = true;
      sketch.counter = 0;

      sketch.min_moving_avg_rhone = Infinity;
      sketch.min_moving_avg_arve = Infinity;
      sketch.min_moving_avg_leman = Infinity;

      sketch.max_moving_avg_rhone = 0.0;
      sketch.max_moving_avg_arve = 0.0;
      sketch.max_moving_avg_leman = 0.0;


        for (let i = 0; i < Object.keys(codata["time"]).length; i++) {
          sketch.moving_avg_arve[i] = codata['moving_avg_arve'][i];
          sketch.moving_avg_rhone[i] = codata['moving_avg_rhone'][i];
          sketch.moving_avg_leman[i] = codata['moving_avg_leman'][i];

          let year = sketch.str(codata['time'][i]);
          sketch.years[i] = year;

          if( sketch.moving_avg_arve[i] < sketch.min_moving_avg_arve){
            sketch.min_moving_avg_arve = sketch.moving_avg_arve[i]; 
          } 

          if( sketch.moving_avg_arve[i] > sketch.max_moving_avg_arve){
            sketch.max_moving_avg_arve = sketch.moving_avg_arve[i]; 
          }

          if( sketch.moving_avg_rhone[i] < sketch.min_moving_avg_rhone){
            sketch.min_moving_avg_rhone = sketch.moving_avg_rhone[i]; 
          } 

          if( sketch.moving_avg_rhone[i] > sketch.max_moving_avg_rhone){
            sketch.max_moving_avg_rhone = sketch.moving_avg_rhone[i]; 
          }  

          if( sketch.moving_avg_leman[i] < sketch.min_moving_avg_leman){
            sketch.min_moving_avg_leman = sketch.moving_avg_leman[i]; 
          } 

          if( sketch.moving_avg_leman[i] > sketch.max_moving_avg_leman){
            sketch.max_moving_avg_leman = sketch.moving_avg_leman[i]; 
          }  

        }
        
        // rhone
        legend_values_rhone.push(parseFloat(sketch.float(sketch.min_moving_avg_rhone).toFixed(1)));
        let diff_legend_rhone = parseFloat(((sketch.max_moving_avg_rhone - sketch.min_moving_avg_rhone) / (colors_water_legend.length-1)).toFixed(1));
        // console.log(diff_legend_rhone);
        let current_legend_rhone_val = legend_values_rhone[0];

        for(let i= 0; i < colors_water_legend.length-1; i++){
          current_legend_rhone_val += diff_legend_rhone;
          legend_values_rhone.push(parseFloat(current_legend_rhone_val.toFixed(1)));
        }
        // console.log(legend_values_rhone);
  
        // arve
        legend_values_arve.push(parseFloat(sketch.float(sketch.min_moving_avg_arve).toFixed(1)));
        let diff_legend_arve = parseFloat(((sketch.max_moving_avg_arve - sketch.min_moving_avg_arve) / (colors_water_legend.length-1)).toFixed(1));
        // console.log(diff_legend_arve);
        let current_legend_arve_val = legend_values_arve[0];

        for(let i= 0; i < colors_water_legend.length-1; i++){
          current_legend_arve_val += diff_legend_arve;
          legend_values_arve.push(parseFloat(current_legend_arve_val.toFixed(1)));
        }
        // console.log(legend_values_arve);

        // leman
        legend_values_leman.push(parseFloat(sketch.float(sketch.min_moving_avg_leman).toFixed(1)));
        let diff_legend_leman =  parseFloat(((sketch.max_moving_avg_leman - sketch.min_moving_avg_leman) / (colors_water_legend.length-1)).toFixed(1));
        // console.log(diff_legend_leman);
        let current_legend_leman_val = legend_values_leman[0];

        for(let i= 0; i < colors_water_legend.length-1; i++){
          current_legend_leman_val += diff_legend_leman;
          legend_values_leman.push(parseFloat(current_legend_leman_val.toFixed(1)));
        }
        // console.log(legend_values_leman);


        waterTimeSlider = new HScrollbar(sketch, sketch.slider_side_margin-16, sketch.timeline_y, sketch.canvas_w-(sketch.slider_side_margin*2)+28, 12, 12, sketch.years[0], sketch.years[sketch.years.length-1], sketch.years[0]);
        sketch.year_slider = waterTimeSlider.getPos();
        sketch.idx = sketch.getIndexFromVal(sketch.year_slider);   
        sketch.slider_loaded = true;
    }

  };   
    