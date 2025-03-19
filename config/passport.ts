import passport from "passport";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { findUser } from "../src/user/db";

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_PRIVATE_KEY as string,
    },
    async (payload, done) => {
      try {
        // if JWT valid find user in db
        const user = await findUser(payload.userId);

        if (user) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Token has invalid user ID" });
        }
      } catch (error) {
        console.error(error);
        return done(error, false, { message: "Error during authentication" });
      }
    },
  ),
);

export { passport };
