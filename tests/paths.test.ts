import { figureOutDefaultSqliteFilePath } from "../src/utils/paths";

const PathSamples: { jsonPath: string; sqlitePath: string }[] = [
  {
    jsonPath: "/path/to/your_file/scanInfo.json",
    sqlitePath: "/path/to/your_file/scanInfo.sqlite",
  },
  {
    jsonPath: "/path/with_[special]_chars.json",
    sqlitePath: "/path/with_[special]_chars.sqlite",
  },
  {
    jsonPath: "/Users/user name/Documents/sample data.json",
    sqlitePath: "/Users/user name/Documents/sample data.sqlite",
  },
  {
    jsonPath: "C:\\Users\\username\\Downloads\\data.json",
    sqlitePath: "C:\\Users\\username\\Downloads\\data.sqlite",
  },
];
describe("Generates valid sqlite path for chosen json paths", () => {
  it.each(PathSamples)(
    "Generate  Sqlite Path for $jsonPath",
    ({ jsonPath, sqlitePath }) => {
      expect(figureOutDefaultSqliteFilePath(jsonPath)).toBe(sqlitePath);
    }
  );
});
