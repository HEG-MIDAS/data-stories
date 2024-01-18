function wrap(text, width) {
  text.each(function () {
    var text = d3.select(this),
      words = text.text().split(/\s+/).reverse(),
      word,
      line = [],
      lineHeight = 1.2, // Adjust as needed
      y = text.attr("y"),
      dy = parseFloat(text.attr("dy")) || 0,
      tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");

    while ((word = words.pop())) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", lineHeight + dy + "em").text(word);
      }
    }
  });
}

function create_svg(){
  // set the dimensions and margins of the graph
  const margin_glacier = {top: 30, right: 30, bottom: 130, left: 60},
    widthPercentage = 100, // Adjust the percentage as needed
    container = d3.select("#my_dataviz_glaciers"),
    containerWidth = container.node().getBoundingClientRect().width,
    containerheight = container.node().getBoundingClientRect().height,
    width_glacier = (widthPercentage / 100) * containerWidth - margin_glacier.left - margin_glacier.right,
    height_glacier = 500 - margin_glacier.top - margin_glacier.bottom;

    
    // append the svg object to the body of the page
    const svg_glacier = d3.select("#my_dataviz_glaciers")
      .append("svg")
        .attr("width", width_glacier + margin_glacier.left + margin_glacier.right)
        .attr("height", height_glacier + margin_glacier.top + margin_glacier.bottom)
      .append("g")
        .attr("transform",
              `translate(${margin_glacier.left}, ${margin_glacier.top})`);
                      

              // time: d3.timeParse("%Y")(d.year),
    

    //Read the data
    d3.csv("data/volume-total-rhone.csv",

    d => {
      return {
            time: d.year,
            value : d.volume_km3
          }
        }).then(function(data) {


        // const x_scale = d3.scaleBand()
        // .range([ 0, width_glacier ])
        // .domain(data.map(d => d.time))
        // .padding(0.2);
            
        // const x = d3.axisBottom(x_scale)
        // .ticks(20);


        // svg_glacier.append("g")
        //         .attr("transform", `translate(0,${height_glacier})`)
        //         .call(d3.axisBottom(x));
          
        const tooltip_glaciers = d3.select("#my_dataviz_glaciers")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "#FFFFFF00")
        .style("padding", "10px")
        .style("user-select", "none");
    
        const mouseover_glaciers = function(event, d) {
          tooltip_glaciers
            .style("opacity", 1)
        }
      
        const mousemove_glaciers = function(event, d) {
          const tooltipHeight = tooltip_glaciers.node().offsetHeight;
          tooltip_glaciers
            .html(`${d.value}`)
            .style("left", event.x + "px") 
            .style("top", event.y - tooltipHeight + window.scrollY + "px")
          }
      
        const mouseleave_glaciers = function(event,d) {
          tooltip_glaciers
            .style("opacity", 0)
        }


        const x = d3.scaleBand()
        .range([ 0, width_glacier ])
        .domain(data.map(d => d.time))
        .padding(0.3);

          svg_glacier.append("g")
    .attr("transform", `translate(0, ${height_glacier})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-90)")
      .style("text-anchor", "end")
      .attr("dx", "-7px");

    // Add Y axis
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => +d.value)])
      .range([ height_glacier, 0 ]);

      svg_glacier.append("g")
        .call(d3.axisLeft(y));


    // text label for the x axis
    svg_glacier.append("text")             
        .attr("transform",
              "translate(" + (width_glacier/2) + " ," +  (height_glacier + margin_glacier.top + 30) + ")")
        .style("text-anchor", "middle")
        .text("Année");
        
    // text label for the y axis
    svg_glacier.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin_glacier.left)
        .attr("x",0 - (height_glacier / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Volume");      
        
    svg_glacier.append("text")             
        .attr("transform",
              "translate(" + 0 + " ," +  (height_glacier + margin_glacier.top + 60) + ")")
        .style("text-anchor", "left")
        .style('fill', 'grey')
        .text("Figure 2. Volume du glacier du Rhône en Km3. Source des données : GLAMOS.")
        .call(wrap, width_glacier);


            // Add the area
            svg_glacier.selectAll("mybar")
            .data(data)
            .join("rect")
            .attr("x", d => x(d.time))
            .attr("y", d => y(d.value))
            .attr("width", x.bandwidth())
            .attr("height", d => height_glacier - y(d.value))
            .attr("stroke", "#69b3a2")
            .attr("fill", "#cce5df")
            .on("mouseover", mouseover_glaciers )
              .on("mousemove", mousemove_glaciers )
              .on("mouseleave", mouseleave_glaciers );

            // .attr("stroke", "#69b3a2")
              // .attr("stroke-width", 1.5)
                  // )
              // })


            })
}

create_svg()

function handleResize() {
  d3.select("#my_dataviz_glaciers").select("svg").remove();
  create_svg();
}

window.addEventListener("resize", handleResize);