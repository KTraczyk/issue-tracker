import bodyParser from 'koa-bodyparser';
import { oas } from 'koa-oas3';
import Koa from 'koa';
import logger from 'koa-logger';
import { router } from './router';
import { Config } from './config';
import { createErrorMiddleware } from './middlewares';

(async function () {
  const oasMw = await oas({
    file: `${__dirname}/../specs/openapi.yaml`,
    endpoint: '/openapi.json',
    uiEndpoint: '/',
  });

  const app = new Koa();

  app
    .use(bodyParser())
    .use(logger())
    .use(createErrorMiddleware())
    .use(oasMw)
    .use(router.routes())
    .use(router.allowedMethods());

  app.listen(Config.PORT, () => console.log(`Server is running on port ${Config.PORT} 🚀`));
})();
