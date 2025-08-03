// This is for structured error

export class AppError extends Error {
  public statusCode: number;
  public success: boolean;

  constructor(message: string, statusCode: number) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);

    message = message || 'Something went wrong!';
    this.statusCode = statusCode;
    this.success = false;
  };
};