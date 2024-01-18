function generate_scientific_arve()  {
  // set the dimensions and margins of the graph
  const margin_water_arve = {top: 10, right: 10, bottom: 140, left: 60},
      width_water_arve = d3.select("#my_dataviz_waters_arve").node().getBoundingClientRect().width - margin_water_arve.left - margin_water_arve.right,
      height_water_arve = 310 - margin_water_arve.top - margin_water_arve.bottom;
  
  
  // append the svg object to the body of the page
  const svg_water_arve = d3.select("#my_dataviz_waters_arve")
    .append("svg")
      .attr("width", width_water_arve + margin_water_arve.left + margin_water_arve.right)
      .attr("height", height_water_arve + margin_water_arve.top + margin_water_arve.bottom)
    .append("g")
      .attr("transform",
            `translate(${margin_water_arve.left}, ${margin_water_arve.top})`);
  
  
  //Read the data
  d3.csv("data/water-course-geneva-rhone-and-arve-leman-temps-moving-avg.csv").then(function(data) {
  
      const allGroup_water_arve = ["moving_avg_arve"]
      const dataReady_water_arve = allGroup_water_arve.map( function(grpName) { 
        return {
          name: grpName,
          values: data.map(function(d) {
            return {time: d.time, value: +d[grpName]};
          })
        };
      });


    const mouseover_water_arve = function(event, d) {
      tooltip_water_arve
        .style("opacity", 1)
    }
  
    const mousemove_water_arve = function(event, d) {
      tooltip_water_arve
        .html(`${d.value.toFixed(2)}`)
        .style("left", event.x + "px") 
        .style("top", event.y+10 + "px")
      }
  
  
    const mouseleave_water_arve = function(event,d) {
      tooltip_water_arve
        .style("opacity", 0)
    }
  
    const tooltip_water_arve = d3.select("#my_dataviz_waters_arve")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "#FFFFFF00")
      .style("padding", "10px")
      .style("user-select", "none")
  

      const x_scale_water_arve = d3.scaleLinear()
        .domain([2007,2021])
        .range([ 0, width_water_arve ]);

      const x_water_arve = d3.axisBottom(x_scale_water_arve)
        .ticks(10)
        .tickFormat(d3.format("d"));

        svg_water_arve.append("g")
          .attr("transform", `translate(0, ${height_water_arve})`)
          .call(x_water_arve);

      // Add Y axis
      const y_water_arve = d3.scaleLinear()
        .domain( [8.0,9.2])
        .range([ height_water_arve, 0 ]);
        svg_water_arve.append("g")
        .call(d3.axisLeft(y_water_arve));
  

      // text label for the x axis
      svg_water_arve.append("text")             
        .attr("transform",
              "translate(" + (width_water_arve/2) + " ," +  (height_water_arve + margin_water_arve.top + 30) + ")")
        .style("text-anchor", "middle")
        .text("Année");
        
      svg_water_arve.append("text")             
        .attr("transform",
              "translate(" + (width_water_arve/2) + " ," +  ( margin_water_arve.top ) + ")")
        .style("text-anchor", "middle")
        .text("Arve");
        
      // text label for the y axis
      svg_water_arve.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin_water_arve.left)
        .attr("x",0 - (height_water_arve / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Température");      
        
        svg_water_arve.append("text")             
        .attr("transform",
              "translate(" + 0 + " ," +  (height_water_arve + margin_water_arve.top + 60) + ")")
        .style("text-anchor", "left")
        .style('fill', 'grey')
        .text("Figure 3. Moyenne mobile de 4 ans des températures annuelle homogène de l'eau en degrés Celsius (Rhône et Arve). Source des données : Division Hydrologie de l’OFEV.")
        .call(wrap, width_water_arve);

        // svg_water_arve.append("text")             
        // .attr("transform",
        //       "translate(" + 0 + " ," +  (height_water_arve + margin_water_arve.top + 80) + ")")
        // .style("text-anchor", "left")
        // .style('fill', 'grey')
        // .text(" degrés Celsius (Rhône et Arve). Source des données : Division Hydrologie de l’OFEV.");


      // Add the lines
      const line_water_arve = d3.line()
        .x(d => x_scale_water_arve(+d.time))
        .y(d => y_water_arve(+d.value))
        svg_water_arve.selectAll("myLines_water_arve")
        .data(dataReady_water_arve)
        .join("path")
          .attr("class", d => d.name)
          .attr("d", d => line_water_arve(d.values))
          .attr("stroke", d => "#0000ff")
          .style("stroke-width", 4)
          .style("fill", "none")

          
      // Add the points
      svg_water_arve
        // First we need to enter in a group
        .selectAll("myDots_water_arve")
        .data(dataReady_water_arve)
        .join('g')
          .style("fill", d => "#0000ff")
          .attr("class", d => d.name)
        // Second we need to enter in the 'values' part of this group
        .selectAll("myPoints_arve")
        .data(d => d.values)
        .join("circle")
          .attr("cx", d => x_scale_water_arve(d.time))
          .attr("cy", d => y_water_arve(d.value))
          .attr("r", 5)
          .attr("stroke", "white")
          .on("mouseover", mouseover_water_arve )
            .on("mousemove", mousemove_water_arve )
            .on("mouseleave", mouseleave_water_arve );
          
  })
}

window.addEventListener('resize', function(event){
  d3.select("#my_dataviz_waters_arve").select("svg").remove();
  generate_scientific_arve(); // just call it again...
})

generate_scientific_arve();