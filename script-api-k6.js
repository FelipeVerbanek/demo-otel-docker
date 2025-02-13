import http from 'k6/http';
import { check, sleep } from 'k6';

// Defina o número de usuários virtuais e a duração do teste
export const options = {
  stages: [
    { duration: '2m', target: 1 },   // Sobe para 10 VUs em 2 minutos
    { duration: '3m', target: 20 },   // Aumenta para 50 VUs em 3 minutos
    { duration: '5m', target: 30 },  // Atinge 100 VUs em 5 minutos
    { duration: '3m', target: 20 },   // Reduz para 50 VUs em 3 minutos
    { duration: '2m', target: 10 },   // Volta para 10 VUs em 2 minutos
    { duration: '1m', target: 0 },    // Finaliza o teste
  ],
};

// URL base do serviço
const BASE_URL = 'http://localhost:3000/api';

export default function () {
  // 8. POST /signin - Cadastro de usuário

  let headers = { 'Content-Type': 'application/json' };  
  let payload = JSON.stringify({
    firstName: 'TESTE',
    lastName: 'TESTE',
    age: 10,
  });

  let res = http.post(`${BASE_URL}/signin`, payload, { headers });
  check(res, {
    'status é 201': (r) => r.status === 201,
  });

  const { user } = JSON.parse(res.body)
  console.log(user)
  sleep(1);

//   // 5. PUT /user/1 - Atualizar usuário

  payload = JSON.stringify({
    firstName: 'TESTE',
    lastName: 'TESTE2',
    age: 10,
  });

  res = http.put(`${BASE_URL}/user/${user.id}`, payload, { headers });
  check(res, {
    'status é 200': (r) => r.status === 200,
  });

  sleep(1);

//   // 6. GET /user/3 - Obter usuário com ID 3
  res = http.get(`${BASE_URL}/user/${user.id}`);
  check(res, {
    'status é 200': (r) => r.status === 200,
  });

  sleep(1);

  // 7. GET /users - Listar todos os usuários
  res = http.get(`${BASE_URL}/users`);
  check(res, {
    'status é 200': (r) => r.status === 200,
  });

  sleep(1);

  //   // 1. POST /order - Criar um pedido - gerar erro
  payload = JSON.stringify({
    status: 'pending',
    totalAmount: 'a1',
    customerId: user.id,
  });

  res = http.post(`${BASE_URL}/order`, payload, { headers });
  check(res, {
    'status é 500': (r) => r.status === 500,
  });

  //   // 2. POST /order - Criar um pedido
  payload = JSON.stringify({
    status: 'pending',
    totalAmount: '1',
    customerId: user.id,
  });

  res = http.post(`${BASE_URL}/order`, payload, { headers });
  check(res, {
    'status é 200': (r) => r.status === 201,
  });

  const {order} = JSON.parse(res.body)
  sleep(1);

//   // 1. PUT /order/1 - Atualizar status do pedido
  payload = JSON.stringify({
    status: 'completed',
  });

  res = http.put(`${BASE_URL}/order/${order.id}`, payload, { headers });
  check(res, {
    'status é 200': (r) => r.status === 200,
  });


  sleep(1);

  // 3. GET /order/3 - Obter pedido com ID 
  res = http.get(`${BASE_URL}/order/${order.id}`);
  check(res, {
    'status é 200': (r) => r.status === 200,
  });

  sleep(1);

  // 4. GET /orders - Listar todos os pedidos
  res = http.get(`${BASE_URL}/orders`);
  check(res, {
    'status é 200': (r) => r.status === 200,
  });

  sleep(1);

}
