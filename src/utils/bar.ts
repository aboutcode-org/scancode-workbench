import { NO_VALUE_DETECTED_LABEL } from "../constants/data";

export function isValid(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.length > 0 && value.every((element) => isValid(element));
  } else {
    return value !== null && value !== undefined;
  }
}

/**
 *
 * @param values - List of Model objects returned by any Sequelize queries
 * @param attribute - Attribute of Model object to be obtained
 */
export function getValidatedAttributeValues(
  values: { dataValues: any }[],
  attribute: string
) {
  const validatedAttributeValues = [];
  let attributeValue = null;

  for (let i = 0; i < values.length; i++) {
    attributeValue = values[i].dataValues[attribute];

    // dedupe entries to prevent overcounting files. See https://github.com/aboutcode-org/scancode-workbench/issues/285
    try {
      const parsed = JSON.parse(attributeValue);
      if (Array.isArray(parsed)) attributeValue = parsed;
    } catch (e) {
      /* empty */
    }

    if (!Array.isArray(attributeValue) || attributeValue.length === 0) {
      attributeValue = [attributeValue];
    }

    for (let j = 0; j < attributeValue.length; j++) {
      const val = attributeValue[j];
      if (!isValid(val) && attribute === "package_data_type") {
        continue;
      }
      validatedAttributeValues.push(
        isValid(val) ? val : NO_VALUE_DETECTED_LABEL
      );
    }
  }

  return validatedAttributeValues;
}

// Counts occurences for unique entries & return formatted object required to draw the Bar chart
export function formatBarchartData(data: unknown[]) {
  const counterMapping = new Map<string, number>();
  let existingCount = 0;
  data.forEach((entry: string | string[]) => {
    const entryString =
      entry == null || entry == undefined
        ? NO_VALUE_DETECTED_LABEL
        : typeof entry === "string"
        ? entry
        : Array.isArray(entry)
        ? entry.join(",")
        : String(entry);
    existingCount = counterMapping.get(entryString);
    if (existingCount) counterMapping.set(entryString, existingCount + 1);
    else counterMapping.set(entryString, 1);
  });

  const noValueEntriesCount =
    (counterMapping.get("") || 0) +
    (counterMapping.get(NO_VALUE_DETECTED_LABEL) || 0);

  counterMapping.delete("");
  counterMapping.delete(NO_VALUE_DETECTED_LABEL);

  const formattedChartData = Array.from(counterMapping, (entry) => ({
    label: entry[0],
    value: entry[1],
  })).sort((a, b) => b.value - a.value);

  return {
    formattedChartData,
    noValueEntriesCount,
  };
}
