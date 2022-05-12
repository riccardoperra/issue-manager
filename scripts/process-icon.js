const glob = require('glob');

const scripts = require('@taiga-ui/icons/scripts');
const path = require('path');

glob('./src/assets/icons/**/*.svg', {}, (_err, files) => {
  console.log(files);
  scripts.processIcons(files);
});
