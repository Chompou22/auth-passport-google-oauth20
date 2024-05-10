import dotenv from "dotenv";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import GoogleUser from "../model/google-user.js";

dotenv.config();

//Persists user data inside session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

//Fetches session details using session id
passport.deserializeUser(async (id, done) => {
  try {
    const findUser = await GoogleUser.findByPk(id);
    return findUser ? done(null, findUser) : done(null, null);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URL,
      scope: [
        "email",
        "profile",
        // "https://www.googleapis.com/auth/youtube",
        // "https://www.googleapis.com/auth/youtube.force-ssl",
      ],
    },
    async function (accessToken, refreshToken, profile, done) {
      console.log("Google accessToken", accessToken);
      console.log("Google refreshToken", refreshToken);
      console.log("Google profile", profile);
      try {
        let user = await GoogleUser.findOne({
          where: { googleId: profile.id },
        });

        if (user) {
          // If the user exists, return the user
          console.log("USERRRRSS", user);
          return done(null, user);
        } else {
          // If the user doesn't exist, create a new user
          const newUser = new GoogleUser({
            username: profile.displayName, // You can use profile.displayName or any other field from the profile
            googleId: profile.id,
          });

          console.log("newUser:", newUser);

          // Save the new user to the database
          await newUser.save();

          // Return the newly created user
          return done(null, newUser);
        }
      } catch (err) {
        return done(err);
      }
    }
  )
);

export default passport;
