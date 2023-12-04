import React, { ReactElement, useEffect, useState } from "react";
import { LicenseMatch } from "../../services/importedJsonTypes";
import CoreLink from "../CoreLink/CoreLink";
import { useWorkbenchDB } from "../../contexts/dbContext";
import { Badge } from "react-bootstrap";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { LicenseRuleReferenceAttributes } from "../../services/models/licenseRuleReference";
import { ScanOptionKeys } from "../../utils/parsers";

interface MatchRulePopoverProps {
  match: LicenseMatch;
}
const MatchRuleDetails = (props: MatchRulePopoverProps) => {
  const { match } = props;
  const { db, scanInfo } = useWorkbenchDB();

  const [ruleReference, setRuleReference] =
    useState<LicenseRuleReferenceAttributes | null>(null);

  useEffect(() => {
    // @TODO - Handle cases when Rule
    db.getLicenseRuleReference(match.rule_identifier)
      .then((newRuleReferenceModel) => {
        const newRuleReference = newRuleReferenceModel.toJSON();
        setRuleReference(newRuleReference);
      })
      .catch(() => setRuleReference(null));
  }, [match]);

  const ruleReferenceDetails: {
    property: string;
    value: ReactElement | string | number;
  }[] = ruleReference
    ? [
        {
          property: "Rule",
          value: (
            <span>
              {ruleReference.license_expression}
              {ruleReference.rule_url && (
                <CoreLink
                  href={ruleReference.rule_url}
                  external
                  fontawesomeIcon={faGithub}
                  className="px-2"
                >
                  View on Github
                </CoreLink>
              )}
            </span>
          ),
        },
        { property: "identifier", value: ruleReference.identifier },
        { property: "Length", value: ruleReference.length },
        { property: "Relevance", value: ruleReference.relevance },
        { property: "Minimum Coverage", value: ruleReference.minimum_coverage },
      ]
    : [];

  const ruleReferenceFlags = ruleReference
    ? [
        {
          flag: "is_license_text",
          value: ruleReference.is_license_text,
        },
        {
          flag: "is_license_notice",
          value: ruleReference.is_license_notice,
        },
        {
          flag: "is_license_reference",
          value: ruleReference.is_license_reference,
        },
        {
          flag: "is_license_tag",
          value: ruleReference.is_license_tag,
        },
        {
          flag: "is_license_intro",
          value: ruleReference.is_license_intro,
        },
        {
          flag: "is_license_clue",
          value: ruleReference.is_license_clue,
        },
        { flag: "is_continuous", value: ruleReference.is_continuous },
        // { flag: "is_builtin", value: ruleReference.is_builtin },
        {
          flag: "is_from_license",
          value: ruleReference.is_from_license,
        },
        { flag: "is_synthetic", value: ruleReference.is_synthetic },
      ]
    : [];

  return (
    <div>
      {ruleReference ? (
        <div>
          <div className="rule-details">
            {ruleReferenceDetails.map(({ property, value }) => (
              <div className="rule-detail-entry" key={property}>
                <b>{property}</b> - {value}
              </div>
            ))}
            {ruleReference.referenced_filenames.length > 0 && (
              <div>
                <b>Referenced Filenames</b>
                <ul className="rule-detail-entry">
                  {ruleReference.referenced_filenames.map((filename) => (
                    <li key={filename}>{filename}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div>
            <div>
              <b>
                Flags <br />
              </b>
            </div>
          </div>
          {ruleReferenceFlags.map(
            ({ flag, value }) =>
              value && (
                <Badge
                  pill
                  bg="primary"
                  className="d-inline px-2 me-1"
                  text="light"
                  key={flag}
                >
                  {flag}
                </Badge>
              )
          )}
        </div>
      ) : (
        <div className="text-break rule-reference-fallback">
          {scanInfo.optionsMap.get(ScanOptionKeys.LICENSE_REFERENCES) ? (
            "Rule reference not available"
          ) : (
            <span>
              Enable{" "}
              <CoreLink href="https://scancode-toolkit.readthedocs.io/en/latest/cli-reference/basic-options.html#all-basic-scan-options">
                {ScanOptionKeys.LICENSE_REFERENCES}
              </CoreLink>{" "}
              option in scans to view rule references
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default MatchRuleDetails;
