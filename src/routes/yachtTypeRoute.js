const express = require('express');
const {
  getAllYachtTypes,
  getYachtTypesBySlug,
  createYachtType,
  updateYachtType,
  deleteYachtType
} = require('../controllers/yachtTypeController');

const yachtTypeRouter = express.Router();

// Get all yacht types
yachtTypeRouter.get('/', getAllYachtTypes);

// Get single yacht type by slug
yachtTypeRouter.get('/:slug', getYachtTypesBySlug);

// Create new yacht type
yachtTypeRouter.post('/', createYachtType);

// Update yacht type
yachtTypeRouter.put('/:id', updateYachtType);

// Delete yacht type (soft delete)
yachtTypeRouter.delete('/:id', deleteYachtType);

module.exports = yachtTypeRouter;
