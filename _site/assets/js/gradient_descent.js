/** Abstract class Algorithm is only used to define the following API for implemented algorithmNames:
* @method one_step : Perform one step of the algorithm
* @method optimize : Perform optimization wth given criterion
* @method get_path : Get the path of the optimization
*/
class Algorithm {
  constructor(name, params){
    if (!algorithmsConfig[name].parameters.every(neededParam => Object.keys(params).includes(neededParam))) {
      throw new Error("Missing parameters");
    }

    this.params = params;
    this.name = name;
    this.path = [];
  }

  one_step(){}

  optimize(){}

  getPath = () => this.path;
  getName = () => this.name;
}

/** Mother class First Order algorithm must do the following task
* @method differentiate : Approximate the Gradient
* @method optimize : optimize the algorithm
*/
class AlgorithmFirstOrder extends Algorithm{
  constructor(name, params){
    super(name, params);
    this.objective = params[paramNames.objectiveFunction];
    this.x_ini = params[paramNames.x_ini];
    this.x = this.x_ini.map(x => x);
    this.h = params[paramNames.h];
    this.delta = params[paramNames.delta];
  }

  differentiate(arr) {
    const x_hP = arr.map(el => el);
    const x_hM = arr.map(el => el);
    let gradient = 0;
    return arr.map((el, i) => {
      x_hP[i] = el + this.h;
      x_hM[i] = el - this.h;
      gradient = ((this.objective(x_hP) - this.objective(x_hM)) / (2*this.h));
      x_hP[i] = el;
      x_hM[i] = el;
      return gradient;
    })
  }

  optimize(){
    let norm = 0;
    let steps = 0;
    do {
      this.path.push(this.x.map(x => x));
      norm = (this.one_step())**(1/2);
      steps = steps + 1;
    } while (norm > this.params[paramNames.normLim] && steps < this.params[paramNames.nlim]);
    return this.path;
  }
}

/** Class AlgorithmSecondOrder implements the following interface
* @method hessian : Approximate the Hessian our implementation only works for 1 element and 2 element arrays
*/
class AlgorithmSecondOrder extends AlgorithmFirstOrder{
  constructor(name, params){
    super(name, params);
  }

  hessian(arr) {
    let n = arr.length;
    if (n == 1){
      return [[(- 1 * this.objective([arr[0] + 2*this.h]) + 16 * this.objective([arr[0] + this.h]) - 30 * this.objective(arr) + 16 * this.objective([arr[0] - this.h]) - this.objective([arr[0] - 2*this.h]))/(12 * this.h ** 2)]];
      }
      let hess = 0;
      const x_hPP = arr.map(el => el);
      const x_hP = arr.map(el => el);
      const x_hM = arr.map(el => el);
      const x_hMM = arr.map(el => el);

      let diag = arr.map((el,i) => {
        x_hPP[i] = el + 2*this.h;
        x_hP[i] = el + this.h;
        x_hM[i] = el - this.h;
        x_hMM[i] = el - 2*this.h;
        hess = (-this.objective(x_hPP) + 16 * this.objective(x_hP) - 30 * this.objective(arr) + 16 * this.objective(x_hM) - this.objective(x_hMM)) / (12 * this.h ** 2);
        x_hPP[i] = el;
        x_hP[i] = el;
        x_hM[i] = el;
        x_hMM[i] = el;
        return hess
      });

      x_hPP[0] = arr[0] + this.h;
      x_hPP[1] = arr[1] + this.h;

      x_hP[0] = arr[0] + this.h;
      x_hP[1] = arr[1] - this.h;

      x_hM[0] = arr[0] - this.h;
      x_hM[1] = arr[1] + this.h;

      x_hMM[0] = arr[0] - this.h;
      x_hMM[1] = arr[1] - this.h;

      let corner = (this.objective(x_hPP) - this.objective(x_hP) - this.objective(x_hM) + this.objective(x_hMM)) / (4 * this.h ** 2)

      return [[diag[0], corner], [corner, diag[1]]]
    }
}

