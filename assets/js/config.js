const inputTypes = {
  // The variable domain is given as a list of names and associated values
  dropdown: "dropdown",

  // The variable domain is given as a function (value) => isValid.
  click: "click",

  // The variable domain is given as a function (value) => isValid.
  text: "text",
};

const paramNames = {
  // algorithm
  algorithmName: "Algorithm",

  // objective
  objectiveFunction: "Objective function",

  // algorithm params
  x_ini: "Initial coordinates",
  delta: "Learning rate",
  h: "Derivatives h param",
  momentum: "Descent momentum",
  rho: "Rho",
  epsilon: "Epsilon",
  beta1 : "Beta1",
  beta2 : "Beta2",
  nlim: "Maximum number of iterations",
  normLim: "Norm value stopping criterion",

  // graph params
  xDomain: "Domain for first variable",
  yDomain: "Domain for second variable",
  interpolation: "Interpolation method",
  threshold: "Contour thresholds",
};

const algorithmNames = {
  gradientDescent: "Gradient Descent",
  gradientDescentWithMomentum: "Gradient Descent With Momentum",
  gradientDescentMomentumNesterov: "Gradient Descent With Momentum Nesterov",
  RMSProp: "RMSProp",
  adam: "Adam",
  bfgs: "BFGS",
  newton: "Newton",
};

const plotTypes = {
  plot_1D: "plot_1D",
  contour_plot: "contour_plot",
};

// TODO add algo specific parameters
const algorithmsConfig = {
  [algorithmNames.gradientDescent]: {
    class: GradientDescent,
    parameters: [
      paramNames.objectiveFunction,
      paramNames.x_ini,
      paramNames.delta,
      paramNames.h,
      paramNames.nlim,
      paramNames.normLim,
    ]
  },
  [algorithmNames.gradientDescentWithMomentum]: {
    class: GradientDescentMomentum,
    parameters: [
      paramNames.objectiveFunction,
      paramNames.x_ini,
      paramNames.delta,
      paramNames.h,
      paramNames.momentum,
      paramNames.nlim,
      paramNames.normLim,
    ]
  },
  [algorithmNames.gradientDescentMomentumNesterov]: {
    class: GradientDescentMomentumNesterov,
    parameters: [
      paramNames.objectiveFunction,
      paramNames.x_ini,
      paramNames.delta,
      paramNames.h,
      paramNames.momentum,
      paramNames.nlim,
      paramNames.normLim,
    ]
  },
  [algorithmNames.RMSProp]: {
    class: RMSProp,
    parameters: [
      paramNames.objectiveFunction,
      paramNames.x_ini,
      paramNames.delta,
      paramNames.h,
      paramNames.rho,
      paramNames.epsilon,
      paramNames.nlim,
      paramNames.normLim,
    ]
  },
  [algorithmNames.adam]: {
    class: Adam,
    parameters: [
      paramNames.objectiveFunction,
      paramNames.x_ini,
      paramNames.delta,
      paramNames.h,
      paramNames.beta1,
      paramNames.beta2,
      paramNames.epsilon,
      paramNames.nlim,
      paramNames.normLim,
    ]
  },
  [algorithmNames.bfgs]: {
    class: BFGS,
    parameters: [
      paramNames.objectiveFunction,
      paramNames.x_ini,
      paramNames.delta,
      paramNames.h,
      paramNames.nlim,
      paramNames.normLim,
    ]
  },
  [algorithmNames.newton]: {
    class: DampedNewton,
    parameters: [
      paramNames.objectiveFunction,
      paramNames.x_ini,
      paramNames.delta,
      paramNames.h,
      paramNames.epsilon,
      paramNames.nlim,
      paramNames.normLim,
    ]
  },
};

