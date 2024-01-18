
const glacier = ( sketch ) => {


  var curve_points = Object.seal([
    -124.5668014404364,
     -124.40751630356047,
     -123.93670563244838,
     -123.17499525444785,
     -122.15510580349799,
     -120.91950222130392,
     -119.51735871225779,
     -118.00107094433172,
     -116.42258150874753,
     -114.82979833491152,
     -113.26337785706735,
     -111.75411586914547,
     -110.26707994570619,
     -108.68146617134623,
     -107.00367595347458,
     -105.2479416109458,
     -103.42985994723021,
     -101.56584846290174,
     -99.67253275545096,
     -97.76610573012988,
     -95.86170189187311,
     -93.97282937938641,
     -92.11089857374387,
     -90.32208396237633,
     -88.83225254068316,
     -87.66286552612144,
     -86.77767335585006,
     -86.12297683843883,
     -85.63193024982056,
     -85.22976180969687,
     -84.83951319247717,
     -84.38786127291863,
     -83.81058051287889,
     -83.05723360338908,
     -82.10245365891593,
     -81.10054722988306,
     -80.11315113150711,
     -79.13406548305917,
     -78.15851425469597,
     -77.18310022098181,
     -76.20567827261539,
     -75.2251690174705,
     -74.24133815829629,
     -73.25456848658915,
     -72.26565040256312,
     -71.27561376290396,
     -70.10841467918496,
     -68.60168720028389,
     -66.79648314410255,
     -64.75700057826205,
     -62.56573662607201,
     -60.31723505302819,
     -58.11091182733334,
     -56.0435130054397,
     -54.20178753017757,
     -52.65594066209483,
     -51.45437310543759,
     -50.6115623342623,
     -50.10341027993297,
     -49.90140003967569,
     -49.95607425289926,
    ]);
                
    let legend_width = 100;
    let margin_width_glacier = 20;
    let ymargin_glacier = margin_width_glacier;
    let easing = 0.40;    
    let font_uomo_glacier;
    let font_legend_glacier;
    let glacierTimeSlider;
    
    let min_glacier_height = 0;
    let max_glacier_height = 0;
    let current_glacier_volume = 0;
    let target_glacier_volume = 0;
    

  let THE_SEED;
  let glacier_width = document.querySelector("#p5sketchglacier").offsetWidth;
  let resolution = 60;
  let noise_zoom = 90;
  let magnitude = 120;
  let plate_padding = 0;
  let visualizations = [];
  let number_of_vis = 1;
  let palette;
  let y_anim = 0;

  let  number_of_plates = 2;

  let isLooping = false;
  var canvas;
  let year_slider = 0;

  

  sketch.preload = () => {
    font_uomo_glacier = sketch.loadFont('fonts/Swiss 721 Thin BT.ttf');
    font_legend_glacier = sketch.loadFont('fonts/Poppins/Poppins-Regular.ttf');
    font_vol = sketch.loadFont('fonts/Poppins/Poppins-Bold.ttf');
  }

    sketch.setup = () => {

      sketch.got_data = false;
      sketch.m_over = false;

      sketch.glacier_volume = []
      sketch.years = []


      sketch.strokeWeight(1);
      sketch.idx = 0;
      sketch.playing = false;
      sketch.next = false


      sketch_mountain_color = sketch.color(155, 80, 43);
      sketch_glacier_color = sketch.color("#dde2de");
      // sketch_glacier_color = sketch.color("#F5EFE6");
      
  
      THE_SEED = sketch.floor(sketch.random(9999999));
      sketch.noiseSeed(THE_SEED);
      
  
      sketch.canvas_w = glacier_width;//720;
      sketch.canvas_h = 720;


      sketch.min_glacier_volume = Infinity;
      sketch.max_glacier_volume = 0;

      let container = sketch.select("#p5sketchglacier");
      canvas = sketch.createCanvas(sketch.canvas_w, sketch.canvas_h);
      container.child(canvas);

      canvas.mouseOver(sketch.m_in);
      canvas.mouseOut(sketch.m_out);


      let bounds = canvas.elt.getBoundingClientRect();
      
      isLooping = true;
      if (bounds.bottom < 0 || bounds.top > sketch.windowHeight) {      
            sketch.noLoop();
        isLooping = false;
        // console.log("glacier noLoop");
      }


      sketch.playing = false;
      sketch.loadJSON('/getGlacierVol?name=glacier-vol' , sketch.dataReceived);

    }

    sketch.render_layers = () => {

    sketch.textSize(16);
    sketch.textFont(font_uomo_glacier);
    sketch.textAlign(sketch.LEFT, sketch.CENTER);
    
    sketch.noStroke();
    let gray_shade = 245;
    sketch.fill(gray_shade);
      sketch.push();
      sketch.translate(0, sketch.height - 65);

      visualizations.forEach(function(visualization) {
      display_block(visualization);
      }, this);
      sketch.pop();

      sketch.noFill();
      // var yellow_color = "#FAE57C";
      // var yellow_color = "#F4D160";
      var yellow_color = "#FFD57E";
      var grey_shade = 96;
      let initial_x_year =  140;
      let initial_y_year =  150;
      sketch.fill(grey_shade,grey_shade,grey_shade);
      sketch.noStroke();
      sketch.textSize(42);
      sketch.textFont(font_vol);
      sketch.text(sketch.str(year_slider), initial_x_year, initial_y_year);
      sketch.fill(yellow_color);
      sketch.noStroke();

      sketch.text(sketch.str(current_glacier_volume.toFixed(2)), initial_x_year+200, initial_y_year);
      // sketch.text("KM3", initial_x_year+335, initial_y_year);
      sketch.text("KM", initial_x_year+335, initial_y_year);
      sketch.textSize(24);
      sketch.text("3", initial_x_year+403, initial_y_year-10);

      sketch.textSize(14);
      sketch.textFont(font_legend_glacier);
      sketch.textAlign(sketch.LEFT, sketch.TOP);
      sketch.noStroke();
      sketch.fill(0);
      sketch.text("Visualisation 2. Volume du glacier du Rhône en Km3. Source des données : GLAMOS.", 0 , sketch.height - 60, glacier_width);

    }

    sketch.m_in = () => {
      if(sketch.m_over != true && sketch.got_data){
        sketch.m_over = true;
        sketch.idx = 0;
        year_slider = sketch.int(sketch.years[0]);
        sketch.playing = true;
      }
    }
    sketch.m_out = () => {
      if(sketch.m_over != false){
        sketch.playing = false;
        sketch.idx = 0;
        year_slider = sketch.int(sketch.years[0]);
        sketch.m_over = false;

        target_glacier_volume = sketch.glacier_volume[sketch.idx]; 
        current_glacier_volume = target_glacier_volume;
        current_glacier_vol_height = sketch.int(sketch.map(current_glacier_volume, sketch.min_glacier_volume, sketch.max_glacier_volume, min_glacier_height, max_glacier_height));

      }
    }
    

    sketch.mouseWheel = (event) => {
      let bounds = canvas.elt.getBoundingClientRect();

      // if (bounds.bottom > 0 && bounds.top <= sketch.windowHeight) {

      //   if (!isLooping) {
      //     isLooping = true;
      //     sketch.loop();
      //     // console.log("glacier loop");
      //   }
      // } else if (isLooping) {
      //   isLooping = false;
      //   sketch.noLoop();
      //   // console.log("glacier noLoop");
      //   sketch.idx = 0;
      //   year_slider = sketch.int(sketch.years[0]);
      //   sketch.playing = false;

      // }
    }   



    sketch.draw = () => {
      
    if(sketch.got_data){

      sketch.background(255);
      let current_height = 0;
  
      if(sketch.next){
        current_glacier_volume = target_glacier_volume;
        current_glacier_vol_height = sketch.int(sketch.map(current_glacier_volume, sketch.min_glacier_volume, sketch.max_glacier_volume, min_glacier_height, max_glacier_height));

        year_slider += 1;
        sketch.idx  += 1;

        target_glacier_volume = sketch.glacier_volume[sketch.idx];
        sketch.next = false;

        let max_year = sketch.int(sketch.years[sketch.years.length-1]);
        if(year_slider == max_year){
          sketch.playing = false;
        }
      
      }

      
      if(sketch.playing){
      if(sketch.start){
        current_glacier_volume = target_glacier_volume;
        current_glacier_vol_height = sketch.int(sketch.map(current_glacier_volume, sketch.min_glacier_volume, sketch.max_glacier_volume, min_glacier_height, max_glacier_height));
        sketch.start = false;
      }else{

        let dx = target_glacier_volume - current_glacier_volume;
        let inc = dx * easing;
    
          if(Math.abs(dx) > 0.1){
          current_glacier_volume += inc;
          current_glacier_vol_height = sketch.int(sketch.map(current_glacier_volume, sketch.min_glacier_volume, sketch.max_glacier_volume, min_glacier_height, max_glacier_height));    
          }else{
            sketch.next = true;
          }

      }
    }
  
        sketch.render_layers();
      }

    }

 
    sketch.dataReceived = (volumedata) => {

        for (let i = 0; i < Object.keys(volumedata["year"]).length; i++) {

          sketch.glacier_volume[i] = volumedata['volume_km3'][i];
          let year = sketch.str(volumedata['year'][i]);
          sketch.years[i] = year;

          if( sketch.glacier_volume[i] < sketch.min_glacier_volume){
            sketch.min_glacier_volume = sketch.glacier_volume[i];           
          } 

          if( sketch.glacier_volume[i] > sketch.max_glacier_volume){
            sketch.max_glacier_volume = sketch.glacier_volume[i]; 
          }
          year_slider = sketch.int(sketch.years[0]);

        }

        min_glacier_height = sketch.min_glacier_volume*2.0;
        max_glacier_height = sketch.max_glacier_volume*2.0;        

        target_glacier_volume = sketch.glacier_volume[sketch.idx];
        current_glacier_volume = target_glacier_volume;
        current_glacier_vol_height = sketch.int(sketch.map(current_glacier_volume, sketch.min_glacier_volume, sketch.max_glacier_volume, min_glacier_height, max_glacier_height));
  
        for (var i = 0; i < number_of_vis; i++) {
          visualizations.push(create_block(number_of_plates, i));
        }
  
        sketch.got_data = true;
      }

    function create_block(number_of_plates) {
      let plates = [];
      for (var plate_index = 0; plate_index < number_of_plates; plate_index++) {
        let points = [];
  
        let plate_height = 0;
        if (plate_index > 0) {
          plate_height = min_glacier_height;

          for (let i = 0; i <= resolution; i++) {
            let temp_y = curve_points[i] - 150;
            points.push(temp_y);
          }
          plates.push({
            points: points,
            color: sketch_glacier_color
          });
  
        } else {
          plate_height = max_glacier_height;
          for (let i = 0; i <= resolution; i++) {
            let temp_y = curve_points[i] - 150;
            points.push(temp_y);
          }
          plates.push({
            points: points,
            color:  sketch_mountain_color
          });
  
        }
  
      }
      return plates;
    }
  
    function display_block(visualization) {

      visualization.forEach(function(plate, index) {
        sketch.fill(plate.color);
        sketch.beginShape();
        if (index == 0) {
          sketch.vertex(0, 0);
          sketch.vertex(glacier_width, 0);
        } else {
          for (let i = 0; i <= resolution; i++) {
            sketch.vertex(i * glacier_width / resolution, visualization[index - 1].points[i] - plate_padding );
          }
        }
  
        for (let i = resolution; i >= 0; i--) {
          sketch.vertex(i * glacier_width / resolution, visualization[index].points[i] - current_glacier_vol_height);
        }
  
        sketch.endShape(sketch.CLOSE);
      }, this);
    }
  
  
  };   
