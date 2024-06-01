const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");
const { Util } = require("../utilities/");
const { buildClassificationList } = require("../utilities/");
const reviewModel = require("../models/review-model");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  
  if (data.length > 0) {
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data[0].classification_name;
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    });
  } else {
    // Handle case where no inventory items are found for the given classification ID
    res.render("./inventory/classification", {
      title: "No vehicles found",
      nav: await utilities.getNav(),
      grid: [], // or whatever you want to render when no items are found
    });
  }
};


/* ***************************
 *  Display Item Detail 
 * ************************** */
invCont.displayItemDetail = async function (req, res) {
  try {
    const itemId = parseInt(req.params.itemId, 10);  // Ensure itemId is parsed as an integer

    if (isNaN(itemId)) {
      throw new Error("Invalid item ID");
    }

    const nav = await utilities.getNav();
    const itemData = await invModel.getInventoryItemById(itemId);

    // Retrieve reviews for the specific item
    const reviews = await reviewModel.getReviewsByItemId(itemId);

    // Flash messages
    let messages = req.flash('info') || [];
    let errors = req.flash('error') || [];

    // Ensure messages and errors are arrays
    if (!Array.isArray(messages)) {
      messages = [messages];
    }
    if (!Array.isArray(errors)) {
      errors = [errors];
    }

    // Construct the inventory object
    const inventory = {
      inv_id: itemData.inv_id,
      make: itemData.inv_make,
      model: itemData.inv_model,
      year: itemData.inv_year,
      description: itemData.inv_description,
      image: itemData.inv_image,
      thumbnail: itemData.inv_thumbnail,
      price: itemData.inv_price,
      miles: itemData.inv_miles,
      color: itemData.inv_color
    };

    // Render the detail view template with the retrieved data
    res.render("inventory/detail", { 
      title: "Vehicle Details",
      nav: nav,
      inventory: inventory,
      reviews: reviews,
      messages,
      errors,
      accountData: res.locals.user // Pass account data if available
    });
  } catch (error) {
    // Handle errors
    console.error("Error displaying item detail:", error);
    res.status(500).send("Error displaying item detail");
  }
};

  

// management
invCont.buildManagement = async function (req, res) {
  try {
    const nav = await utilities.getNav();
    const title = "Inventory Management";
    const classificationSelect = await utilities.buildClassificationList()
    
    res.render("inventory/management", {
      title, 
      nav,
      classificationSelect,
      messages: req.flash('info')
      
    });
  } catch (error) {
    console.error("Error rendering management view:", error);
    res.status(500).send("Internal Server Error");
  }
};

//classification
invCont.buildAddClassification = async function (req, res) {
  try {
    const nav = await utilities.getNav();
    res.render('inventory/add-classification', {
      title: 'Add New Classification',
      nav,
      messages: req.flash('info')
    });
  } catch (error) {
    console.error("Error rendering add classification view:", error);
    res.status(500).send("Internal Server Error");
  }
};


//addinventory
invCont.buildAddInventory = async function(req, res) {
  const nav = await utilities.getNav();
  const classificationList = await buildClassificationList();
  res.render('inventory/add-inventory', {
    title: 'Add New Inventory',
    nav,
    classificationList, 
    messages: req.flash('info')
  });
};

//addclassification

invCont.addClassification = async function (req, res) {
  try {
    const { classificationName } = req.body;
    
    // Server-side validation
    const regex = /^[a-zA-Z0-9]+$/;
    if (!regex.test(classificationName)) {
      req.flash('info', 'Classification name cannot contain spaces or special characters.');
      return res.redirect('/inv/classification/add');
    }

    // Insert classification into the database
    const result = await invModel.addClassification(classificationName);
    if (result) {
      // Set the title for the management view
      const title = 'Inventory Management';
      req.flash('info', 'Classification added successfully.');
      const nav = await utilities.getNav();
      return res.render('inventory/management', { title, nav, messages: req.flash('info') });
    } else {
      req.flash('info', 'Failed to add classification.');
      return res.redirect('/inv/classification/add');
    }
    } catch (error) {
    console.error("Error adding classification:", error);
    req.flash('info', 'An error occurred.');
    res.redirect('/inv/classification/add');
    }
};

invCont.addInventory = async function(req, res) {
  try {
    const { make, model, year, description, price, miles, color, image, thumbnail, classification_id } = req.body;

    

    const newItem = await invModel.addInventoryItem({ make, model, year, description, price, miles, color, image, thumbnail, classification_id });
    if (newItem) {
      req.flash('info', 'Inventory added successfully');
      res.redirect('/inv/management');
    } else {
      throw new Error('Failed to add inventory item');
    }
  } catch (error) {
    console.error("Error adding inventory:", error);
    req.flash('info', 'An error occurred while adding the inventory item.');
    res.redirect('/inv/add');
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

//edit inventory
invCont.buildEditInventory = async function(req, res) {
  try {
    const itemId = req.params.itemId;
    const itemData = await invModel.getInventoryItemById(itemId); 
    const nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList(itemData.classification_id);

  
    // Prepopulate form fields with existing data
    const formData = {
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price: itemData.inv_price,
      inv_miles: itemData.inv_miles,
      inv_color: itemData.inv_color,
      classification_id: itemData.classification_id
    };

    const messages = req.flash('info') || []; // Ensure messages is always an array

    res.render('inventory/edit-inventory', {
      title: `Edit ${itemData.inv_make} ${itemData.inv_model}`,
      nav,
      formData, 
      classificationList, // Pass classificationList to the view
      messages
    });
  } catch (error) {
    console.error("Error building edit inventory view:", error);
    req.flash('info', 'An error occurred while loading the edit inventory view.');
    res.redirect('/inv/management');
  }
};






/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const {
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
    } = req.body;

    const updateResult = await invModel.updateInventory(
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id
    );

    if (updateResult) {
      const itemName = updateResult.inv_make + " " + updateResult.inv_model;
      req.flash("info", `The ${itemName} was successfully updated.`);
      res.redirect("/inv/management");
    } else {
      // If the update fails, redirect to management with error flash message
      req.flash("error", "Sorry, the update failed.");
      res.redirect("/inv/management");
    }
  } catch (error) {
    console.error("Error updating inventory:", error);
    req.flash("error", "An error occurred while updating the inventory item.");
    res.redirect("/inv/management");
  }
};



module.exports = invCont;
