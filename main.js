'use strict';
var path = require('path');
var fs = require('fs');
function copyFileSync( source, target ) {

    var targetFile = target;

    // If target is a directory, a new file with the same name will be created
    if ( fs.existsSync( target ) ) {
        if ( fs.lstatSync( target ).isDirectory() ) {
            targetFile = path.join( target, path.basename( source ) );
        }
    }

    fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function getUmaKey(platform){
  try {
    let data = JSON.parse(fs.readFileSync(path.join(Editor.Project.path,"settings","uma.json")));
    for (let i = 0; i < data.length; i++) {
      const it = data[i];
      if(it.platform == platform)
        // return it.umakey;  //改为项目中初始化
        return it.enable;
    }
  } catch (error) {
    return false;  
    // return undefined;
  }
}

function doUma(options,callback){

  let umaKey = getUmaKey(String(options.actualPlatform))
  if(!umaKey) {callback();return;}
  
  copyFileSync(path.join(__dirname,"uma.min.js"),path.join(options.dest));
  
  let buffer = fs.readFileSync(path.join(options.dest,"main.js"));
  
  let umaFileName = "uma.min.js"

  // let umaCode = `
  //   const uma = require("./${umaFileName}");
  //   console.log("require uma finished");
  //   uma.init({
  //     appKey:"${umaKey}",
  //     useOpenid:false,
  //     debug:false
  //   })
  // `  
  let umaCode = `const uma = require("./${umaFileName}");
  console.log("require uma finished");
  `;
  fs.writeFileSync(path.join(options.dest,"main.js"),umaCode + buffer.toString());
  Editor.success("uma finished")
  callback();
}


function onBeforeBuildFinish (options, callback) {
  Editor.log('Building ' + options.platform + ' to ' + options.dest);  
  doUma(options,callback)
}

module.exports = {
    load () {
        Editor.Builder.on('before-change-files', onBeforeBuildFinish);
    },

    unload () {
        Editor.Builder.removeListener('before-change-files', onBeforeBuildFinish);
    },
    messages: {
      'uma-setting' () {
        Editor.Panel.open('importuma');
      }
    },
};