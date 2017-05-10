const getUserJson = (ctx) => {
  let user = null
  if (ctx.state.user) {
    user = ctx.state.user.toJSON()
    delete user.password
    delete user.salt
  }
  return user
}

const isLogin = (ctx) => {
  return !!ctx.state.user
}

module.exports = {getUserJson, isLogin}
