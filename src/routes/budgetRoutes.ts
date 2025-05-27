import { Router } from 'express';
import { BudgetController } from '../controllers/BudgetController';

const router = Router();
const budgetController = new BudgetController();

// Create a new budget
router.post('/create', budgetController.create);

// Get all budgets with optional filters
router.get('/get', budgetController.getAll);

// Get a single budget by ID
router.get('/get/:id', budgetController.getById);

// Update a budget
router.put('/update/:id', budgetController.update);

// Delete a budget
router.delete('/delete/:id', budgetController.delete);

export default router; 