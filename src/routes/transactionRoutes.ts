import { Router } from 'express';
import { TransactionController } from '../controllers/TransactionController';

const router = Router();
const transactionController = new TransactionController();

// Create a new transaction
router.post('/', transactionController.create);

// Get all transactions with optional filters
router.get('/', transactionController.getAll);

// Get a single transaction by ID
router.get('/:id', transactionController.getById);

// Update a transaction
router.put('/:id', transactionController.update);

// Delete a transaction
router.delete('/:id', transactionController.delete);

export default router; 