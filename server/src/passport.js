import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as AppleStrategy } from 'passport-apple';

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,  // Google client ID from Google Developer Console
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,  // Google client secret
      callbackURL: process.env.GOOGLE_CALLBACK_URL,  // Callback URL for Google
    },
    (accessToken, refreshToken, profile, done) => {
      // Handle Google profile
      return done(null, profile);
    }
  )
);

// Facebook OAuth Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,  // Facebook app ID
      clientSecret: process.env.FACEBOOK_APP_SECRET,  // Facebook app secret
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,  // Callback URL for Facebook
      profileFields: ['id', 'displayName', 'emails', 'photos'],  // Optional profile fields
    },
    (accessToken, refreshToken, profile, done) => {
      // Handle Facebook profile
      return done(null, profile);
    }
  )
);

// Apple OAuth Strategy
passport.use(
  new AppleStrategy(
    {
      clientID: process.env.APPLE_CLIENT_ID,  // Apple client ID from Apple Developer Console
      teamID: process.env.APPLE_TEAM_ID,  // Apple team ID
      keyID: process.env.APPLE_KEY_ID,  // Apple key ID
      privateKeyLocation: process.env.APPLE_PRIVATE_KEY_PATH,  // Path to Apple private key
      callbackURL: process.env.APPLE_CALLBACK_URL,  // Callback URL for Apple
    },
    (accessToken, refreshToken, idToken, profile, done) => {
      // Handle Apple profile
      return done(null, profile);
    }
  )
);

// Serialize and Deserialize the user for sessions
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

export default passport;
