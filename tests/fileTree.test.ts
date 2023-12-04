import path from "path";
import { FileTreeSamples } from "./test-scans/fileTree/expectedFileTree";
import { WorkbenchDB } from "../src/services/workbenchDB";
import { figureOutDefaultSqliteFilePath } from "../src/utils/paths";
import assert from "assert";

// Avoid logging scan-parser checkpoints during tests
beforeEach(() => {
  jest.spyOn(console, "time").mockImplementation(() => null);
  jest.spyOn(console, "info").mockImplementation(() => null);
});

describe("Parse flat files & create file tree", () => {
  it.each(FileTreeSamples)(
    "Process $jsonFileName",
    async ({ jsonFileName, flatData, fileTree }) => {
      const jsonFilePath = path.join(
        __dirname,
        "test-scans/fileTree/",
        jsonFileName
      );

      const newWorkbenchDB = new WorkbenchDB({
        dbName: "workbench_db",
        dbStoragePath: figureOutDefaultSqliteFilePath(jsonFilePath),
        deleteExisting: true,
      });
      const db = await newWorkbenchDB.sync;
      await newWorkbenchDB.addFromJson(jsonFilePath, () => null);

      const parsedFiles = (
        await db.File.findAll({
          attributes: ["id", "path", "parent", "name", "type"],
        })
      ).map((file) => file.toJSON());
      assert.deepEqual(parsedFiles, flatData);

      const parsedFileTree = await newWorkbenchDB.findAllJSTree();
      assert.deepEqual(parsedFileTree, fileTree);
    }
  );
});
