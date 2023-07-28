import path from "path";
import assert from "assert";
import { parseScanInfo } from "../utils/parsers";
import { figureOutDefaultSqliteFilePath } from "../utils/paths";
import { WorkbenchDB } from "./workbenchDB";
import { HeaderSamples } from "./test-scans/headers/expectedHeaders";

// Avoid logging scan-parser checkpoints during tests
beforeEach(() => {
  jest.spyOn(console, "log").mockImplementation(() => null);
  jest.spyOn(console, "time").mockImplementation(() => null);
  jest.spyOn(console, "warn").mockImplementation(() => null);
});

describe("Can parse Headers correctly", () => {
  it.each(HeaderSamples)(
    "Parses $jsonFileName",
    async ({ jsonFileName, expectedHeaders }) => {
      const jsonFilePath = path.join(__dirname, "test-scans/headers/", jsonFileName);

      const newWorkbenchDB = new WorkbenchDB({
        dbName: "workbench_db",
        dbStorage: figureOutDefaultSqliteFilePath(jsonFilePath),
      });

      await newWorkbenchDB.addFromJson(jsonFilePath, () => null);

      const scanInfo = parseScanInfo(await newWorkbenchDB.getScanInfo());
      assert.deepEqual(scanInfo, expectedHeaders);
    }
  );
});
