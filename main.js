const mongoose = require('mongoose');
let {scan, uri, exit} = require('./util');

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

module.exports = {handleMain}