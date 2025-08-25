const Item = require("../models/Item");

// @desc   Get all items
const getItems = async (req, res) => {
  const items = await Item.find();
  res.json(items);
};

// @desc   Create item
const createItem = async (req, res) => {
  const { name, description } = req.body;
  const newItem = new Item({ name, description });
  await newItem.save();
  res.status(201).json(newItem);
};

// @desc   Get single item
const getItemById = async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Item not found" });
  res.json(item);
};

// @desc   Update item
const updateItem = async (req, res) => {
  const { name, description } = req.body;
  const item = await Item.findByIdAndUpdate(
    req.params.id,
    { name, description },
    { new: true }
  );
  if (!item) return res.status(404).json({ message: "Item not found" });
  res.json(item);
};

// @desc   Delete item
const deleteItem = async (req, res) => {
  const item = await Item.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: "Item not found" });
  res.json({ message: "Item deleted successfully" });
};

module.exports = {
  getItems,
  createItem,
  getItemById,
  updateItem,
  deleteItem,
};
