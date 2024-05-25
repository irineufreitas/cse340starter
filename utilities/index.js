const invModel = require("../models/inventory-model");
const Util = {};

/* ************************
 * Constructs the nav HTML DIV (personal preference) list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<div class='menu'>";
  list += '<a href="/" title="Home page">Home</a>';
  data.rows.forEach((row) => {
    
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    
  });
  list += "</div>";
  return list;
};

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid;
    if(data.length > 0){
      grid = '<ul id="inv-display">';
      data.forEach(vehicle => { 
        grid += '<li>';
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>';
        grid += '<div class="namePrice">';
        grid += '<hr />';
        grid += '<h2>';
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>';
        grid += '</h2>';
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>';
        grid += '</div>';
        grid += '</li>';
      });
      grid += '</ul>';
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
    }
    return grid;
  };

/* **************************************
* Build HTML markup for displaying vehicle details
* ************************************ */
Util.generateVehicleHTML = function(vehicle) {
  // Construct HTML markup using the provided vehicle information
  const html = `
      <div class="vehicle-details">
          <h2>${vehicle.inv_make} ${vehicle.inv_model} (${vehicle.inv_year})</h2>
          <img src="${vehicle.inv_image}" alt="${vehicle.inv_make} ${vehicle.inv_model}">
          <p><strong>Description:</strong> ${vehicle.inv_description}</p>
          <p><strong>Price:</strong> $${vehicle.inv_price.toLocaleString()}</p>
          <p><strong>Mileage:</strong> ${vehicle.inv_miles.toLocaleString()} miles</p>
          <p><strong>Color:</strong> ${vehicle.inv_color}</p>
      </div>
  `;
  return html;
};

/* ************************
 * Error Handling Middleware
 ************************** */
Util.handleErrors = function (fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(next);
  };
};
/* ************************
 * Classification List
 ************************** */

Util.buildClassificationList = async function(classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList = '<select name="classification_id" id="classificationList" required>';
  classificationList += "<option value=''>Choose a Classification</option>";
  data.rows.forEach((row) => {
      classificationList += '<option value="' + row.classification_id + '"';
      if (classification_id != null && row.classification_id == classification_id) {
          classificationList += " selected ";
      }
      classificationList += ">" + row.classification_name + "</option>";
  });
  classificationList += "</select>";
  return classificationList;
};

module.exports = {
  getNav: Util.getNav,
  buildClassificationGrid: Util.buildClassificationGrid,
  generateVehicleHTML: Util.generateVehicleHTML,
  handleErrors: Util.handleErrors,
  buildClassificationList: Util.buildClassificationList
};