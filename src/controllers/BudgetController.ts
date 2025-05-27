import { Request, Response, RequestHandler } from 'express';
import { Budget, Category, Transaction } from '../models';
import { TransactionType } from '../types/TransactionType';

export class BudgetController {
  constructor() {
    this.create = this.create.bind(this);
    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  // Create a new budget
  create: RequestHandler = async (req, res) => {
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

      res.status(201).json(budgetWithRelations);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Get all budgets with optional filters
  getAll: RequestHandler = async (req, res) => {
    try {
      const { type, categoryId, startDate, endDate } = req.query;

      const where: any = {};
      if (type) where.type = type;
      if (categoryId) where.categoryId = categoryId;
      if (startDate) where.startDate = { $gte: new Date(startDate as string) };
      if (endDate) where.endDate = { $lte: new Date(endDate as string) };

      const budgets = await Budget.findAll({
        where,
        include: [
          { model: Category, as: 'category' },
          { model: Transaction, as: 'transactions' },
        ],
        order: [['startDate', 'DESC']],
      });

      res.json(budgets);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get a single budget by ID
  getById: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;

      const budget = await Budget.findByPk(id, {
        include: [
          { model: Category, as: 'category' },
          { model: Transaction, as: 'transactions' },
        ],
      });

      if (!budget) {
        res.status(404).json({ error: 'Budget not found' });
        return;
      }

      res.json(budget);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Update a budget
  update: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, amount, description, type, categoryId, startDate, endDate } = req.body;

      const budget = await Budget.findByPk(id);

      if (!budget) {
        res.status(404).json({ error: 'Budget not found' });
        return;
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

      res.json(updatedBudget);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Delete a budget
  delete: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;

      const budget = await Budget.findByPk(id);

      if (!budget) {
        res.status(404).json({ error: 'Budget not found' });
        return;
      }

      await budget.destroy();

      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
} 