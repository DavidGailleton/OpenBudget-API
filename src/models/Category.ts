import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import { TransactionType } from '../types/TransactionType';

interface CategoryAttributes {
  id: string;
  name: string;
  type: TransactionType;
  description?: string;
  icon?: string;
  color?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class Category extends Model<CategoryAttributes> implements CategoryAttributes {
  public id!: string;
  public name!: string;
  public type!: TransactionType;
  public description!: string;
  public icon!: string;
  public color!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Category.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    type: {
      type: DataTypes.ENUM(...Object.values(TransactionType)),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: /^#[0-9A-F]{6}$/i, // Hex color code validation
      },
    },
  },
  {
    sequelize,
    tableName: 'categories',
    modelName: 'Category',
    indexes: [
      {
        fields: ['type'],
      },
      {
        fields: ['name'],
        unique: true,
      },
    ],
  }
);

export default Category; 