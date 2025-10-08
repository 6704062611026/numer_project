// src/utils/NewtonInterpolationMethod.js
class NewtonInterpolationMethod {
  constructor(points) {
    this.points = points;
    this.n = points.length;
    this.xs = points.map(p => p.x);
    this.ys = points.map(p => p.y);
    this.dividedDiffTable = this.calculateDividedDifferences();
  }

  calculateDividedDifferences() {
    const n = this.n;
    const x = this.xs;
    const y = this.ys;
    const table = Array.from({ length: n }, () => Array(n).fill(0));

    for (let i = 0; i < n; i++) {
      table[i][0] = y[i];
    }

    for (let j = 1; j < n; j++) {
      for (let i = 0; i < n - j; i++) {
        const denominator = x[i + j] - x[i];
        table[i][j] = (table[i + 1][j - 1] - table[i][j - 1]) / denominator;
      }
    }

    return table;
  }

  evaluateAt(xx) {
    const x = this.xs;
    const table = this.dividedDiffTable;
    let result = table[0][0];
    let term = 1;

    for (let i = 1; i < this.n; i++) {
      term *= (xx - x[i - 1]);
      result += table[0][i] * term;
    }

    return result;
  }

  generatePlotPoints(steps = 100) {
    const minX = Math.min(...this.xs);
    const maxX = Math.max(...this.xs);

    const plotXs = Array.from({ length: steps }, (_, i) =>
      minX + ((maxX - minX) * i) / (steps - 1)
    );
    const plotYs = plotXs.map(x => this.evaluateAt(x));

    return { plotXs, plotYs };
  }

  getXs() {
    return this.xs;
  }

  getYs() {
    return this.ys;
  }

  getTable() {
    return this.dividedDiffTable;
  }
}

export default NewtonInterpolationMethod;
