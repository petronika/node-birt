var assert = require('assert'),
    fs = require('fs');

var BIRT_HOME = '/home/tito/app/birt-runtime-4.5.0';
var birt = require('..')(BIRT_HOME);

var REPORT_DIR = __dirname;
var OUTPUT_DIR = __dirname + '/output';

var FORMAT = 'PDF';

var config = {
  resourceDir: REPORT_DIR,  // optional
  tempDir: OUTPUT_DIR       // optional
};

var parameter = {
  param1: 111,
  param2: 222
};

// -----------------------------------------------------------------------------
// (1.1) run - rptdedign -> rptdocument
// -----------------------------------------------------------------------------
birt.run(REPORT_DIR + '/report.rptdesign', {
  output: OUTPUT_DIR + '/1-1 report.rptdocument',
  config: config,
  parameter: parameter
}, function(error, stdout, stderr) {
  console.log('run stdout: ' + stdout);
  console.log('run stderr: ' + stderr);
  if (error !== null) {
    console.log('run error: ' + error);
  } else {
    assert(fs.existsSync(OUTPUT_DIR + '/1-1 report.rptdocument'));
    // -------------------------------------------------------------------------
    // (1.2) render - rptdocument -> PDF/HTML
    // -------------------------------------------------------------------------
    birt.render(OUTPUT_DIR + '/1-1 report.rptdocument', {
      output: OUTPUT_DIR + '/1-2 report.pdf',
      format: FORMAT,
      config: config
    }, function(error, stdout, stderr) {
      console.log('render stdout: ' + stdout);
      console.log('render stderr: ' + stderr);
      if (error !== null) {
        console.log('render error: ' + error);
      } else {
        assert(fs.existsSync(OUTPUT_DIR + '/1-2 report.pdf'));
        // ---------------------------------------------------------------------
        // (2) runAndRender - rptdedign -> PDF/HTML
        // ---------------------------------------------------------------------
        birt.runAndRender(REPORT_DIR + '/report.rptdesign', {
          output: OUTPUT_DIR + '/2 report.pdf',
          format: FORMAT,
          config: config,
          parameter: parameter
        }, function(error, stdout, stderr) {
          console.log('runAndRender stdout: ' + stdout);
          console.log('runAndRender stderr: ' + stderr);
          if (error !== null) {
            console.log('runAndRender error: ' + error);
          } else {
            assert(fs.existsSync(OUTPUT_DIR + '/2 report.pdf'));
          }
        });
      }
    });
  }
});
