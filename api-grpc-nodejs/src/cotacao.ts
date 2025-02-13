import axios from 'axios';

export async function getPriceDolar() {
  const cotacao = 'USD'; // Adicionando o parâmetro cotação
  const url = `https://economia.awesomeapi.com.br/json/last/${cotacao}`;

  try {
    const response = await axios.get(url);

    return response.data.USDBRL.bid;
  } catch (error: any) {
      

      throw error;
  }
}
