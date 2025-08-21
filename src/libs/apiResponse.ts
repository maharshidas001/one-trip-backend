// This is for structured success response.

interface IApiResponse {
  message: string;
  statusCode: number;
  success: boolean;
  data?: any;
};

export const apiResponse = (
  message: string,
  statusCode: number,
  data?: any
) => {
  let response: IApiResponse = {
    message: message || 'Success',
    statusCode,
    success: true,
    data
  };

  return response;
};