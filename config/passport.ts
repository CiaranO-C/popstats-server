import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { User } from "@prisma/client";
import prisma from "./prisma";
import { GraphQLLocalStrategy } from "graphql-passport";

passport.use(
  new GraphQLLocalStrategy(async (username: string, password: string, done) => {
    try {
      const user: User | null = await prisma.user.findUnique({
        where: { username },
      });

      if (!user) {
        return done(null, false, "Username does not exist");
      }

      const isMatch: boolean = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return done(null, false, "Incorrect password");
      }

      //Correct details entered
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }),
);

/*passport.use(
  "login",
  new LocalStrategy(
    async (username: string, password: string, done: Function) => {
      try {
        const user: User | null = await prisma.user.findUnique({
          where: { username },
        });

        if (!user) {
          return done(null, false, { message: "Username does not exist" });
        }

        const isMatch: boolean = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return done(null, false, { message: "Incorrect password" });
        }

        //Correct details entered
        return done(null, user);
      } catch (error) {
        console.error(error);
        return done(error);
      }
    },
  ),
);*/

export { passport };
