const express = require("express");
const router = express.Router();
const {
  getItems,
  createItem,
  getItemById,
  updateItem,
  deleteItem,
} = require("../controllers/itemController");

router.route("/")
  .get(getItems)
  .post(createItem);

router.route("/:id")
  .get(getItemById)
  .put(updateItem)
  .delete(deleteItem);

module.exports = router;
