'use strict';


const { body } = require('express-validator');

/**
 * Check the data received for adding a new inventory item.
 * If any data is invalid, it sends the user back to the add view with error messages.
 * @param {*} req The request object.
 * @param {*} res The response object.
 * @param {*} next The next middleware function.
 */


  
  // inventory data
function checkInventoryData(req, res, next) {
  // Extract inventory data from the request body
  const { make, model, year, description, price, miles, color, image, thumbnail, classification_id } = req.body;

  // Validate the inventory data
  let errors = [];
  if (!make || !model || !year || !price || !miles || !color || !image || !thumbnail || !classification_id) {
    errors.push({ msg: 'All fields are required.' });
  }
  if (isNaN(year) || isNaN(price) || isNaN(miles) || isNaN(classification_id)) {
    errors.push({ msg: 'Year, price, miles, and classification ID must be numbers.' });
  }

  // If there are errors, render the add view with error messages
  if (errors.length > 0) {
    return res.render('inventory/add', {
      title: 'Add Inventory Item',
      errors: errors,
      inv_make: make,
      inv_model: model,
      inv_year: year,
      inv_description: description,
      inv_price: price,
      inv_miles: miles,
      inv_color: color,
      inv_image: image,
      inv_thumbnail: thumbnail,
      classification_id: classification_id
    });
  }
  
  // If no errors, proceed to the next middleware
  next();
}

//checkupdate data
function checkUpdateData(req, res, next) {
    // Extract inventory data from the request body
    const { inv_id, make, model, year, description, price, miles, color, image, thumbnail, classification_id } = req.body;
  
    // Validate the inventory data
    let errors = [];
    if (!make || !model || !year || !price || !miles || !color || !image || !thumbnail || !classification_id) {
      errors.push({ msg: 'All fields are required.' });
    }
    if (isNaN(year) || isNaN(price) || isNaN(miles) || isNaN(classification_id)) {
      errors.push({ msg: 'Year, price, miles, and classification ID must be numbers.' });
    }
  
    // If there are errors, render the edit view with error messages
    if (errors.length > 0) {
      return res.render('inventory/edit', {
        title: 'Edit Inventory Item',
        errors: errors,
        inv_id: inv_id,
        inv_make: make,
        inv_model: model,
        inv_year: year,
        inv_description: description,
        inv_price: price,
        inv_miles: miles,
        inv_color: color,
        inv_image: image,
        inv_thumbnail: thumbnail,
        classification_id: classification_id
      });
    }
    
    // If no errors, proceed to the next middleware
    next();
  }

  //inventoryRules

function newInventoryRules() {
    return [
      // Validate make
      body('make')
        .trim()
        .notEmpty().withMessage('Make is required'),
  
      // Validate model
      body('model')
        .trim()
        .notEmpty().withMessage('Model is required'),
  
      // Validate year
      body('year')
        .trim()
        .notEmpty().withMessage('Year is required'),
  
      // Validate description
      body('description')
        .trim()
        .notEmpty().withMessage('Description is required'),
  
      // Validate price
      body('price')
        .trim()
        .notEmpty().withMessage('Price is required'),
  
      // Validate miles
      body('miles')
        .trim()
        .notEmpty().withMessage('Miles is required'),
  
      // Validate color
      body('color')
        .trim()
        .notEmpty().withMessage('Color is required'),
  
      // Validate image
      body('image')
        .trim()
        .notEmpty().withMessage('Image is required'),
  
      // Validate thumbnail
      body('thumbnail')
        .trim()
        .notEmpty().withMessage('Thumbnail is required'),
  
      // Validate classification_id
      body('classification_id')
        .trim()
        .notEmpty().withMessage('Classification ID is required'),
    ];
  }
  
module.exports = {checkUpdateData, checkInventoryData, newInventoryRules};
