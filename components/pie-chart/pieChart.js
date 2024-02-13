// piechart second container
const getPieChartData = async(props) => {
  const {
    width,
    selector,
    legendSelector,
    height,
    legendHeight, 
  } = props;

  return fetch('http://localhost/vis_assign1/constants.json')
    .then((res) => res.json())
    .then((res) => {
      return constructNewPieChart({
        width,
        data: res.piechartConstants,
        selector,
        legendSelector,
        heightValue: height,
        legendHeight,
      })
    });
}

// piechart fifth container left
const getPieChartLiterate = async(props) => {
  const {
    width,
    selector,
    height
  } = props;

  return fetch('http://localhost/vis_assign1/constants.json')
    .then((res) => res.json())
    .then((res) => {
      res.pieChartLiteracy?.forEach((pieItem) => {
        constructPieChart({
          width,
          data: [
            {
              ...pieItem,
              color: '#FAB344',
            },
            { 
              value: 100 - pieItem?.value,
              color: '#FEE9C7',
            }
          ],
          selector,
          type: 'single',
          heightValue: height,
        })
      })
    });
}

// piechart fifth container right
const getPieChartTechData = async({ width, selector, height, stroke, label }) => {
  return fetch('http://localhost/vis_assign1/constants.json')
    .then((res) => res.json())
    .then((res) => {
      res.pieChartTech?.forEach((pieItem) => {
        constructPieChart({
          width,
          data: [
            {
              ...pieItem,
              color: pieItem?.color,
            },
          ],
          selector,
          type: 'single',
          heightValue: height,
          stroke,
          textType: 'bold',
        })
      })
    })
}

// fifth container piechart
const constructPieChart = async(props) => {
  const {
    width,
    data,
    selector,
    heightValue,
    stroke,
    pieItemsData,
    textType,
  } = props;

  // setting height and radius
  const height = heightValue || Math.min(width, 500);
  const radius = width / 2;

  // pieItems to be rendered
  let pieItems = [ ...(pieItemsData || data) ];

  // total of the value
  const total = pieItems.reduce((sum, pieItem) => {
    return sum + pieItem.value;
  }, 0);

  // calculate the percentage of value based on the total
  const calculateValue = (valueItem) => {
    return Math.round((valueItem / total) * 100);
  }

  // arc of the chart
  const arc = d3.arc()
      .innerRadius(stroke || radius * 0.67)
      .outerRadius(radius -1);

  //pie config
  const pie = d3.pie()
      .padAngle(0)
      .sort(null)
      .value(d => d.value)
      .startAngle(0)
      .endAngle(360)

  // svg canvas
  const svg = d3.select(selector).append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -(width/2) / 2, width, (width/2)])
      .attr("style", "max-width: 100%;")
      .attr('class', 'pie')
      .style('cursor', 'pointer')
      .on("mouseover", function() {
        d3.select(this).transition().attr("transform", "scale(1.2)");
        svg.selectAll("path")
           .attr("d", 0)
           .transition()
           .duration(500)
           .attrTween('d', arcTween) 
      })
      .on("mouseout", function() {
        d3.select(this).transition().attr("transform", "scale(1)");
        svg.selectAll("path")
          .attr("d", 0)
          .transition()
          .duration(500)
          .attrTween('d', arcTween) 
      })
      .attr('x', 0)
      .attr('y', 0);

  // group for the donut path
  svg.append("g")
    .selectAll()
    .data(pie(pieItems))
    .join("path")
    .attr("fill", d => d.data.color)
    .attr("d", arc)
    .append("title")
    .text(d => `${d.data.name}: ${d.data.value.toLocaleString()}`);

  // group for text
  const group = svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
      .attr("text-anchor", "middle")
      .selectAll()
      .data(pie(pieItems))
  
  // transition
  const arcTween = (d) => {
    const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
    return (t) => arc(interpolate(t));
  };
  svg.selectAll('path')
    .data(pie(pieItems))
    .join('path')
    .transition()
    .duration(1000)
    .attr('fill', (d) => d.data.color)
    .attrTween('d', arcTween) 

    // center text
    svg.append('text')
      .text(`${pieItems[0].value}%`)
      .style('fill', textType === 'bold' ? "#5F5F5F" : '#EC8B40')
      .style('font-weight', 'bold')
      .style('font-size', textType === 'bold' ? '22px' : '16px')
      .attr('x', textType === 'bold' ? pieItems[0].value < 10 ? -15 : -20 : -14)
      .attr('y', textType === 'bold' ? 8 : 5)
    
    // name text
    const text = svg.append('text')
      .text(`${pieItems[0].name}`)
      .style('fill', textType === 'bold' ? "#5F5F5F" : '#EC8B40')
      .style('font-weight', 'bold')
      .style('font-size', '12px')
      .attr('x', 0)
      .attr('y', 55)

    const textWidth = text.node().getComputedTextLength();
    text.attr("x", (width - textWidth - 70) / 2);
}

