export const figureOutDefaultSqliteFilePath = (jsonFilePath: string) =>
  jsonFilePath.substring(0, jsonFilePath.lastIndexOf(".")) + ".sqlite";
