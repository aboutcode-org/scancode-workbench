export const LICENSE_EXPRESSIONS_CONJUNCTIONS = ["AND", "OR", "WITH"];

export const parseSubExpressions = (expression: string) => {
  if (!expression || !expression.length) return [];
  const tokens = expression.split(/( |\(|\))/);
  const result = [];
  let currSubExpression = "";
  let popTokens = 0;
  for (const token of tokens) {
    if (token === "(") {
      if (popTokens) currSubExpression += "(";
      popTokens++;
    } else if (token === ")") {
      popTokens--;
      if (popTokens) {
        currSubExpression += ")";
      } else {
        result.push(currSubExpression);
        currSubExpression = "";
      }
    } else {
      if (popTokens) currSubExpression += token;
      else {
        if (token.trim().length) result.push(token);
      }
    }
  }

  return result.filter(
    (subExpression) =>
      subExpression.trim().length &&
      !LICENSE_EXPRESSIONS_CONJUNCTIONS.includes(subExpression.trim())
  );
};

export function parseTokensFromExpression(expression: string) {
  if (!expression) expression = "";
  const tokens = expression.split(/( |\(|\))/);
  return tokens;
}

export function parseTokenKeysFromExpression(expression: string) {
  if (!expression) expression = "";
  const AVOID_KEYWORDS = new Set(["WITH", "OR", "AND", "(", ")"]);
  const tokens = parseTokensFromExpression(expression);
  return tokens.filter(
    (token) =>
      token.trim().length && token.length && !AVOID_KEYWORDS.has(token.trim())
  );
}

export function filterSpdxKeys(keys: string[]) {
  const ignoredPrefixes = ["License-scancode-", "LicenseRef-scancode-"];
  return keys.filter((key) => {
    for (const prefix of ignoredPrefixes) {
      if (key.includes(prefix)) return false;
    }
    return true;
  });
}
