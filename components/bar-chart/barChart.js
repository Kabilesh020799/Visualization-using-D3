// data getter for bar chart with key
const constructBarChart= async(props) => {
  const {
    key,
    selector,
    width,
    height,
    type,
    legendSelector,
  } = props;

  return fetch('http://localhost/vis_assign1/constants.json')
    .then((res) => res.json())
    .then((res) => {
      return barChart({
        data: res?.[key],
        selector,
        width,
        height,
        type,
        legendSelector,
      })
    });
};

// barchart construct function
const barChart = (props) => {
  const {
    data,
    selector,
    width,
    height,
    type,
    legendSelector,
    barItemsData,
  } = props;

  // vertical or horizontal chart
  const isVertical = type === 'vertical';
  const baseIndex = 360;

  // baritems
  let barItems = [... (barItemsData || data)];

  // total of the value
  const total = barItems.reduce((sum, barItem) => {
    return sum + barItem.value;
  }, 0);

  // percentage based on the total
  const calculateValue = (valueItem) => {
    return Math.round((valueItem / total) * 100);
  }

  // svg canvas
  const svg = d3.select(selector)
      .append('svg')
      .attr('width', "100%")
      .attr('height', isVertical ? 400 : '100%')

  // group for the bar
  const group = svg.selectAll('g')
      .data(barItems)
      .enter()
      .append('g')

  // bar element
  group.append('rect')
    .attr('height', isVertical ? 0 : height)
    .attr('width', isVertical ? height : 0)
    .attr('fill', d => d.color ? d.color : '#FDB342')
    .attr('x', isVertical ? (d, i) => (i * (90)) + 10: 0)
    .attr('y', isVertical ? baseIndex : (d, i) => i * 38 + 10)
    .attr('class', (d, i) => `rect${d.name.split(/[ /']/).join('-')}`)
    .style('cursor', 'pointer')
    .on('mouseover', (event, d) => {
      d3.select(`.rect${d.name.split(/[ /']/).join('-')}`)
        .attr('fill', '#f2670d')
    })
    .on('mouseout', (event, d) => {
      d3.select(`.rect${d.name.split(/[ /']/).join('-')}`)
      .transition()
      .duration(1000)
      .attr('fill', d => d.color ? d.color : '#FDB342')
    })
    .transition()
    .duration(1000)
    .attr('width', isVertical ? height : d => calculateValue(d.value) * width / 100)
    .attr('height', isVertical ? (d) => Math.min((calculateValue(d.value) * width / 100), width - 400) : height)
    .attr('y', isVertical ? d => baseIndex - Math.min((calculateValue(d.value) * width / 100), width - 400) : (d, i) => i * 38 + 10)

  // render text based on the graph
  if(!isVertical) {
    group.append('text')
    .text(d => d.name)
    .attr('x', 0)
    .attr('y', (d, i) => i * 38 + 29)
    .style('fill', '#E76820')
    .style('font-weight', 'bold')
    .on('mouseover', (event, d) => {
      d3.select(`.rect${d.name.split(/[ /']/).join('-')}`)
        .attr('fill', '#f2670d')
    })
    .on('mouseout', (event, d) => {
      d3.select(`.rect${d.name.split(/[ /']/).join('-')}`)
      .transition()
      .duration(1000)
      .attr('fill', d => d.color ? d.color : '#FDB342')
    })
    .transition()
    .duration(1000)
    .attr('x', d => calculateValue(d.value) * width /100 + 10)

  }
  
  if(!isVertical) {
    setTimeout(() => {
      group.append('text')
      .text(d => `${calculateValue(d.value)}%`)
      .attr('y', (d, i) => i * 38 + 29)
      .attr('x', 8)
      .style('fill', 'white')
      .on('mouseover', (event, d) => {
        d3.select(`.rect${d.name.split(/[ /']/).join('-')}`)
          .attr('fill', '#f2670d')
      })
      .on('mouseout', (event, d) => {
        d3.select(`.rect${d.name.split(/[ /']/).join('-')}`)
        .transition()
        .duration(1000)
        .attr('fill', d => d.color ? d.color : '#FDB342')
      })
      .style('font-weight', "bold");
    }, 800);
  } else {
    group.append('text')
      .text(d => `${calculateValue(d.value)}%`)
      .attr('x', (d, i) => (i * (90)) + 25)
      .attr('y', baseIndex - 7)
      .style('font-weight', 'bold')
      .style('fill', '#656565')
      .on('mouseover', (event, d) => {
        d3.select(`.rect${d.name.split(/[ /']/).join('-')}`)
          .attr('fill', '#f2670d')
      })
      .on('mouseout', (event, d) => {
        d3.select(`.rect${d.name.split(/[ /']/).join('-')}`)
        .transition()
        .duration(1000)
        .attr('fill', d => d.color ? d.color : '#FDB342')
      })
      .transition()
      .duration(1000)
      .attr('y', d => baseIndex - 7 - Math.min((calculateValue(d.value) * width / 100), width - 400));
    
      const legendSize = 10; 
      const legendSpacing = 4;
      const legendSvg = d3.select(legendSelector)
          .append('svg')
          .attr('width', 'fit-content')
          .attr('height', 150)
      
      data.forEach((dataItem, index) => {
        const legendItem = legendSvg.append("g")
          .attr("class", "legend-item")
          .attr("transform", `translate(0, ${index * 20})`)

        legendItem.append("rect")
          .attr("width", legendSize)
          .attr("height", legendSize)
          .attr("fill", dataItem.color)
          .attr('x', 0)
          .attr('y', 0)
          .style('cursor', 'pointer')
          .on('mouseover', () => {
            d3.select(`.rect${dataItem.name.split(/[ /']/).join('-')}`).attr('fill', '#f2670d');
          })
          .on('mouseout', () => {
            d3.select(`.rect${dataItem.name.split(/[ /']/).join('-')}`).attr('fill', dataItem.color ? dataItem.color : '#FDB342');
          });
      
        const legendText = legendItem.append("text")
          .attr("x", legendSize + legendSpacing + 4)
          .attr("y", 0)
          .text(dataItem.name)
          .style("font-size", "12px")
          .attr("alignment-baseline", "hanging")
          .style('fill', '#646464')
          .style('cursor', 'pointer')
          .style('text-decoration', `${barItems?.findIndex((barItem) => barItem?.name === dataItem.name) !== -1 ? 'none' : 'line-through'}`)
          .on('mouseover', () => {
            d3.select(`.rect${dataItem.name.split(/[ /']/).join('-')}`).attr('fill', '#f2670d');
          })
          .on('mouseout', () => {
            d3.select(`.rect${dataItem.name.split(/[ /']/).join('-')}`).attr('fill', dataItem.color ? dataItem.color : '#FDB342');
          });

        legendText.on('click', () => {
          const textDecoration = legendText.style('text-decoration');
          console.log(textDecoration)
          if(textDecoration === 'line-through') {
            legendText.style("text-decoration", "none")
            barItems = [ ...barItems, data.find((dataI) => dataI.name === dataItem.name)]
            d3.select(selector).html('')
            d3.select(legendSelector).html('')
            barChart({ ...props, barItemsData: barItems })
          } else {
            legendText.style("text-decoration", "line-through")
            barItems = barItems.filter((barItem) => barItem.name !== dataItem.name)
            console.log(barItems)
            d3.select(selector).html('')
            d3.select(legendSelector).html('')
            barChart({ ...props, barItemsData: barItems })
          }
        })
      });
  }
}