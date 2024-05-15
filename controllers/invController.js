const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
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

// Export the controller functions
module.exports = invCont;
