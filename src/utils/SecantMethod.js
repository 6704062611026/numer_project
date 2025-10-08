// src/utils/SecantMethod.js
import { evaluate } from "mathjs";

class SecantMethod {
  constructor(equation, x0, x1, tolerance, maxIterations = 50) {
    this.equation = equation;
    this.x0 = parseFloat(x0);
    this.x1 = parseFloat(x1);
    this.tolerance = parseFloat(tolerance);
    this.maxIterations = maxIterations;
    this.results = [];
  }

  evaluateAt(x) {
    return evaluate(this.equation, { x });
  }

  solve() {
    let iter = 0;
    let xOld = this.x0;
    let xCurr = this.x1;
    let xNew, fxOld, fxCurr, error;

    this.results = [];

    do {
      fxOld = this.evaluateAt(xOld);
      fxCurr = this.evaluateAt(xCurr);

      if (fxCurr - fxOld === 0) {
        throw new Error("Division by zero in Secant formula.");
      }

      xNew = xCurr - (fxCurr * (xCurr - xOld)) / (fxCurr - fxOld);
      error = Math.abs((xNew - xCurr) / xNew);

      this.results.push({
        iteration: iter + 1,
        xOld: xOld.toFixed(6),
        xCurr: xCurr.toFixed(6),
        fxOld: fxOld.toFixed(6),
        fxCurr: fxCurr.toFixed(6),
        xNew: xNew.toFixed(6),
        error: error.toFixed(6),
      });

      xOld = xCurr;
      xCurr = xNew;
      iter++;
    } while (error > this.tolerance && iter < this.maxIterations);

    return this.results;
  }
}

export default SecantMethod;