const paramsConfig = {
  [paramNames.objectiveFunction]: {
    input_type: inputTypes.dropdown,
    values: {
      [plotTypes.plot_1D]: {
        get_init_value: () => ({ name: "square", value: x => x**2 }),
        domain: [
          { name: "square", value: x => x**2 },
          { name: "pow3", value: x => x**3 },
          { name: "sin1", value: x => Math.sin(x) + Math.sin((10/3) * x)},
          { name: "sin2", value: x => - Math.sin(2*x + 1) - 2 * Math.sin(3*x + 2) - 3 * Math.sin(4*x + 3) - 4 * Math.sin(5*x + 4) - 5 * Math.sin(6*x + 5) - 6 * Math.sin(7*x + 6)},
          { name: "sin3", value: x => -(1.4 -3 * x)*Math.sin(18 * x) },
          { name: "sin4", value: x => Math.sin(x) + Math.sin((10/3) * x) + Math.log(x) - 0.84 * x  + 3},
          { name: "sin5", value: x => x*Math.sin(x) + x * Math.cos(2 * x)}
        ],
      },
      [plotTypes.contour_plot]: {
        get_init_value: () => ({ name: "square", value: ([x, y]) => x ** 2 + y ** 2 + (x + y) ** 2 }),
        domain: [
          { name: "square", value: ([x, y]) => x ** 2 + y ** 2 + (x + y) ** 2 },
          { name: "saddle", value: ([x,y]) => 2 + x**2 - y ** 2},
          { name: "rosenbrock", value: ([x,y]) => (1-x)**2  + 100*(y - x**2)**2 + 1},
          { name: "rastrigin", value: ([x,y]) => 1 + (20 + x**2 + y**2 - 10 * Math.cos(2*(Math.PI)*x) - 10 * Math.cos(2*(Math.PI)*y))},
          { name: "ackley", value: ([x,y]) => 1 - 20 * Math.exp(  -0.2 * Math.sqrt(0.5*(x**2 + y**2))) - Math.exp(0.5 * (Math.cos(2*Math.PI*x) + Math.cos(2*Math.PI*y))) + Math.exp(1) + 20},
          { name: "goldstein", value: ([x,y]) => (1 + ((x + y + 1)**2) * (19 - 14 * x + 3 * x ** 2 - 14 * y + 6 * x * y + 3 * y ** 2)) * (30 + ((2 * x - 3 * y) ** 2) * (18 - 32 * x + 12 * x ** 2 + 48 * y - 36 * x * y + 27 * y **2))},
          { name: "himmelblau", value: ([x,y]) => 1 + (x ** 2 + y - 11) ** 2 + (x + y ** 2 - 7) ** 2},
          { name: "camel", value: ([x,y]) => 2 * x ** 2 - 1.05 * x ** 4 + (1/6) * x ** 6 + x * y + y ** 2},
          { name: "easom", value: ([x,y]) =>  2 - Math.cos(x) * Math.cos(y) * Math.exp(-((x - Math.PI) ** 2 + (y - Math.PI) ** 2))},
          { name: "eggholder", value: ([x,y]) =>  960.6407 -(y + 47) * Math.sin(Math.sqrt(Math.abs(x / 2 + (y + 47)))) - x * Math.sin(Math.sqrt(Math.abs(x - (y + 47))))},
          { name: "mccormick", value: ([x,y]) =>  2.9193 + Math.sin(x + y) + (x - y) ** 2 - 1.5 * x + 2.5 * y + 1},
          { name: "styblinski", value: ([x,y]) => 79.33198 + 0.5 * (x ** 4 - 16 * x ** 2 + 5 * x + y ** 4 - 16 * y ** 2 + 5 * y)},
        ],
      }
    },
  },
  [paramNames.algorithmName]: {
    input_type: inputTypes.dropdown,
    values: {
      [plotTypes.plot_1D]: {
        get_init_value: () => ({ name: algorithmNames.gradientDescent, value: algorithmsConfig[algorithmNames.gradientDescent].class }),
        domain: Object.values(algorithmNames).map(name => ({ name, value: algorithmsConfig[name].class })),
      },
      [plotTypes.contour_plot]: {
        get_init_value: () => ({ name: algorithmNames.gradientDescent, value: algorithmsConfig[algorithmNames.gradientDescent].class }),
        domain: Object.values(algorithmNames).map(name => ({ name, value: algorithmsConfig[name].class })),
      }
    },
  },
  [paramNames.x_ini]: {
    input_type: inputTypes.click,
    values: {
      [plotTypes.plot_1D]: {
        get_init_value: (algorithm, objective) => ({ square: [1.5],
          pow3: [0.7],
          sin1: [3],
          sin2: [-7.2],
          sin3: [1],
          sin4: [3],
          sin5: [6.5] }[objective]),
        // TODO implement domain validation
        domain: value => true,
      },
      [plotTypes.contour_plot]: {
        get_init_value: (algorithm, objective) => ({ square: [-30, 175],
          saddle: [-0.5, 0.05],
          rosenbrock: [2.5, -1.5],
          rastrigin: [2.5, -1.5],
          ackley: [2.5, -1.5],
          goldstein: [-0.4, 1],
          himmelblau: [0, 0],
          camel: [2.5, -1.5],
          easom: [2.5, -1.5],
          eggholder: [300, 400],
          mccormick: [2.5, -1.5],
          styblinski: [0.25, -0.5]}[objective]),
        domain: value => true,
      }
    },
  },
  [paramNames.h]: {
    input_type: inputTypes.text,
    values: {
      [plotTypes.plot_1D]: {
        get_init_value: () => 0.001,
        domain: value => value > 0,
      },
      [plotTypes.contour_plot]: {
        get_init_value: () => 0.001,
        domain: value => value > 0,
      }
    },
  },
  [paramNames.delta]: {
    input_type: inputTypes.text,
    values: {
      [plotTypes.plot_1D]: {
        get_init_value: (algorithm, objective) => ({ square: 0.8,
          pow3: 0.1,
          sin1: 0.01,
          sin2: 0.01,
          sin3: 0.01,
          sin4: 0.01,
          sin5: 0.01 }[objective]),
        domain: value => value > 0,
      },
      [plotTypes.contour_plot]: {
        get_init_value: (algorithm, objective) => ({ square: 0.1,
          saddle: 0.1,
          rosenbrock: 0.0001,
          rastrigin: 0.001,
          ackley: 0.1,
          goldstein: 0.00001,
          himmelblau: 0.001,
          camel: 0.004,
          easom: 0.001,
          eggholder: 5,
          mccormick: 0.1,
          styblinski: 0.05}[objective]),
        domain: value => value > 0,
      }
    }
  },
  [paramNames.momentum]: {
    input_type: inputTypes.text,
    values: {
      [plotTypes.plot_1D]: {
        get_init_value: () => 0.9,
        domain: value => value > 0,
      },
      [plotTypes.contour_plot]: {
        get_init_value: () => 0.9,
        domain: value => value > 0,
      }
    }
  },
  [paramNames.rho]: {
    input_type: inputTypes.text,
    values: {
      [plotTypes.plot_1D]: {
        get_init_value: () => 0.9,
        domain: value => value > 0,
      },
      [plotTypes.contour_plot]: {
        get_init_value: () => 0.9,
        domain: value => value > 0,
      }
    }
  },
  [paramNames.epsilon]: {
    input_type: inputTypes.text,
    values: {
      [plotTypes.plot_1D]: {
        get_init_value: () => 0.0000001,
        domain: value => value > 0,
      },
      [plotTypes.contour_plot]: {
        get_init_value: () => 0.0000001,
        domain: value => value > 0,
      }
    }
  },
  [paramNames.beta1]: {
    input_type: inputTypes.text,
    values: {
      [plotTypes.plot_1D]: {
        get_init_value: () => 0.9,
        domain: value => value > 0,
      },
      [plotTypes.contour_plot]: {
        get_init_value: () => 0.9,
        domain: value => value > 0,
      }
    }
  },
  [paramNames.beta2]: {
    input_type: inputTypes.text,
    values: {
      [plotTypes.plot_1D]: {
        get_init_value: () => 0.999,
        domain: value => value > 0,
      },
      [plotTypes.contour_plot]: {
        get_init_value: () => 0.999,
        domain: value => value > 0,
      }
    }
  },
  [paramNames.nlim]: {
    input_type: inputTypes.text,
    values: {
      [plotTypes.plot_1D]: {
        get_init_value: () => 60,
        domain: value => value > 0,
      },
      [plotTypes.contour_plot]: {
        get_init_value: () => 60,
        domain: value => value > 0,
      }
    }
  },
  [paramNames.normLim]: {
    input_type: inputTypes.text,
    values: {
      [plotTypes.plot_1D]: {
        get_init_value: () => 0.01,
        domain: value => value > 0,
      },
      [plotTypes.contour_plot]: {
        get_init_value: () => 0.01,
        domain: value => value > 0,
      }
    }
  },
  [paramNames.xDomain]: {
    input_type: null, // not implemented yet
    values: {
      [plotTypes.plot_1D]: {
        get_init_value: (algorithm, objective) => ({ square: [-2,2],
          pow3: [-1,1],
          sin1: [2.7,6.5],
          sin2: [-10,10],
          sin3: [0,1.2],
          sin4: [2.7,7.5],
          sin5: [0,10] }[objective]),
        domain: () => true,
      },
      [plotTypes.contour_plot]: {
        get_init_value: (algorithm, objective) => ({ square: [-200,200],
          saddle: [-1,1],
          rosenbrock: [-2,3],
          rastrigin: [-5.12, 5.12],
          ackley: [-5, 5],
          goldstein: [-2, 2],
          himmelblau: [-5, 5],
          camel: [-5, 5],
          easom: [-10, 10],
          eggholder: [-512, 512],
          mccormick: [-1.5, 4],
          styblinski: [-5, 5]}[objective]),
        domain: () => true,
      }
    }
  },
  [paramNames.yDomain]: {
    input_type: null, // not implemented yet
    values: {
      [plotTypes.plot_1D]: {
        get_init_value: () => null, // no-op in 1 dimension
        domain: () => false,
      },
      [plotTypes.contour_plot]: {
        get_init_value: (algorithm, objective) => ({ square: [-200,200],
          saddle: [-1,1],
          rosenbrock: [-2,3],
          rastrigin: [-5.12, 5.12],
          ackley: [-5, 5],
          goldstein: [-2, 2],
          himmelblau: [-5, 5],
          camel: [-5, 5],
          easom: [-10, 10],
          eggholder: [-512, 512],
          mccormick: [-3, 4],
          styblinski: [-5, 5]}[objective]),
        domain: () => true,
      }
    }
  },
  [paramNames.threshold]: {
    input_type: null, // not implemented yet
    values: {
      [plotTypes.plot_1D]: {
        get_init_value: () => null, // no-op in 1 dimension
        domain: () => false,
      },
      [plotTypes.contour_plot]: {
        get_init_value: (algorithm, objective) => ({ square : [...Array(19).keys()].map(i => Math.pow(2, i+1)),
          saddle : [...Array(19).keys()].map(i => Math.pow(1.09, i)),
          rosenbrock: [...Array(19).keys()].map(i => Math.pow(1.7, i + 1)),
          rastrigin: [...Array(19).keys()].map(i => Math.pow(1.3, i)),
          ackley: [...Array(19).keys()].map(i => Math.pow(1.17, i)),
          goldstein: [...Array(19).keys()].map(i => Math.pow(2, i+1)),
          himmelblau: [...Array(19).keys()].map(i => Math.pow(1.5, i)),
          camel: [...Array(19).keys()].map(i => Math.pow(1.75, i)),
          easom: [...Array(19).keys()].map(i => Math.pow(1.1, i)),
          eggholder: [...Array(25).keys()].map(i => Math.pow(1.35, i)),
          mccormick: [...Array(19).keys()].map(i => Math.pow(1.22, i)),
          styblinski: [...Array(19).keys()].map(i => Math.pow(1.4, i+1))}[objective]),
        domain: () => true,
      }
    }
  },
  [paramNames.interpolation]: {
    input_type: inputTypes.dropdown,
    values: {
      [plotTypes.plot_1D]: {
        get_init_value: () => null, // no-op in 1 dimension
        domain: [],
      },
      [plotTypes.contour_plot]: {
        get_init_value: (algorithm, objective) => {
          const value = objective === "square" ? "interpolateMagma" : "interpolateYlGnBu";
          return ({ name: value, value });
        },
        domain: ["interpolateMagma", "interpolateYlGnBu"].map(value => ({ name: value, value })),
      }
    },
  },
};

