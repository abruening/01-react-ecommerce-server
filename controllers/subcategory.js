const subCategory = require("../models/subcategory");
const Product = require("../models/product");
const slugify = require("slugify");

exports.create = async (req, res) => {
  try {
    const { name, parent } = req.body;
    res.json(
      await new subCategory({
        name,
        parent,
        slug: slugify(name),
      }).save()
    );
  } catch (err) {
    res.status(400).send("Create SubCategory failed");
  }
};

exports.list = async (req, res) => {
  res.json(await subCategory.find({}).sort({ createAt: -1 }).exec());
};

exports.read = async (req, res) => {
  const subcategory = await subCategory
    .findOne({ slug: req.params.slug })
    .exec();
  const products = await Product.find({ subcategory: subcategory })
    .populate("subcategory")
    .populate("category")
    .exec();
  res.json({ subcategory, products });
};

exports.update = async (req, res) => {
  const { name, parent } = req.body;
  try {
    const updated = await subCategory.findOneAndUpdate(
      { slug: req.params.slug },
      { name, parent, slug: slugify(name) },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).send("Update SubCategory failed");
  }
};

exports.remove = async (req, res) => {
  try {
    const { name } = req.body;
    const deleted = await subCategory.findOneAndDelete({
      slug: req.params.slug,
    });

    res.json(deleted);
  } catch (err) {
    res.status(400).send("Delete SubCategory failed");
  }
};
