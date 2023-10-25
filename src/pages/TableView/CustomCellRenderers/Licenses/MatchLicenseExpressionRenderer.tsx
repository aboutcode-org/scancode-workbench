import React, { useMemo } from "react";
import {
  LICENSE_EXPRESSIONS_CONJUNCTIONS,
  parseTokensFromExpression,
} from "../../../../services/models/databaseUtils";
import CoreLink from "../../../../components/CoreLink/CoreLink";

const DEBUG_URLS = false;

interface LicenseExpressionRendererProps {
  value: string;
  spdxLicense?: boolean;
  data: {
    license_expression: string;
    license_expression_spdx: string;
    license_expression_keys: {
      key: string;
      licensedb_url: string;
      scancode_url: string;
    }[];
    license_expression_spdx_keys: {
      key: string;
      spdx_url: string;
    }[];
  };
}

interface ParsedTokens {
  value: string;
  href?: string;
}

const MatchLicenseExpressionRenderer = (
  props: LicenseExpressionRendererProps
) => {
  const { spdxLicense, data } = props;

  const {
    license_expression,
    license_expression_spdx,
    license_expression_keys,
    license_expression_spdx_keys,
  } = data;

  const parsedComponents = useMemo<ParsedTokens[]>(() => {
    if (!license_expression) return [];

    let newParsedComponents: ParsedTokens[];
    if (spdxLicense) {
      const licenseExpressionSpdxKeysMap = new Map(
        // Handle deferred state update to ag data grid
        (license_expression_spdx_keys || []).map((expKey) => [
          expKey.key,
          expKey,
        ])
      );
      newParsedComponents = parseTokensFromExpression(
        license_expression_spdx
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
  }, [data]);

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
