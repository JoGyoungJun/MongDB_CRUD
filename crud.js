const express = require('express');
const app = express();
const mongoose = require('mongoose');
const readline = require('readline');
const mongodb = require('mongodb');
const { boolean } = require('webidl-conversions');

const hostname = '127.0.0.1';
const port = 5500;
const uri = 'mongodb+srv://yoop80075:whrudwns!048576@cluster0.r9zhf.mongodb.net/';
const mongo = new mongodb.MongoClient(uri);
let connectStatus = false;
app.listen(port, hostname, async () => {
  console.log(`서버가 시작되었습니다. http://${hostname}:${port}/`);
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let mode = 'main';

rl.on('line',async (input) => {
  let i = input.trim();
  switch(mode) {
    case 'main': await handleMain(i); break;
    case 'create' : await handleCreate(i); break;
    case 'read' : await handleRead(i); break;
    case 'listCollection' : await hadleListCollection(i); break;
    case 'update' : await handleUpdate(i); break;
    case 'delete' : await handleDelete(i); break;
  } 
  console.log('현재 모드 : ' + mode);
});

async function handleMain(input) {
  connectStatus = mongoose.connection.readyState === 1 ? true : false;
  console.log(`몽고DB 연결상태 : ${connectStatus ? '연결':'미연결'}`);
  console.log('사용가능 명령어 : 1.connent, 2.create, 3.read, 4.update, 5.delete, 6.exit');
  if(['1','connect'].includes(input)) {
      if(connectStatus){
        try {
          await mongoose.disconnect();
          console.log('몽고DB연결을 해제하였습니다.');
        } catch (error) {
          console.log(error);
        }
      }else{
      try {
        await mongoose.connect(uri);
        console.log('몽고DB연결에 성공하였습니다.')
      } catch (error) {
        console.log(error);
      }}
    return;
  }
  if(['2','create'].includes(input)){
    console.log('create모드로 진입합니다.');
    mode = 'create';
    return;
  }
  if(['3','read'].includes(input)){
    console.log('read모드로 진입합니다.');
    mode = 'read';
    return;
  }
  if(['4','update'].includes(input)){
    console.log('update모드로 진입합니다.');
    mode = 'update';
    return;
  }
  if(['5','delete'].includes(input)){
    console.log('delete모드로 진입합니다.');
    mode = 'delete';
    return;
  }
  if(['6','exit'].includes(input)){await exit();}
  console.log(`없는 명령어 입니다. : ${input}`)
  }

async function handleCreate(input) {
  if(['4','exit'].includes(input)){mode = 'main'; return;}
}
async function handleRead(input) {
    console.log('사용가능 명령어 : 1.listDatabase 2.listCollection 3.find 4.toMain');
    if(['1', 'listdatabase'].includes(input)){
      let listDatabase = await mongo.db().admin().listDatabases();
      console.log(listDatabase.databases.map((db) => {return db.name;}));
    }
    if(['2', 'listcollection'].includes(input)){
      mode = 'listCollection';
      return;
    }
    if(['4','exit'].includes(input)){mode = 'main'; return;}
}
async function handleUpdate(input) {
  if(['4','exit'].includes(input)){mode = 'main'; return;}
}
async function handleDelete(input) {
  if(['4','exit'].includes(input)){mode = 'main'; return;}
}

async function hadleListCollection(input) {
  console.log('사용가능 명령어 : 일반 입력 DB이름, 1.exit 돌아가기');
  if('' === input){return;}
  if(['1','exit'].includes(input)){mode = 'read'; return;}
  let dbname = input;
  let listCollection = await mongo.db(input).listCollections().map((lc)=>{return lc.name});
    
  console.log(listCollection);
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

process.on('SIGINT', async () => {exit();});

// switch (input.trim()) {
//   case 'connent':
//     if (mongoose.connection.readyState === 1) {
//       console.log('이미 몽고DB와 연결되어있습니다.');
//       break;
//     } else {
//       try {
//         await mongoose.connect(url);
//         console.log('몽고DB연결에 성공하였습니다.');
//       } catch (error) {
//         console.error('연결에 실패하였습니다. :', error);
//       }
//     };
//     break;

//   case 'disconnent':
//     await mongoose.disconnect();
//     console.log(`몽고DB와의 연결을 해제하였습니다.`);
//     break;

//   case 'create':
//     console.log(`create를 입력했습니다.`);
//     break;

//   case 'read':
//     console.log(`read를 입력했습니다.`);
//     break;

//   case 'update':
//     console.log(`update를 입력했습니다.`);
//     break;

//     case 'list':
//       const adminDb = mongo.db().admin();
//       let dbs = await adminDb.listDatabases();
//       console.log('현재 데이터베이스 목록:');
//       dbs.databases.forEach(db => console.log(` - ${db.name}`));
//       break;

//   case 'delete':
//     console.log(`delete를 입력했습니다.`);
//     break;
//   case 'costom':
//     console.log(`delete를 입력했습니다.`);
//     break;
//   case 'help':
//     console.log(`${help}`);
//     break;


// }


