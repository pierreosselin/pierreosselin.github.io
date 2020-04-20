
// Display the documentation
function documentationFactoryFunction(paramName, doc, containerId) {
  let div = d3.select(containerId).html("");
  div.append("p").style("color", "black").style("font-size", "50px").text(doc[paramName].name);
  let formulaP = div.append("p");
  let text = formulaP.append("foreignObject").attr("width",50).attr("height",50)
  text.text(doc[paramName].value);
  MathJax.Hub.Queue(["Typeset",MathJax.Hub]);

}

// Display the documentation
function documentationFactoryAlgo(paramName, doc, containerId) {
  let div = d3.select(containerId).html("");
  div.append("p").style("color", "black").style("font-size", "50px").text(doc[paramName].name);
  let formulaP = div.append("p");
  let text = formulaP.append("foreignObject").attr("width",50).attr("height",50)
  text.text(doc[paramName].value);
  d3.select(containerId).append('img').attr("src", doc[paramName].link).attr("class", "svg-content-responsive-algo")
  let formulaExplaination = div.append("p");
  let textExplaination = formulaExplaination.append("foreignObject").attr("width",50).attr("height",50)
  textExplaination.text(doc[paramName].explain);
  MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
}

// Display the documentation
function documentationFactoryBarmijo(flag, doc, containerId) {
  let div = d3.select(containerId).html("");
  if (flag) {
    div.append("p").style("color", "black").style("font-size", "50px").text(doc.name);
    let formulaP = div.append("p");
    let text = formulaP.append("foreignObject").attr("width",50).attr("height",50)
    text.text(doc.explain);
    d3.select(containerId).append('img').attr("src", doc.link).attr("class", "svg-content-responsive-algo")
    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
  }
}
