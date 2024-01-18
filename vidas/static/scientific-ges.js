function generate_scientific_ges(){
  // set the dimensions and margins of the graph
  const margin_ges = {top: 20, right: 15, bottom: 220, left: 50},
        width_ges  = d3.select("#my_dataviz_ges").node().getBoundingClientRect().width - margin_ges.left - margin_ges.right,
        height_ges  = 550 - margin_ges.top - margin_ges.bottom;
    
    
    // append the svg object to the body of the page
    const svg_ges = d3.select("#my_dataviz_ges")
      .append("svg")
        .attr("width", width_ges + margin_ges.left + margin_ges.right)
        .attr("height", height_ges + margin_ges.top + margin_ges.bottom)
        .append("g")
        .attr("transform", `translate(${margin_ges.left}, ${margin_ges.top})`);
    

    //Read the data
      d3.csv("data/tous-les-ges-sw-with-goals.csv").then(function(data) {

  const allGroup = ["all_ges", "paris_agreement"]
        
        const dataReady = allGroup.map( function(grpName) { 
          return {
            name: grpName,
            values: data.map(function(d) {
              return {time: d.year, value: +d[grpName]};
            })
          };
        });

    
      const mouseover_ges = function(event, d) {
        tooltip
          .style("opacity", 1)
      }
    
      const mousemove_ges = function(event, d) {
        tooltip
          .html(`${d.value.toFixed(2)}`)
          .style("left", event.x + "px") 
          .style("top", event.y+10 + "px")
        }
    
      const mouseleave_ges = function(event,d) {
        tooltip
          .style("opacity", 0)
      }

    
      const tooltip = d3.select("#my_dataviz_ges")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "#FFFFFF00")
        .style("padding", "10px")
        .style("user-select", "none")
    
        const myColor_ges = d3.scaleOrdinal()
          .domain(allGroup)
          .range(d3.schemeSet2);
    

        // Add X axis 
        const x_scale_ges = d3.scaleLinear()
          .domain([1990,2030])
          .range([ 0, width_ges ]);

        const x_axis_ges = d3.axisBottom(x_scale_ges)
          .ticks(10)
          .tickFormat(d3.format("d"));

        // Add Y axis
        const y_ges = d3.scaleLinear()
          .domain( [0.0, 60.0])
          .range([ height_ges, 0 ]);
          svg_ges.append("g")
          .call(d3.axisLeft(y_ges));
    

      // text label for the x axis
      svg_ges.append("text")             
        .attr("transform",
              "translate(" + (width_ges/2) + " ," +  (height_ges + margin_ges.top + 30) + ")")
        .style("text-anchor", "middle")
        .text("Année");

      var text_2_display = "Figure 5. Emissions de gaz à effet de serre de la Suisse 1990-2020. Emissions en millions de tonnes équivalent CO2 correspondant à la somme des gaz. Source des données : BAFU."

      svg_ges.append("text")             
        .attr("transform",
              "translate(" + 0 + " ," +  (height_ges + margin_ges.top + 60) + ")")
        .style("text-anchor", "left")
        .style('fill', 'grey')
        .text(text_2_display)
        .call(wrap, width_ges);

      // text label for the y axis
      svg_ges.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin_ges.left)
        .attr("x",0 - (height_ges / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Emissions de gaz à effet de serre");     

        // Add the lines
        const line = d3.line()
          .x(d => x_scale_ges(d.time))
          .y(d => y_ges(+d.value))
          .defined(function(d) {
            return d.value != -1000 ;
          });

    
    // Period before CO2 act measures

    // trend
    const pred_bef_measures_trend_x1 = x_scale_ges(1990);
    const pred_bef_measures_trend_y1 = y_ges(54.47945455);
    const pred_bef_measures_trend_x2 = x_scale_ges(2000);
    const pred_bef_measures_trend_y2 = y_ges(52.78733333);

    svg_ges.append('line')
      .style("stroke", "black")
      .attr("id", "trend_1990_1999")
      .attr("active", 1)
      .style("stroke-width", 3)
      .attr("x1",pred_bef_measures_trend_x1 )
      .attr("y1", pred_bef_measures_trend_y1)
      .attr("x2", pred_bef_measures_trend_x2)
      .attr("y2", pred_bef_measures_trend_y2);

    // pred
    const pred_bef_measures_pred_x1 = x_scale_ges(2000);
    const pred_bef_measures_pred_y1 = y_ges(52.78733333);
    const pred_bef_measures_pred_x2 = x_scale_ges(2030);
    const pred_bef_measures_pred_y2 = y_ges(47.7109697);

    svg_ges.append('line')
      .style("stroke", "black")
      .attr("id", "trend_1990_1999_pred_2030")
      .attr("active", 1)
      .style("stroke-width", 3)
      .style("stroke-dasharray", ("5, 5"))  
      .attr("x1",pred_bef_measures_pred_x1 )
      .attr("y1", pred_bef_measures_pred_y1)
      .attr("x2", pred_bef_measures_pred_x2)
      .attr("y2", pred_bef_measures_pred_y2);

    // Period after CO2 act measures

    // trend
    const pred_aft_measures_trend_x1 = x_scale_ges(2000);
    const pred_aft_measures_trend_y1 =y_ges(56.40281385);
    const pred_aft_measures_trend_x2 = x_scale_ges(2020);
    const pred_aft_measures_trend_y2 =y_ges(46.61813853);

      svg_ges.append('line')
      .style("stroke", "red")
      .attr("id", "trend_2000_2020")
      .attr("active", 1)
      .style("stroke-width", 3)
      .attr("x1",pred_aft_measures_trend_x1 )
      .attr("y1", pred_aft_measures_trend_y1)
      .attr("x2", pred_aft_measures_trend_x2)
      .attr("y2", pred_aft_measures_trend_y2);
    
    // pred
    const pred_aft_measures_pred_x1 = x_scale_ges(2020);
    const pred_aft_measures_pred_y1 =y_ges(46.61813853);
    const pred_aft_measures_pred_x2 = x_scale_ges(2030);
    const pred_aft_measures_pred_y2 =y_ges(41.72580087);

    var sym = d3.symbol().type(d3.symbolSquare).size(50);


      svg_ges.append('line')
      .style("stroke", "red")
      .attr("id", "trend_2000_2020_pred_2030")
      .attr("active", 1)
      .style("stroke-width", 3)
      .style("stroke-dasharray", ("5, 5")) 
      .attr("x1",pred_aft_measures_pred_x1 )
      .attr("y1", pred_aft_measures_pred_y1)
      .attr("x2", pred_aft_measures_pred_x2)
      .attr("y2", pred_aft_measures_pred_y2);
    
      svg_ges.selectAll("myLines")
      .data(dataReady)
      .join("path")
        .attr("class", d => d.name)
        .attr("active", 1)
        .attr("d", d => line(d.values))
        .attr("stroke", d => myColor_ges(d.name))
        .style("stroke-width", 4)
        .style("fill", "none");

      // Add the points
      svg_ges
        // First we need to enter in a group
        .selectAll("myDots")
        .data(dataReady)
        .join('g')
          .style("fill", d => myColor_ges(d.name))
          .attr("class", d => d.name)
        // Second we need to enter in the 'values' part of this group
        .selectAll("myPoints")
        .data(d => d.values)
        .attr("active", 1)
        .join("circle")
        .attr("cy", d => y_ges(d.value))
          .attr("cx", d => x_scale_ges(d.time))
          .attr("r", 5)
          .attr("stroke", "white")
          .on("mouseover", mouseover_ges )
            .on("mousemove", mousemove_ges )
            .on("mouseleave", mouseleave_ges );



      svg_ges.append("g")
        .attr('id', 'x-axis')
        .attr("transform", `translate(0, ${height_ges})`)
        .call(x_axis_ges);



    // Add a legend (interactive)

    offset_for_legend = getTextHeight(text_2_display, width_ges) + 10

    const legendContainer = svg_ges
      .append("g")
      .style("width", "150px") // Set the maximum height for the legend container
      .style("overflow-x", "auto"); // Enable vertical scrolling
      // Legend lines
        legendContainer
      .selectAll("myLegend")
      .data(dataReady)
      .join('g')
        .append("line")
        .style("stroke", d => myColor_ges(d.name))
      .style("stroke-width", 3)
          .attr('x1', 0)
          .attr('y1', (d,i) => height_ges + margin_ges.top + 60 + offset_for_legend + i*25)
          .attr('x2', 30)
          .attr('y2', (d,i) => height_ges + margin_ges.top + 60 + offset_for_legend + i*25);


        legendContainer
      .selectAll("myLegend")
      .data(dataReady)
      .join('g')
        .append("text")        
        .attr('x', 40)
          .attr('y', (d,i) => height_ges + margin_ges.top + 60 + offset_for_legend + 5 + i*25)
          .classed('select-none', true)
          .text(function(d){
            if(d.name == "all_ges"){
              d3.selectAll("." + d.name).attr("active", 1);
              return "Emissions de gaz à effet de serre";
            }else{
              d3.selectAll("." + d.name).attr("active", 1);
              return "Objectif Accord de Paris pour 2030";
            }
          })
          .classed('select-none', true)
          .style("fill", d => myColor_ges(d.name))
          .style("font-size", 15)
          .on("mouseover", function(event,d){
            var newOpacity = 0.3;
            d3.select(this).style("opacity",newOpacity)
            d3.selectAll("." + d.name).style("opacity",newOpacity)
        })
        .on("mouseleave", function(event,d){
          var active = d3.select("." + d.name).attr("active");
              d3.select(this).style("opacity",1.0)
              if(active == 1){
            var newOpacity = 1.0;
            d3.selectAll("." + d.name).style("opacity",newOpacity)
            }else{
              var newOpacity = 0.0;
              d3.selectAll("." + d.name).style("opacity",newOpacity)
              }
      })
          .on("click", function(event,d){
            var active = d3.selectAll("." + d.name).attr("active");
            if(active == 0){
              active = 1;
            }else{
              active = 0;
            }
            newOpacity = active;
            d3.selectAll("." + d.name).style("opacity",newOpacity)
            d3.selectAll("." + d.name).attr("active", active);

        });




    // Trend 2020 - 2020
      legendContainer.append('line')
      .style("stroke", "red")
      .style("stroke-width", 3)
      .attr("x1",320)
      .attr("y1", height_ges + margin_ges.top + 60 + 25 + offset_for_legend)
      .attr("x2", 350)
      .attr("y2", height_ges + margin_ges.top + 60 + 25 + offset_for_legend);



        legendContainer
      .append("text")
          .attr('x', 360)
          .attr('y', height_ges + margin_ges.top + 60 + offset_for_legend + 5 + 25)
          .classed('select-none', true)
          .text("Tendance 2000-2020")
          .style("fill", "red")
          .style("font-size", 15)     
        .on("mouseover", function(event){
          var newOpacity = 0.3;
          d3.select(this).style("opacity",newOpacity)
          d3.select("#trend_2000_2020").style("opacity",newOpacity)
      })
      .on("mouseleave", function(event){
        var active = d3.select("#trend_2000_2020").attr("active");
            d3.select(this).style("opacity",1.0)
            if(active == 1){
          var newOpacity = 1.0;
          d3.select("#trend_2000_2020").style("opacity",newOpacity)
          }else{
            var newOpacity = 0.0;
            d3.select("#trend_2000_2020").style("opacity",newOpacity)
            }
    })
        .on("click", function(event){
          var active = d3.select("#trend_2000_2020").attr("active");
          if(active == 0){
            active = 1;
            // d3.select(this).style("opacity",active)
          }else{
            active = 0;
          }
          newOpacity = active;
          d3.select("#trend_2000_2020").style("opacity",newOpacity)
          d3.select("#trend_2000_2020").attr("active", active);

      });      

    // Prediction 2000 - 2020
    legendContainer.append('line')
      .style("stroke", "red")
      .style("stroke-width", 3)
      .style("stroke-dasharray", ("5, 5"))  
      .attr("x1",535)
      .attr("y1", height_ges + margin_ges.top + 60 + offset_for_legend + 25)
      .attr("x2", 565)
      .attr("y2", height_ges + margin_ges.top + 60 + offset_for_legend + 25);


    legendContainer
    .append("text")
        .attr('x', 575)
        .attr('y', height_ges + margin_ges.top + 60 + offset_for_legend + 5 + 25)
        .classed('select-none', true)
        .text("Prédictions jusqu'en 2030 ( basées sur la tendance 2000-2020)")
        .style("fill", "red")
        .style("font-size", 15)
        .on("mouseover", function(event){
          var newOpacity = 0.3;
          d3.select(this).style("opacity",newOpacity)
          d3.select("#trend_2000_2020_pred_2030").style("opacity",newOpacity)
      })
      .on("mouseleave", function(event){
        var active = d3.select("#trend_2000_2020_pred_2030").attr("active");
            d3.select(this).style("opacity",1.0)
            if(active == 1){
          var newOpacity = 1.0;
          d3.select("#trend_2000_2020_pred_2030").style("opacity",newOpacity)
          }else{
            var newOpacity = 0.0;
            d3.select("#trend_2000_2020_pred_2030").style("opacity",newOpacity)
            }
    })
        .on("click", function(event){
          var active = d3.select("#trend_2000_2020_pred_2030").attr("active");
          if(active == 0){
            active = 1;
          }else{
            active = 0;
          }
          newOpacity = active;
          d3.select("#trend_2000_2020_pred_2030").style("opacity",newOpacity)
          d3.select("#trend_2000_2020_pred_2030").attr("active", active);

      });


    // Trend 1990 - 2000
    legendContainer.append('line')
      .style("stroke", "black")
      .style("stroke-width", 3)
      .attr("x1",320)
      .attr("y1", height_ges + margin_ges.top + 60 + offset_for_legend)
      .attr("x2", 350)
      .attr("y2", height_ges + margin_ges.top + 60 + offset_for_legend);


        legendContainer
      .append("text")
          .attr('x', 360)
          .attr('y', height_ges + margin_ges.top + 60 + offset_for_legend + 5)
          .classed('select-none', true)
          .text("Tendance 1990-1999")
          .style("fill", "black")
          .style("font-size", 15)
          .on("mouseover", function(event){
            var newOpacity = 0.3;
            d3.select(this).style("opacity",newOpacity)
            d3.select("#trend_1990_1999").style("opacity",newOpacity)
        })
        .on("mouseleave", function(event){
          var active = d3.select("#trend_1990_1999").attr("active");
              d3.select(this).style("opacity",1.0)
              if(active == 1){
            var newOpacity = 1.0;
            d3.select("#trend_1990_1999").style("opacity",newOpacity)
            }else{
              var newOpacity = 0.0;
              d3.select("#trend_1990_1999").style("opacity",newOpacity)
              }
      })
          .on("click", function(event){
            var active = d3.select("#trend_1990_1999").attr("active");
            if(active == 0){
              active = 1;
              // d3.select(this).style("opacity",active)
            }else{
              active = 0;
            }
            newOpacity = active;
            d3.select("#trend_1990_1999").style("opacity",newOpacity)
            d3.select("#trend_1990_1999").attr("active", active);

        });

        

    // Prediction 2020 - 2020
    legendContainer.append('line')
      .style("stroke", "black")
      .style("stroke-width", 3)
      .style("stroke-dasharray", ("5, 5"))  
      .attr("x1",535)
      .attr("y1", height_ges + margin_ges.top + 60 + offset_for_legend)
      .attr("x2", 565)
      .attr("y2", height_ges + margin_ges.top + 60 + offset_for_legend);
      


        legendContainer
      .append("text")
          .attr('x', 575)
          .attr('y', height_ges + margin_ges.top + 60 + offset_for_legend + 5)
          .classed('select-none', true)
          .text("Prédictions jusqu'en 2030 ( basées sur la tendance 1990-1999)")
          .style("fill", "black")
          .style("font-size", 15)
          .on("mouseover", function(event){
            var newOpacity = 0.3;
            d3.select(this).style("opacity",newOpacity)
            d3.select("#trend_1990_1999_pred_2030").style("opacity",newOpacity)
        })
        .on("mouseleave", function(event){
          var active = d3.select("#trend_1990_1999_pred_2030").attr("active");
              d3.select(this).style("opacity",1.0)
              if(active == 1){
            var newOpacity = 1.0;
            d3.select("#trend_1990_1999_pred_2030").style("opacity",newOpacity)
            }else{
              var newOpacity = 0.0;
              d3.select("#trend_1990_1999_pred_2030").style("opacity",newOpacity)
              }
      })
          .on("click", function(event){
            var active = d3.select("#trend_1990_1999_pred_2030").attr("active");
            if(active == 0){
              active = 1;
            }else{
              active = 0;
            }
            newOpacity = active;
            d3.select("#trend_1990_1999_pred_2030").style("opacity",newOpacity)
            d3.select("#trend_1990_1999_pred_2030").attr("active", active);

        });


      })
}

window.addEventListener('resize', function(event){
  d3.select("#my_dataviz_ges").select("svg").remove();
  generate_scientific_ges(); // just call it again...
})

generate_scientific_ges();
