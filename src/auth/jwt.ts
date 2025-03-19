import { Request, Response, NextFunction } from "express";
import passport from "passport";

const jwtAuth = (req: Request, res: Response, next: NextFunction) => {
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

export { jwtAuth }
