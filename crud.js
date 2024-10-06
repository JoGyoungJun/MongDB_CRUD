const mongoose = require('mongoose');
const readline = require('readline');
const mongodb = require('mongodb');

const uri = 'mongodb+srv://yoop80075:whrudwns!048576@cluster0.r9zhf.mongodb.net/';
const mongo = new mongodb.MongoClient(uri);
let connectStatus = false;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function scan(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

let mode = 'main';
let tempMode = '';
let listDatabase = [];
let selectDb = '';
let selectCollection = '';

async function startloop() {
  while(true){
    console.log('현재 모드 : ' + mode);
    switch(mode) {
      case 'main': await handleMain(); break;
      case 'create' : await handleCreate(); break;
      case 'read' : await handleRead(); break;
      case 'update' : await handleUpdate(); break;
      case 'delete' : await handleDelete(); break;
    } 
  }
}
startloop();
async function handleMain() {
  connectStatus = mongoose.connection.readyState === 1 ? true : false;
  console.log(`몽고DB 연결상태 : ${connectStatus ? '연결':'미연결'}`);
  console.log('사용가능 명령어 : 1.connent, 2.create, 3.read, 4.update, 5.delete, 6.exit');
  let input = await scan('');
  input = input.trim();
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

async function handleCreate() {
  console.log('선택된 DB :' + selectDb);
  console.log('선택된 컬렉션 :' + selectCollection);
  console.log('사용가능 명령어 : 1.DB 및 컬렉션 선택 2.한개 생성 3.다수 생성 4.exit');
  let input = await scan('');
  input = input.trim();
  if('' === input){return;}
  if(['1','selectdb'].includes(input)){
    console.log('선택할 DB를 입력해주세요.');
    listDatabase.map((db,i) => {console.log(`${i+1}. ${db}`);})
    let dbNum = await scan('');
    dbNum = dbNum.trim();
      selectDb = listDatabase[dbNum-1];
      let listCollection = (await mongo.db(selectDb).listCollections().toArray()).map((lc)=>{return lc.name;});
      console.log('선택할 컬렉션을 입력해주세요.');
      listCollection.map((db,i) => {console.log(`${i+1}. ${db}`);})
      let colNum = await scan('');
      colNum = colNum.trim();
      selectCollection = listCollection[dbNum-1];
    return;
  }
  if(['2','selectcollection'].includes(input)){mode = 'main'; return;}
  if(['4','exit'].includes(input)){mode = 'main'; return;}
}
async function handleRead() {
    console.log('사용가능 명령어 : 1.listDatabase 2.listCollection 3.find 4.exit');
    let input = await scan('');
    input = input.trim();
    if(['1', 'listdatabase'].includes(input)){
      listDatabase = (await mongo.db().admin().listDatabases()).databases.map((db) => {return db.name;});
      console.log(listDatabase);
    }
    if(['2', 'listcollection'].includes(input)){
      listDatabase.map((db,i) => {console.log(`${i+1}. ${db}`);})
      let dbNum = await scan('');
      dbNum = dbNum.trim();
      let dbname = listDatabase[input-1];
      let listCollection = (await mongo.db(dbname).listCollections().toArray()).map((lc)=>{return lc.name;});
        
      console.log(listCollection);
      return;
    }
    if(['4','exit'].includes(input)){mode = 'main'; return;}
}
async function handleUpdate() {
  if(['4','exit'].includes(input)){mode = 'main'; return;}
}
async function handleDelete() {
  if(['4','exit'].includes(input)){mode = 'main'; return;}
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

