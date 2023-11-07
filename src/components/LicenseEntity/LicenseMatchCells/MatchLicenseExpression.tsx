import React, { useMemo } from "react";
import CoreLink from "../../CoreLink/CoreLink";
import {
  LICENSE_EXPRESSIONS_CONJUNCTIONS,
  parseTokensFromExpression,
} from "../../../services/models/databaseUtils";
import {
  LicenseClueMatch,
  LicenseDetectionMatch,
} from "../../../services/importedJsonTypes";

const DEBUG_URLS = false;

interface MatchLicenseExpressionRendererProps {
  matchInfo:
    | {
        spdxLicense: false;
        match: LicenseClueMatch;
      }
    | {
        spdxLicense: true;
        match: LicenseDetectionMatch;
      };
}

interface ParsedTokens {
  value: string;
  href?: string;
}

const MatchLicenseExpressionRenderer = (
  props: MatchLicenseExpressionRendererProps
) => {
  const { matchInfo } = props;

  const { license_expression, license_expression_keys } = matchInfo.match;

  const parsedComponents = useMemo<ParsedTokens[]>(() => {
    if (!license_expression) return [];

    let newParsedComponents: ParsedTokens[];
    if (matchInfo.spdxLicense) {
      const licenseExpressionSpdxKeysMap = new Map(
        // Handle deferred state update to ag data grid
        (matchInfo.match.license_expression_spdx_keys || []).map((expKey) => [
          expKey.key,
          expKey,
        ])
      );
      newParsedComponents = parseTokensFromExpression(
        matchInfo.match.license_expression_spdx
      ).map((token) => {
        const tokenInfo = licenseExpressionSpdxKeysMap.get(token);
        if (tokenInfo) {
          return {
            value: tokenInfo.key,
            href: tokenInfo.spdx_url,
          };
        }
        return { value: token };
      });
    } else {
      const licenseExpressionKeysMap = new Map(
        license_expression_keys.map((expKey) => [expKey.key, expKey])
      );
      newParsedComponents = parseTokensFromExpression(license_expression).map(
        (token) => {
          const tokenInfo = licenseExpressionKeysMap.get(token);
          if (tokenInfo) {
            return {
              value: tokenInfo.key,
              href: tokenInfo?.licensedb_url || tokenInfo?.scancode_url || "",
            };
          }
          return { value: token };
        }
      );
    }
    return newParsedComponents;
  }, [matchInfo]);

  return (
    <>
      {parsedComponents.map(({ value, href }, idx) => {
        if (href) {
          return (
            <CoreLink href={href} key={href + value}>
              {value}
              {DEBUG_URLS && `(${href})`}
            </CoreLink>
          );
        }
        return (
          <React.Fragment key={value + idx}>
            {value}
            {DEBUG_URLS
              ? value.trim().length > 0 &&
                !LICENSE_EXPRESSIONS_CONJUNCTIONS.includes(value) &&
                "(NoURL)"
              : ""}
          </React.Fragment>
        );
      })}
    </>
  );
};

export default MatchLicenseExpressionRenderer;
