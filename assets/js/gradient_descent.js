/** Abstract class Algorithm is only used to define the following API for implemented algorithmNames:
* @method one_step : Perform one step of the algorithm
* @method one_step : Perform one step of the algorithm
* @method one_step_armijo : Perform one step of the algorithm with backtracking search
* @method compute_direction : Compute the opposite direction in this.direction, has to also compute the gradient in this.gradient
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

  compute_direction(){}

  one_step(){}
  one_step_armijo(){}
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
    this.beta = 0.1; // Initial Beta, button has to be implemented
    this.tau = 0.75;
    this.flag_barmijo = params[paramNames.barmijo];
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

  one_step() {
    let norm = this.compute_direction();
    this.x = this.x.map((x, i) => x - this.delta * this.direction[i])
    return norm
  }

  one_step_armijo() {
    let norm = this.compute_direction();
    let current_delta = this.delta;
    while (this.objective(this.x.map((x, i) => x - current_delta * this.direction[i])) > this.objective(this.x) - this.beta * current_delta * this.direction.map((x,i) => x * this.gradient[i]).reduce((a,b) => a + b, 0)) {
      current_delta = this.tau * current_delta;
    }
    this.x = this.x.map((x, i) => x - current_delta * this.direction[i])
    return norm
  }

  optimize(){
    let norm = 0;
    let steps = 0;
    if (this.flag_barmijo){
      do {
        this.path.push(this.x.map(x => x));
        norm = (this.one_step_armijo())**(1/2);
        steps = steps + 1;
      } while (norm > this.params[paramNames.normLim] && steps < this.params[paramNames.nlim]);
      return this.path;
    }
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
* @method compute_direction : Compute the descent direction
*/
class GradientDescent extends AlgorithmFirstOrder{
  constructor(params) {
    super(algorithmNames.gradientDescent, params);
  }

  compute_direction() {
    this.gradient = this.differentiate(this.x);
    this.direction = this.gradient.map(x => x);
    return this.gradient.reduce((a,b) => a + b**2, 0);
  }
}

/** Gradient Descent with momentum must do the following task
* @method compute_direction : Compute the opposite direction for momentum.
*/
class GradientDescentMomentum extends AlgorithmFirstOrder{
  constructor(params) {
    super(algorithmNames.gradientDescentWithMomentum, params);
    this.momentum = params[paramNames.momentum];
    this.direction = this.x_ini.map(() => 0);
  }

  compute_direction() {
    this.gradient = this.differentiate(this.x);
    this.direction = this.direction.map((e,i) => this.momentum * e + this.gradient[i])
    return this.gradient.reduce((a,b) => a + b**2, 0);
  }
}

/** Gradient Descent with nesterov momentum must do the following task
* @method compute_direction : Compute the descent direction.
*/
class GradientDescentMomentumNesterov extends AlgorithmFirstOrder{
  constructor(params) {
    super(algorithmNames.gradientDescentMomentumNesterov, params);
    this.momentum = params[paramNames.momentum];
    this.direction = this.x_ini.map(() => 0);
  }

  compute_direction() {
    let x_next = this.x.map((e,i) => e - this.momentum * this.delta * this.direction[i]);
    this.gradient = this.differentiate(x_next);
    this.direction = this.direction.map((e,i) => this.momentum * e + this.gradient[i]);
    this.gradient = this.differentiate(this.x);
    return this.gradient.reduce((a,b) => a + b**2, 0);
  }
}

/** RMSProp must do the following task
* @method compute_direction : Compute the descent direction
*/
class RMSProp extends AlgorithmFirstOrder{
  constructor(params) {
    super(algorithmNames.RMSProp, params);
    this.rho = params[paramNames.rho];
    this.epsilon = params[paramNames.epsilon];
    this.currentSquareGradientAverage = this.x_ini.map(() => 0);
  }

  compute_direction() {
    this.gradient = this.differentiate(this.x);
    this.currentSquareGradientAverage = this.currentSquareGradientAverage.map((e,i) => this.rho * e + (1-this.rho) * (this.gradient[i] ** 2));
    this.direction = this.gradient.map((e,i) => e / (Math.sqrt(this.currentSquareGradientAverage[i]) + this.epsilon));
    return this.gradient.reduce((a,b) => a + b**2, 0);
  }
}

