import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, BaseEntity } from 'typeorm';
import { User } from './User'; // Assumindo que você tenha um modelo de usuário para associar o pedido a um cliente.

@Entity('orders')
export class Order extends BaseEntity{
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  orderNumber!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount!: number;

  @Column({ default: 'pending' })
  status!: 'pending' | 'completed' | 'cancelled';

  @ManyToOne(() => User, (user: User) => user.orders)
  customer!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
