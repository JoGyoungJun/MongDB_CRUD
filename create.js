const { showDatabase } = require("./read");
const { scan, mongo } = require("./util");

let selectDb = '';
let selectCollection = '';

async function handleCreate() {
  console.log('선택된 DB : ' + selectDb);
  console.log('선택된 컬렉션 : ' + selectCollection);
  console.log('사용가능 명령어 : 1.select(DB,Collection) 2.insertOne 3.exit');
  let input = await scan('');
  input = input.trim();
  if ('' === input) { return; }
  if (['1', 'select'].includes(input)) {
    console.log('선택할 DB를 입력해주세요.');
    console.log('문자열 입력시 신규 생성');
    await showDatabase();
    listDatabase.map((db, i) => { console.log(`${i + 1}. ${db}`); })
    let dbNum = await scan('');
    dbNum = dbNum.trim();
    if (!isNaN(dbNum)) {
      selectDb = listDatabase[dbNum - 1];
    } else {
      selectDb = dbNum;
    }

    let listCollection = (await mongo.db(selectDb).listCollections().toArray()).map((lc) => { return lc.name; });
    console.log('선택할 컬렉션을 입력해주세요.');
    console.log('문자열 입력시 신규 생성');
    listCollection.map((db, i) => { console.log(`${i + 1}. ${db}`); })
    let colNum = await scan('');
    colNum = colNum.trim();
    if (!isNaN(colNum)) {
      selectCollection = listCollection[colNum - 1];
    } else {
      selectCollection = colNum;
    }
    return;
  }

  if (['2', 'insertone'].includes(input)) {
    let client = mongo.db(selectDb).collection(selectCollection);
    console.log('생성할 데이터를 입력해주세요.');
    console.log(`ex) { "name": "김이박", "age": 25, "job": "개발자" }`);
    let insert = await scan('');
    insert = insert.trim();
    let doc = JSON.parse(insert);
    let result = await client.insertOne(doc);
    console.log(`새로운 문서 ID: ${result.insertedId}`);
    return;
  }
  if (['3', 'exit'].includes(input)) { mode = 'main'; return; }
}

module.exports = { handleCreate }