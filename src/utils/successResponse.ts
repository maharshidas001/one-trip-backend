// This is for structured success response.

interface ISuccessResponse {
  message: string;
  statusCode: number;
  success: boolean;
  data?: any;
};

export const successResponse = (message: string, statusCode: number, data?: any) => {
  let response: ISuccessResponse = {
    message: message || 'Success',
    statusCode,
    success: true,
    data
  };

  return response;
};