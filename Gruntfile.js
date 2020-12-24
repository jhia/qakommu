const fs = require('fs');
const path = require('path');
const dependencies = require('./package.json').dependencies;

module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);
    
    const ignorePackages = ['app.zip', 'node_modules', '.dockerignore', 'Dockerfile', 'docker-compose.yml', '.git', '.gitignore', 'Gruntfile.js'];

    var dirs = fs.readdirSync(__dirname);

    const foundPackages = ignorePackages.sort();

    if(foundPackages.length > 0 && dirs.length > 0) {
        var lastFound = foundPackages.shift();
        var i = 0;
        var cleanDir = [];
        while(!!lastFound && i < dirs.length) {
            if(dirs[i] !== lastFound) {
                const isDir = fs.statSync(dirs[i]).isDirectory();
                if(isDir) dirs[i] = path.join(dirs[i], '**/*');
                cleanDir.push(dirs[i]);
            }
            if(dirs[i] === lastFound || dirs[i] > lastFound) {
                lastFound = foundPackages.shift();
            }

            i++;
        }
        dirs = cleanDir;
    }

    dirs = dirs.concat(Object.keys(dependencies).map(dep => path.join('node_modules', dep, '**/*')));
  
    grunt.initConfig({
      compress: {
        main: {
          options: {
            archive: 'app.zip',
            pretty: true
          },
          expand: true,
          cwd: './',
          src: dirs,
          dest: './'
        }
      }
    });
  
    grunt.registerTask('default', ['compress']);
  };
  