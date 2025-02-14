import axios from 'axios';
import opentelemetry from '@opentelemetry/api'

const meter = opentelemetry.metrics.getMeter('cotacao-grpc');


const requestDurationHistogram = meter.createHistogram('http_request_duration_seconds_cotacao', {
  description: 'Duration seconds cotacao',
  unit: 'milliseconds',
  valueType: 1,
  advice: {
    explicitBucketBoundaries: [10, 50, 100, 200,300, 400, 500, 600, 700, 800, 900,1000,2000,3000,4000,5000,6000,7000]
  }
});

export async function getPriceDolar() {
  const cotacao = 'USD'; // Adicionando o parâmetro cotação
  const url = `https://economia.awesomeapi.com.br/json/last/${cotacao}`;

  let status = false
  const startTime = Date.now()

  try {
    const response = await axios.get(url);
    status = true

    return response.data.USDBRL.bid;
  } catch (error: any) {
      

      throw error;
  } finally {
    const endTime = new Date().getTime()
    const executionTime = endTime - startTime

    requestDurationHistogram.record(executionTime, {
      'http.method': 'GET',
      'http.url': url,
      'cotacao': cotacao,
      'status': status ? 'SUCESSO' : 'ERROR'
    })
  }
}
