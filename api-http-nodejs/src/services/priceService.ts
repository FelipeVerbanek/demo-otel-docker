import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { logger } from '../instrumentation/logger';

export class GrpcClient {
  private static client: any;  // Propriedade estática para armazenar o cliente gRPC

  constructor() {
    // Verifica se o cliente já foi instanciado
    if (!GrpcClient.client) {
      // Carregar o arquivo .proto e configurar o cliente gRPC apenas uma vez
      try {
        const host_grpc = process.env.HOST_GRPC || 'localhost:50051'
        const PROTO_PATH = path.join(__dirname, '../grpc/price.proto');
        const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
          keepCase: true,
          longs: String,
          enums: String,
          defaults: true,
          oneofs: true,
        });
        const proto = grpc.loadPackageDefinition(packageDefinition) as any;
        const myservice = proto.myservice;

        GrpcClient.client =  new myservice.MyService(host_grpc, grpc.credentials.createInsecure());
        logger.logInfo('Cliente gRPC instanciado');
      } catch(error: any) {
        logger.logError('Erro ao montar o client', {error: { message: error.message }})
        throw error
      }
    }
  }

  // Função para fazer a chamada gRPC com o trace_id nos metadados
  public async getPrice(name: string): Promise<any> {
  
    const metadata = new grpc.Metadata();

    return new Promise((resolve, reject) => {
      GrpcClient.client.GetPrice({ name }, metadata, (error: grpc.ServiceError | null, response: any) => {
        if (error) {
            logger.logError('Erro na comunicacao GRPC', {error: { message: error.message }})
          reject(error); // Rejeita a Promise com o erro
          return;
        }
        logger.logInfo('Resposta do servidor:', response.message);
        resolve(response); // Resolve a Promise com a resposta
      });
    });
  }
}