import http from 'http';
import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import ejs from 'ejs';
import reload from 'reload';
import apiRouter from './api/apiRouter';

let app = express();
let port = process.env.npm_package_config_port || 3000;
let isProduction = process.env.NODE_ENV == 'production';

// view engine setup
// app.set('views', path.join(__dirname, './client/dist'));
app.set('views', path.join(__dirname, './public'));
app.set('view engine', 'html'); // 将模板设置为html
app.engine('html', ejs.renderFile); 
app.use(express.static(path.join(__dirname, '../client/dist'))); // 静态文件夹指向前端打包生成文件夹，在请求 http://localhost:3001/main.css... 的时候就会去查找本地文件夹

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// 路由api
app.use('/api', apiRouter);

//除了api请求，其他请求像浏览器返回index.html
app.use('*', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
})


// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('404 Not Found');
  err.status = 404;
  res.status(404);
  res.sendFile(path.join(__dirname, './404.html'));
  // next(err);
  console.log(err);
});

if(isProduction) {
  // production error handler
  // no stacktraces leaked to user
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });

  app.listen(port, (err) => {
    if(err) {
      console.log(`err: ${err}`);
    } else {
      console.log(`server is running on port: ${port}`);
    }
  });
} else {
  // development error handler
  // will print stacktrace
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });

  let server = http.createServer(app);
  reload(server, app);
  server.listen(port, (err) => {
    if(err) {
      console.log(`err: ${err}`);
    } else {
      console.log(`server is running on port(dev): ${server.address().port}`);
    }
  });
}


export default app;
