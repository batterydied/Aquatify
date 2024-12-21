import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as OAuth2Strategy } from 'passport-oauth2';
import bcrypt from 'bcryptjs';
import UserModel from './models/UserModel'; 

// Local strategy for username/password authentication
passport.use(
  new LocalStrategy(async (email, password, done) => {
    try {
      const user = await UserModel.models.User.findOne({ where: { email } });
      if (!user) {
        return done(null, false, { message: 'Invalid email or password' });
      }

      // Compare hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: 'Invalid email or password' });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

// passport.use(
//   'google',
//   new OAuth2Strategy(
//     {
//       authorizationURL: 'https://accounts.google.com/o/oauth2/auth',
//       tokenURL: 'https://accounts.google.com/o/oauth2/token',
//       clientID: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your client ID
//       clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET', // Replace with your client secret
//       callbackURL: 'http://localhost:5000/auth/google/callback', // Your callback URL
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const user = await UserModel.models.User.findOrCreate({
//           where: { email: profile.emails[0].value },
//           defaults: {
//             name: profile.displayName,
//             email: profile.emails[0].value,
//             avatar: profile.photos ? profile.photos[0].value : null,
//           },
//         });

//         return done(null, user[0]);
//       } catch (err) {
//         return done(err);
//       }
//     }
//   )
// );

// Serialize user information into session
passport.serializeUser((user, done) => {
  done(null, user.id); // Store only the user ID in the session for efficiency
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.models.User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
