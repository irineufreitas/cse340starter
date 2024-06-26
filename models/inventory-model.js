const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id,
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get inventory item by ID
 * ************************** */
async function getInventoryItemById(itemId) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`,
      [itemId]
    );
    return data.rows[0]; 
  } catch (error) {
    console.error("getInventoryItemById error: " + error);
    throw error; 
  }
}

//addclassification



async function addClassification (classificationName) {
  try {
    const sql = 'INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *';
    const params = [classificationName];
    const result = await pool.query(sql, params);
    return result.rowCount > 0;
  } catch (error) {
    console.error('Error inserting classification:', error);
    return false;
  }
};

async function addInventoryItem(inventoryData) {
  try {
    const { make, model, year, description, price, miles, color, image, thumbnail, classification_id } = inventoryData;

    // Validate the "make" field
    if (!make || make.trim() === '') {
      throw new Error('Invalid make value');
    }

    const query = `
      INSERT INTO public.inventory (inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, inv_image, inv_thumbnail, classification_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `;

    const values = [make, model, year, description, price, miles, color, image, thumbnail, classification_id];
    const result = await pool.query(query, values);
    return result.rows[0]; // Return the newly inserted inventory item
  } catch (error) {
    console.error('Error adding inventory item:', error);
    throw error;
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
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
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
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
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}


module.exports = {getClassifications, getInventoryByClassificationId, getInventoryItemById, addClassification, addInventoryItem, updateInventory};






