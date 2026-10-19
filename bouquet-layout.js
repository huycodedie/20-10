'use strict';

// Coordinates use the same 600 x 680 viewBox as the wrapping artwork.
// Every row is centered; fewer people produce larger flowers, not empty slots.
function createBouquetLayout(count) {
  if (!Number.isInteger(count) || count <= 0) return [];

  const rowCount = Math.min(count, Math.max(1, Math.round(Math.sqrt(count * .85))));
  const weights = Array.from({length:rowCount}, (_, row) =>
    rowCount === 1 ? 1 : .66 + .34 * Math.sin(Math.PI * .85 * row / (rowCount - 1))
  );
  const totalWeight = weights.reduce((sum, value) => sum + value, 0);
  const shares = weights.map(weight => count * weight / totalWeight);
  const rowSizes = shares.map(Math.floor);
  const priority = shares.map((share, row) => ({row, remainder:share - rowSizes[row]}))
    .sort((a, b) => b.remainder - a.remainder || a.row - b.row);
  const unplaced = count - rowSizes.reduce((sum, value) => sum + value, 0);
  for (let i = 0; i < unplaced; i++) rowSizes[priority[i].row]++;

  // Keep petals overlapping while fitting the crown above the front paper.
  const columns = Math.max(...rowSizes);
  const size = Math.min(360, 510 / (1 + .64 * (columns - 1)), 384 / (1 + .55 * (rowCount - 1)));
  const stepX = size * .64;
  const stepY = size * .55;
  const firstY = 216 - (rowCount - 1) * stepY / 2;
  const flowers = [];
  rowSizes.forEach((length, row) => {
    for (let column = 0; column < length; column++) {
      const index = flowers.length;
      flowers.push({
        x:300 + (column - (length - 1) / 2) * stepX,
        y:firstY + row * stepY,
        size,
        row,
        turn:(index * 19) % 48 - 24
      });
    }
  });
  return flowers;
}
