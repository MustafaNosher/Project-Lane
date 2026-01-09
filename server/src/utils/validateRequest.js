
export const validateRequestBody = (body={}, requiredFields = []) => {

  // For PUT scenario where there are no fix required fields but body should not be empty
  if (requiredFields.length === 0) {
    if (!body || Object.keys(body).length === 0) {
      return "Request body cannot be empty. At least one field is required.";
    }
    return null;
  }

  // For required fields (POST/create scenario)
  const missingFields = requiredFields.filter(field => !body[field]);
  if (missingFields.length > 0) {
    return `Missing required fields: ${missingFields.join(", ")}`;
  }

  return null; // No errors
};
