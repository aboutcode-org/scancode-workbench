import path from "path";
import assert from "assert";
import { parseScanInfo } from "../utils/parsers";
import { figureOutDefaultSqliteFilePath } from "../utils/paths";
import { WorkbenchDB } from "./workbenchDB";
import { HeaderSamples } from "./test-scans/headers/expectedHeaders";
import { CopyrightSamples } from "./test-scans/copyright/expectedCopyrights";
import { EmailUrlInfoSamples } from "./test-scans/email_url_info/expectedEmailUrlInfo";
import { LicenseSamples } from "./test-scans/licenses/expectedLicenses";
import { SanitySamples } from "./test-scans/sanity/sanitySamples";

// Avoid logging scan-parser checkpoints during tests
beforeEach(() => {
  jest.spyOn(console, "time").mockImplementation(() => null);
  jest.spyOn(console, "info").mockImplementation(() => null);
});

describe("Can parse scans", () => {
  it.each(SanitySamples)("Parses $jsonFileName", async ({ jsonFileName }) => {
    const jsonFilePath = path.join(
      __dirname,
      "test-scans/sanity/",
      jsonFileName
    );

    const newWorkbenchDB = new WorkbenchDB({
      dbName: "workbench_db",
      dbStoragePath: figureOutDefaultSqliteFilePath(jsonFilePath),
      deleteExisting: true,
    });
    await newWorkbenchDB.sync;
    await newWorkbenchDB.addFromJson(jsonFilePath, () => null);
  });
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
    async ({ jsonFileName, expectedFlatFiles, expectedCopyrights }) => {
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
      const db = await newWorkbenchDB.sync;
      await newWorkbenchDB.addFromJson(jsonFilePath, () => null);

      const flatFiles = (
        await db.FlatFile.findAll({
          attributes: [
            "copyright_statements",
            "copyright_holders",
            "copyright_authors",
            "copyright_start_line",
            "copyright_end_line",
          ],
        })
      ).map((flatFile) => flatFile.dataValues);
      const rawCopyrights = (await newWorkbenchDB.db.Copyright.findAll()).map(
        (copyright) => copyright.dataValues
      );

      assert.deepEqual(flatFiles, expectedFlatFiles);
      assert.deepEqual(rawCopyrights, expectedCopyrights);
    }
  );
});

describe("Can parse Email, URL & Info", () => {
  it.each(EmailUrlInfoSamples)(
    "Parses $jsonFileName",
    async ({
      jsonFileName,
      expectedFlatFiles,
      expectedEmails,
      expectedUrls,
    }) => {
      const jsonFilePath = path.join(
        __dirname,
        "test-scans/email_url_info/",
        jsonFileName
      );

      const newWorkbenchDB = new WorkbenchDB({
        dbName: "workbench_db",
        dbStoragePath: figureOutDefaultSqliteFilePath(jsonFilePath),
        deleteExisting: true,
      });
      const db = await newWorkbenchDB.sync;

      await newWorkbenchDB.addFromJson(jsonFilePath, () => null);

      const flatFiles = (
        await db.FlatFile.findAll({
          attributes: [
            "type",
            "name",
            "extension",
            "date",
            "size",
            "sha1",
            "md5",
            "file_count",
            "mime_type",
            "file_type",
            "programming_language",
            "is_binary",
            "is_text",
            "is_archive",
            "is_media",
            "is_source",
            "is_script",
            "email",
            "email_start_line",
            "email_end_line",
            "url",
            "url_start_line",
            "url_end_line",
          ],
        })
      ).map((flatFile) => flatFile.dataValues);
      const emails = (await db.Email.findAll()).map(
        (email) => email.dataValues
      );
      const urls = (await db.Url.findAll()).map((url) => url.dataValues);

      assert.deepEqual(flatFiles, expectedFlatFiles);
      assert.deepEqual(emails, expectedEmails);
      assert.deepEqual(urls, expectedUrls);
    }
  );
});

describe("Can parse Licenses", () => {
  it.each(LicenseSamples)(
    "Parses $jsonFileName",
    async ({
      jsonFileName,
      expectedFlatFiles,
      expectedLicenseClues,
      expectedLicenseDetections,
      expectedLicenseExpressions,
      expectedLicensePolicies,
      expectedLicenseRuleReferences,
    }) => {
      const jsonFilePath = path.join(
        __dirname,
        "test-scans/licenses/",
        jsonFileName
      );

      const newWorkbenchDB = new WorkbenchDB({
        dbName: "workbench_db",
        dbStoragePath: figureOutDefaultSqliteFilePath(jsonFilePath),
        deleteExisting: true,
      });
      const db = await newWorkbenchDB.sync;

      await newWorkbenchDB.addFromJson(jsonFilePath, () => null);

      const flatFiles = (
        await db.FlatFile.findAll({
          attributes: [
            "detected_license_expression",
            "detected_license_expression_spdx",
            "percentage_of_license_text",
            "license_policy",
            "license_clues",
            "license_detections",
          ],
        })
      ).map((flatFile) => flatFile.dataValues);
      const licenseDetections = (await db.LicenseDetections.findAll()).map(
        (detection) => detection.dataValues
      );
      const licenseClues = (await db.LicenseClues.findAll()).map(
        (clue) => clue.dataValues
      );
      const licenseExpressions = (await db.LicenseExpression.findAll()).map(
        (expression) => expression.dataValues
      );
      const licensePolicies = (await db.LicensePolicy.findAll()).map(
        (policy) => policy.dataValues
      );
      const licenseRuleReferences = (
        await db.LicenseRuleReferences.findAll()
      ).map((ruleReference) => ruleReference.dataValues);

      assert.deepEqual(flatFiles, expectedFlatFiles);
      assert.deepEqual(licenseDetections, expectedLicenseDetections);
      assert.deepEqual(licenseClues, expectedLicenseClues);
      assert.deepEqual(licenseExpressions, expectedLicenseExpressions);
      assert.deepEqual(licensePolicies, expectedLicensePolicies);
      assert.deepEqual(licenseRuleReferences, expectedLicenseRuleReferences);
    }
  );
});
