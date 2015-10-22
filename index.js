var REPORT_ENGINE = 'ReportEngine';

var GEN_REPORT_UNIX = 'genReport.sh',
    GEN_REPORT_WIN = 'genReport.bat';

var MODE_RUN = 'run',
    MODE_RENDER = 'render',
    MODE_RUNRENDER = 'runrender';

var os = require('os'),
  path = require('path'),
  fs = require('fs'),
  exec = require('child_process').exec;

var genReportScriptName = /^win/.test(os.platform()) ? GEN_REPORT_WIN : GEN_REPORT_UNIX;

module.exports = function(birtHome, workDir) {
  if (!birtHome || !birtHome.length) {
    throw new Error('No BIRT home specified');
  }

  var genReportScript = path.resolve(birtHome, REPORT_ENGINE, genReportScriptName);
  if (!fs.existsSync(genReportScript)) {
    throw new Error('BIRT genReport script doesn\'t exist: ' + genReportScript);
  }

  var execOptions = {
    env: {
      BIRT_HOME: birtHome
    }
  };
  if (workDir) {
    execOptions.cwd = workDir;
  }

  function execBirt(mode, rptFile, options, callback) {
    var command = '"' + genReportScript + '"';
    command += ' --mode ' + mode;
    for (var option in options) {
      var optionValue = options[option];
      if (typeof(optionValue) == 'object') {
        for (var key in optionValue) {
          command += ' --' + option + ' ' + '"' + key + '=' + optionValue[key] + '"';
        }
      } else {
        command += ' --' + option + ' ' + '"' + optionValue + '"';
      }
    }
    command += ' ' + '"' + rptFile + '"';
    console.log('Executing BIRT Runtime: ' + command);
    return exec(command, execOptions, callback);
  }

  return {
    run: function(rptdesignFile, options, callback) {
      return execBirt(MODE_RUN, rptdesignFile, options, callback);
    },
    render: function(rptdocumentFile, options, callback) {
      return execBirt(MODE_RENDER, rptdocumentFile, options, callback);
    },
    runAndRender: function(rptdesignFile, options, callback) {
      return execBirt(MODE_RUNRENDER, rptdesignFile, options, callback);
    }
  };
};
