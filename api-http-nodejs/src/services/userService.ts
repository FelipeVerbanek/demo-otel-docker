import { prisma } from '../database/prisma';
import { logger } from '../instrumentation/logger';
export class UserService {

    async create(user: any) {
        try {
            logger.logInfo('Criando usuario', {
                firstName: user.firstName,
                lastName: user.lastName,
                age: user.age
            })


            const newUser = await prisma.users.create({
                data: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    age: user.age,
                },
            });
    
            return newUser;
        }catch(error: any){
            logger.logError('Erro ao criar usuario', {error: { message: error.message }})
            throw error
        }
    }


    async list() {
        try{
            logger.logInfo('Listando usuarios!')
            const allUsers = await prisma.users.findMany(); // Retorna todos os usuários
            return allUsers;
        } catch(error: any){
            logger.logError('Falha ao listar usuários', {error: { message: error.message }})
            throw error
        }
    }


    async findById(id: number) {
        try {
            logger.logInfo('Buscando usuarios!', { userId: id })
            const user = await prisma.users.findUnique({
                where: {
                    id: Number(id),
                },
            });

            return user;
        } catch (error: any) {
            logger.logError('Falha ao buscar usuário', { userId: id, error: { message: error.message }})
            throw error;
        }
    }

    async update(id: number, body: any) {
        try{
            const { firstName, lastName, age } = body;

            logger.logInfo('Buscando usuario para update')
            const userToUpdate = await prisma.users.findUnique({
                where: {
                    id,
                },
            });

            if (!userToUpdate) {
                throw new Error("Usuário não encontrado!");
            }

            
            logger.logInfo('Alterando usuario', { userId: id })
            const updatedUser = await prisma.users.update({
                where: {
                    id,
                },
                data: {
                    firstName,
                    lastName,
                    age,
                },
            });

            return updatedUser;
        }catch(error: any) {
            logger.logError('Falha ao alterar usuario', { userId: id, error: { message: error.message }})
            throw error;
        }
    }
}
