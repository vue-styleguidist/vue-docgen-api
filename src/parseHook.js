const hooks = require('require-extension-hooks');
hooks('vue').plugin('vue').push();
hooks(['vue', 'js']).plugin('babel').push();

let component = require('../tests/components/render-ts.vue');

console.log(component);
