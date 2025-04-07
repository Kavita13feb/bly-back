"use strict";

var express = require('express');

var destinationRouter = express.Router();

var destinationController = require('../controllers/destinationController'); // Get all destinations


destinationRouter.get('/', destinationController.getAllDestinations); // Get a single destination by ID or slug

destinationRouter.get('/:id', destinationController.getDestination); // Update destination rating                      

destinationRouter.put('/:id/rating', destinationController.updateRating); // Search destinations by region

destinationRouter.get('/search/:region', destinationController.searchByRegion); // Update destinations from yacht data

destinationRouter.post('/update-from-yachts', destinationController.updateDestinationsFromYachts); // Create new destination

destinationRouter.post('/', destinationController.createDestination); // Update destination

destinationRouter.put('/:id', destinationController.updateDestination); // Delete destination

destinationRouter["delete"]('/:id', destinationController.deleteDestination); // Get featured destinations

destinationRouter.get('/featured', destinationController.getFeaturedDestinations);
module.exports = destinationRouter;