// second container piechart
const constructNewPieChart = async(props) => {
  const {
    width,
    data,
    selector,
    legendSelector,
    heightValue,
    pieItemsData
  } = props;

  // svg canvas
  var svgSelector = d3.select(selector)
  .append("svg")
  .attr('height', heightValue + 100)
  .attr('width', width + 200);

  // pieitems
  let pieItems = [ ...(pieItemsData || data) ];

  // total of the value
  const total = pieItems.reduce((sum, pieItem) => {
    return sum + pieItem.value;
  }, 0);

  // percentage of the value with the total
  const calculateValue = (valueItem) => {
    return Math.round((valueItem / total) * 100);
  }

  // group for svg canvas
  var svg = svgSelector
    .append("g")

  // groups for slices, labels and poly lines
  svg.append("g")
    .attr("class", "slices");
  svg.append("g")
    .attr("class", "labels");
  svg.append("g")
    .attr("class", "lines");

  // height and radius declaration
  height = heightValue,
  radius = Math.min(width, height) / 2;

  // pie chart element
  var pie = d3.pie()
    .sort(null)
    .value(function (d) {
      return d.value;
    });

  // arc element
  var arc = d3.arc()
    .outerRadius(radius * 0.8)
    .innerRadius(radius * 0.55);

  // outer arc element
  var outerArc = d3.arc()
    .innerRadius(radius * 0.9)
    .outerRadius(radius * 0.9);

  svg.attr("transform", `translate(${width / 2 }, ${height / 2})`);

  // slice construction
  var slice = svg.select(".slices").selectAll("path.slice")
    .data(pie(pieItems));

  slice.enter()
    .append("path")
    .style("fill", function (d) { return d.data.color; })
    .style('cursor', 'pointer')
    .attr("class", (d, i) => `slice${i}`)
    .each(function(d) { d.initialAngle = {startAngle: 0, endAngle: 0}; })
    .merge(slice)
    .on('mouseover', function() {
      d3.select(this).attr('transform', 'scale(1.1)');
      d3.select(this).append("title").text(d.data.name);
    })
    .on('mouseout', function() {
      d3.select(this).attr('transform', 'scale(1)');
      d3.select(this).select("title").remove();
    })
    .transition().duration(1000)
    .attrTween("d", function(d) {
      var interpolate = d3.interpolate(d.initialAngle, d);
      return function(t) {
        return arc(interpolate(t));
      };
    });

  slice.exit()
    .remove();

  // text element
  var text = svg.select(".labels").selectAll("text")
    .data(pie(pieItems));

  text.enter()
    .append("text")
    .attr("dy", ".35em")
    .text(function (d) {
      return calculateValue(d.data.value) + '%';
    })
    .merge(text)
    .transition().duration(1000)
    .attr("transform", function (d) {
      var pos = outerArc.centroid(d);
      return `translate(${pos})`;
    })
    .style("text-anchor", function (d) {
      return midAngle(d) < Math.PI ? "start" : "end";
    });

  text.exit()
    .remove();

  // lines using polyline
  var polyline = svg.select(".lines").selectAll("polyline")
    .data(pie(pieItems));

  polyline.enter()
    .append("polyline")
    .merge(polyline)
    .transition().duration(1000)
    .attr("points", function (d) {
      var pos = outerArc.centroid(d);
      return [arc.centroid(d), outerArc.centroid(d), pos];
    });

  polyline.exit()
    .remove();

  function midAngle(d) {
    return d.startAngle + (d.endAngle - d.startAngle) / 2;
  }
  const legend = svgSelector
      .append('g')
      .attr("width", 200)
      .attr('height', 200);  
  
  data.forEach((dataItem, i) => {
    // legend color
    legend.append("rect")
        .attr("x",200)
        .attr("y",i * 35 + 4)
        .style("fill", dataItem?.color)
        .attr("width", 10)
        .attr("height", 15)
        .style('cursor', 'pointer')
        .on('mouseover', function() {
          d3.select(`.slice${i}`).attr('transform', 'scale(1.1)');
          d3.select(this).append("title").text(dataItem.name);
        })
        .on('mouseout', function() {
          d3.select(`.slice${i}`).attr('transform', 'scale(1)');
          d3.select(this).select("title").remove();
        });

    // legend text for single line
    const text = legend.append('text')
        .text(dataItem.name)
        .attr("x", 220)
        .attr('y', i * 35 + 15)
        .style('text-decoration', `${pieItems?.findIndex(pieItem => pieItem?.name === dataItem.name) !== -1 ? 'none' : 'line-through'}`)
        .style('font-size', '11px')
        .style('cursor', 'pointer')
        .on('mouseover', function() {
          d3.select(`.slice${i}`).attr('transform', 'scale(1.1)');
          d3.select(this).append("title").text(dataItem.name);
        })
        .on('mouseout', function() {
          d3.select(`.slice${i}`).attr('transform', 'scale(1)');
          d3.select(this).select("title").remove();
        });
    
    // legend text for second line
    const text1 = legend.append('text')
        .text(dataItem.name1)
        .attr("x", 220)
        .attr('y', i * 35 + 28)
        .style('text-decoration', `${pieItems?.findIndex(pieItem => pieItem?.name1 === dataItem.name1) !== -1 ? 'none' : 'line-through'}`)
        .style('font-size', '11px')
        .style('cursor', 'pointer')
        .on('mouseover', function() {
          d3.select(`.slice${i}`).attr('transform', 'scale(1.1)');
          d3.select(this).append("title").text(dataItem.name);
        })
        .on('mouseout', function() {
          d3.select(`.slice${i}`).attr('transform', 'scale(1)');
          d3.select(this).select("title").remove();
        });
    
    // click function for text
    text.on('click', () => {
      const textDecoration = text.style('text-decoration');
      if(textDecoration === 'line-through') {
        text.style("text-decoration", "none")
        text1.style("text-decoration", "none")
        pieItems = [ ...pieItems, data.find((dataI) => dataI.name === dataItem.name)]
        d3.select(selector).html('')
        constructNewPieChart({ ...props, pieItemsData: pieItems })
      } else {
        text.style("text-decoration", "line-through")
        text1.style("text-decoration", "line-through")
        pieItems = pieItems.filter((pieItem) => pieItem.name !== dataItem.name)
        d3.select(selector).html('')
        constructNewPieChart({ ...props, pieItemsData: pieItems })
      }
    })

    // click function for text 2
    text1.on('click', () => {
      const textDecoration = text.style('text-decoration');
      if(textDecoration === 'line-through') {
        text.style("text-decoration", "none")
        text1.style("text-decoration", "none")
        pieItems = [ ...pieItems, data.find((dataI) => dataI.name1 === dataItem.name1)]
        d3.select(legendSelector).html('')
        constructNewPieChart({ ...props, pieItemsData: pieItems })
      } else {
        text.style("text-decoration", "line-through")
        text1.style("text-decoration", "line-through")
        pieItems = pieItems.filter((pieItem) => pieItem.name1 !== dataItem.name1)
        d3.select(legendSelector).html('')
        constructNewPieChart({ ...props, pieItemsData: pieItems })
      }
    })
  })
}
