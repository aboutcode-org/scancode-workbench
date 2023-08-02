import path from "path";
import assert from "assert";
import { parseScanInfo } from "../utils/parsers";
import { figureOutDefaultSqliteFilePath } from "../utils/paths";
import { WorkbenchDB } from "./workbenchDB";
import { HeaderSamples } from "./test-scans/headers/expectedHeaders";
import { CopyrightSamples } from "./test-scans/copyright/expectedCopyrights";

// Avoid logging scan-parser checkpoints during tests
beforeEach(() => {
  jest.spyOn(console, "time").mockImplementation(() => null);
  jest.spyOn(console, "info").mockImplementation(() => null);
});

describe("Can parse Headers", () => {
  it.each(HeaderSamples)(
    "Parses $jsonFileName",
    async ({ jsonFileName, expectedHeaders }) => {
      const jsonFilePath = path.join(
        __dirname,
        "test-scans/headers/",
        jsonFileName
      );

      const newWorkbenchDB = new WorkbenchDB({
        dbName: "workbench_db",
        dbStoragePath: figureOutDefaultSqliteFilePath(jsonFilePath),
        deleteExisting: true,
      });

      await newWorkbenchDB.addFromJson(jsonFilePath, () => null);

      const scanInfo = parseScanInfo(await newWorkbenchDB.getScanInfo());
      assert.deepEqual(scanInfo, expectedHeaders);
    }
  );
});

describe("Can parse Copyrights", () => {
  it.each(CopyrightSamples)(
    "Parses $jsonFileName",
    async ({ jsonFileName, expectedCopyrights }) => {
      const jsonFilePath = path.join(
        __dirname,
        "test-scans/copyright/",
        jsonFileName
      );

      const newWorkbenchDB = new WorkbenchDB({
        dbName: "workbench_db",
        dbStoragePath: figureOutDefaultSqliteFilePath(jsonFilePath),
        deleteExisting: true,
      });

      await newWorkbenchDB.addFromJson(jsonFilePath, () => null);

      const rawCopyrights = await newWorkbenchDB.db.Copyright.findAll({ raw: true });
      assert.deepEqual(rawCopyrights, expectedCopyrights);
    }
  );
});
