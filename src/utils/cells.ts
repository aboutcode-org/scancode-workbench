const CELL_PADDING = 22;
const MAX_CELL_SIZE = 500;
const CHARACTER_WIDTH = 7;

export function calculateCellWidth(textLength: number) {
  const calculatedColumnSize = textLength * CHARACTER_WIDTH + CELL_PADDING * 2;
  return Math.min(MAX_CELL_SIZE, calculatedColumnSize);
}
