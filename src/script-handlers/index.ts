import classDisplayNameHandler from './classDisplayNameHandler'
import classMethodHandler from './classMethodHandler'
import classPropHandler from './classPropHandler'
import componentHandler from './componentHandler'
import displayNameHandler from './displayNameHandler'
// import eventHandler from './eventHandler'
import methodHandler from './methodHandler'
import propHandler from './propHandler'
// TODO: add render function slots management here

export default [
  componentHandler,
  displayNameHandler,
  methodHandler,
  propHandler,
  // TODO: uncomment this if @rafaesc is ok with it and fix tests
  // eventHandler,
  classDisplayNameHandler,
  classMethodHandler,
  classPropHandler,
]
