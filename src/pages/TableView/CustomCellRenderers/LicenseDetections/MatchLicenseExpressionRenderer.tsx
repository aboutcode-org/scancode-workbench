import React, { useMemo } from "react";
import { LICENSE_EXPRESSIONS_CONJUNCTIONS, parseTokensFromExpression } from "../../../../services/models/databaseUtils";

// @TODO - Create SPDXLicenseExpressionParser too !!
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

const DEBUG_URLS = false;

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
    console.log("Match data", data);
    if (!license_expression) return [];

    const licenseExpressionKeysMap = new Map(
      license_expression_keys.map((expKey) => [expKey.key, expKey])
    );
    const licenseExpressionSpdxKeysMap = new Map(
      license_expression_spdx_keys.map((expKey) => [expKey.key, expKey])
    );

    console.log(
      "Keys mapper",
      licenseExpressionKeysMap,
      licenseExpressionSpdxKeysMap
    );

    let newParsedComponents: ParsedTokens[];
    if (spdxLicense) {
      console.log(
        "SPDX Tokens",
        parseTokensFromExpression(license_expression_spdx)
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
      console.log("Tokens", parseTokensFromExpression(license_expression));

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
    console.log("Parsed components", newParsedComponents);
    return newParsedComponents;
  }, [data]);

  return (
    <>
      {parsedComponents.map(({ value, href }, idx) => {
        if (href) {
          return (
            <a href={href} key={href + value}>
              {value}
              { DEBUG_URLS && `(${href})`}
            </a>
          );
        }
        return (
          <React.Fragment key={value + idx}>
            {value}
            {
              DEBUG_URLS ?
              value.trim().length>0 &&
              !LICENSE_EXPRESSIONS_CONJUNCTIONS.includes(value) &&
              "(NoURL)"
              : ""
            }
          </React.Fragment>
        );
      })}
    </>
  );
};

export default MatchLicenseExpressionRenderer;
