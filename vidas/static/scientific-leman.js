function generate_scientific_leman(){
    // set the dimensions and margins of the graph
    const margin_water_leman = {top: 10, right: 10, bottom: 140, left: 60},
        width_water_leman = d3.select("#my_dataviz_waters_leman").node().getBoundingClientRect().width - margin_water_leman.left - margin_water_leman.right,
        height_water_leman = 320 - margin_water_leman.top - margin_water_leman.bottom;
    
    
    // append the svg object to the body of the page
    const svg_water_leman = d3.select("#my_dataviz_waters_leman")
      .append("svg")
        .attr("width", width_water_leman + margin_water_leman.left + margin_water_leman.right)
        .attr("height", height_water_leman + margin_water_leman.top + margin_water_leman.bottom)
      .append("g")
        .attr("transform",
              `translate(${margin_water_leman.left}, ${margin_water_leman.top})`);
    
    
    //Read the data
    d3.csv("data/water-course-geneva-rhone-and-arve-leman-temps-moving-avg.csv").then(function(data) {  
        const allGroup_water_leman = ["moving_avg_leman"]
        const dataReady_water_leman = allGroup_water_leman.map( function(grpName) { 
          return {
            name: grpName,
            values: data.map(function(d) {
              return {time: d.time, value: +d[grpName]};
            })
          };
        });


      const mouseover_water_leman = function(event, d) {
        tooltip_water_leman
          .style("opacity", 1)
      }
    
      const mousemove_water_leman = function(event, d) {
        tooltip_water_leman
          .html(`${d.value.toFixed(2)}`)
          .style("left", event.x + "px") 
          .style("top", event.y+10 + "px")
        }
    
    
      const mouseleave_water_leman = function(event,d) {
        tooltip_water_leman
          .style("opacity", 0)
      }
    
      const tooltip_water_leman = d3.select("#my_dataviz_waters_leman")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "#FFFFFF00")
        .style("padding", "10px")
        .style("user-select", "none")
    

        const x_scale_water_leman = d3.scaleLinear()
          .domain([2007,2021])
          .range([ 0, width_water_leman ]);

        const x_water_leman = d3.axisBottom(x_scale_water_leman)
          .ticks(10)
          .tickFormat(d3.format("d"));

          svg_water_leman.append("g")
            .attr("transform", `translate(0, ${height_water_leman})`)
            .call(x_water_leman);

        // Add Y axis
        const y_water_leman = d3.scaleLinear()
          .domain( [5.3,6.5])
          .range([ height_water_leman, 0 ]);
          svg_water_leman.append("g")
          .call(d3.axisLeft(y_water_leman));
    

        // text label for the x axis
        svg_water_leman.append("text")             
          .attr("transform",
                "translate(" + (width_water_leman/2) + " ," +  (height_water_leman + margin_water_leman.top + 30) + ")")
          .style("text-anchor", "middle")
          .text("Année");
          
        svg_water_leman.append("text")             
          .attr("transform",
                "translate(" + (width_water_leman/2) + " ," +  ( margin_water_leman.top ) + ")")
          .style("text-anchor", "middle")
          .text("Lac Léman");
          
        // text label for the y axis
        svg_water_leman.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin_water_leman.left)
          .attr("x",0 - (height_water_leman / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text("Température");      
          
          svg_water_leman.append("text")             
          .attr("transform",
                "translate(" + 0 + " ," +  (height_water_leman + margin_water_leman.top + 60) + ")")
          .style("text-anchor", "left")
          .style('fill', 'grey')
          .text("Figure 4. Moyenne mobile de 4 ans des températures annuelle de l'eau du Lac Léman entre 150 et 155 mètres (station SHL2). Source des données : CIPEL.")
          .call(wrap, width_water_leman);

          // svg_water_leman.append("text")             
          // .attr("transform",
          //       "translate(" + 0 + " ," +  (height_water_leman + margin_water_leman.top + 80) + ")")
          // .style("text-anchor", "left")
          // .style('fill', 'grey')
          // .text("Léman entre 150 et 155 mètres (station SHL2). Source des données : CIPEL.");


        // Add the lines
        const line_water_leman = d3.line()
          .x(d => x_scale_water_leman(+d.time))
          .y(d => y_water_leman(+d.value))
          svg_water_leman.selectAll("myLines_water_leman")
          .data(dataReady_water_leman)
          .join("path")
            .attr("class", d => d.name)
            .attr("d", d => line_water_leman(d.values))
            // .attr("stroke", d => "#9955ff")
            // .attr("stroke", d => "#74CDD1")
            .attr("stroke", d => "#0000ff")
            .style("stroke-width", 4)
            .style("fill", "none")

            
        // Add the points
        svg_water_leman
          .selectAll("myDots_water_leman")
          .data(dataReady_water_leman)
          .join('g')
            // .style("fill", d => "#9955ff")
            // .style("fill", d => "#74CDD1")
            .style("fill", d => "#0000ff")
            .attr("class", d => d.name)
          // Second we need to enter in the 'values' part of this group
          .selectAll("myPoints_leman")
          .data(d => d.values)
          .join("circle")
            .attr("cx", d => x_scale_water_leman(d.time))
            .attr("cy", d => y_water_leman(d.value))
            .attr("r", 5)
            .attr("stroke", "white")
            .on("mouseover", mouseover_water_leman )
              .on("mousemove", mousemove_water_leman )
              .on("mouseleave", mouseleave_water_leman );
    
  })
}

window.addEventListener('resize', function(event){
  d3.select("#my_dataviz_waters_leman").select("svg").remove();
  generate_scientific_leman(); // just call it again...
})

generate_scientific_leman();

