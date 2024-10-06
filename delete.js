const { showDatabase } = require("./read");
const { mongo, scan } = require("./util");

let selectDb = '';
let selectCollection = '';

async function handleDelete() {
  console.log('선택된 DB : ' + selectDb);
  console.log('선택된 컬렉션 : ' + selectCollection);
  console.log('사용가능 명령어 : 1.select(DB,Collection) 2.deleteOne,3.dropDatabase, 4.dropCollection 5.exit');
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

  if (['2', 'deleteOne'].includes(input)) {
    let client = mongo.db(selectDb).collection(selectCollection);
    console.log('필터할 조건을 입력해주세요.');
    console.log(`ex) { "name": "김이박" }`);
    console.log(`컬렉션 최초 값 : `);
    console.log(await client.findOne({}))
    let filter = await scan('');
    filter = JSON.parse(filter.trim());
    let result = await client.deleteOne(filter);
    console.log(`삭제된 문서 수: ${result.deletedCount}`);
    return;
  }
  if (['3', 'dropDatabase'].includes(input)) {
    console.log('동의시 현재 선택된 데이터베이스가 삭제됩니다.');
    console.log(`1. Yes 2. No`);
    let answer = await scan('');
    answer = answer.trim();
    if(['1','yes'].includes(answer)) {
      await mongo.db(selectDb).dropDatabase();
      console.log(`${selectDb} 데이터베이스가 삭제되었습니다.`);
      selectDb = '';
      selectCollection = '';
    }
    return;
  }
  if (['4', 'dropCollection'].includes(input)) {
    let client = mongo.db(selectDb).collection(selectCollection);
    console.log('동의시 현재 선택된 콜렉션이 삭제됩니다.');
    console.log(`1. Yes 2. No`);
    let answer = await scan('');
    answer = answer.trim();
    if(['1','yes'].includes(answer)) {
      await client.drop();
      console.log(`${selectCollection} 콜렉션이 삭제되었습니다.`);
      selectDb = '';
      selectCollection = '';
    }
    return;
  }
  if (['5', 'exit'].includes(input)) { mode = 'main'; return; }
}

module.exports = {handleDelete}