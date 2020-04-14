function documentationFactory(objFunction, algName, plot_type) {
  let div = d3.select("#documentation").html("");
  div.append("p").style("color", "black").style("font-size", "50px").text(docConfig[plot_type][objFunction].name);
  let formulaP = div.append("p");
  let text = formulaP.append("foreignObject").attr("width",50).attr("height",50)
  text.text(docConfig[plot_type][objFunction].value);
  MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
}
