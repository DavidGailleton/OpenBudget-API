import { Request, Response, NextFunction } from 'express';
import { BudgetController } from '../../controllers/BudgetController';
import { Budget, Category, Transaction } from '../../models';

// Mock the models
jest.mock('../../models', () => ({
  Budget: {
    create: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
  },
  Category: {},
  Transaction: {},
}));

describe('BudgetController', () => {
  let budgetController: BudgetController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    budgetController = new BudgetController();
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockNext = jest.fn();
    mockResponse = {
      json: mockJson,
      status: mockStatus,
    };
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new budget successfully', async () => {
      const mockBudget = {
        name: 'Test Budget',
        amount: 1000,
        description: 'Test Description',
        type: 'EXPENSE',
        categoryId: 1,
        startDate: new Date(),
        endDate: new Date(),
      };

      const createdBudget = {
        id: 1,
        ...mockBudget,
      };

      mockRequest = {
        body: mockBudget,
      };

      (Budget.create as jest.Mock).mockResolvedValue(createdBudget);
      (Budget.findByPk as jest.Mock).mockResolvedValue({
        ...createdBudget,
        category: {},
        transactions: [],
      });

      await budgetController.create(mockRequest as Request, mockResponse as Response, mockNext);

      expect(Budget.create).toHaveBeenCalledWith(mockBudget);
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalled();
    });

    it('should handle errors when creating a budget', async () => {
      const error = new Error('Test error');
      mockRequest = {
        body: {},
      };

      (Budget.create as jest.Mock).mockRejectedValue(error);

      await budgetController.create(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('getAll', () => {
    it('should get all budgets with filters', async () => {
      const mockBudgets = [
        {
          id: 1,
          name: 'Test Budget',
          category: {},
          transactions: [],
          _attributes: {},
          dataValues: {},
          _creationAttributes: {},
          isNewRecord: false,
        },
      ];

      mockRequest = {
        query: {
          type: 'EXPENSE',
          categoryId: '1',
          startDate: '2024-01-01',
          endDate: '2024-12-31',
        },
      };

      const findAllSpy = jest.spyOn(Budget, 'findAll').mockResolvedValue(mockBudgets as any);

      await budgetController.getAll(mockRequest as Request, mockResponse as Response, mockNext);

      expect(findAllSpy).toHaveBeenCalledWith({
        where: {
          type: 'EXPENSE',
          categoryId: '1',
          startDate: { $gte: new Date('2024-01-01') },
          endDate: { $lte: new Date('2024-12-31') },
        },
        include: [
          { model: Category, as: 'category' },
          { model: Transaction, as: 'transactions' },
        ],
        order: [['startDate', 'DESC']],
      });
      expect(mockJson).toHaveBeenCalledWith(mockBudgets);
    });

    it('should handle errors when getting all budgets', async () => {
      const error = new Error('Test error');
      mockRequest = {
        query: {},
      };

      (Budget.findAll as jest.Mock).mockRejectedValue(error);

      await budgetController.getAll(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('getById', () => {
    it('should get a budget by id', async () => {
      const mockBudget = {
        id: 1,
        name: 'Test Budget',
        category: {},
        transactions: [],
      };

      mockRequest = {
        params: { id: '1' },
      };

      (Budget.findByPk as jest.Mock).mockResolvedValue(mockBudget);

      await budgetController.getById(mockRequest as Request, mockResponse as Response, mockNext);

      expect(Budget.findByPk).toHaveBeenCalledWith('1', {
        include: [
          { model: Category, as: 'category' },
          { model: Transaction, as: 'transactions' },
        ],
      });
      expect(mockJson).toHaveBeenCalledWith(mockBudget);
    });

    it('should return 404 when budget is not found', async () => {
      mockRequest = {
        params: { id: '999' },
      };

      (Budget.findByPk as jest.Mock).mockResolvedValue(null);

      await budgetController.getById(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Budget not found' });
    });
  });

  describe('update', () => {
    it('should update a budget successfully', async () => {
      const mockBudget = {
        id: 1,
        name: 'Updated Budget',
        update: jest.fn().mockResolvedValue(true),
      };

      mockRequest = {
        params: { id: '1' },
        body: { name: 'Updated Budget' },
      };

      (Budget.findByPk as jest.Mock)
        .mockResolvedValueOnce(mockBudget)
        .mockResolvedValueOnce({ ...mockBudget, category: {}, transactions: [] });

      await budgetController.update(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockBudget.update).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalled();
    });

    it('should return 404 when updating non-existent budget', async () => {
      mockRequest = {
        params: { id: '999' },
        body: { name: 'Updated Budget' },
      };

      (Budget.findByPk as jest.Mock).mockResolvedValue(null);

      await budgetController.update(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Budget not found' });
    });
  });

  describe('delete', () => {
    it('should delete a budget successfully', async () => {
      const mockBudget = {
        id: 1,
        destroy: jest.fn().mockResolvedValue(true),
      };

      mockRequest = {
        params: { id: '1' },
      };

      (Budget.findByPk as jest.Mock).mockResolvedValue(mockBudget);

      await budgetController.delete(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockBudget.destroy).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(204);
    });

    it('should return 404 when deleting non-existent budget', async () => {
      mockRequest = {
        params: { id: '999' },
      };

      (Budget.findByPk as jest.Mock).mockResolvedValue(null);

      await budgetController.delete(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Budget not found' });
    });
  });
}); 