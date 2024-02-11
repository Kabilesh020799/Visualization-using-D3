const constructImage = async() => {
  return fetch('http://localhost/vis_assign1/constants.json')
    .then((res) => res.json())
    .then((res) => {
      return imageContainer({
        data: res.imageConstants,
      })
    });
};

const imageContainer = (props) => {
  const {
    data,
  } = props;

  const container = d3.select('.second-container-techs-stacks');

  var div = container.selectAll("div")
    .data(data)
    .enter()
    .append("div")
    .attr("class", (d, i) => i === 0 ? "second-container-techs-stack first-img" : "second-container-techs-stack");

  div.append('img')
    .attr('class', 'image')
    .attr('src', (d) => `http://localhost/vis_assign1/images/${d.image}.jpg`)
    .attr('alt', (d) => `Image${d.image}`)
    .style('opacity', 0)
    .transition()
    .duration(1000)
    .style('opacity', 1);
  
  div.append('div')
    .attr('class', 'text')
    .text((d) => d.name)
    .style('opacity', 0)
    .transition()
    .duration(1000)
    .style('opacity', 1);
}