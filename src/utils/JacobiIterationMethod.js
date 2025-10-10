function formatNumber(x) {
  if (Math.abs(x) < 1e-10) return "0";
  return parseFloat(x.toFixed(6)).toString();
}

export default function solveJacobi(A, b, x0, iterations) {
  const n = A.length;
  let xOld = [...x0];
  let xNew = Array(n).fill(0);
  const steps = [];

  for (let k = 0; k < iterations; k++) {
    let iterStep = [`\\text{Iteration } ${k + 1}:`];
    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let j = 0; j < n; j++) {
        if (j !== i) sum += A[i][j] * xOld[j];
      }
      xNew[i] = (b[i] - sum) / A[i][i];
      iterStep.push(
        `x_${i + 1}^{(${k + 1})} = \\frac{1}{${A[i][i]}}\\left(${b[i]} - (${A[i]
          .map((aij, j) =>
            j === i
              ? ""
              : `${aij}x_${j + 1}^{(${k})}`
          )
          .filter(Boolean)
          .join(" + ")})\\right) = ${formatNumber(xNew[i])}`
      );
    }

    steps.push(iterStep.join("\\\\"));
    xOld = [...xNew];
  }

  const finalLatex = `\\begin{pmatrix}${xNew.map(formatNumber).join("\\\\")}\\end{pmatrix}`;
  return { steps, finalLatex };
}
