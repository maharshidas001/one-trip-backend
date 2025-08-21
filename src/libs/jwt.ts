import { SignJWT, jwtVerify, type JWTPayload } from "jose";

interface SignOptions {
  expiresIn: string | number;
}

const sign = async (
  payload: JWTPayload,
  secret: string,
  options: SignOptions
): Promise<string> => {
  const secretKey = new TextEncoder().encode(secret);

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(options.expiresIn)
    .sign(secretKey);

  return token;
};

const verify = async (
  token: string,
  secret: string
) => {
  const secretKey = new TextEncoder().encode(secret);

  const { payload } = await jwtVerify(token, secretKey);

  return payload;
};

export {
  sign,
  verify
};