const { scan, mongo } = require("./util");

let selectDb = '';
let selectCollection = '';

async function handleRead() {
  console.log('선택된 DB : ' + selectDb);
  console.log('선택된 컬렉션 : ' + selectCollection);
  console.log('사용가능 명령어 : 1.select(DB,Collection), 2.listDatabase 3.listCollection 4.findOne 5.exit');
  let input = await scan('');
  input = input.trim();

  if (['1', 'select'].includes(input)) {
    console.log('선택할 DB를 입력해주세요.');
    await showDatabase();
    listDatabase.map((db, i) => { console.log(`${i + 1}. ${db}`); })
    let dbNum = await scan('');
    dbNum = dbNum.trim();
    selectDb = listDatabase[dbNum - 1];

    let listCollection = (await mongo.db(selectDb).listCollections().toArray()).map((lc) => { return lc.name; });
    console.log('선택할 컬렉션을 입력해주세요.');
    listCollection.map((db, i) => { console.log(`${i + 1}. ${db}`); })
    let colNum = await scan('');
    colNum = colNum.trim();
    selectCollection = listCollection[colNum - 1];
    return;
  }

  if(['2', 'listdatabase'].includes(input)){
    await showDatabase();
    console.log(listDatabase);
    return;
  }
  if(['3', 'listcollection'].includes(input)){
    listDatabase.map((db,i) => {console.log(`${i+1}. ${db}`);})
    let dbNum = await scan('');
    dbNum = dbNum.trim();
    let dbname = listDatabase[dbNum-1];
    let listCollection = (await mongo.db(dbname).listCollections().toArray()).map((lc)=>{return lc.name;});
    console.log(listCollection);
    return;
  }
  if(['4', 'findone'].includes(input)){
    let client = mongo.db(selectDb).collection(selectCollection);
    console.log('필터할 조건을 입력해주세요.');
    console.log(`ex) { "name": "김이박" }`);
    console.log(`컬렉션 최초 값 : `);
    console.log(await client.findOne({}))
    let filter = await scan('');
    if(filter === ''){return;}
    filter = JSON.parse(filter.trim());
    console.log(await client.findOne(filter))
    return;
  }
  if(['5','exit'].includes(input)){mode = 'main'; return;}
}

async function showDatabase() {
  listDatabase = (await mongo.db().admin().listDatabases()).databases.map((db) => {return db.name;});
}

module.exports = {handleRead, showDatabase}

