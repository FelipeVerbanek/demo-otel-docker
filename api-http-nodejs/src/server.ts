import express from 'express'
import dotenv from "dotenv";
import { otelSetup } from './instrumentation/otel'
otelSetup()

import { Router as userRouter } from "./routers/user";
import { Router as orderRouter } from "./routers/order";
import { prisma } from './database/prisma'



async function main(){
  dotenv.config();
  const app = express();
  const port = process.env.PORT || 3000;
  
  app.use(express.json());
  app.use("/api", userRouter);
  app.use("/api", orderRouter);
  
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

main()
.then(async () => {
  await prisma.$connect();
})
.catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});  