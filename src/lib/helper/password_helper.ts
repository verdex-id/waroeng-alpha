import bcrypt from "bcrypt";

export async function encryptPassword(password: string) {
  const hashPassword = await bcrypt.hash(password, 10);
  return hashPassword;
}

export async function checkPasswordIsValid(
  password: string,
  hashPassword: string
) {
  const result = await bcrypt.compare(password, hashPassword);
  return result;
}
