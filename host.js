//引入http模块
let http = require('http');
//引入fs模块
let fs = require('fs');
//引入url模块
const url = require('url');
//开启本地http服务，监听相应端口号
let querystring = require('querystring');

let router = {
  log: {
    handler: function (query,req,res) {


      let queryArr =JSON.parse(query.data);

      console.log.apply(null,queryArr)
      res.end("");
    }
  }
};


http.createServer(function (req, res) {
  let method = req.method.toUpperCase();
  let hostname = req.headers.host;
  let pathname = url.parse(req.url).pathname.substr(1);
  let route = undefined;
  if (router[pathname]){
    route = router[pathname];
  } else{
    return;
  }
  switch (method){
    case 'POST':
      let postData = "";
      req.addListener("data", function (data) {
        postData += data;
      });
      req.addListener("end", function () {
        postData = querystring.parse(postData);
        route.handler(postData,req, res);
        postData = '';
      });
      break;
    case 'GET':
      let query = url.parse(req.url).query;
      query = querystring.parse(query);
      route.handler(query,req, res);
      break;
  }

}).listen(4000);
//读取文件并返回response
function readFileAndResponse(pathname, response) {
  //判断文件是否存在
  fs.readFile(pathname.substr(1), '', function (err, data) {
    //文件不存在或读取错误返回404，并打印page not found
    if (err) {
      response.writeHead(404);
      response.end('page not found');
    }
    else {
      //读取成功返回相应页面信息
      response.end(data);
    }
  });
}