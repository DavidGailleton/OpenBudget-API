import { Router } from 'express';
import { TransactionController } from '../controllers/TransactionController';

const router = Router();
const transactionController = new TransactionController();

// Create a new transaction
router.post('/create', transactionController.create);

// Get all transactions with optional filters
router.get('/get', transactionController.getAll);

// Get a single transaction by ID
router.get('/get/:id', transactionController.getById);

// Update a transaction
router.put('/update/:id', transactionController.update);

// Delete a transaction
router.delete('/delete/:id', transactionController.delete);

export default router; 