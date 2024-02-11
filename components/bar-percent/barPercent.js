// data getter function for single bar
const constructBarPercent = async() => {
  return fetch('http://localhost/vis_assign1/constants.json')
    .then((res) => res.json())
    .then((res) => {
      return barPercent({
        data: res.barPercentConstants
      })
    });
}

// single bar construct function
const barPercent = ({ data }) => {
  // width and height of bar
  const width = 90;
  const height = 20;

  // svg canvas
  const svg = d3.select(".percentage")
      .append("svg")
      .attr("width", "100%")
      .attr('height', '100%');
  
  // group for the elements
  const group = svg.selectAll('g')
      .data(data)
      .enter()
      .append('g');
  
	// text element
  const textElement = group.append('text')
      .text(d => `0%`)
      .attr('fill', '#EC7D31')
      .style('font-size', '3rem')
      .style('font-weight', 'bold')
			.style('cursor', 'pointer')
      .attr('x', (d, i) => 140  * i)
			.attr('class', d => `text${d.name.split(/[ /']/).join('-')}`)
			.on('mouseover', (event, d) => {
				d3.select(`.text${d.name.split(/[ /']/).join('-')}`)
					.attr('fill', '#f2670d')
				d3.select(`.rect${d.name.split(/[ /']/).join('-')}`)
					.attr('fill', '#f2670d')
			})
			.on('mouseout', (event, d) => {
				d3.select(`.text${d.name.split(/[ /']/).join('-')}`)
					.attr('fill', '#EC7D31')
				d3.select(`.rect${d.name.split(/[ /']/).join('-')}`)
					.attr('fill', '#FDB342')
			})
      .attr('y', height / 2 + 80);
			
			textElement.transition()
				.duration(1000)
				.tween("text", function(d) {
						var i = d3.interpolate(0, d.value);
						return function(t) {
								d3.select(`.text${d.name.split(/[ /']/).join('-')}`).text(`${Math.round(i(t))}%`);
						};
				});
  
	// first bar element
  group.append('rect')
      .attr('width', 0)
      .attr('height', height)
      .attr('fill', '#FDB342')
			.style('cursor', 'pointer')
      .attr('y', height + 80)
      .attr('x', (d, i) => i * 130)
			.style('cursor', 'pointer')
			.attr('class', d => `rect${d.name.split(/[ /']/).join('-')}`)
			.on('mouseover', (event, d) => {
				d3.select(`.text${d.name.split(/[ /']/).join('-')}`)
					.attr('fill', '#f2670d')
				d3.select(`.rect${d.name.split(/[ /']/).join('-')}`)
					.attr('fill', '#f2670d')
			})
			.on('mouseout', (event, d) => {
				d3.select(`.text${d.name.split(/[ /']/).join('-')}`)
					.attr('fill', '#EC7D31')
				d3.select(`.rect${d.name.split(/[ /']/).join('-')}`)
					.attr('fill', '#FDB342')
			})
			.transition()
			.duration(1000)
			.attr('width', (d) => d.value * width /100);
			
	// second bar
  group.append('rect')
      .attr("x", (d, i) => i * 130)
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "#FEE9C7")
      .attr('y', height + 80)
			.style('cursor', 'pointer')
			.attr('class', d => `rect2${d.name.split(/[ /']/).join('-')}`)
			.on('mouseover', (event, d) => {
				d3.select(`.text${d.name.split(/[ /']/).join('-')}`)
					.attr('fill', '#f2670d')
				d3.select(`.rect${d.name.split(/[ /']/).join('-')}`)
					.attr('fill', '#f2670d')
			})
			.on('mouseout', (event, d) => {
				d3.select(`.text${d.name.split(/[ /']/).join('-')}`)
					.attr('fill', '#EC7D31')
				d3.select(`.rect${d.name.split(/[ /']/).join('-')}`)
					.attr('fill', '#FDB342')
			})
			.transition()
			.duration(1000)
      .attr("width", d => width - (d.value * width / 100))
			.attr('x', (d, i) => d.value * width / 100 + i * 130);
  
	// oraganization text
  group.append('text')
      .text(d => 'organizations')
      .style('font-size', '0.9rem')
      .attr('y', height + 120)
      .attr('x', (d, i) => i * 130 + 5)
			.style('cursor', 'pointer')
			.on('mouseover', (event, d) => {
				d3.select(`.text${d.name.split(/[ /']/).join('-')}`)
					.attr('fill', '#f2670d')
				d3.select(`.rect${d.name.split(/[ /']/).join('-')}`)
					.attr('fill', '#f2670d')
			})
			.on('mouseout', (event, d) => {
				d3.select(`.text${d.name.split(/[ /']/).join('-')}`)
					.attr('fill', '#EC7D31')
				d3.select(`.rect${d.name.split(/[ /']/).join('-')}`)
					.attr('fill', '#FDB342')
			});
			
	// text element
  group.append('text')
      .text(d => d.name)
      .style('font-size', '0.9rem')
      .style('font-weight', 'bold')
			.style('cursor', 'pointer')
      .attr('y', height + 135)
      .attr('x', (d, i) => (i * 130))
			.on('mouseover', (event, d) => {
				d3.select(`.text${d.name.split(/[ /']/).join('-')}`)
					.attr('fill', '#f2670d')
				d3.select(`.rect${d.name.split(/[ /']/).join('-')}`)
					.attr('fill', '#f2670d')
			})
			.on('mouseout', (event, d) => {
				d3.select(`.text${d.name.split(/[ /']/).join('-')}`)
					.attr('fill', '#EC7D31')
				d3.select(`.rect${d.name.split(/[ /']/).join('-')}`)
					.attr('fill', '#FDB342')
			});

	// seperator line
  svg.append('line')
      .attr('x1', 110)
      .attr('x2', 110)
      .attr('y1', 40)
      .attr('y2', 180)
      .attr('stroke', "#C9C9C9")
      .attr('stroke-width', 2)

}