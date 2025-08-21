export interface IUserMongooseModel {
  fullName: string;
  email: string;
  password: string;
  refreshToken: string;
  comparePassword: (password: string) => Promise<boolean>;
  createAccessToken: () => string;
  createRefreshToken: () => string;
};