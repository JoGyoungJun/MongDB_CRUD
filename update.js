const { showDatabase } = require("./read");
const { mongo, scan } = require("./util");

let selectDb = '';
let selectCollection = '';

async function handleUpdate() {
  console.log('선택된 DB : ' + selectDb);
  console.log('선택된 컬렉션 : ' + selectCollection);
  console.log('사용가능 명령어 : 1.select(DB,Collection) 2.updateOne 3.exit');
  let input = await scan('');
  input = input.trim();
  if ('' === input) { return; }
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

  if (['2', 'updateOne'].includes(input)) {
    let client = mongo.db(selectDb).collection(selectCollection);
    console.log('필터할 조건을 입력해주세요.');
    console.log(`ex) { "name": "김이박" }`);
    console.log(`컬렉션 최초 값 : `);
    console.log(await client.findOne({}))
    let filter = await scan('');
    filter = JSON.parse(filter.trim());
    console.log('업데이트 할 내용을 입력해주세요.');
    console.log(`ex) { "$set": { "name": "홍길동" } }`);
    console.log(`$set 미입력시 전체 교체`);
    let update = await scan('');
    update = JSON.parse(update.trim());
    let result = await client.updateOne(filter, update);
    console.log(`일치한 문서 수: ${result.matchedCount}`);
    console.log(`수정된 문서 수: ${result.modifiedCount}`);
    return;
  }
  if (['3', 'exit'].includes(input)) { mode = 'main'; return; }
}

module.exports = {handleUpdate}