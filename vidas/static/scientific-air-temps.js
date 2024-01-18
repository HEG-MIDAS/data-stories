function generate_svg_temp_air(){
  // set the dimensions and margins of the graph
  // const margin_air_temps = {top: 10, right: 5, bottom: 80, left: 50},
  const margin_air_temps = {top: 10, right: 5, bottom: 140, left: 50}
  var width_air_temps = d3.select("#my_dataviz_air_temps").node().getBoundingClientRect().width - margin_air_temps.left - margin_air_temps.right;
  var height_air_temps = 360
    
    
    // append the svg object to the body of the page
    const svg_air_temps = d3.select("#my_dataviz_air_temps")
      .append("svg")
        .attr("width", width_air_temps + margin_air_temps.left + margin_air_temps.right)
        .attr("height", height_air_temps + margin_air_temps.top + margin_air_temps.bottom)
      .append("g")
        .attr("transform",
              `translate(${margin_air_temps.left}, ${margin_air_temps.top})`);
    
    
    //Read the data
    // d3.csv("data/order_109743_GVE_th6190yv_1_data_processed_from50.csv").then(function(data) {
    // d3.csv("data/order_109743_GVE_th6190yv_1_data_processed_from50_lr.csv").then(function(data) {
    d3.csv("data/order_109743_GVE_th6190yv_1_data_processed_from50_lr_80s.csv").then(function(data) {
    
        // const allGroup_air_temps = ["th6190yv","lr"]
        const allGroup_air_temps = ["th6190yv"]
        
        const dataReady_air_temps = allGroup_air_temps.map( function(grpName) { 
          return {
            name: grpName,
            values: data.map(function(d) {
              return {time: d.time, value: +d[grpName]};
            })
          };
        });

    
      const tooltip_air_temps = d3.select("#my_dataviz_air_temps")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "#FFFFFF00")
        .style("padding", "10px")
        .style("user-select", "none");
    
        const myColor_air_temps = d3.scaleOrdinal()
          .domain(allGroup_air_temps)
          .range(d3.schemeSet2);

        const x_scale_air_temps = d3.scaleLinear()
          .domain([1950,2022])
          .range([ 0, width_air_temps ]);

        const x_air_temps = d3.axisBottom(x_scale_air_temps)
          .ticks(20)
          .tickFormat(d3.format("d"))


  // Drop shadow filter from Lao ////
  // https://observablehq.com/@laotzunami/d3-drop-shadow

    // drop shadow filter
    let reposition = 1         // adjust to prevent clipping
    let scaleBoundingBox = 4   // adjust to prevent clipping
    let angle = 1.75 * Math.PI // angle of the offset, measured from the right, clockwise in radians
    let distance = 7           // how far the shadow is from object
    let blur = 2               // ammount of Gausian blur
    let shadowColor = '#003152'// 
    let shadowOpacity = .4     // how strong the shadow is
    
    var dropShadow = svg_air_temps
    .append("filter")
      .attr("id", "dropshadow")
      .attr("x", (1-scaleBoundingBox)/2 + reposition * Math.cos(angle) )
      .attr("y", (1-scaleBoundingBox)/2 - reposition  * Math.sin(angle) )
      .attr("width",  scaleBoundingBox)
      .attr("height", scaleBoundingBox)
      .attr("filterUnits", "objectBoundingBox"); // userSpaceOnUse or objectBoundingBox
    dropShadow.append("feGaussianBlur")
      .attr("in", "SourceAlpha")
      .attr("stdDeviation", blur)
      .attr("result", "blur");
    dropShadow.append("feOffset")
      .attr("in", "blur")
      .attr("dx", distance *  Math.cos(angle) )
      .attr("dy", distance * -Math.sin(angle) )
      .attr("result", "offsetBlur")
    dropShadow.append("feFlood")
      .attr("in", "offsetBlur")
      .attr("flood-color", shadowColor)
      .attr("flood-opacity", shadowOpacity )
      .attr("result", "offsetColor");
    dropShadow.append("feComposite")
      .attr("in", "offsetColor")
      .attr("in2", "offsetBlur")
      .attr("operator", "in")
      .attr("result", "offsetBlur");

    var feMerge = dropShadow.append("feMerge");
    feMerge.append("feMergeNode")
      .attr("in", "offsetBlur")
    feMerge.append("feMergeNode")
      .attr("in", "SourceGraphic");

      ///////////////////////////////////



    // text label for the x axis
    svg_air_temps.append("text")             
        .attr("transform",
              "translate(" + (width_air_temps/2) + " ," +  (height_air_temps + margin_air_temps.top + 30) + ")")
        .style("text-anchor", "middle")
        .text("Année");
        
    // text label for the y axis
    svg_air_temps.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin_air_temps.left)
        .attr("x",0 - (height_air_temps / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Anomalie de température");      
        
    svg_air_temps.append("text")             
        // .attr("transform","translate(" + 0 + " ," +  (height_air_temps + margin_air_temps.top + 60) + ")")
        .attr("transform","translate(" + 0 + " ," +  (height_air_temps + margin_air_temps.top + 70) + ")")
        .style("text-anchor", "left")
        .style('fill', 'grey')
        .text("Figure 1. Anomalies de température, en degrés Celsius, de l'air à Genève à 2m du sol par rapport a la norme 6190. Météo Suisse, station de Cointrin.")
        .call(wrap, width_air_temps);

      const y_air_temps = d3.scaleLinear()
        .domain( [-1.5, 3.5])
        .range([ height_air_temps, 0 ]);


      svg_air_temps.append("g")
        .call(d3.axisLeft(y_air_temps));


      // Add the lines
      const line_air_temps = d3.line()
        .x(d => x_scale_air_temps(+d.time))
        .y(d => y_air_temps(+d.value));
        


      svg_air_temps.selectAll("myLines_air_temps")
        .data(dataReady_air_temps)
        .join("path")
          .attr("class", d => d.name)
          .attr("d", d => line_air_temps(d.values))
          .attr("stroke", d =>  "#ff0000")
          .style("stroke-width", 4)
          .style("fill", "none");
    
      const mouseover_air_temps = function(event, d) {
        tooltip_air_temps
          .style("opacity", 1)
      }
    
      const mousemove_air_temps = function(event, d) {
        const tooltipHeight = tooltip_air_temps.node().offsetHeight;
        tooltip_air_temps
          .html(`${d.value.toFixed(2)}`)
          .style("left", event.x + "px") 
          .style("top", event.y - tooltipHeight + window.scrollY + "px")
        }
    
      const mouseleave_air_temps = function(event,d) {
        tooltip_air_temps
          .style("opacity", 0)
      }
      
      svg_air_temps.append("g")
      .attr('id', 'x-axis')
      .attr("transform", `translate(0, ${height_air_temps})`)
      .call(x_air_temps)
      .selectAll("text")
      .attr("dx", "-7px")
      .attr("transform", "rotate(-45)");
    




      svg_air_temps
          .selectAll("myDots_air_temps")
          .data(dataReady_air_temps)
          .join('g')
            .attr("fill", d =>  "#ff0000")
            .attr("class", d => d.name)
          .selectAll("myPoints_air_temps")
          .data(d => d.values)
          .join("circle")
            .attr("cx", d => x_scale_air_temps(d.time))
            .attr("cy", d => y_air_temps(d.value))
            .attr("r", 5)
            .attr("stroke", "white")
            .on("mouseover", mouseover_air_temps )
              .on("mousemove", mousemove_air_temps )
              .on("mouseleave", mouseleave_air_temps );
              


          // trend
          const trend_x1 = x_scale_air_temps(1980);
          const trend_y1 = y_air_temps(0.41901148);
          const trend_x2 = x_scale_air_temps(2022);
          const trend_y2 = y_air_temps(1.80099963);
        
          svg_air_temps.append('line')
            // .style("stroke", "red")
            // .style("stroke", "#ff2c2c")
            // .style("stroke", "#DF2E38")
            .style("stroke", "#000000")
            .attr("id", "trend_1980_2022")
            .attr("active", 0)
            .style("stroke-width", 4)
            .style("opacity", 0)
            .attr("x1",trend_x1 )
            .attr("y1", trend_y1)
            .attr("x2", trend_x2)
            .attr("y2", trend_y2)
            .attr("filter", "url(#dropshadow)");  // This is what applies the drop shadow to each object
        



    svg_air_temps.append('line')
    // .style("stroke", "#a70000")
    // .style("stroke", "#b00808")
    // .style("stroke", "#DF2E38")
    .style("stroke", "#000000")
    .style("stroke-width", 4)
    .attr("x1",width_air_temps-190)
    .attr("y1", 305)
    .attr("x2", width_air_temps-160)
    .attr("y2", 305);
    // .attr("y2", 305)
    // .attr("filter", "url(#dropshadow)");  // This is what applies the drop shadow to each object



      svg_air_temps
      .append("text")
          .attr('x', width_air_temps-150)
          .attr('y', 310)
          .classed('select-none', true)
          .text("Tendance 1980-2022")
          // .style("fill", "#DF2E38")
          .style("fill", "#000000")
          .style("font-size", 15)
          .on("mouseover", function(event){
            var newOpacity = 0.3;
            d3.select(this).style("opacity",newOpacity)
            d3.select("#trend_1980_2022").style("opacity",newOpacity)
        })
        .on("mouseleave", function(event){
          var active = d3.select("#trend_1980_2022").attr("active");
              d3.select(this).style("opacity",1.0)
              if(active == 1){
            var newOpacity = 1.0;
            d3.select("#trend_1980_2022").style("opacity",newOpacity)
            }else{
              var newOpacity = 0.0;
              d3.select("#trend_1980_2022").style("opacity",newOpacity)
              }
      })
          .on("click", function(event){
            var active = d3.select("#trend_1980_2022").attr("active");
            if(active == 0){
              active = 1;
            }else{
              active = 0;
            }
            newOpacity = active;
            d3.select("#trend_1980_2022").style("opacity",newOpacity)
            d3.select("#trend_1980_2022").attr("active", active);
    
        });
    


            })

}

window.addEventListener('resize', function(event){
  d3.select("#my_dataviz_air_temps").select("svg").remove();
  generate_svg_temp_air(); // just call it again...
})

generate_svg_temp_air();
