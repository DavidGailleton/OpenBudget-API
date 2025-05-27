import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import { TransactionType } from '../types/TransactionType';

interface BudgetAttributes {
  id?: string;
  name: string;
  amount: number;
  description?: string;
  type: TransactionType;
  categoryId: string;
  startDate: Date;
  endDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

class Budget extends Model<BudgetAttributes> implements BudgetAttributes {
  public id?: string;
  public name!: string;
  public amount!: number;
  public description!: string;
  public type!: TransactionType;
  public categoryId!: string;
  public startDate!: Date;
  public endDate!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Budget.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'category_id',
      references: {
        model: 'categories',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'start_date',
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'end_date',
    },
  },
  {
    sequelize,
    tableName: 'budgets',
    modelName: 'Budget',
  }
);

export default Budget; 