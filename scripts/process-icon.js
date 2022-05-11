const glob = require('glob');

const scripts = require('@taiga-ui/icons/scripts');
const path = require('path');

glob('./scripts/icons/**/*.svg', {}, (_err, files) => {
  scripts.processIcons(files);
});
