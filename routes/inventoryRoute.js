// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route for the detail view
router.get("/detail/:itemId", invController.displayItemDetail);

// Route for management
router.get('/management', invController.buildManagement);

router.get('/classification/add', invController.buildAddClassification);

router.get('/add', invController.buildAddInventory);

// Adding new classification
router.post('/classification/add', invController.addClassification);

router.get('/add', invController.buildAddInventory);

// adding new inventory
router.post('/add', invController.addInventory);


module.exports = router;
// 
