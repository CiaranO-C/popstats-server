import { Request, Response, NextFunction } from "express";
import passport from "passport";

const jwtAuth = (req: Request, res: Response, next: NextFunction) => {
  // if no jwt skip auth, gQL resolvers will handle permissions based on user role
  const token = req.headers.authorization?.split(" ")[1]; 

  if (!token) {
    console.log("No JWT Found!")
    return next();
  }

  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(401).json({
        message: info?.message || "Authentication failed",
      });
    }

    req.user = user;
    next();
  })(req, res, next);
};

export { jwtAuth };
