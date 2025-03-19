import prisma from "../../../../config/prisma";
import { createUser } from "../../../user/db";
import { findUsername } from "../../db";
import bcrypt from "bcryptjs";
import { validateSignUp } from "../../validate";

async function handleSignUp(
  parent,
  { username, password }: { username: string; password: string },
  context,
) {
  try {
    const {
      cleanUsername = "",
      cleanPassword = "",
      error: validationError,
    } = validateSignUp(username, password);
    console.log("ERROR! -> ", validationError);
    
    if (validationError) {
      return {
        id: null,
        username: null,
        success: false,
        message: validationError,
      };
    }

    const existingUser = await findUsername(username);

    if (existingUser) {
      return {
        id: null,
        username: null,
        success: false,
        message: "Username already taken",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await createUser(prisma, username, hashedPassword, "USER");
    return {
      success: true,
      message: `User: ${username} created successfully`,
      id: newUser.id,
      username,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "A server error occured during sign up",
    };
  }
}

export default handleSignUp;
