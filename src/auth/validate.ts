const regexMap = {
  username: /^[a-zA-Z0-9]{3,20}$/,
  password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
};

function sanitizeUsername(username: string) {
  return username.trim().toLowerCase();
}

function validateInput(value: string, regex: keyof typeof regexMap) {
  return regexMap[regex].test(value);
}

function validateSignUp(username: string, password: string) {
  if (!username || !password) return { message: "all fields required" };

  const sanitizedName = sanitizeUsername(username);

  if (!validateInput(sanitizedName, "username"))
    return {
      error: "invalid username, must be 3-20 alphanumeric characters",
    };

  if (!validateInput(password, "password"))
    return {
      error:
        "invalid password, must be at least 8 characters, including one letter and one digit",
    };

  return {
    error: null,
    cleanUsername: sanitizedName,
    cleanPassword: password,
  };
}

export { validateSignUp };
