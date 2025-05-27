import { Request, Response } from 'express';
import { Category, Transaction } from '../models';
import { TransactionType } from '../types/TransactionType';

export class CategoryController {
  // Create a new category
  async create(req: Request, res: Response) {
    try {
      const { name, type, description, icon, color } = req.body;

      const category = await Category.create({
        name,
        type,
        description,
        icon,
        color,
      });

      return res.status(201).json(category);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Get all categories with optional filters
  async getAll(req: Request, res: Response) {
    try {
      const { type } = req.query;

      const where: any = {};
      if (type) where.type = type;

      const categories = await Category.findAll({
        where,
        include: [
          {
            model: Transaction,
            as: 'transactions',
            attributes: ['id', 'amount', 'date'],
          },
        ],
      });

      return res.json(categories);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Get a single category by ID
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const category = await Category.findByPk(id, {
        include: [
          {
            model: Transaction,
            as: 'transactions',
            attributes: ['id', 'amount', 'date'],
          },
        ],
      });

      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      return res.json(category);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Update a category
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, type, description, icon, color } = req.body;

      const category = await Category.findByPk(id);

      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      await category.update({
        name,
        type,
        description,
        icon,
        color,
      });

      return res.json(category);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Delete a category
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const category = await Category.findByPk(id);

      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      await category.destroy();

      return res.status(204).send();
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
} 