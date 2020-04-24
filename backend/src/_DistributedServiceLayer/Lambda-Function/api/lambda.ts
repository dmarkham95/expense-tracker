import { NestFactory } from '@nestjs/core';
import { APIGatewayEvent, Context, Handler } from 'aws-lambda';
import * as serverless from 'aws-serverless-express';
//import { createServer, proxy } from 'aws-serverless-express';
import { eventContext } from 'aws-serverless-express/middleware';
import { Server } from 'http';
import env_variables from '_Common/env_variables';
import { AllExceptionsFilter } from '_Common/Filters/Exception.filter';
import { waitForLogger } from '_Common/Logger';
import { ApiDDBModule } from '_DistributedServiceLayer/API/api.ddb.module';
//import { ApiModule } from '../API/api.module';
// NOTE: If you get ERR_CONTENT_DECODING_FAILED in your browser, this is likely
// due to a compressed response (e.g. gzip) which has not been handled correctly
// by aws-serverless-express and/or API Gateway. Add the necessary MIME types to
// binaryMimeTypes below
const binaryMimeTypes: string[] = [];

let cachedServer: Server;
const expressApp = require('express')();

async function bootstrapServer(): Promise<any> {
  return NestFactory.create(ApiDDBModule, expressApp, {
    bodyParser: true,
    logger: env_variables.isDev ? undefined : false,
  })
    .then(app => {
      app.use(eventContext());
      app.useGlobalFilters(new AllExceptionsFilter());
      app.setGlobalPrefix('api');
      app.enableCors();
      return app.init();
    })
    .then(() => {
      return serverless.createServer(expressApp);
    });
}

export const handler: Handler = async (event: APIGatewayEvent, context: Context) => {
  // context.callbackWaitsForEmptyEventLoop = false;
  context.succeed = succeedWaitsLogger(context.succeed);
  if (!cachedServer) {
    cachedServer = await bootstrapServer();
  }
  return serverless.proxy(cachedServer, event, context, 'PROMISE').promise;
};

function succeedWaitsLogger(succeed: Context['succeed']): Context['succeed'] {
  return (messageObject: any) => {
    waitForLogger()
      .then(() => {
        succeed(messageObject);
      })
      .catch(error => {
        succeed(messageObject);
      });
  };
}








// process.on('unhandledRejection', reason => {
//   console.error(reason);
// });

// process.on('uncaughtException', reason => {
//   console.error(reason);
// });

// async function bootstrapServer(): Promise<Server> {
//   if (!cachedServer) {
//     try {
//       const expressApp = require('express')();
//       const nestApp = await NestFactory.create(ApiModule, expressApp);
//       nestApp.use(eventContext());
//       nestApp.setGlobalPrefix('api');
//       await nestApp.init();
//       cachedServer = createServer(expressApp, undefined, binaryMimeTypes);
//     } catch (error) {
//       return Promise.reject(error);
//     }
//   }
//   return Promise.resolve(cachedServer);
// }

// export const handler: Handler = async (event: any, context: Context) => {
//   console.log('inside handler event', JSON.stringify(event));
//   cachedServer = await bootstrapServer();
//   return proxy(cachedServer, event, context, 'PROMISE').promise;
// };
