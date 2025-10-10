function formatNumber(x) {
  if (Math.abs(x) < 1e-10) return "0";
  return parseFloat(x.toFixed(6)).toString();
}

export default function solveGaussSeidel(A, b, x0, iterations) {
  const n = A.length;
  let x = [...x0];
  const steps = [];

  for (let k = 0; k < iterations; k++) {
    let iterStep = [`\\text{Iteration } ${k + 1}:`];

    for (let i = 0; i < n; i++) {
      let sum = 0;
      let latexSumParts = [];

      for (let j = 0; j < n; j++) {
        if (j !== i) {
          sum += A[i][j] * x[j];
          latexSumParts.push(`${A[i][j]}x_${j + 1}^{(${j < i ? k + 1 : k})}`);
        }
      }

      const newXi = (b[i] - sum) / A[i][i];
      iterStep.push(
        `x_${i + 1}^{(${k + 1})} = \\frac{1}{${A[i][i]}}\\left(${b[i]} - (${latexSumParts.join(" + ")})\\right) = ${formatNumber(newXi)}`
      );
      x[i] = newXi;
    }

    steps.push(iterStep.join("\\\\"));
  }

  const finalLatex = `\\begin{pmatrix}${x.map(formatNumber).join("\\\\")}\\end{pmatrix}`;
  return { steps, finalLatex };
}
