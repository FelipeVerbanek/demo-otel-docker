import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateUserAndOrderTables1669999999999 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Criação da tabela 'users'
        await queryRunner.createTable(
            new Table({
                name: 'users',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'firstName',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'lastName',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'age',
                        type: 'int',
                        isNullable: false,
                    },
                    {
                        name: 'createdAt',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'updatedAt',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                        onUpdate: 'CURRENT_TIMESTAMP',
                    },
                ],
            }),
            true
        );

        // Criação da tabela 'orders'
        await queryRunner.createTable(
            new Table({
                name: 'orders',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'orderNumber',
                        type: 'varchar',
                        isUnique: true,
                        isNullable: false,
                    },
                    {
                        name: 'totalAmount',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                        isNullable: false,
                    },
                    {
                        name: 'status',
                        type: 'enum',
                        enum: ['pending', 'completed', 'cancelled'],
                        default: `'pending'`,
                    },
                    {
                        name: 'createdAt',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'updatedAt',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                        onUpdate: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'customerId',
                        type: 'int',
                        isNullable: true,
                    },
                ],
            }),
            true
        );

        // Criação da chave estrangeira entre 'orders' e 'users'
        await queryRunner.createForeignKey(
            'orders',
            new TableForeignKey({
                columnNames: ['customerId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'SET NULL',
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove chave estrangeira e tabelas
        const table = await queryRunner.getTable('orders');
        const foreignKey = table!.foreignKeys.find(fk => fk.columnNames.indexOf('customerId') !== -1);
        if (foreignKey) {
            await queryRunner.dropForeignKey('orders', foreignKey);
        }

        await queryRunner.dropTable('orders');
        await queryRunner.dropTable('users');
    }
}
