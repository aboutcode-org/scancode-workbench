export const figureOutDefaultSqliteFilePath = (jsonFilePath: string) =>
  jsonFilePath.substring(0, jsonFilePath.lastIndexOf(".")) + ".sqlite";

export function getPathDepth(filePath: string) {
  const separatorRegExp = /[\\/]/g;
  const depth = (filePath.match(separatorRegExp) || []).length;
  return depth;
}
