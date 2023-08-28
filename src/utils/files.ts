const validityRegex = {
  json: /\.(json)+$/i,
  sqlite: /\.(sqlite)+$/i,
};

export function getFileType(file: File) {
  if (validityRegex.json.test(file.name)) return "json";
  if (validityRegex.sqlite.test(file.name)) return "sqlite";
  return "unknown";
}
export function filterValidFiles(files: FileList) {
  return Array.from(files)
    .filter(
      (file) =>
        file.name.match(validityRegex.json) ||
        file.name.match(validityRegex.sqlite)
    )
    .filter((file) => file !== null);
}
