import Budget from './Budget';
import Transaction from './Transaction';
import Category from './Category';

// Define relationships
Budget.hasMany(Transaction, {
  foreignKey: 'budgetId',
  as: 'transactions',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
});

Transaction.belongsTo(Budget, {
  foreignKey: 'budgetId',
  as: 'budget',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
});

Category.hasMany(Transaction, {
  foreignKey: 'categoryId',
  as: 'transactions',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Transaction.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Category.hasMany(Budget, {
  foreignKey: 'categoryId',
  as: 'budgets',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Budget.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

export {
  Budget,
  Transaction,
  Category,
}; 