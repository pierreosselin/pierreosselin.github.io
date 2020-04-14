class GraphPlot {
  /**
   * @param svg - svg object on which to draw the plot.
   * @param xDomain - 2 elements list, domain of the variable of f for the plot.
   * @param width - pixels width of the plot.
   * @param height - pixels height of the plot.
   */
  constructor(svg, xDomain, width, height) {
    this.type = plotTypes.plot_1D;
    this.svg = svg;
    this.xScale = d3.scaleLinear(xDomain, [0, width]);
    this.width = width;
    this.height = height;
  }

  /**
   * Display a plot of a function over a domain.
   * @param f - one variable function with real values to plot.
   * @param precision - sample every <precision> pixels in xDomain.
   */
  draw(f, precision) {
    /**
     * Compute graph of the function on the number of points defined by precision
     * Data contains the value of f at relevant points
     */

    const gridWidth = Math.ceil(this.width / precision);
    const data = [...Array(gridWidth).keys()].map(index => ({x: this.xScale.invert(index * precision), y: f([this.xScale.invert(index * precision)])}));


    // Define the y domain
    this.yScale = d3.scaleLinear()
        .domain([Math.min(...data.map(({y}) => y)), Math.max(...data.map(({y}) => y))]).nice()
        .range([this.height, 0]);


    // prepare a helper function
    let curveFunc = d3.line()
      .curve(d3.curveBasis)              // This is where you define the type of curve. Try curveStep for instance.
      .x(({ x }) => this.xScale(x))
      .y(({ y }) => this.yScale(y));

    /**
     * Display plot in svg
     */
     this.svg
       .attr("viewBox", [0, 0, this.width, this.height])
       .style("display", "block")
       .style("margin", "0 -14px")
       .style("width", "calc(100%)")
       .append('path')
       .attr('d', curveFunc(data))
       .attr('stroke', 'black')
       .attr('fill', 'none');

    return this;
  }

  /**
   * Add axis on the plot based on xDomain and yDomain.
   * @returns {GraphPlot}
   */
  addAxis() {
    const xAxis = g => g
      .attr("transform", `translate(0,${this.height})`)
      .call(d3.axisTop(this.xScale).ticks(this.width / this.height * 10))
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick").filter(d => this.xScale.domain().includes(d)).remove());

    const yAxis = g => g
      .attr("transform", "translate(-1,0)")
      .call(d3.axisRight(this.yScale))
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick").filter(d => this.yScale.domain().includes(d)).remove());

    this.svg.append("g")
      .call(xAxis);

    this.svg.append("g")
      .call(yAxis);

    return this;
  }

  /**
   * Draw line from points coordinates.
   * @param points - list of points.
   *  Point: [x, y] where x and y are coordinates in xDomain and yDomain.
   */
   addLine(points) {
     const coords = points.map(([x, y]) => [this.xScale(x), this.yScale(y)]);

     const transitionDuration = index => Math.round(350 / index);
     const previousTransitionsDuration = index => [...Array(index - 1).keys()]
       .reduce((acc, current) => acc + transitionDuration(current + 1), 0);

     for (let i = 1 ; i < coords.length ; i++) {
       const transitionPath = d3.transition()
         .ease(d3.easeLinear)
         .delay(previousTransitionsDuration(i))
         .duration(transitionDuration(i));

       const transitionDot = d3.transition()
         .ease(d3.easeLinear)
         .delay(previousTransitionsDuration(i))
         .duration(0);

       this.svg.append("circle")
         .attr('r', 0)
         .attr('id', 'dot')
         .style("fill", "green")
         .attr("transform", `translate(${coords[i - 1][0]}, ${coords[i - 1][1]})`)
         .transition(transitionDot)
         .attr('r', 3);

       this.svg.append("line")
         .attr('id', 'path')
         .attr("x1", coords[i - 1][0])
         .attr("y1", coords[i - 1][1])
         .attr("x2", coords[i - 1][0])
         .attr("y2", coords[i - 1][1])
         .attr("stroke", "green")
         .style("fill","none")
         .transition(transitionPath)
         .attr("x2", coords[i][0])
         .attr("y2", coords[i][1]);
     }

     this.svg.append("circle")
       .attr('r', 0)
       .attr('id', 'dot')
       .style("fill", "green")
       .attr("transform", `translate(${coords[coords.length - 1][0]}, ${coords[coords.length - 1][1]})`)
       .transition(d3.transition().delay(previousTransitionsDuration(coords.length)).duration(0))
       .attr('r', 3);

     return this;
   }


  addLine2(points) {
    const line = d3.line()(points.map(([x, y]) => [this.xScale(x), this.yScale(y)]));

    this.svg
      .append('defs')
      .append('marker')
      .attr('id', 'dot')
      .attr('viewBox', [0, 0, 20, 20])
      .attr('refX', 10)
      .attr('refY', 10)
      .attr('markerWidth', 10)
      .attr('markerHeight', 10)
      .append('circle')
      .attr('cx', 10)
      .attr('cy', 10)
      .attr('r', 5)
      .style('fill', 'green');

    this.svg.append("path")
      .attr("stroke", "green")
      .attr('id', 'path')
      .attr("d", line)
      .style("fill","none")
      .attr('marker-start', 'url(#dot)')
      .attr('marker-mid', 'url(#dot)')
      .attr('marker-end', 'url(#dot)');

    return this;
  }

  clearLines() {
    d3.selectAll("#path").remove();
    d3.selectAll("#dot").remove();
  }

  clearAll() {
    d3.select("#svg1").selectAll("*").remove();
  }

  getType = () => this.type;

  setXDomain = xDomain => this.xScale = d3.scaleLinear(xDomain, [0, this.width]);
  setYDomain = () => {};
}
