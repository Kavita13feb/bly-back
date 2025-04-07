"use strict";

var express = require('express');

var _require = require('../controllers/yachtTypeController'),
    getAllYachtTypes = _require.getAllYachtTypes,
    getYachtTypesBySlug = _require.getYachtTypesBySlug,
    createYachtType = _require.createYachtType,
    updateYachtType = _require.updateYachtType,
    deleteYachtType = _require.deleteYachtType;

var yachtTypeRouter = express.Router(); // Get all yacht types

yachtTypeRouter.get('/', getAllYachtTypes); // Get single yacht type by slug

yachtTypeRouter.get('/:slug', getYachtTypesBySlug); // Create new yacht type

yachtTypeRouter.post('/', createYachtType); // Update yacht type

yachtTypeRouter.put('/:id', updateYachtType); // Delete yacht type (soft delete)

yachtTypeRouter["delete"]('/:id', deleteYachtType);
module.exports = yachtTypeRouter;