import { derivative, evaluate, parse } from "mathjs";

class NewtonRaphsonMethod {
  constructor(equation, x0, tolerance, maxIterations = 50) {
    this.equation = equation;
    this.x0 = parseFloat(x0);
    this.tolerance = parseFloat(tolerance);
    this.maxIterations = maxIterations;
    this.results = [];
    this.expr = parse(this.equation);
    this.diffExpr = derivative(this.expr, "x");
  }

  evaluateAt(x) {
    return this.expr.evaluate({ x });
  }

  evaluateDerivativeAt(x) {
    return this.diffExpr.evaluate({ x });
  }

  solve() {
    let iter = 0;
    let xOld = this.x0;
    let xNew, fx, fpx, error;

    this.results = [];

    do {
      fx = this.evaluateAt(xOld);
      fpx = this.evaluateDerivativeAt(xOld);

      if (fpx === 0) {
        throw new Error("Derivative is zero. Cannot proceed.");
      }

      xNew = xOld - fx / fpx;
      error = Math.abs((xNew - xOld) / xNew);

      this.results.push({
        iteration: iter + 1,
        xOld: xOld.toFixed(6),
        fx: fx.toFixed(6),
        fpx: fpx.toFixed(6),
        xNew: xNew.toFixed(6),
        error: error.toFixed(6),
      });

      xOld = xNew;
      iter++;
    } while (error > this.tolerance && iter < this.maxIterations);

    return this.results;
  }
}

export default NewtonRaphsonMethod;
