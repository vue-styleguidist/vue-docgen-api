import classDisplayNameHandler from './classDisplayNameHandler'
import classMethodHandler from './classMethodHandler'
import classPropHandler from './classPropHandler'
import componentHandler from './componentHandler'
import displayNameHandler from './displayNameHandler'
import extendsHandler from './extendsHandler'
// import eventHandler from './eventHandler'
import methodHandler from './methodHandler'
import mixinsHandler from './mixinsHandler'
import oldEventsHandler from './oldEventsHandler'
import propHandler from './propHandler'
// TODO: add render function slots management here

export default [
  // have to be first if they can be overridden
  extendsHandler,
  // have to be second as they can be overridden too
  mixinsHandler,
  componentHandler,
  displayNameHandler,
  methodHandler,
  propHandler,
  // TODO: uncomment this if @rafaesc is ok with it and fix tests
  // eventHandler,
  classDisplayNameHandler,
  classMethodHandler,
  classPropHandler,
  // at the end extract events from comments
  oldEventsHandler,
]
