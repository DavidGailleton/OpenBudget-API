import { Router } from 'express';
import { CategoryController } from '../controllers/CategoryController';

const router = Router();
const categoryController = new CategoryController();

// Create a new category
router.post('/create', categoryController.create);

// Get all categories with optional filters
router.get('/get', categoryController.getAll);

// Get a single category by ID
router.get('/get/:id', categoryController.getById);

// Update a category
router.put('/update/:id', categoryController.update);

// Delete a category
router.delete('/delete/:id', categoryController.delete);

export default router; 