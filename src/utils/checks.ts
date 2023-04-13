export function isSchemaChanged(dbVersion: string, workbenchVersion: string) {  
  const majorDBVersion = dbVersion.split('.')[0];
  const majorWorkbenchVersion = workbenchVersion.split('.')[0];
  
  console.log("Comparing schema versions:", dbVersion, workbenchVersion);
  console.log("Comparing major versions:", majorDBVersion, majorWorkbenchVersion);

  return majorDBVersion !== majorWorkbenchVersion;
}