const mongoose = require('mongoose');
const readline = require('readline');
const mongodb = require('mongodb');

const uri = 'mongodb+srv://yoop80075:whrudwns!048576@cluster0.r9zhf.mongodb.net/';
const mongo = new mongodb.MongoClient(uri);

global.listDatabase = [];
global.mode = 'main';
global.connectStatus = false;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function scan(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function exit() {
  if(connectStatus){
    await mongoose.disconnect();
  console.log(`몽고DB와의 연결을 해제하였습니다.`);
  console.log('정상적으로 종료되었습니다.');
  process.exit(0);
} else {
  console.log('정상적으로 종료되었습니다.');
  process.exit(0);
}
}

module.exports = {scan, mongo, uri, exit}

