import Budget from './Budget';
import Transaction from './Transaction';
import Category from './Category';

// Define relationships
Budget.hasMany(Transaction, {
  foreignKey: 'budgetId',
  as: 'transactions',
});

Transaction.belongsTo(Budget, {
  foreignKey: 'budgetId',
  as: 'budget',
});

Category.hasMany(Transaction, {
  foreignKey: 'categoryId',
  as: 'transactions',
});

Transaction.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category',
});

export {
  Budget,
  Transaction,
  Category,
}; 