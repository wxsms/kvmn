import { app, router, store } from './app'

export default context => {
  // Inject the session user to vuex state
  if (context.user) {
    store.state.user = context.user
  }
  // set router's location
  router.push(context.url)
  // call prefetch hooks on components matched by the route
  return Promise.all(router.getMatchedComponents().map(component => {
    if (component.prefetch) {
      return component.prefetch(store)
    }
  })).then(() => {
    // set initial store on context
    // the request handler will inline the state in the HTML response.
    context.initialState = store.state
    return app
  })
}
