

    const gradient_v1 = ( sketch ) => {


    // based on the norm 61/90 (1991-2022)
    temp_anomalies = [];

    curr_temps_decades_transitions = [];
    prev_temps_decades_transitions = [];
        
    let color_palette = [];
    let boundaries_color_code = [];
    let temps_index = 0;
    let color_val = 0;
    let lineColor = 0;
    let lerp_transition = 0.0;
    const lerp_inc = 0.05;
    const alpha_inc = 10;
    
    let src_color;
    let dst_color;
    let current_color;
    let band_width = 0.0;
    let band_height = 0.0;
    const legend_height = 100.0;
    
    const canvas_w = document.querySelector("#p5sketchinteractivetemps").offsetWidth //1490.0;
    const band_aspect_ratio = 0.85;
    
    let current_alpha_decades = [];
    let current_color_palette_idx = 0;
    
    let font_uomo;
    let font_legend;
    let font_poppins_bold;
    let isLooping = false;

    let initial_decade = 0;
    let currente_decade = initial_decade;


    sketch.preload = () => {
      font_uomo = sketch.loadFont('fonts/Swiss 721 Thin BT.ttf');
      font_legend = sketch.loadFont('fonts/Poppins/Poppins-Regular.ttf');
      font_poppins_bold = sketch.loadFont('fonts/Poppins/Poppins-Bold.ttf');

    }
    
    let max_decade_displayed = 0
    let prev_max_decade_displayed = 0;
    let curr_max_decade_displayed = 0;
    let decade_transition = false;

    let canvas;
    let offset = 31;

    let grey_shade = 182;
    let black_text_shade = 32;
  

    sketch.m_in = () => {
      sketch.m_over = true;
    }
    sketch.m_out = () => {
      sketch.m_over = false;
    }
    
    sketch.setup = () => {

      sketch.loadJSON('/getAirTempAnomalies?name=air-temp-anomalies' , sketch.dataReceived);
      sketch.data_loaded = false;
      sketch.m_over = false;

        sketch.noStroke();

        color_palette.push(sketch.color(255,237,127));
        color_palette.push(sketch.color(255,211,0));
        color_palette.push(sketch.color(253,183,0));
        color_palette.push(sketch.color(253,104,1));
        color_palette.push(sketch.color(229,1,0));

        
        band_width = (canvas_w / 8);
        band_height = band_width * band_aspect_ratio;
        let container = sketch.select("#p5sketchinteractivetemps");
        canvas = sketch.createCanvas(canvas_w, band_height+legend_height);
        container.child(canvas);

        canvas.mouseOver(sketch.m_in);
        canvas.mouseOut(sketch.m_out);

        let bounds = canvas.elt.getBoundingClientRect();
      
        isLooping = true;

        if (bounds.bottom < 0 || bounds.top > sketch.windowHeight) {
          sketch.noLoop();
          isLooping = false;
        }

      }

    sketch.mouseWheel = (event) => {
      let bounds = canvas.elt.getBoundingClientRect();
      // if (bounds.bottom > 0 &&
      //     bounds.top <= sketch.windowHeight) {

      //   if (!isLooping) {
      //     isLooping = true;
      //     sketch.loop();
      //     // console.log("temps loop");

      //   }
      // } else if (isLooping) {
      //   isLooping = false;
      //   sketch.noLoop();
      //   // console.log("temps noLoop");

      // }
    }
    sketch.drawLegendText = () => {
      sketch.textSize(14);
      sketch.textFont(font_legend);
      sketch.textAlign(sketch.LEFT, sketch.TOP);
      sketch.fill(black_text_shade);

      // sketch.text("Visualisation 1. Anomalies de température, en degrés Celsius, de l'air à Genève à 2m du sol par rapport à la moyenne des années de", 0 , sketch.height - 50);
      // sketch.text("1961 à 1990. Source des données : Meteo Suisse, station de Cointrin.", 0 , sketch.height - 30);
      sketch.text("Visualisation 1. Anomalies de température, en degrés Celsius, de l'air à Genève à 2m du sol par rapport à la moyenne des années de 1961 à 1990. Source des données : Meteo Suisse, station de Cointrin.", 0 , sketch.height - 75, canvas_w);
      // sketch.textWrap("WORD");
    }

    sketch.drawLegendColorCode = () => {

      let legend_rects_width = 27;
      let legend_rects_height = 12;
      let legend_rects_sep = 45;
      let legend_text_sep = 8;

      sketch.noStroke();
      for(let i=0; i < color_palette.length; i+=1){

        let x_rect = (i*legend_rects_width)+(i*legend_rects_sep);//-4+sketch.width*(3.0/4.0)+(i*legend_rects_width) + (i*legend_rects_sep);
        let x_text = x_rect + legend_rects_width + legend_text_sep;
        let y_rect = 0//sketch.height - legend_rects_height - 28;
        let y_text = y_rect + 3;

        sketch.fill(sketch.red(color_palette[i]), sketch.green(color_palette[i]), sketch.blue(color_palette[i]));
        sketch.rect(x_rect,y_rect,legend_rects_width,legend_rects_height);

        sketch.fill(black_text_shade);
        sketch.textSize(14);
        sketch.textFont(font_legend);
        sketch.textAlign(sketch.LEFT, sketch.CENTER);
        sketch.fill(32);
        sketch.text(sketch.str(boundaries_color_code[i]), x_text, y_text);
      }
    }

    sketch.draw = () => {
    
      if(sketch.data_loaded){
        sketch.background(255);


        sketch.drawLegendText();
        sketch.drawLegendColorCode();


        currente_decade = initial_decade;

        for(let i=0; i < temp_anomalies.length; i+=1){

          let current_temp_decade = temp_anomalies[i]
          
          current_color_palette_idx = 0;
          if(current_temp_decade > boundaries_color_code[boundaries_color_code.length-1] ){
            current_color_palette_idx = boundaries_color_code.length-1;
          }else if(current_temp_decade > boundaries_color_code[boundaries_color_code.length-2] ){
            current_color_palette_idx = boundaries_color_code.length-2;

          } else if(current_temp_decade > boundaries_color_code[boundaries_color_code.length-3] ){
            current_color_palette_idx = boundaries_color_code.length-3;

          } else if(current_temp_decade > boundaries_color_code[boundaries_color_code.length-4] ){
            current_color_palette_idx = boundaries_color_code.length-4;

          } else{
            current_color_palette_idx = boundaries_color_code.length-5;

          }

          if(sketch.m_over){
              // max_decade_displayed = sketch.int(sketch.map(sketch.mouseX, 0, sketch.width-(band_width* band_aspect_ratio), 1, temps_decades.length));
              max_decade_displayed = sketch.int(sketch.map(sketch.mouseX, 0, sketch.width-(band_width* band_aspect_ratio), 1, temp_anomalies.length));
            }    
          if(i == 0 && max_decade_displayed == 0){
            current_alpha_decades[0] = 255;
          }
          else if(max_decade_displayed > i){
            if(current_alpha_decades[i] < 255){
              current_alpha_decades[i] += alpha_inc;
            }
          }else{
            if(current_alpha_decades[i] > 0){
              current_alpha_decades[i] -= alpha_inc;
            }
            }

          sketch.fill(sketch.red(color_palette[current_color_palette_idx]), sketch.green(color_palette[current_color_palette_idx]), sketch.blue(color_palette[current_color_palette_idx]),  sketch.int(current_alpha_decades[i]));
            if(i==4){
            sketch.rect((i*band_width),20,band_width+1,(band_width) * band_aspect_ratio);
            }else{
            sketch.rect((i*band_width),20,band_width,(band_width) * band_aspect_ratio);
            }
            sketch.fill(64,sketch.int(current_alpha_decades[i]));
            sketch.textSize(24);
            sketch.textFont(font_legend);
            sketch.textAlign(sketch.CENTER, sketch.CENTER);
    
            sketch.text(sketch.str(currente_decade)+"s", band_width/2 + (i*band_width) , band_height/2 + 20);
          
        currente_decade+=10;
      }
       
    }
      }



    sketch.dataReceived = (data) => {


      for (let i = 0; i < Object.keys(data["decade"]).length; i++) {
          temp_anomalies[i] = data['temp_anomaly'][i];
          if(i == 0){
            initial_decade = data['decade'][i];
            currente_decade = initial_decade;
          }
        }  
        sketch.data_loaded = true;

        for(let i = 0; i < temp_anomalies.length; i+=1){
          curr_temps_decades_transitions.push(false);
          prev_temps_decades_transitions.push(false);
          current_alpha_decades.push(0);
        }

        // calculate the boundaries of the color code
        let test_temp = sketch.min(temp_anomalies);
        let test_color_palette_idx = sketch.int(sketch.map(test_temp, sketch.min(temp_anomalies), sketch.max(temp_anomalies), 0, color_palette.length));



        boundaries_color_code.push(test_temp.toFixed(2));
        let counter = 0;
          for(let i = 0; i < color_palette.length; i++){
          if(counter == 1){
            test_temp = 0.5;
          }else if(counter == 2){
            test_temp = 0.9;
          }else if(counter == 3){
            test_temp = 1.5;
          }else if(counter == 4){
            test_temp = 2.0;
          }

          counter = counter +1;
          if(sketch.int(sketch.map(test_temp, sketch.min(temp_anomalies), sketch.max(temp_anomalies), 0, color_palette.length)) != test_color_palette_idx){
            test_color_palette_idx = sketch.int(sketch.map(test_temp, sketch.min(temp_anomalies), sketch.max(temp_anomalies), 0, color_palette.length));
            boundaries_color_code.push(test_temp.toFixed(2));
          }
        }

        src_temp = temp_anomalies[temps_index]
        dst_temp = temp_anomalies[temps_index]
        src_color_palette_idx = sketch.int(sketch.map(src_temp, sketch.min(temp_anomalies), sketch.max(temp_anomalies), 0, color_palette.length));
    
        src_color = color_palette[src_color_palette_idx];
        dst_color_palette_idx = src_color_palette_idx;
        dst_color = src_color

    }

    }