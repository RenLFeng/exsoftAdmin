


const ws = require('nodejs-websocket');
const htpp = require('http');
//const server = http.createServer();

//封装发送消息的函数(向每个链接的用户发送消息)
const boardcast = (str)=>{
    console.log(str);
  server.connections.forEach((connect)=>{
      connect.sendText(str)
  })
};

//封装获取所有聊天者的nickname
const getAllChatter = ()=>{
      let chartterArr = [];
      server.connections.forEach((connect)=>{
          chartterArr.push({name:connect.nickname})
      });
    return chartterArr;
};

const server = ws.createServer((connect)=>{

     //链接上来的时候
      connect.on('text',(str)=>{
          let data = JSON.parse(str);
          console.log(data);
          switch (data.type)
          {
              case 'setName':
                  connect.nickname = data.nickname;
                  boardcast(JSON.stringify({
                      type:'serverInformation',
                      message:data.nickname+"进入房间",
                  }));

                  boardcast(JSON.stringify({
                      type:'chatterList',
                      list:getAllChatter()
                  }));
                  break;
              case 'chat':
                  boardcast(JSON.stringify({
                      type:'chat',
                      name:connect.nickname,
                      message: data.message
                  }));
                  break;
              default:
                  break;
          }
      });

      //关闭链接的时候
    connect.on('close',()=>{

        //离开房间
        boardcast(JSON.stringify({
            type:'serverInformation',
            message:connect.nickname+'离开房间'
        }));

        //从在线聊天的人数上面除去
        boardcast(JSON.stringify({
            type:'chatterList',
            list: getAllChatter()
        }))
    });

    //错误处理
    connect.on('error',(err)=>{
        console.log(err);
    })

}).listen(8088,()=>{
    console.log("running")
});








// var ws = require('nodejs-websocket');
// var port=8088
// var server = ws.createServer(function(conn){
//     //受到连接触发//
// //在服务端cmd安装npm install nodejs-websocket//
//     console.log('new connection');
//     conn.on("text",function(str){
//         // 收到信息触发     接收 //
//         console.log("收到信息触发接收"+str)
//         boardcast(str) // 广播消息 //
//         conn.sendText(str) // 发送 数据 //
//     })
//     conn.on("close",function(code,reason){
//         // 断开连接触发 //
//         console.log("断开连接触发",code)
//     })
//     conn.on("error",function(err){
//         // 出错触发 //
//         console.log("header err")
//         console.log(err)
//     })
//     function boardcast(str){  // 广播 //
//     // server.connections  保存每个连接进来的用户 //
//     server.connections.forEach(function(conn){   //  .forEach 是调用数组里每个元素  //
//     conn.sendText(str)
//     })
//     }
// }).listen(port)
// console.log("websocket server listen port is" + port)