const docConfigFunctions = {
  [plotTypes.plot_1D]: {
  "square" : {name : "Square Function", value : "$$f(x) = x^{2}$$"},
  "pow3" : {name : "Power-3 Function", value : "$$f(x) = x^{3}$$"},
  "sin1" : {name : "Sin-Type 1 Function", value : "$$f(x) = \\sin (x) + \\sin (\\frac{10}{3} x)$$"},
  "sin2" : {name : "Sin-Type 2 Function", value : "$$f(x) = - \\sin (2x + 1) - 2 \\sin (3x + 2) - 3 \\sin (4x + 3) - 4 \\sin (5x + 4) - 5 \\sin (6x + 5) - 6 \\sin (7x + 6)$$"},
  "sin3" : {name : "Sin-Type 3 Function", value : "$$f(x) = -(1.4 - 3x) \\sin (18x) $$"},
  "sin4" : {name : "Sin-Type 4 Function", value : "$$f(x) = \\sin (x) + \\sin (\\frac{10}{3}x) + \\log (x) - 0.84x  + 3$$"},
  "sin5" : {name : "Sin-Type 5 Function", value : "$$f(x) = x \\sin (x) + x \\cos (2x)$$"},
  },
  [plotTypes.contour_plot]: {
  "square" : {name : "Square Function", value : "$$f(x,y) = x^{2} + y^{2} + (x + y)^{2} $$"},
  "saddle" : {name : "Saddle Function", value : "$$f(x,y) = x^{2} - y^{2}$$"},
  "rosenbrock" : {name : "Rosenbrock Function", value : "$$f(x,y) = (1-x)^{2}  + 100 (y - x^{2})^{2}$$"},
  "rastrigin" : {name : "Rastrigin Function", value : "$$f(x,y) = 20 + x^{2} + y^{2} - 10 \\cos(2 \\pi x) - 10 \\cos ( 2 \\pi y)$$"},
  "ackley" : {name : "Ackley Function", value : "$$f(x,y) = - 20 \\exp ( -0.2 \\sqrt{0.5 \\times (x^{2} + y^{2})}) - \\exp (0.5 \\times (\\cos (2 \\pi x) + \\cos( 2 \\pi y))) + \\exp(1) + 20$$"},
  "goldstein" : {name : "Goldstein Function", value : "$$f(x,y) = (1 + (x + y + 1)^{2} \\times (19 - 14 x + 3 x^{2} - 14 y + 6 x y + 3 y^{2})) \\times (30 + (2 x - 3 y)^{2} (18 - 32 x + 12 x^{2} + 48 y - 36 x y + 27 y^{2}))$$"},
  "himmelblau" : {name : "Himmelblau Function", value : "$$f(x,y) = (x^{2} + y - 11)^{2} + (x + y^{2} - 7)^{2}$$"},
  "camel" : {name : "Three-hump Camel Function", value : "$$f(x,y) = 2 x^{2} - 1.05 x^{4} + \\frac{1}{6} x^{6} + x y + y^{2}$$"},
  "easom" : {name : "Easom Function", value : "$$f(x,y) = - \\cos (x) \\cos (y) \\exp( -((x - \\pi)^{2} + (y - \\pi)^{2}))$$"},
  "eggholder" : {name : "Eggholder Function", value : "$$f(x,y) = -(y + 47) \\sin ( \\sqrt{ | \\frac{x}{2} + (y + 47) | } - x \\sin(\\sqrt{|x - (y + 47)|})$$"},
  "mccormick" : {name : "McCormick Function", value : "$$f(x,y) = \\sin (x + y) + (x - y)^{2} - 1.5 x + 2.5 y + 1$$"},
  "styblinski" : {name : "Styblinski-Tang Function", value : "$$f(x,y) = 0.5 (x^{4} - 16 x^{2} + 5 x + y^{4} - 16 y^{2} + 5 y)$$"},
  },
}

