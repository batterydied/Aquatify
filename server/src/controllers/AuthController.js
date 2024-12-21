import passport from 'passport';

class AuthController {
  // Google login route
  async googleLogin(req, res, next) {
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
  }

  // Google callback route
  async googleCallback(req, res, next) {
    passport.authenticate('google', { failureRedirect: '/login' }, (err, user, info) => {
      if (err || !user) {
        return res.status(400).json({ message: 'Authentication failed', error: err || info });
      }
      // Successful login
      return res.status(200).json({ message: 'Google Authentication successful', user });
    })(req, res, next);
  }

  // Facebook login route
  async facebookLogin(req, res, next) {
    passport.authenticate('facebook', { scope: ['email'] })(req, res, next);
  }

  // Facebook callback route
  async facebookCallback(req, res, next) {
    passport.authenticate('facebook', { failureRedirect: '/login' }, (err, user, info) => {
      if (err || !user) {
        return res.status(400).json({ message: 'Authentication failed', error: err || info });
      }
      // Successful login
      return res.status(200).json({ message: 'Facebook Authentication successful', user });
    })(req, res, next);
  }

  // Apple login route
  async appleLogin(req, res, next) {
    passport.authenticate('apple')(req, res, next);
  }

  // Apple callback route
  async appleCallback(req, res, next) {
    passport.authenticate('apple', { failureRedirect: '/login' }, (err, user, info) => {
      if (err || !user) {
        return res.status(400).json({ message: 'Authentication failed', error: err || info });
      }
      // Successful login
      return res.status(200).json({ message: 'Apple Authentication successful', user });
    })(req, res, next);
  }
}

export default new AuthController();
