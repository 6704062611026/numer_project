// src/utils/CramerRuleMethod.js

// คำนวณ determinant แบบ recursive สำหรับเมทริกซ์ n x n
function determinant(matrix) {
  const n = matrix.length;

  if (n === 1) return matrix[0][0];
  if (n === 2)
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];

  let det = 0;
  for (let col = 0; col < n; col++) {
    const sign = col % 2 === 0 ? 1 : -1;
    const subMatrix = matrix.slice(1).map(row =>
      row.filter((_, index) => index !== col)
    );
    det += sign * matrix[0][col] * determinant(subMatrix);
  }

  return det;
}

function replaceColumn(matrix, colIndex, newCol) {
  return matrix.map((row, i) => {
    const newRow = [...row];
    newRow[colIndex] = newCol[i];
    return newRow;
  });
}

function solveCramer(A, B) {
  const detA = determinant(A);
  const steps = [];

  if (detA === 0) {
    return {
      detA,
      steps: [],
      error: "Matrix A is singular (det(A) = 0), so Cramer's Rule can't be applied.",
    };
  }

  for (let i = 0; i < A.length; i++) {
    const Ai = replaceColumn(A, i, B);
    const detAi = determinant(Ai);
    const value = detAi / detA;
    steps.push({ detAi, value: value.toFixed(10) });
  }

  return { detA, steps };
}

export default solveCramer;