/** Simple Gradient Descent algorithm must do the following task
* @method one_step : One step towards the opposite of the gradient
*/
class GradientDescent extends AlgorithmFirstOrder{
  constructor(params) {
    super(algorithmNames.gradientDescent, params);
  }

  one_step() {
    const gradient = this.differentiate(this.x);
    let norm = 0;
    for (let i = 0, len = gradient.length; i < len; i++) {
      this.x[i] = this.x[i] - this.delta * gradient[i];
      norm = norm + gradient[i] ** 2
    }
    return norm
  }
}

/** Gradient Descent with momentum must do the following task
* @method one_step : One step towards the opposite of the gradient with momentum.
*/
class GradientDescentMomentum extends AlgorithmFirstOrder{
  constructor(params) {
    super(algorithmNames.gradientDescentWithMomentum, params);
    this.momentum = params[paramNames.momentum];
    this.currentgrad = this.x_ini.map(() => 0);
  }

  one_step() {
    const gradient = this.differentiate(this.x);
    this.currentgrad = this.currentgrad.map((e,i) => this.momentum * e + this.delta * gradient[i])
    let norm = 0;
    for (let i = 0, len = gradient.length; i < len; i++) {
      this.x[i] = this.x[i] - this.currentgrad[i];
      norm = norm + gradient[i] ** 2
    }
    return norm
  }
}

/** Gradient Descent with nesterov momentum must do the following task
* @method one_step : One step towards the opposite of the gradient with nesterov momentum.
*/
class GradientDescentMomentumNesterov extends AlgorithmFirstOrder{
  constructor(params) {
    super(algorithmNames.gradientDescentMomentumNesterov, params);
    this.momentum = params[paramNames.momentum];
    this.currentgrad = this.x_ini.map(() => 0);
  }

  one_step() {
    let x_next = this.x.map((e,i) => e - this.momentum * this.currentgrad[i]);
    const gradient = this.differentiate(x_next);
    this.currentgrad = this.currentgrad.map((e,i) => this.momentum * e + this.delta * gradient[i]);
    let norm = 0;
    for (let i = 0, len = gradient.length; i < len; i++) {
      this.x[i] = this.x[i] - this.currentgrad[i];
      norm = norm + gradient[i] ** 2
    }
    return norm
  }
}

/** Gradient Descent with nesterov momentum must do the following task
* @method one_step : One step towards the opposite of the gradient with nesterov momentum.
*/
class RMSProp extends AlgorithmFirstOrder{
  constructor(params) {
    super(algorithmNames.RMSProp, params);
    this.rho = params[paramNames.rho];
    this.epsilon = params[paramNames.epsilon];
    this.currentSquareGradientAverage = this.x_ini.map(() => 0);
  }

  one_step() {
    let gradient = this.differentiate(this.x);
    this.currentSquareGradientAverage = this.currentSquareGradientAverage.map((e,i) => this.rho * e + (1-this.rho) * (gradient[i] ** 2));
    let direction = gradient.map((e,i) => (this.delta * e) / (Math.sqrt(this.currentSquareGradientAverage[i]) + this.epsilon));
    let norm = 0;
    for (let i = 0, len = gradient.length; i < len; i++) {
      this.x[i] = this.x[i] - direction[i];
      norm = norm + gradient[i] ** 2
    }
    return norm
  }
}

/** Gradient Descent with nesterov momentum must do the following task
* @method one_step : One step towards the opposite of the gradient with nesterov momentum.
*/
class Adam extends AlgorithmFirstOrder{
  constructor(params) {
    super(algorithmNames.adam, params);
    this.beta1 = params[paramNames.beta1];
    this.beta2 = params[paramNames.beta2];
    this.epsilon = params[paramNames.epsilon];
    this.currentGradientAverage = this.x_ini.map(() => 0);
    this.currentSquareGradientAverage = this.x_ini.map(() => 0);
    this.nStep = 0;
  }

