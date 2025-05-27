import { Request, Response, NextFunction } from 'express';
import { TransactionController } from '../../controllers/TransactionController';
import { Transaction, Category, Budget } from '../../models';

// Mock the models
jest.mock('../../models', () => ({
  Transaction: {
    create: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
  },
  Category: {},
  Budget: {},
}));

describe('TransactionController', () => {
  let transactionController: TransactionController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    transactionController = new TransactionController();
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
    it('should create a new transaction successfully', async () => {
      const mockTransaction = {
        type: 'EXPENSE',
        amount: 100,
        description: 'Test Transaction',
        categoryId: 1,
        date: new Date(),
        isRecurring: false,
        recurringFrequency: null,
        budgetId: 1,
      };

      const createdTransaction = {
        id: 1,
        ...mockTransaction,
      };

      mockRequest = {
        body: mockTransaction,
      };

      (Transaction.create as jest.Mock).mockResolvedValue(createdTransaction);
      (Transaction.findByPk as jest.Mock).mockResolvedValue({
        ...createdTransaction,
        category: {},
        budget: {},
      });

      await transactionController.create(mockRequest as Request, mockResponse as Response, mockNext);

      expect(Transaction.create).toHaveBeenCalledWith(mockTransaction);
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalled();
    });

    it('should handle errors when creating a transaction', async () => {
      const error = new Error('Test error');
      mockRequest = {
        body: {},
      };

      (Transaction.create as jest.Mock).mockRejectedValue(error);

      await transactionController.create(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('getAll', () => {
    it('should get all transactions with filters', async () => {
      const mockTransactions = [
        {
          id: 1,
          type: 'EXPENSE',
          amount: 100,
          category: {},
          budget: {},
        },
      ];

      mockRequest = {
        query: {
          type: 'EXPENSE',
          categoryId: '1',
          budgetId: '1',
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          isRecurring: 'false',
        },
      };

      (Transaction.findAll as jest.Mock).mockResolvedValue(mockTransactions);

      await transactionController.getAll(mockRequest as Request, mockResponse as Response, mockNext);

      expect(Transaction.findAll).toHaveBeenCalledWith({
        where: {
          type: 'EXPENSE',
          categoryId: '1',
          budgetId: '1',
          isRecurring: 'false',
          date: {
            $gte: new Date('2024-01-01'),
            $lte: new Date('2024-12-31'),
          },
        },
        include: [
          { model: Category, as: 'category' },
          { model: Budget, as: 'budget' },
        ],
        order: [['date', 'DESC']],
      });
      expect(mockJson).toHaveBeenCalledWith(mockTransactions);
    });

    it('should handle errors when getting all transactions', async () => {
      const error = new Error('Test error');
      mockRequest = {
        query: {},
      };

      (Transaction.findAll as jest.Mock).mockRejectedValue(error);

      await transactionController.getAll(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('getById', () => {
    it('should get a transaction by id', async () => {
      const mockTransaction = {
        id: 1,
        type: 'EXPENSE',
        amount: 100,
        category: {},
        budget: {},
      };

      mockRequest = {
        params: { id: '1' },
      };

      (Transaction.findByPk as jest.Mock).mockResolvedValue(mockTransaction);

      await transactionController.getById(mockRequest as Request, mockResponse as Response, mockNext);

      expect(Transaction.findByPk).toHaveBeenCalledWith('1', {
        include: [
          { model: Category, as: 'category' },
          { model: Budget, as: 'budget' },
        ],
      });
      expect(mockJson).toHaveBeenCalledWith(mockTransaction);
    });

    it('should return 404 when transaction is not found', async () => {
      mockRequest = {
        params: { id: '999' },
      };

      (Transaction.findByPk as jest.Mock).mockResolvedValue(null);

      await transactionController.getById(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Transaction not found' });
    });
  });

  describe('update', () => {
    it('should update a transaction successfully', async () => {
      const mockTransaction = {
        id: 1,
        type: 'EXPENSE',
        amount: 100,
        update: jest.fn().mockResolvedValue(true),
      };

      mockRequest = {
        params: { id: '1' },
        body: { amount: 200 },
      };

      (Transaction.findByPk as jest.Mock)
        .mockResolvedValueOnce(mockTransaction)
        .mockResolvedValueOnce({ ...mockTransaction, category: {}, budget: {} });

      await transactionController.update(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockTransaction.update).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalled();
    });

    it('should return 404 when updating non-existent transaction', async () => {
      mockRequest = {
        params: { id: '999' },
        body: { amount: 200 },
      };

      (Transaction.findByPk as jest.Mock).mockResolvedValue(null);

      await transactionController.update(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Transaction not found' });
    });
  });

  describe('delete', () => {
    it('should delete a transaction successfully', async () => {
      const mockTransaction = {
        id: 1,
        destroy: jest.fn().mockResolvedValue(true),
      };

      mockRequest = {
        params: { id: '1' },
      };

      (Transaction.findByPk as jest.Mock).mockResolvedValue(mockTransaction);

      await transactionController.delete(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockTransaction.destroy).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(204);
    });

    it('should return 404 when deleting non-existent transaction', async () => {
      mockRequest = {
        params: { id: '999' },
      };

      (Transaction.findByPk as jest.Mock).mockResolvedValue(null);

      await transactionController.delete(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Transaction not found' });
    });
  });
}); 