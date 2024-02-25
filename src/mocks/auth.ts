import bcrypt from "bcryptjs";

// fake jwt token generator function
export const jwt_sign = () => {
  return "token";
};

/**
 * compares the hash and password
 * @param {string} password - string to compare
 * @param {string} hash - Hash to test against
 * @returns {boolean} - true if matching, otherwise false
 */
export const is_password_correct = (
  password: string,
  hash: string
): boolean => {
  // hash stores two things: actual hash and salt. bcrypt.compareSync will do the job.
  return bcrypt.compareSync(password, hash);
};
