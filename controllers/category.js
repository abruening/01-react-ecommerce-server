const Category = require("../models/category");
const SubCategory = require("../models/subcategory");
const Product = require("../models/product");
const slugify = require("slugify");

exports.getSubCategory = async (req, res) => {
  SubCategory.find({ parent: req.params._id }).exec((err, subCategory) => {
    if (err) console.log(err);
    res.json(subCategory);
  });
};

exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    res.json(await new Category({ name, slug: slugify(name) }).save());
  } catch (err) {
    res.status(400).send("Create category failed");
  }
};

exports.list = async (req, res) => {
  res.json(await Category.find({}).sort({ createAt: -1 }).exec());
};

exports.read = async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug }).exec();
  // res.json(category);
  const products = await Product.find({ category: category })
    .populate("category")
    .exec();
  res.json({ category, products });
};

exports.update = async (req, res) => {
  const { name } = req.body;
  try {
    const updated = await Category.findOneAndUpdate(
      { slug: req.params.slug },
      { name, slug: slugify(name) },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).send("Update Category failed");
  }
};

exports.remove = async (req, res) => {
  try {
    const { name } = req.body;
    const deleted = await Category.findOneAndDelete({ slug: req.params.slug });

    res.json(deleted);
  } catch (err) {
    res.status(400).send("Delete Category failed");
  }
};
