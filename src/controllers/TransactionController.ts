import { Request, Response, RequestHandler } from 'express';
import { Transaction, Category, Budget } from '../models';
import { TransactionType } from '../types/TransactionType';

export class TransactionController {
  constructor() {
    this.create = this.create.bind(this);
    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  // Create a new transaction
  create: RequestHandler = async (req, res) => {
    try {
      const {
        type,
        amount,
        description,
        categoryId,
        date,
        isRecurring,
        recurringFrequency,
        budgetId,
      } = req.body;

      const transaction = await Transaction.create({
        type,
        amount,
        description,
        categoryId,
        date: date || new Date(),
        isRecurring,
        recurringFrequency,
        budgetId,
      });

      const transactionWithRelations = await Transaction.findByPk(transaction.id, {
        include: [
          { model: Category, as: 'category' },
          { model: Budget, as: 'budget' },
        ],
      });

      res.status(201).json(transactionWithRelations);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Get all transactions with optional filters
  getAll: RequestHandler = async (req, res) => {
    try {
      const {
        type,
        categoryId,
        budgetId,
        startDate,
        endDate,
        isRecurring,
      } = req.query;

      const where: any = {};

      if (type) where.type = type;
      if (categoryId) where.categoryId = categoryId;
      if (budgetId) where.budgetId = budgetId;
      if (isRecurring !== undefined) where.isRecurring = isRecurring;
      if (startDate || endDate) {
        where.date = {};
        if (startDate) where.date.$gte = new Date(startDate as string);
        if (endDate) where.date.$lte = new Date(endDate as string);
      }

      const transactions = await Transaction.findAll({
        where,
        include: [
          { model: Category, as: 'category' },
          { model: Budget, as: 'budget' },
        ],
        order: [['date', 'DESC']],
      });

      res.json(transactions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get a single transaction by ID
  getById: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;

      const transaction = await Transaction.findByPk(id, {
        include: [
          { model: Category, as: 'category' },
          { model: Budget, as: 'budget' },
        ],
      });

      if (!transaction) {
        res.status(404).json({ error: 'Transaction not found' });
        return;
      }

      res.json(transaction);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Update a transaction
  update: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const {
        type,
        amount,
        description,
        categoryId,
        date,
        isRecurring,
        recurringFrequency,
        budgetId,
      } = req.body;

      const transaction = await Transaction.findByPk(id);

      if (!transaction) {
        res.status(404).json({ error: 'Transaction not found' });
        return;
      }

      await transaction.update({
        type,
        amount,
        description,
        categoryId,
        date,
        isRecurring,
        recurringFrequency,
        budgetId,
      });

      const updatedTransaction = await Transaction.findByPk(id, {
        include: [
          { model: Category, as: 'category' },
          { model: Budget, as: 'budget' },
        ],
      });

      res.json(updatedTransaction);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Delete a transaction
  delete: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;

      const transaction = await Transaction.findByPk(id);

      if (!transaction) {
        res.status(404).json({ error: 'Transaction not found' });
        return;
      }

      await transaction.destroy();

      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
} 