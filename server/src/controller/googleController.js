import passport from "passport";

export const googleAuth = passport.authenticate("google");

export const googleAuthRedirect = passport.authenticate("google", {
  successRedirect: "/",
  failureRedirect: "/login",
});
