const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");
const { Util } = require("../utilities/");
const { buildClassificationList } = require("../utilities/");

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
    // Retrieve item ID from URL parameter
    const itemId = req.params.itemId;

    const nav = await utilities.getNav();
    // Call function from model to retrieve data for the specific item
    const itemData = await invModel.getInventoryItemById(itemId); // Replace with your actual model function

  
    // Render the detail view template with the retrieved data
    res.render("inventory/detail", { 
      title: "Vehicle Details",
      nav: nav,
      make: itemData.inv_make,
      model: itemData.inv_model,
      year: itemData.inv_year,
      description: itemData.inv_description,
      image: itemData.inv_image,
      thumbnail: itemData.inv_thumbnail,
      price: itemData.inv_price,
      miles: itemData.inv_miles,
      color: itemData.inv_color
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
    console.log("Title value:", title);
    res.render("inventory/management", {
      title, 
      nav,
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


// Export the controller functions
module.exports = invCont;
