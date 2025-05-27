import { Request, Response, RequestHandler } from 'express';
import { Category, Transaction } from '../models';
import { TransactionType } from '../types/TransactionType';

export class CategoryController {
  constructor() {
    this.create = this.create.bind(this);
    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  // Create a new category
  create: RequestHandler = async (req, res) => {
    try {
      const { name, type, description, icon, color } = req.body;

      const category = await Category.create({
        name,
        type,
        description,
        icon,
        color,
      });

      res.status(201).json(category);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Get all categories with optional filters
  getAll: RequestHandler = async (req, res) => {
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

      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get a single category by ID
  getById: RequestHandler = async (req, res) => {
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
        res.status(404).json({ error: 'Category not found' });
        return;
      }

      res.json(category);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Update a category
  update: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, type, description, icon, color } = req.body;

      const category = await Category.findByPk(id);

      if (!category) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }

      await category.update({
        name,
        type,
        description,
        icon,
        color,
      });

      res.json(category);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Delete a category
  delete: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;

      const category = await Category.findByPk(id);

      if (!category) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }

      await category.destroy();

      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
} 