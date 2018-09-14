import vm from 'vm'

function clone(obj) {
  if (null == obj || 'object' != typeof obj) return obj
  var copy = obj.constructor()
  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr]
  }
  return copy
}

module.exports = function evalComponentCode(code) {
  try {
    const script = new vm.Script(code, {})

    // Fake require
    function fakeRequire() {}
    fakeRequire.default = fakeRequire

    let requireSanbox = function(element) {
      // depending on the preset that one is running,
      // babel will not always use the root interopRequireDefault
      // for babel es6, it uses .../builtin/es6/interop...
      if (/@babel\/runtime\/helpers\/.*interopRequireDefault$/.test(element)) {
        return function(value) {
          return value
        }
      }
      if (element === 'vuex') {
        const outputVuex = {
          mapState: function() {},
          mapMutations: function() {},
          mapGetters: function() {},
          mapActions: function() {},
          createNamespacedHelpers: function() {},
        }
        return {
          ...outputVuex,
          default: outputVuex,
        }
      }
      if (element === 'vue') {
        const outputVue = {
          __esModule: true,
          use: function use() {},
          directive: function use() {},
          component: function component() {},
          extended: function extended() {},
          extend(obj) {
            return obj
          },
        }
        return {
          ...outputVue,
          default: outputVue,
        }
      }
      return fakeRequire
    }
    requireSanbox.context = function() {
      return function() {}
    }
    const sandbox = {
      exports: {},
      module: {
        exports: {},
      },
      require: requireSanbox,
      document: {},
      window: {
        location: {},
      },
      alert() {},
      confirm() {},
      console: {
        log() {},
        debug() {},
      },
      sessionStorage: {
        getItem() {},
        setItem() {},
        removeItem() {},
      },
      localStorage: {
        getItem() {},
        setItem() {},
        removeItem() {},
      },
    }
    const context = new vm.createContext(sandbox)
    script.runInContext(context)
    const output = sandbox
    return clone(output)
  } catch (err) {
    throw err
  }
}
