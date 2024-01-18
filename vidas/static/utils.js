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

function getTextHeight(text, width) {
    // Create a temporary DOM element
    const tempElement = document.createElement("div");
    const lineHeight = 1.2;
    const fontSize = "15px";
  
    // Set the font size and line height
    tempElement.style.fontSize = fontSize;
    tempElement.style.lineHeight = lineHeight;
  
    // Set the width and text content
    tempElement.style.width = `${width}px`;
    tempElement.textContent = text;
  
    // Set the position and visibility to prevent affecting the layout
    tempElement.style.position = "absolute";
    tempElement.style.top = "-1000px";
    tempElement.style.left = "-1000px";
    tempElement.style.visibility = "hidden";
  
    // Append the element to the body
    document.body.appendChild(tempElement);
  
    // Get the computed height
    const height = tempElement.clientHeight;
  
    // Remove the temporary element
    document.body.removeChild(tempElement);
  
    return height;
  }
