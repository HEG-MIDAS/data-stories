function generate_scientific_rhone() {
  // set the dimensions and margins of the graph  
  const margin_water_rhone = {top: 10, right: 10, bottom: 20, left: 60},
      width_water_rhone = d3.select("#my_dataviz_waters_rhone").node().getBoundingClientRect().width - margin_water_rhone.left - margin_water_rhone.right,
      height_water_rhone = 230 - margin_water_rhone.top - margin_water_rhone.bottom;
  
  
  // append the svg object to the body of the page
  const svg_water_rhone = d3.select("#my_dataviz_waters_rhone")
    .append("svg")
      .attr("width", width_water_rhone + margin_water_rhone.left + margin_water_rhone.right)
      .attr("height", height_water_rhone + margin_water_rhone.top + margin_water_rhone.bottom)
    .append("g")
      .attr("transform",
            `translate(${margin_water_rhone.left}, ${margin_water_rhone.top})`);
  
  
  //Read the data
  d3.csv("data/water-course-geneva-rhone-and-arve-leman-temps-moving-avg.csv").then(function(data) {
  
      const allGroup_water_rhone = ["moving_avg_rhone"]
      
      const dataReady_water_rhone = allGroup_water_rhone.map( function(grpName) { // .map allows to do something for each element of the list
        return {
          name: grpName,
          values: data.map(function(d) {
            return {time: d.time, value: +d[grpName]};
          })
        };
      });

      const mouseover_water_rhone = function(event, d) {
      tooltip_water_rhone
        .style("opacity", 1)
    }
  
    const mousemove_water_rhone = function(event, d) {
      tooltip_water_rhone
        .html(`${d.value.toFixed(2)}`)
        .style("left", event.x + "px") 
        .style("top", event.y+10 + "px")
      }
  
  
    const mouseleave_water_rhone = function(event,d) {
      tooltip_water_rhone
        .style("opacity", 0)
    }
  
    const tooltip_water_rhone = d3.select("#my_dataviz_waters_rhone")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "#FFFFFF00")
      .style("padding", "10px")
      .style("user-select", "none")
  
      // A color scale: one color for each group
      const myColor_water_rhone = d3.scaleOrdinal()
        .domain(allGroup_water_rhone)
        .range(d3.schemeSet3);
  
        
      // Add X axis
      const x_scale_water_rhone = d3.scaleLinear()
        .domain([2007,2021])
        .range([ 0, width_water_rhone ]);

      const x_water_rhone = d3.axisBottom(x_scale_water_rhone)
        .ticks(10)
        .tickFormat(d3.format("d"));

      svg_water_rhone.append("g")
          .attr("transform", `translate(0, ${height_water_rhone})`)
          .call(x_water_rhone);

      // Add Y axis
      const y_water_rhone = d3.scaleLinear()
        .domain( [12.0,13.8])
        .range([ height_water_rhone, 0 ]);
        svg_water_rhone.append("g")
        .call(d3.axisLeft(y_water_rhone));
  

      // text label for the x axis
      svg_water_rhone.append("text")             
        .attr("transform",
              "translate(" + (width_water_rhone/2) + " ," +  (height_water_rhone + margin_water_rhone.top + 30) + ")")
        .style("text-anchor", "middle")
        .text("Année");
        
        svg_water_rhone.append("text")             
        .attr("transform",
              "translate(" + (width_water_rhone/2) + " ," +  ( margin_water_rhone.top ) + ")")
        .style("text-anchor", "middle")
        .text("Rhône");

      // text label for the y axis
      svg_water_rhone.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin_water_rhone.left)
        .attr("x",0 - (height_water_rhone / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Température");      
        
      // Add the lines
      const line_water_rhone = d3.line()
        .x(d => x_scale_water_rhone(+d.time))
        .y(d => y_water_rhone(+d.value))
        svg_water_rhone.selectAll("myLines_water_rhone")
        .data(dataReady_water_rhone)
        .join("path")
          .attr("class", d => d.name)
          .attr("d", d => line_water_rhone(d.values))
          // .attr("stroke", d => "#37D0FA")
          .attr("stroke", d => "#0000ff")
          .style("stroke-width", 4)
          .style("fill", "none")

          
      // Add the points
      svg_water_rhone
        .selectAll("myDots_water_rhone")
        .data(dataReady_water_rhone)
        .join('g')
          // .style("fill", d => "#37D0FA")
          .style("fill", d => "#0000ff")
          .attr("class", d => d.name)
        .selectAll("myPoints_rhone")
        .data(d => d.values)
        .join("circle")
          .attr("cx", d => x_scale_water_rhone(d.time))
          .attr("cy", d => y_water_rhone(d.value))
          .attr("r", 5)
          .attr("stroke", "white")
          .on("mouseover", mouseover_water_rhone )
            .on("mousemove", mousemove_water_rhone )
            .on("mouseleave", mouseleave_water_rhone );
  
  })
}

window.addEventListener('resize', function(event){
  d3.select("#my_dataviz_waters_rhone").select("svg").remove();
  generate_scientific_rhone(); // just call it again...
})

generate_scientific_rhone();