import { NO_VALUE_DETECTED_LABEL } from "../constants/data";

export function isValid(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.length > 0 && value.every((element) => isValid(element));
  } else {
    return value !== null;
  }
}

export function getAttributeValues(values: any[], attribute: any) {
  const validatedValues = [];
  let attributeValue = null;
   
  for (let i = 0; i < values.length; i++) {
    attributeValue = values[i][attribute];
    const fileType = values[i].type;
    
    // dedupe entries to prevent overcounting files. See https://github.com/nexB/scancode-workbench/issues/285
    if (Array.isArray(attributeValue)) {
      attributeValue = Array.from(new Set(attributeValue));
    }  

    if (!Array.isArray(attributeValue) || attributeValue.length === 0) {
      attributeValue = [attributeValue];
    }

    for (let j = 0; j < attributeValue.length; j++) {
      const val = attributeValue[j];
      if (!isValid(val) && attribute === 'package_data_type' && fileType === 'directory') {
        continue;
      }
      validatedValues.push(
        isValid(val) ?
          val : NO_VALUE_DETECTED_LABEL);
    }
  }
  return validatedValues;
}

export function formatBarchartData(data: unknown[]){
  const counterMapping = new Map<string, number>();
  let existingCount = 0;
  data.forEach((entry: string | string[]) => {
    const entryString = typeof entry === 'string' ? entry : Array.isArray(entry) ? entry.join(',') : String(entry);
    existingCount = counterMapping.get(entryString);
    if(existingCount)
      counterMapping.set(entryString, existingCount + 1);
    else
      counterMapping.set(entryString, 1);
  });


  if(counterMapping.has('')){
    counterMapping.set(
      NO_VALUE_DETECTED_LABEL,
      (counterMapping.get(NO_VALUE_DETECTED_LABEL) || 0) + counterMapping.get('')
    );
    counterMapping.delete('');
  }

  const formattedList = Array.from(counterMapping, entry => ({
    label: entry[0],
    value: entry[1],
  })).sort((a, b) => b.value - a.value);  

  return formattedList;
}