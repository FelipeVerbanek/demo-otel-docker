import { otelSetup } from './infra/otel'
//otelSetup()
import dotenv from "dotenv";
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { Redis } from 'ioredis'
import path from 'path';
import { logger } from './infra/logger';
import { getPriceDolar } from './cotacao'

const redis = new Redis({
    host: process.env.REDIS || 'localhost',
    port: 6379,
    password: '',
    db: 0
  });

const PROTO_PATH = path.join(__dirname, 'service.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const proto = grpc.loadPackageDefinition(packageDefinition) as any;
const myservice = proto.myservice;

// Exemplo instrumentação manual
async function setPriceRedis(price: string) {

    try {
        await redis.set('USD', price, 'EX', 10);
    } catch (error: any) {
        
        logger.logError('Falha ao salvar preco no Redis', { error: { message: error.message } });
        
        throw error;
    }
}

async function getPriceRedis() {
    try {
        const value = await redis.get('USD');
        return value
    } catch (error: any) {
        logger.logError('Falha buscar preco redis', {error: { message: error.message }})
        throw error
    }    
}

async function getPrice(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>): Promise<void> {
  const responseMessage = `${call.request.name}!`;

  const price = await getPriceRedis()
  if (!price) {
    logger.logInfo(`buscando cotacao ${responseMessage}`)
    const response = await getPriceDolar()
    await setPriceRedis(response)

    callback(null, { message: response });
  }else {
    logger.logInfo(`Cotacao redis $${price}`)
    callback(null, { message: price });
  }
}

function main(): void {
    dotenv.config()
    const server = new grpc.Server();
    const host = process.env.GRPC_HOST
    server.addService(myservice.MyService.service, { GetPrice: getPrice });
    
    server.bindAsync(host || '0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), (err, port) => {
      if (err) {
        logger.logError(`Failed to start server`, {error: { message: err.message }})
        return;
      }
      logger.logInfo(`Servidor gRPC rodando na porta ${port}`)
    });
}

main();