const docConfigAlgorithms = {
  [algorithmNames.gradientDescent]: {name : "Gradient Descent Algorithm", value :
  "The Gradient Descent Algorithm is given by the following formula : \
  $$x_{k + 1} = x_{k} - \\alpha \\nabla_{x} f(x_{k})$$ \
  Where \\( \\alpha \\) is called the learning rate. At every iteration, this algorithm takes a step towards the direction of the steepest descent of the function, given by the opposite of its gradient. \
  Although it is the simplest first-order method, it is guaranteed to converge to a local minimum if the objective function is bounded below, has a Lipschitz continuous gradient, and if the step is chosen \
  according to some criterion such as the bArmijo linesearch (not implemented for the moment)."
  },
  [algorithmNames.gradientDescentWithMomentum]: {name : "Gradient Descent Algorithm with Momentum", value :
  "The Gradient Descent Algorithm with Momentum is given by the following formula : \
  $$x_{k + 1} = x_{k} - v_{k}$$ \
  $$v_{k} = \\gamma v_{k-1} + \\alpha \\nabla_{x} f(x_{k})$$ \
  Where \\( \\alpha \\) is called the learning rate and \\( \\gamma \\) is the momentum. \
  The momentum steers the optimizer to explore the space according to the previous gradients direction."
  },
  [algorithmNames.gradientDescentMomentumNesterov]: {name : "Gradient Descent Algorithm with Nesterov Momentum", value :
  "The Gradient Descent Algorithm with Nesterov Momentum is given by the following formula : \
  $$x_{k + 1} = x_{k} - v_{k}$$ \
  $$v_{k} = \\gamma v_{k-1} + \\alpha \\nabla_{x} f(x_{k} - \\gamma v_{k-1})$$ \
  Where \\( \\alpha \\) is called the learning rate and \\( \\gamma \\) is the momentum. \
  The intuition behind Nesterov Momentum, is to look \" one step ahead \" according to our estimate of the next point, and carry out a correction with the comupted gradient at this points"
  },
  [algorithmNames.RMSProp]: {name : "RMSProp Algorithm", value :
  "The RMSProp Algorithm is given by the following formula : \
  $$x_{k + 1} = x_{k} - \\frac{\\alpha}{\\sqrt{E[g^{2}]_{k} + \\epsilon}}g_{k}$$ \
  $$E[g^{2}]_{k} = \\gamma E[g^{2}]_{k-1} + (1 - \\gamma) \\nabla_{x} f(x_{k})$$ \
  Where \\( \\alpha \\) is called the learning rate and \\( \\gamma \\) plays the role of the momentum for the square average, \\( \\epsilon \\) is small as to avoid dividing by zero. The elementary operations above are done element-wise.\
  This algorithm allows to adapt the learning rate (dimension-wise) to the local \" roughness \" of the function, the locality being determined by \\( \\gamma \\) (a bigger \\( \\gamma \\) allows a more long-term memory)."
  },
  [algorithmNames.adam]: {name : "ADAM Algorithm", value :
  "The ADAM Algorithm is given by the following formula : \
  $$x_{k + 1} = x_{k} - \\frac{\\alpha}{\\sqrt{\\hat{v}_{k}} + \\epsilon}\\hat{m}_{k}$$ \
  $$ \\hat{m}_{k} = \\frac{m_{k}}{1 - \\beta_{1}^{k}} \\text{ and } \\hat{v}_{k} = \\frac{v_{k}}{1 - \\beta_{2}^{k}}$$ \
  $$ \\hat{m}_{k} = \\beta_{1} m_{k-1} + (1 - \\beta_{1}) \\nabla_{x} f(x_{k}) \\text{ and } \\hat{v}_{k} = \\beta_{2} v_{k-1} + (1 - \\beta_{2}) (\\nabla_{x} f(x_{k}))^{2}$$ \
  Where \\( \\alpha \\) is called the learning rate, \\( \\beta_{1} \\) and \\( \\beta_{2} \\) are the momentum of the gradient and square gradient respectively. The parameter \\( \\epsilon \\) is used to avoid dividing by zero  \
  The Adam Algorithm combine the momentum and adaptative learning rates components, which present some more desirable behaviour towards certain types of loss shapes such as flat minima. The corrected estimates of the gradient and square gradient used in the final \
  parameter update is computed to avoid a bias of towards zero, which is all the more present at initialization"
  },
  [algorithmNames.bfgs]: {name : "BFGS Algorithm", value :
  "The BFGS Algorithm, from the category of the Quasi-Newton methods is given by the following formula : \
  $$x_{k + 1} = x_{k} - \\alpha B_{k}^{-1} \\nabla_{x} f(x_{k})$$ \
  $$B_{k + 1} = B_{k} + \\frac{y_{k} y_{k}^{T}}{\\langle s_{k}, y_{k} \\rangle} - \\frac{B_{k}s_{k}s_{k}^{T}B_{k}}{\\langle s_{k}, B_{k}s_{k} \\rangle}$$ \
  Where \\( \\alpha \\) is called the learning rate and \\( B_{0} = I \\). \
  \\( B_{k} \\) represents an approximation to the Hessian, the algorithm then tries to minimize the function by creating a quadratic (strictly convex) surogate model of the objective function. The computed direction  \\( B_{k}^{-1} \\nabla_{x} f(x_{k}) \\) is the optimal step according to this model \
  (if you put the learning rate to one, in four steps you reach the minimum for the square function). The \\( B_{k} \\) is updated by levering the information about the hessian embedded in the successive gradients. \
  More precisely, the BFGS update is computed as a two-rank update (preserving the property of symmetric, positive definite of \\( B_{k} \\) ) according to the secant condition: \
  $$B_{k+1}(x_{k+1} - x_{k}) = \\nabla_{x}f(x_{k+1}) - \\nabla_{x}f(x_{k}) $$"
  },
  [algorithmNames.newton]: {name : "Newton Algorithm", value :
  "The Newton Algorithm, a second-order method, is given by the following formula : \
  $$x_{k + 1} = x_{k} - \\alpha (\\nabla^{2}_{x} f(x_{k}))^{-1} \\nabla_{x} f(x_{k})$$ \
  Where \\( \\alpha \\) is called the learning rate. This method build a quadratic surrogate model of the objective function by computing its gradient and hessian at the current point \
  and compute its optimal step (more precisely, the location where the gradient vanishes, which is optimal iff the hessian is positive definite). One of the advantage of this method is that it is scale-invariant \
  (it performs well in valleys). If you put the learning rate to one, you find the optimal value for the square function in one step, it would be true for the quadratic function no matter the scale inhomogeneity."
  },

}
