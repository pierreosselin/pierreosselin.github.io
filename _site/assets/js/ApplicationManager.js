/**
 * Manages application state and updates parameter buttons and plot as needed.
 */
class ApplicationManager {
  constructor(plot) {
    this.plot = plot;

    const plotType = plot.getType();
    const { name: initialAlgoName } =
      paramsConfig[paramNames.algorithmName]
        .values[plotType]
        .get_init_value();
    const { name: initialObjectiveName, value: initialObjective } =
      paramsConfig[paramNames.objectiveFunction]
        .values[plotType]
        .get_init_value();
    this.objectiveFunction = {
      name: initialObjectiveName,
      value: initialObjective
    };

    this.resetParams(initialAlgoName);
    this.resetAlgo(initialAlgoName);

    this.algoDropdown = parameterInputFactory(
      paramNames.algorithmName,
      inputTypes.dropdown,
      paramsConfig[paramNames.algorithmName].values[this.plot.getType()].get_init_value(),
      paramsConfig[paramNames.algorithmName].values[this.plot.getType()].domain,
      algo => this.setParam(paramNames.algorithmName, algo),
      "#algoButtonSpace"
    );

    this.paramButtons = {};
    this.resetParametersButtons();
    this.plotFunctionAndAxis();
    this.plotAlgoResults();
    this.resetMouse();
    this.xiniclick = parameterInputFactory(
      null,
      inputTypes.click,
      null,
      null,
      xini => this.setParam(paramNames.x_ini, xini),
      "#svg1"
    );
    this.plotDoc();
  }



  getInitializedParams(algoName) {
    let initializedParam = algorithmsConfig[algoName].parameters.reduce(
      (params, paramName) => {
        if (paramName === paramNames.objectiveFunction) {
          return {
            ...params,
            [paramName]: this.objectiveFunction.value,
          }
        }

        const config = paramsConfig[paramName];
        let initialValue = config.values[this.plot.getType()].get_init_value(algoName, this.objectiveFunction.name);
        if (config.input_type === inputTypes.dropdown) {
          initialValue = initialValue.value;
        }

        return {
          ...params,
          [paramName]: initialValue,
        }
      },
      {}
    );
    return {...initializedParam}
  }

  resetParams(algoName) {
    this.algoParams = this.getInitializedParams(algoName);
  }

  changeAlgorithmParams(algoName) {
    let newAlgoParams = this.getInitializedParams(algoName);
    for (let key in newAlgoParams) {
      if (key in this.algoParams){
        if (!(key === paramNames.objectiveFunction || key === paramNames.algorithmName)){
          newAlgoParams[key] = this.algoParams[key]
        }
      }
    };
    this.algoParams = {...newAlgoParams};
    this.resetAlgo(algoName);
  }

  resetAlgo(algoName) {
    this.algo = new (algorithmsConfig[algoName].class)(this.algoParams);
    this.algo.optimize();
  }

  plotFunctionAndAxis() {
    this.plot.clearAll();

    if (this.plot.getType() === plotTypes.plot_1D) {
      this.plot.draw(this.algoParams[paramNames.objectiveFunction], 4);
    }

    if (this.plot.getType() === plotTypes.contour_plot) {
      const thresholds = paramsConfig[paramNames.threshold].values[this.plot.getType()].get_init_value(null, this.objectiveFunction.name);
      const interpolation = paramsConfig[paramNames.interpolation].values[this.plot.getType()]
        .get_init_value(null, this.objectiveFunction.name).value;
      this.plot.draw(this.algoParams[paramNames.objectiveFunction], 4, thresholds, d3[interpolation])
    }

    this.plot.addAxis();
  }

  plotAlgoResults() {
    this.plot.clearLines();

    if (this.plot.getType() === plotTypes.plot_1D) {
      this.plot.addLine(this.algo.getPath().map(index => [index[0], this.algoParams[paramNames.objectiveFunction](index)]));
    }

    if (this.plot.getType() === plotTypes.contour_plot) {
      this.plot.addLine(this.algo.getPath());
    }
  }

  setParam(paramName, value) {
    if (!Object.values(paramNames).includes(paramName)) {
      throw new Error("Invalid parameter name");
    }

    if (paramName === paramNames.algorithmName) {
      this.changeAlgorithmParams(value.name, this.objectiveFunction.name, this.objectiveFunction.value);
      this.resetParametersButtons();
      this.plotAlgoResults();
      this.plotDoc();
      return;
    }

    if (paramName === paramNames.objectiveFunction) {
      this.algoParams[paramNames.objectiveFunction] = value;
      this.objectiveFunction = value;
      this.resetParams(this.algo.getName());
      this.resetAlgo(this.algo.getName());

      const xDomain = paramsConfig[paramNames.xDomain].values[this.plot.getType()]
        .get_init_value(null, this.objectiveFunction.name);
      const yDomain = paramsConfig[paramNames.yDomain].values[this.plot.getType()]
        .get_init_value(null, this.objectiveFunction.name);
      this.plot.setXDomain(xDomain);
      this.plot.setYDomain(yDomain);

      this.plotFunctionAndAxis();
      this.plotAlgoResults();
      this.resetParametersButtons();
      this.resetMouse();
      this.plotDoc();
      return;
    }

    if (paramName === paramNames.x_ini) {
      if (this.plot.getType() === plotTypes.plot_1D){
        this.algoParams[paramName] = [this.plot.xScale.invert(value[0])];
      }

      if (this.plot.getType() === plotTypes.contour_plot){
        this.algoParams[paramName] = [this.plot.xScale.invert(value[0]), this.plot.yScale.invert(value[1])];
      }

      this.resetAlgo(this.algo.getName());
      this.plotAlgoResults();
      return;
    }

    if (paramsConfig[paramName].input_type === inputTypes.dropdown) {
      this.algoParams[paramName] = value.value;
    } else {
      this.algoParams[paramName] = parseFloat(value);
    }
    this.resetAlgo(this.algo.getName());
    this.plotAlgoResults();
  }

  resetParametersButtons() {
    d3.select("#algoParamsButtonSpace").selectAll("*").remove();
    algorithmsConfig[this.algo.getName()].parameters.forEach(param => {
      if (paramsConfig[param].input_type !== inputTypes.click) {
        const { input_type: inputType } = paramsConfig[param];
        const { domain, get_init_value: getInitValue } = paramsConfig[param].values[this.plot.getType()];
        let initValue;
        if (param === paramNames.objectiveFunction) {
          initValue = this.objectiveFunction;
        } else {
          initValue = this.algoParams[param];
        }
        const onValueChanged = value => this.setParam(param, value);
        this.paramButtons[param] = parameterInputFactory(param, inputType, initValue, domain, onValueChanged, "#algoParamsButtonSpace")
      }
    })
  }

  resetMouse() {
    if (this.plot.getType() === plotTypes.plot_1D) {
      let obj = this.algo.objective;
      let plt = this.plot;
      let circle_xini = plt.svg
        .append("circle")
        .attr('r', 4)
        .style("fill", "black");
      plt.svg
        .on("mousemove", function () {
          const mousex = d3.mouse(d3.event.target)[0];
          circle_xini
            .attr('cx', mousex)
            .attr('cy', plt.yScale(obj([graphPlot.xScale.invert(mousex)])))
        });
    }
  }

  plotDoc() {
    documentationFactory(this.objectiveFunction.name, this.algoParams[paramNames.algorithmName], this.plot.getType());
  }
}
