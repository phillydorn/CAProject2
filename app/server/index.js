const Webpack_isomorphic_tools = require('webpack-isomorphic-tools');

const project_base_path = require('path').resolve(__dirname, '..');

global.webpack_isomorphic_tools = new Webpack_isomorphic_tools(require('../../webpack-isomorphic-tools-configuration'))
  .server(project_base_path, () => {
    require('./server.js');
  });