/** Adam must do the following task
* @method compute_direction : Compute the descent direction
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

  compute_direction() {
    this.nStep = this.nStep + 1;
    this.gradient = this.differentiate(this.x);
    this.currentGradientAverage = this.currentGradientAverage.map((e,i) => this.beta1 * e + (1 - this.beta1) * this.gradient[i]);
    this.currentSquareGradientAverage = this.currentSquareGradientAverage.map((e,i) => this.beta2 * e + (1-this.beta2) * (this.gradient[i] ** 2));
    let firstCorrectionTerm = 1 - (this.beta1 ** this.nStep);
    let secondCorrectionTerm = 1 - (this.beta2 ** this.nStep);
    let currentFirstMoment = this.currentGradientAverage.map(e => e/firstCorrectionTerm);
    let currentSecondMoment = this.currentSquareGradientAverage.map(e => e/secondCorrectionTerm);
    this.direction = this.currentGradientAverage.map((e,i) => e / (Math.sqrt(this.currentSquareGradientAverage[i]) + this.epsilon));
    return this.gradient.reduce((a,b) => a + b**2, 0);
  }
}

/** BFGS implements the following interface
* @method direction : Compute the descent direction.
* @method one_step : Modify one step to make updates.
* @method update : Method for BFGS update.
*/
class BFGS extends AlgorithmFirstOrder{
  constructor(params) {
    super(algorithmNames.bfgs, params);
    this.x_ini = array2vec(this.x_ini);
    this.x = array2vec(this.x);
    this.n = this.x_ini.length
    this.gradient = this.differentiate(this.x);
    this.currentHessian = eye(this.n);
  }

  compute_direction() {
    if (this.n == 1) {
      this.direction = [this.gradient / this.currentHessian];
      return this.gradient.reduce((a,b) => a + b**2, 0);
    }
    this.direction = solve(this.currentHessian, this.gradient);
    return this.gradient.reduce((a,b) => a + b**2, 0);
  }

  one_step() {
    let norm = this.compute_direction();
    this.x_next = this.x.map((x, i) => x - this.delta * this.direction[i])
    this.update();
    return norm
  }

  one_step_armijo() {
    let norm = this.compute_direction();
    let current_delta = this.delta;
    while (this.objective(this.x.map((x, i) => x - current_delta * this.direction[i])) > this.objective(this.x) - this.beta * current_delta * this.direction.map((x,i) => x * this.gradient[i]).reduce((a,b) => a + b, 0)) {
      current_delta = this.tau * current_delta;
    }
    this.x_next = this.x.map((x, i) => x - current_delta * this.direction[i])
    this.update();
    return norm
  }

  update() {
    if (this.n === 1){
      let vector_s = this.x_next[0] - this.x[0];
      let next_gradient = this.differentiate(this.x_next);
      let y_k = next_gradient.map((el, i)=> el - this.gradient[i]);
      let firstQuantity = vector_s * y_k;
      let secondQuantity = this.currentHessian * vector_s;
      let thirdQuantity = vector_s * secondQuantity;
      this.currentHessian = this.currentHessian + ((y_k * y_k) / firstQuantity) - secondQuantity * (secondQuantity / thirdQuantity);
      this.x = this.x_next.map(x => x);
      this.gradient = next_gradient.map(el => el);
    } else {
      let next_gradient = this.differentiate(this.x_next);
      let vector_s = array2vec(this.x_next.map((e,i) => e - this.x[i]))
      let y_k = sub(next_gradient, this.gradient);
      let firstQuantity = mul(vector_s, y_k);
      let secondQuantity = mul(this.currentHessian, vector_s);
      let thirdQuantity = mul(vector_s, secondQuantity);
      this.currentHessian = add(this.currentHessian, sub(mul(y_k, transpose(y_k.map(el => el/firstQuantity))), mul(secondQuantity, transpose(secondQuantity.map(el => el / thirdQuantity)))));
      this.x = this.x_next.map(x => x);
      this.gradient = next_gradient.map(x => x);
    }
  }
}

/** Newton Descent
* @method direction : Compute the descent direction.
*/
class DampedNewton extends AlgorithmSecondOrder{
  constructor(params) {
    super(algorithmNames.newton, params);
    this.epsilon = params[paramNames.epsilon];
    this.x_ini = array2vec(this.x_ini);
    this.x = array2vec(this.x);
    this.n = this.x_ini.length;
  }

  compute_direction() {
    if (this.n === 1) {
      let hess = this.hessian(this.x);
      let eigval = Math.max(Math.abs(hess[0]),  this.epsilon);
      this.gradient = this.differentiate(this.x);
      this.direction = [this.gradient / eigval] ;
      return this.gradient.reduce((a,b) => a + b**2, 0);
    }
    let hess = array2mat(this.hessian(this.x));
    let eigdec = eigs(hess, this.n);
    let eigval = eigdec.V;
    let eigvec = eigdec.U;
    eigval = eigval.map(el => Math.max(Math.abs(el), this.epsilon));
    hess = mul(eigvec, mul(diag(eigval), transpose(eigvec)));
    this.gradient = this.differentiate(this.x);
    this.direction = solve(hess, this.gradient);
    return this.gradient.reduce((a,b) => a + b**2, 0);
  }
}
