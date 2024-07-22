const passport = require("passport");
const { ExtractJwt, Strategy: JwtStrategy } = require("passport-jwt");
const User = require("../models/usersSchema");

function setJWTStrategy() {
  const secret = process.env.SECRET;
  const params = {
    secretOrKey: secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  };
  passport.use(
    new JwtStrategy(params, async function (payload, done) {
      try {
        const user = await User.findOne({ _id: payload.id }).lean();
        if (!user) {
          return done(new Error("User not found."));
        }
        return done(null, user);
      } catch (e) {
        return done(e);
      }
    })
  );
}
module.exports = setJWTStrategy;
