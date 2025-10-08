function cloneMatrix(matrix) {
  return matrix.map(row => [...row]);
}

function forwardElimination(matrix, n) {
  const steps = [];

  for (let i = 0; i < n; i++) {
    let step = {
      pivotInfo: null,
      factorInfo: [],
      matrixSnapshot: [],
    };

    // Partial Pivoting
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(matrix[k][i]) > Math.abs(matrix[maxRow][i])) {
        maxRow = k;
      }
    }

    if (maxRow !== i) {
      [matrix[i], matrix[maxRow]] = [matrix[maxRow], matrix[i]];
      step.pivotInfo = `R${i + 1} ⟺ R${maxRow + 1}`;
    }

    for (let k = i + 1; k < n; k++) {
      const factor = matrix[k][i] / matrix[i][i];
      step.factorInfo.push({
        row: k + 1,
        factor: factor,
        formula: `R${k + 1} ⇒ R${k + 1} - (${factor.toFixed(6)})×R${i + 1}`,
      });

      for (let j = i; j <= n; j++) {
        matrix[k][j] -= factor * matrix[i][j];
      }
    }

    step.matrixSnapshot = cloneMatrix(matrix);
    steps.push(step);
  }

  return steps;
}

function backSubstitution(matrix, n) {
  const x = Array(n).fill(0);
  const steps = [];

  for (let i = n - 1; i >= 0; i--) {
    let sum = matrix[i][n];
    let formulaParts = [];

    for (let j = i + 1; j < n; j++) {
      sum -= matrix[i][j] * x[j];
      formulaParts.push(`${matrix[i][j].toFixed(6)}×x${j + 1}`);
    }

    x[i] = sum / matrix[i][i];

    steps.push({
      variable: `x${i + 1}`,
      formula: formulaParts.length > 0
        ? `(${matrix[i][n].toFixed(6)} - ${formulaParts.join(" - ")}) / ${matrix[i][i].toFixed(6)}`
        : `${matrix[i][n].toFixed(6)} / ${matrix[i][i].toFixed(6)}`,
      value: x[i].toFixed(6),
    });
  }

  return steps.reverse();
}

function solveGaussElimination(A, B) {
  const n = A.length;
  const matrix = A.map((row, i) => [...row, B[i]]);
  const forwardSteps = forwardElimination(matrix, n);
  const backSubSteps = backSubstitution(matrix, n);
  const solution = backSubSteps.map((s) => s.value);

  return {
    forwardSteps,
    backSubSteps,
    solution,
  };
}

export default solveGaussElimination;
