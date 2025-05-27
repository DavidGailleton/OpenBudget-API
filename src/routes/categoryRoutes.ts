import { Router } from 'express';
import { CategoryController } from '../controllers/CategoryController';

const router = Router();
const categoryController = new CategoryController();

// Create a new category
router.post('/', categoryController.create);

// Get all categories with optional filters
router.get('/', categoryController.getAll);

// Get a single category by ID
router.get('/:id', categoryController.getById);

// Update a category
router.put('/:id', categoryController.update);

// Delete a category
router.delete('/:id', categoryController.delete);

export default router; 