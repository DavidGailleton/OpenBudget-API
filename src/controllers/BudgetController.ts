import { Request, Response } from 'express';
import { Budget, Category, Transaction } from '../models';
import { TransactionType } from '../types/TransactionType';

export class BudgetController {
  // Create a new budget
  async create(req: Request, res: Response) {
    try {
      const { name, amount, description, type, categoryId, startDate, endDate } = req.body;

      const budget = await Budget.create({
        name,
        amount,
        description,
        type,
        categoryId,
        startDate,
        endDate,
      });

      const budgetWithRelations = await Budget.findByPk(budget.id, {
        include: [
          { model: Category, as: 'category' },
          { model: Transaction, as: 'transactions' },
        ],
      });

      return res.status(201).json(budgetWithRelations);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Get all budgets with optional filters
  async getAll(req: Request, res: Response) {
    try {
      const { type, categoryId, startDate, endDate } = req.query;

      const where: any = {};
      if (type) where.type = type;
      if (categoryId) where.categoryId = categoryId;
      if (startDate || endDate) {
        where.startDate = {};
        if (startDate) where.startDate.$gte = new Date(startDate as string);
        if (endDate) where.endDate.$lte = new Date(endDate as string);
      }

      const budgets = await Budget.findAll({
        where,
        include: [
          { model: Category, as: 'category' },
          { model: Transaction, as: 'transactions' },
        ],
        order: [['startDate', 'DESC']],
      });

      return res.json(budgets);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Get a single budget by ID
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const budget = await Budget.findByPk(id, {
        include: [
          { model: Category, as: 'category' },
          { model: Transaction, as: 'transactions' },
        ],
      });

      if (!budget) {
        return res.status(404).json({ error: 'Budget not found' });
      }

      return res.json(budget);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Update a budget
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, amount, description, type, categoryId, startDate, endDate } = req.body;

      const budget = await Budget.findByPk(id);

      if (!budget) {
        return res.status(404).json({ error: 'Budget not found' });
      }

      await budget.update({
        name,
        amount,
        description,
        type,
        categoryId,
        startDate,
        endDate,
      });

      const updatedBudget = await Budget.findByPk(id, {
        include: [
          { model: Category, as: 'category' },
          { model: Transaction, as: 'transactions' },
        ],
      });

      return res.json(updatedBudget);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Delete a budget
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const budget = await Budget.findByPk(id);

      if (!budget) {
        return res.status(404).json({ error: 'Budget not found' });
      }

      await budget.destroy();

      return res.status(204).send();
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
} 