const passport = require('koa-passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('mongoose').model('User')

const fetchUser = async (id, usernameOrEmail) => {
  let user
  if (id) {
    user = await User.findById(id)
  } else {
    user = await User.findOne({
      $or: [{
        username: usernameOrEmail.toLowerCase()
      }, {
        email: usernameOrEmail.toLowerCase()
      }]
    })
  }
  return user
}

passport.serializeUser((user, done) => {
  done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await fetchUser(id)
    done(null, user)
  } catch (err) {
    done(err)
  }
})

passport.use(new LocalStrategy(function (usernameOrEmail, password, done) {
  console.log(usernameOrEmail, password)
  fetchUser(null, usernameOrEmail)
    .then((user) => {
      if (!user || !user.authenticate(password)) {
        return done(null, false, {
          message: 'Invalid username or password (' + (new Date()).toLocaleTimeString() + ')'
        })
      }
      return done(null, user)
    })
    .catch((err) => {
      return done(err)
    })
}))

