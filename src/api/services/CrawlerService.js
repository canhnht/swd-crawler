import {exec} from 'child_process';
import psTree from 'ps-tree';
import HTTPError from 'http-errors';
import CrawlerStatus from '../../common/models/CrawlerStatus';


// ------------------------------------
// Exports
// ------------------------------------

export default {
  startCrawler,
  stopCrawler,
  getCrawlerStatus
};


// ------------------------------------
// Private
// ------------------------------------

let crawlerPID = null;

const kill = function (pid, signal, callback) {
  signal = signal || 'SIGKILL';
  callback = callback || function() {};
  psTree(pid, function (err, children) {
    [pid].concat(children.map((p) => p.PID))
      .forEach((tpid) => {
        console.log(`tpid ${tpid}`);
        try {
          process.kill(tpid, signal);
        } catch (ex) {}
      });
    callback();
  });
};


// ------------------------------------
// Public
// ------------------------------------

function startCrawler() {
  if (crawlerPID !== null) {
    console.log('Already running');
    return crawlerPID;
  }
  let child = exec('babel-node ./src/crawler');
  child.stdout.on('data', function(data) {
    console.log('stdout: ' + data);
  });
  child.stderr.on('data', function(data) {
    console.log('stderr: ' + data);
  });
  child.on('close', function(code) {
    console.log('closing code: ' + code);
    crawlerPID = null;
  });
  crawlerPID = child.pid;
  return crawlerPID;
}

function stopCrawler() {
  if (crawlerPID === null) return null;
  var isWin = /^win/.test(process.platform);
  if (!isWin) {
    kill(crawlerPID);
  } else {
    exec('taskkill /PID ' + crawlerPID + ' /T /F', (error, stdout, stderr) => {
      console.log('Crawler Output: ' + stdout);
      console.log('Crawler Error: ' + stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
      }
    });
  }
  let pid = crawlerPID;
  crawlerPID = null;
  return pid;
}

function getCrawlerStatus() {
  if (crawlerPID !== null) return CrawlerStatus.Running;
  else return CrawlerStatus.Stopped;
}
