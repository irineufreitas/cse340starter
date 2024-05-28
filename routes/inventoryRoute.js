// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController");
const utilities = require("../utilities");

const inventoryValidation = require('../utilities/inventory-validation');
const { newInventoryRules, checkUpdateData } = inventoryValidation;

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

// get
router.get('/add', invController.buildAddInventory);

// adding new inventory
router.post('/add', invController.addInventory);

router.get("/getInventory/:classification_id", invController.getInventoryJSON)

//edit items
router.get('/edit/:itemId', utilities.checkLogin, invController.buildEditInventory);

//post for updating
router.post("/update/", newInventoryRules(), checkUpdateData, invController.updateInventory);


module.exports = router;
// 
