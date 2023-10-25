/**
 * @jest-environment jsdom
 */
import { getFileType, filterValidFiles } from "../src/utils/files";

describe("Get file type", () => {
  it("Identify JSON files", () => {
    const jsonFile = new File([""], "example.json");
    const fileType = getFileType(jsonFile);
    expect(fileType).toBe("json");
  });

  it("Identify SQLite files", () => {
    const sqliteFile = new File([""], "example.sqlite");
    const fileType = getFileType(sqliteFile);
    expect(fileType).toBe("sqlite");
  });

  it("Identify unknown file types", () => {
    const unknownFile = new File([""], "example.txt");
    const fileType = getFileType(unknownFile);
    expect(fileType).toBe("unknown");
  });
});

// Helper function to create a mock FileList
function createMockFileList(files: File[]): FileList {
  const mockFiles = {
    length: files.length,
    item(index: number) {
      return files[index];
    },
  } as FileList;

  files.map((file, idx) => (mockFiles[idx] = file));

  return mockFiles;
}

describe("Filter opened files", () => {
  it("Filter out invalid files", () => {
    const validJsonFile = new File([""], "valid.json");
    const validSqliteFile = new File([""], "valid.sqlite");
    const invalidFile = new File([""], "invalid.txt");
    const fileList = createMockFileList([
      validJsonFile,
      validSqliteFile,
      invalidFile,
    ]);
    const validFiles = filterValidFiles(fileList);
    expect(validFiles.length).toBe(2);
    expect(validFiles[0].name).toBe("valid.json");
    expect(validFiles[1].name).toBe("valid.sqlite");
  });

  it("Handle an empty list of files", () => {
    const emptyFiles: File[] = [];
    const fileList = createMockFileList(emptyFiles);
    const validFiles = filterValidFiles(fileList);
    expect(validFiles.length).toBe(0);
  });
});
