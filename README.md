# ko-port

> make sure get an available port on your server

### 支持本地安装

``` bash
$ npm install ko-port
```

### 支持全局安装

``` bash
$ npm install ko-port -g
```

### 支持API

- `asyncPort(port: number): Promise<any>`

识别指定port是否可用，否则递归加1，返回有效port

样例:

``` javascript
var koport = require('ko-port');

koport.asyncPort(3000)
  .then((port) => {
      // 返回有效port
      http.createServer(app).listen(port, function () {
          console.log('listening on port ', port)
      })
  })
  .catch((err) => {
      // 返回err
  });
```

- `killPort(port: number): Promise<any>`

杀死指定的port占用进程

样例:

``` javascript
var koport = require('ko-port');

koport.killPort(3000)
  .then(() => {
      // success
  })
  .catch((err) => {
      // error
  });
```

如果是全局安装：

``` bash
$ koport 3000
```

