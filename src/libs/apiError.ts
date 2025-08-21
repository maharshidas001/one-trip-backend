// This is for structured error

export class ApiError extends Error {
  public statusCode: number;
  public success: boolean;
  public error: any;

  constructor(message: string, statusCode: number, error?: any) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);

    this.statusCode = statusCode;
    this.error = error;
    this.success = false;
  };
};