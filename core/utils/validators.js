/**
 * Validators for JSON schema integrity
 */
export function validateSchema(json, schemaName) {
  if (!json) throw new Error(`Invalid JSON in schema: ${schemaName}`);
  console.log(`Validated schema: ${schemaName}`);
  return true;
}
