
//Utility function to send success and failure responses

export const successResponse = (res, statusCode = 200, message = "Success", data = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

export const errorResponse = (res, statusCode = 500, message = "Something went wrong", errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors
  });
};
