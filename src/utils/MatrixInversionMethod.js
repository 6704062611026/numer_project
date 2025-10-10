function cloneMatrix(A) {
  return A.map((r) => [...r]);
}

function identityMatrix(n) {
  return Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))
  );
}

function formatNumber(x) {
  if (Math.abs(x) < 1e-12) return "0";
  if (Number.isInteger(x)) return String(x);
  return parseFloat(x.toFixed(6)).toString();
}

function matrixToLatex(A, I) {
  const rows = A.map(
    (r, i) =>
      r.map((v) => formatNumber(v)).join(" & ") +
      " & \\big| & " +
      I[i].map((v) => formatNumber(v)).join(" & ")
  );
  return `\\begin{pmatrix} ${rows.join(" \\\\ ")} \\end{pmatrix}`;
}

export default function invertMatrixStepwise(Ainput) {
  const A = cloneMatrix(Ainput);
  const n = A.length;
  const I = identityMatrix(n);
  const steps = [];

  const initialLatex = matrixToLatex(A, I);

  for (let i = 0; i < n; i++) {
    // Pivot selection
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) maxRow = k;
    }
    if (maxRow !== i) {
      [A[i], A[maxRow]] = [A[maxRow], A[i]];
      [I[i], I[maxRow]] = [I[maxRow], I[i]];
      steps.push({
        latex: `R_{${i + 1}} \\leftrightarrow R_{${maxRow + 1}}`,
        matrixLatex: matrixToLatex(A, I),
      });
    }

    // Normalize pivot
    const pivot = A[i][i];
    if (Math.abs(pivot) < 1e-12) {
      return { error: "Matrix is singular and cannot be inverted." };
    }
    for (let j = 0; j < n; j++) {
      A[i][j] /= pivot;
      I[i][j] /= pivot;
    }

    steps.push({
      latex: `R_{${i + 1}} = R_{${i + 1}} / ${formatNumber(pivot)}`,
      matrixLatex: matrixToLatex(A, I),
    });

    // Eliminate other rows
    for (let k = 0; k < n; k++) {
      if (k === i) continue;
      const factor = A[k][i];
      for (let j = 0; j < n; j++) {
        A[k][j] -= factor * A[i][j];
        I[k][j] -= factor * I[i][j];
      }

      steps.push({
        latex: `R_{${k + 1}} \\leftarrow R_{${k + 1}} - (${formatNumber(
          factor
        )}) R_{${i + 1}}`,
        matrixLatex: matrixToLatex(A, I),
      });
    }
  }

  const finalLatex = matrixToLatex(A, I);
  const inverseLatex = `\\begin{pmatrix} ${I.map((r) =>
    r.map((v) => formatNumber(v)).join(" & ")
  ).join(" \\\\ ")} \\end{pmatrix}`;

  return { initialLatex, steps, finalLatex, inverseLatex };
}