  one_step() {
    this.nStep = this.nStep + 1;
    let gradient = this.differentiate(this.x);
    this.currentGradientAverage = this.currentGradientAverage.map((e,i) => this.beta1 * e + (1 - this.beta1) * gradient[i]);
    this.currentSquareGradientAverage = this.currentSquareGradientAverage.map((e,i) => this.beta2 * e + (1-this.beta2) * (gradient[i] ** 2));

    let firstCorrectionTerm = 1 - (this.beta1 ** this.nStep);
    let secondCorrectionTerm = 1 - (this.beta2 ** this.nStep);
    let currentFirstMoment = this.currentGradientAverage.map(e => e/firstCorrectionTerm);
    let currentSecondMoment = this.currentSquareGradientAverage.map(e => e/secondCorrectionTerm);

    let direction = this.currentGradientAverage.map((e,i) => (this.delta * e) / (Math.sqrt(this.currentSquareGradientAverage[i]) + this.epsilon));
    let norm = 0;
    for (let i = 0, len = gradient.length; i < len; i++) {
      this.x[i] = this.x[i] - direction[i];
      norm = norm + gradient[i] ** 2
    }
    return norm
  }
}

/** BFGS implements the following interface
* @method one_step : One step towards the bfgs direction.
*/
class BFGS extends AlgorithmFirstOrder{
  constructor(params) {
    super(algorithmNames.bfgs, params);
    this.x_ini = array2vec(this.x_ini);
    this.x = array2vec(this.x);
    this.n = this.x_ini.length
    this.currentGradient = this.differentiate(this.x);
    this.currentHessian = eye(this.n);
  }

  one_step() {
    if (this.n === 1) {
      let direction = -1 * this.delta * this.currentGradient / this.currentHessian;
      this.x[0] = this.x[0] + direction;
      let next_gradient = this.differentiate(this.x);
      let y_k = next_gradient.map((el, i)=> el - this.currentGradient[i]);
      let firstQuantity = direction * y_k;
      let secondQuantity = this.currentHessian * direction;
      let thirdQuantity = direction * secondQuantity;
      this.currentHessian = this.currentHessian + ((y_k * y_k) / firstQuantity) - secondQuantity * (secondQuantity / thirdQuantity);
      let normGrad = this.currentGradient ** 2;
      this.currentGradient = next_gradient.map(el => el);
      return normGrad
    }
    let direction = solve(this.currentHessian, this.currentGradient.map(el => -1 * this.delta * el ));
    this.x = add(this.x, direction);
    let next_gradient = this.differentiate(this.x);
    let y_k = sub(next_gradient, this.currentGradient);
    let firstQuantity = mul(direction, y_k);
    let secondQuantity = mul(this.currentHessian, direction);
    let thirdQuantity = mul(direction, secondQuantity);
    this.currentHessian = add(this.currentHessian, sub(mul(y_k, transpose(y_k.map(el => el/firstQuantity))), mul(secondQuantity, transpose(secondQuantity.map(el => el / thirdQuantity)))));
    let normGrad = norm(this.currentGradient);
    this.currentGradient = next_gradient.map(el => el);
    return normGrad
  }
}

/** Newton Descent
* @method one_step : Perform Newton Step.
*/
class DampedNewton extends AlgorithmSecondOrder{
  constructor(params) {
    super(algorithmNames.newton, params);
    this.epsilon = params[paramNames.epsilon];
    this.x_ini = array2vec(this.x_ini);
    this.x = array2vec(this.x);
    this.n = this.x_ini.length;
  }
  one_step() {
    if (this.n === 1) {
      let hess = this.hessian(this.x);
      let eigval = Math.max(Math.abs(hess[0]),  this.epsilon);
      let gradient = this.differentiate(this.x);
      let direction = -1 * gradient / eigval ;
      this.x[0] = this.x[0] + this.delta * direction;
      return gradient ** 2;
    }
    let hess = array2mat(this.hessian(this.x));
    let eigdec = eigs(hess, this.x_ini.length);
    let eigval = eigdec.V;
    let eigvec = eigdec.U;
    eigval = eigval.map(el => Math.max(Math.abs(el), this.epsilon));
    hess = mul(eigvec, mul(diag(eigval), transpose(eigvec)));
    let gradient = this.differentiate(this.x);
    let direction = solve(hess, mul(-1, gradient));
    this.x = add(this.x, direction.map(el => el * this.delta));
    return norm(gradient);
  }
}
