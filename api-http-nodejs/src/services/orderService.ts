import { UserService } from "../services/userService";
import { prisma } from '../database/prisma';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../instrumentation/logger';
import { GrpcClient } from './priceService'
export class OrderService {
    private grpcClient;
    constructor() {
        this.grpcClient = new GrpcClient();
    }
    async create(order: any) {
        try {
            const user = new UserService();
            logger.logInfo('buscando usuario', { userId: order.customerId })

            const consumer = await user.findById(order.customerId);

            if (!consumer) {
                throw new Error("Cliente não encontrado");
            }

            logger.logInfo('Buscando cotacao')
            const response = await this.grpcClient.getPrice('USD')
            const price = (order.totalAmount * response.message)

            logger.logInfo('criando pedido', { userId: order.customerId })
            const newOrder = await prisma.orders.create({
                data: {
                    orderNumber: uuidv4(),
                    status: order.status,
                    totalAmount: price,
                    customerId: consumer.id,
                },
            });

            logger.logInfo('pedido criado', { orderId: newOrder.id })

            return newOrder;
        }catch(error: any) {
            logger.logError('Erro ao criar ordem', {error: { message: error.message }})
            throw error
        }
    }

    async list() {
        try {
            logger.logInfo('listando usuarios')
            const allOrders = await prisma.orders.findMany();
            return allOrders;
        }catch(error: any) {
            logger.logError('Erro ao listar pedidos', {error: { message: error.message }})
            throw error
        }
    }

    async findById(id: number) {
        try {
            logger.logInfo('Buscando pedido', { orderId: id })
            const order = await prisma.orders.findUnique({
                where: { id: Number(id) },
            });
            return order;
        } catch(error: any) {
            logger.logError('Erro ao buscar pedidos', { error: { message: error.message }})
            throw error
        }
    }

    async update(id: number, status: 'pending' | 'completed' | 'cancelled') {
        try {
            logger.logInfo('Alterando pedido', { orderId: id })
            const updatedOrder = await prisma.orders.update({
                where: { id: Number(id) },
                data: { status },
            });

            return updatedOrder;            
        } catch(error: any) {
            logger.logError('Erro ao buscar pedidos', { error: { message: error.message }})
            throw error
        }
    }
}
