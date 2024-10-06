
let {scan, uri, exit} = require('./util');
const { handleRead } = require('./read');
const { handleCreate } = require('./create');
const { handleUpdate } = require('./update');
const { handleDelete } = require('./delete');
const { handleMain } = require('./main');

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

process.on('SIGINT', async () => {exit();});
