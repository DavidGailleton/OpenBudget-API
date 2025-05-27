import { Request, Response, NextFunction } from 'express';
import { CategoryController } from '../../controllers/CategoryController';
import { Category, Transaction } from '../../models';

// Mock the models
jest.mock('../../models', () => ({
  Category: {
    create: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
  },
  Transaction: {},
}));

describe('CategoryController', () => {
  let categoryController: CategoryController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    categoryController = new CategoryController();
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
    it('should create a new category successfully', async () => {
      const mockCategory = {
        name: 'Test Category',
        type: 'EXPENSE',
        description: 'Test Description',
        icon: 'test-icon',
        color: '#000000',
      };

      const createdCategory = {
        id: 1,
        ...mockCategory,
      };

      mockRequest = {
        body: mockCategory,
      };

      (Category.create as jest.Mock).mockResolvedValue(createdCategory);

      await categoryController.create(mockRequest as Request, mockResponse as Response, mockNext);

      expect(Category.create).toHaveBeenCalledWith(mockCategory);
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(createdCategory);
    });

    it('should handle errors when creating a category', async () => {
      const error = new Error('Test error');
      mockRequest = {
        body: {},
      };

      (Category.create as jest.Mock).mockRejectedValue(error);

      await categoryController.create(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('getAll', () => {
    it('should get all categories with filters', async () => {
      const mockCategories = [
        {
          id: 1,
          name: 'Test Category',
          transactions: [],
        },
      ];

      mockRequest = {
        query: {
          type: 'EXPENSE',
        },
      };

      (Category.findAll as jest.Mock).mockResolvedValue(mockCategories);

      await categoryController.getAll(mockRequest as Request, mockResponse as Response, mockNext);

      expect(Category.findAll).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(mockCategories);
    });

    it('should handle errors when getting all categories', async () => {
      const error = new Error('Test error');
      mockRequest = {
        query: {},
      };

      (Category.findAll as jest.Mock).mockRejectedValue(error);

      await categoryController.getAll(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('getById', () => {
    it('should get a category by id', async () => {
      const mockCategory = {
        id: 1,
        name: 'Test Category',
        transactions: [],
      };

      mockRequest = {
        params: { id: '1' },
      };

      (Category.findByPk as jest.Mock).mockResolvedValue(mockCategory);

      await categoryController.getById(mockRequest as Request, mockResponse as Response, mockNext);

      expect(Category.findByPk).toHaveBeenCalledWith('1', {
        include: [
          {
            model: Transaction,
            as: 'transactions',
            attributes: ['id', 'amount', 'date'],
          },
        ],
      });
      expect(mockJson).toHaveBeenCalledWith(mockCategory);
    });

    it('should return 404 when category is not found', async () => {
      mockRequest = {
        params: { id: '999' },
      };

      (Category.findByPk as jest.Mock).mockResolvedValue(null);

      await categoryController.getById(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Category not found' });
    });
  });

  describe('update', () => {
    it('should update a category successfully', async () => {
      const mockCategory = {
        id: 1,
        name: 'Updated Category',
        update: jest.fn().mockResolvedValue(true),
      };

      mockRequest = {
        params: { id: '1' },
        body: { name: 'Updated Category' },
      };

      (Category.findByPk as jest.Mock).mockResolvedValue(mockCategory);

      await categoryController.update(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockCategory.update).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalled();
    });

    it('should return 404 when updating non-existent category', async () => {
      mockRequest = {
        params: { id: '999' },
        body: { name: 'Updated Category' },
      };

      (Category.findByPk as jest.Mock).mockResolvedValue(null);

      await categoryController.update(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Category not found' });
    });
  });

  describe('delete', () => {
    it('should delete a category successfully', async () => {
      const mockCategory = {
        id: 1,
        destroy: jest.fn().mockResolvedValue(true),
      };

      mockRequest = {
        params: { id: '1' },
      };

      (Category.findByPk as jest.Mock).mockResolvedValue(mockCategory);

      await categoryController.delete(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockCategory.destroy).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(204);
    });

    it('should return 404 when deleting non-existent category', async () => {
      mockRequest = {
        params: { id: '999' },
      };

      (Category.findByPk as jest.Mock).mockResolvedValue(null);

      await categoryController.delete(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Category not found' });
    });
  });
}); 