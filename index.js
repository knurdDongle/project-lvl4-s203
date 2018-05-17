import 'babel-polyfill';

import path from 'path';
// import _ from 'lodash';

import Koa from 'koa';
import koaLogger from 'koa-logger';
import bodyParser from 'koa-bodyparser';
import serve from 'koa-static';
import Router from 'koa-router';
import Pug from 'koa-pug';
// import koaWebpack from 'koa-webpack';
import Rollbar from 'rollbar';

import addRoutes from './routes';
import container from './container';
// import webpackConfig from './webpack.config.babel';


export default () => {
  const app = new Koa();

  // app.keys = ['some secret hurr'];
  // app.use(session(app));
  // app.use(flash());

  app.use(bodyParser());
  // method override
  app.use(koaLogger());
  app.use(serve(path.join(__dirname, 'public')));

  // if (process.env.NODE_ENV !== 'production') {
  //   app.use(koaWebpack({ config: webpackConfig }));
  // }

  const router = new Router();
  addRoutes(router, container);
  app.use(router.allowedMethods());
  app.use(router.routes());

  if (process.env.NODE_ENV === 'production') {
    const rollbar = new Rollbar(process.env.ROLLBAR_TOKEN);
    app.on('error', (err, ctx) => {
      console.error(err);
      rollbar.log(err, ctx.request);
    });
  }

  const pug = new Pug({
    viewPath: path.join(__dirname, 'views'),
    basedir: path.join(__dirname, 'views'),
    debug: process.env.NODE_ENV === 'development',
    noCache: process.env.NODE_ENV === 'development',
    // locals: [],
    // helperPath: [
    //   { _ },
    //   { urlFor: (...args) => router.url(...args) },
    // ],
  });
  pug.use(app);

  return app;
};
