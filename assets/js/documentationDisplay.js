
// Display the documentation
function documentationFactory(paramName, doc, containerId) {
  let div = d3.select(containerId).html("");
  div.append("p").style("color", "black").style("font-size", "50px").text(doc[paramName].name);
  let formulaP = div.append("p");
  let text = formulaP.append("foreignObject").attr("width",50).attr("height",50)
  text.text(doc[paramName].value);
  MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
}
