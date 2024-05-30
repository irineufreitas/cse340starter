// Needed Resources 
const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");
const authMiddleware = require("../middleware/authMiddleware"); // Require the authMiddleware
const inventoryValidation = require("../utilities/inventory-validation");
const { newInventoryRules, checkUpdateData } = inventoryValidation;

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route for the detail view
router.get("/detail/:itemId", invController.displayItemDetail);

// Route for management
router.get("/management", authMiddleware, invController.buildManagement); // Apply authMiddleware here

router.get("/classification/add", authMiddleware, invController.buildAddClassification); // Apply authMiddleware here

// Route for adding new inventory
router.get("/add", authMiddleware, invController.buildAddInventory); // Apply authMiddleware here

// Adding new classification
router.post("/classification/add", authMiddleware, invController.addClassification); // Apply authMiddleware here

// Route for adding new inventory
router.post("/add", authMiddleware, invController.addInventory); // Apply authMiddleware here

router.get("/getInventory/:classification_id", invController.getInventoryJSON);

// Route for editing items
router.get("/edit/:itemId", authMiddleware, invController.buildEditInventory); // Apply authMiddleware here

// Route for updating inventory
router.post("/update", authMiddleware, newInventoryRules(), checkUpdateData, invController.updateInventory); // Apply authMiddleware here

module.exports = router;
