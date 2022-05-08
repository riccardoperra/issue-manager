const { resolve } = require('path');
const { copyFileSync } = require('fs');

const angularRoot = resolve(__dirname, 'node_modules', '@angular');

const cdkRoot = resolve(angularRoot, 'cdk');
const animationRoot = resolve(angularRoot, 'animations');

// Fix @angular/animation/browser
copyFileSync(
  resolve(animationRoot, 'v13', 'browser', 'package.json'),
  resolve(animationRoot, 'browser', 'package.json')
);

// Fix @angular/cdk/drag-drop
copyFileSync(
  resolve(cdkRoot, 'v13', 'drag-drop', 'package.json'),
  resolve(cdkRoot, 'drag-drop', 'package.json')
);
