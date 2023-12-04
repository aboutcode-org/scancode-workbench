import path from "path";
import assert from "assert";
import { parseScanInfo } from "../src/utils/parsers";
import { figureOutDefaultSqliteFilePath } from "../src/utils/paths";
import { WorkbenchDB } from "../src/services/workbenchDB";
import { HeaderSamples } from "./test-scans/headers/expectedHeaders";
import { CopyrightSamples } from "./test-scans/copyrights/expectedCopyrights";
import { EmailUrlInfoSamples } from "./test-scans/email_url_info/expectedEmailUrlInfo";
import { LicenseSamples } from "./test-scans/licenses/expectedLicenses";
import { SanitySamples } from "./test-scans/sanity/sanitySamples";
import { ErrorSamples } from "./test-scans/scan-errors/expectedErrors";
import { PackageDepsSamples } from "./test-scans/packages_dependencies/expectedPackagesDeps";
import { TodoSamples } from "./test-scans/todos/todoSamples";

// Avoid logging scan-parser checkpoints during tests
beforeEach(() => {
  jest.spyOn(console, "time").mockImplementation(() => null);
  jest.spyOn(console, "info").mockImplementation(() => null);
});

describe("Process special cases", () => {
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

describe("Parse Headers", () => {
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

describe("Parse Errors", () => {
  it.each(ErrorSamples)(
    "Parses $jsonFileName",
    async ({ jsonFileName, expectedFlatFiles, expectedScanErrors }) => {
      const jsonFilePath = path.join(
        __dirname,
        "test-scans/scan-errors/",
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
          attributes: ["fileId", "scan_errors"],
        })
      ).map((flatFile) => flatFile.toJSON());
      const scanErrors = (await newWorkbenchDB.db.ScanError.findAll()).map(
        (error) => error.toJSON()
      );

      assert.deepEqual(flatFiles, expectedFlatFiles);
      assert.deepEqual(scanErrors, expectedScanErrors);
    }
  );
});

describe("Parse Copyrights", () => {
  it.each(CopyrightSamples)(
    "Parses $jsonFileName",
    async ({ jsonFileName, expectedFlatFiles, expectedCopyrights }) => {
      const jsonFilePath = path.join(
        __dirname,
        "test-scans/copyrights/",
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
      ).map((flatFile) => flatFile.toJSON());
      const copyrights = (await newWorkbenchDB.db.Copyright.findAll()).map(
        (copyright) => copyright.toJSON()
      );

      assert.deepEqual(flatFiles, expectedFlatFiles);
      assert.deepEqual(copyrights, expectedCopyrights);
    }
  );
});

describe("Parse Email, URL & Info", () => {
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
      ).map((flatFile) => flatFile.toJSON());
      const emails = (await db.Email.findAll()).map(
        (email) => email.toJSON()
      );
      const urls = (await db.Url.findAll()).map((url) => url.toJSON());

      assert.deepEqual(flatFiles, expectedFlatFiles);
      assert.deepEqual(emails, expectedEmails);
      assert.deepEqual(urls, expectedUrls);
    }
  );
});

describe("Parse Licenses", () => {
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
      ).map((flatFile) => flatFile.toJSON());
      const licenseDetections = (await db.LicenseDetections.findAll()).map(
        (detection) => detection.toJSON()
      );
      const licenseClues = (await db.LicenseClues.findAll()).map((clue) =>
        clue.toJSON()
      );
      const licenseExpressions = (await db.LicenseExpression.findAll()).map(
        (expression) => expression.toJSON()
      );
      const licensePolicies = (await db.LicensePolicy.findAll()).map((policy) =>
        policy.toJSON()
      );
      const licenseRuleReferences = (
        await db.LicenseRuleReferences.findAll()
      ).map((ruleReference) => ruleReference.toJSON());

      assert.deepEqual(flatFiles, expectedFlatFiles);
      assert.deepEqual(licenseDetections, expectedLicenseDetections);
      assert.deepEqual(licenseClues, expectedLicenseClues);
      assert.deepEqual(licenseExpressions, expectedLicenseExpressions);
      assert.deepEqual(licensePolicies, expectedLicensePolicies);
      assert.deepEqual(licenseRuleReferences, expectedLicenseRuleReferences);
    }
  );
});

describe("Parse Packages & Dependencies", () => {
  it.each(PackageDepsSamples)(
    "Parses $jsonFileName",
    async ({
      jsonFileName,
      expectedFlatFiles,
      expectedDependencies,
      expectedPackageData,
      expectedPackages,
    }) => {
      const jsonFilePath = path.join(
        __dirname,
        "test-scans/packages_dependencies/",
        jsonFileName
      );

      const newWorkbenchDB = new WorkbenchDB({
        dbName: "workbench_db",
        dbStoragePath: figureOutDefaultSqliteFilePath(jsonFilePath),
        deleteExisting: true,
      });
      const db = await newWorkbenchDB.sync;

      await newWorkbenchDB.addFromJson(jsonFilePath, () => null);

      const flatFileAttributes = [
        "for_packages",
        "package_data_type",
        "package_data_namespace",
        "package_data_name",
        "package_data_version",
        "package_data_qualifiers",
        "package_data_subpath",
        "package_data_purl",
        "package_data_primary_language",
        "package_data_code_type",
        "package_data_description",
        "package_data_size",
        "package_data_release_date",
        "package_data_keywords",
        "package_data_homepage_url",
        "package_data_download_url",
        "package_data_download_checksums",
        "package_data_bug_tracking_url",
        "package_data_code_view_url",
        "package_data_vcs_tool",
        "package_data_vcs_url",
        "package_data_vcs_repository",
        "package_data_vcs_revision",
        "package_data_extracted_license_statement",
        "package_data_declared_license_expression",
        "package_data_declared_license_expression_spdx",
        "package_data_notice_text",
        "package_data_dependencies",
        "package_data_related_packages",
      ];
      const flatFiles = (
        await db.FlatFile.findAll({
          attributes: flatFileAttributes,
        })
      ).map((flatFile) => flatFile.toJSON());
      const packages = (await db.Packages.findAll()).map((pkg) => pkg.toJSON());
      const packageData = (await db.PackageData.findAll()).map((pkgData) =>
        pkgData.toJSON()
      );
      const dependencies = (await db.Dependencies.findAll()).map((dependency) =>
        dependency.toJSON()
      );

      assert.deepEqual(flatFiles, expectedFlatFiles);
      assert.deepEqual(packages, expectedPackages);
      assert.deepEqual(packageData, expectedPackageData);
      assert.deepEqual(dependencies, expectedDependencies);
    }
  );
});

describe("Parse Todos", () => {
  it.each(TodoSamples)(
    "Parses $jsonFileName",
    async ({ jsonFileName, expectedTodos }) => {
      const jsonFilePath = path.join(
        __dirname,
        "test-scans/todos/",
        jsonFileName
      );

      const newWorkbenchDB = new WorkbenchDB({
        dbName: "workbench_db",
        dbStoragePath: figureOutDefaultSqliteFilePath(jsonFilePath),
        deleteExisting: true,
      });
      await newWorkbenchDB.addFromJson(jsonFilePath, () => null);

      const todos = (await newWorkbenchDB.db.Todo.findAll()).map((todo) =>
        todo.toJSON()
      );

      assert.deepEqual(todos, expectedTodos);
    }
  );
});
