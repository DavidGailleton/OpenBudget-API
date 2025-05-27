import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import { TransactionType } from '../types/TransactionType';

interface TransactionAttributes {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  categoryId: string;
  date: Date;
  isRecurring: boolean;
  recurringFrequency?: string; // 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'
  budgetId?: string; // Reference to the associated budget
  createdAt?: Date;
  updatedAt?: Date;
}

class Transaction extends Model<TransactionAttributes> implements TransactionAttributes {
  public id!: string;
  public type!: TransactionType;
  public amount!: number;
  public description!: string;
  public categoryId!: string;
  public date!: Date;
  public isRecurring!: boolean;
  public recurringFrequency!: string;
  public budgetId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Transaction.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM(...Object.values(TransactionType)),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id',
      },
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    isRecurring: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    recurringFrequency: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isIn: [['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']],
      },
    },
    budgetId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'budgets',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'transactions',
    modelName: 'Transaction',
    indexes: [
      {
        fields: ['date'],
      },
      {
        fields: ['type'],
      },
      {
        fields: ['categoryId'],
      },
    ],
  }
);

export default Transaction; 