const Product = require("../models/product");
const User = require("../models/user");
const slugify = require("slugify");

exports.create = async (req, res) => {
  try {
    req.body.slug = slugify(req.body.title);
    const newProduct = await new Product(req.body).save();
    res.json(newProduct);
  } catch (err) {
    // res.status(400).send("Create Product failed");
    res.status(400).json({ err: err.message });
  }
};

exports.listAll = async (req, res) => {
  let products = await Product.find({})
    .limit(parseInt(req.params.count))
    .populate("category")
    .populate("subcategory")
    .sort([["createdAt", "desc"]])
    .exec();
  res.json(products);
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Product.findOneAndRemove({
      slug: req.params.slug,
    }).exec();
    res.json(deleted);
  } catch (err) {
    res.status(400).send("Delete Product failed");
  }
};

exports.read = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug })
    .populate("category")
    .populate("subcategory")
    .exec();
  res.json(product);
};

exports.update = async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updated = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true }
    ).exec();
    res.json(updated);
  } catch (err) {
    res.status(400).send("Update Product failed");
  }
};

// Sin Paginacion
// exports.list = async (req, res) => {
//   try {
//     const { sort, order, limit } = req.body;
//     const products = await Product.find({})
//       .populate("category")
//       .populate("subcategory")
//       .sort([[sort, order]])
//       .limit(limit)
//       .exec();
//     res.json(products);
//   } catch (err) {
//     console.log(err);
//   }
// };

// Con Paginacion
exports.list = async (req, res) => {
  try {
    const { sort, order, page } = req.body;

    const currentPage = page || 1;
    const perPage = 3;

    const products = await Product.find({})
      .skip((currentPage - 1) * perPage)
      .populate("category")
      .populate("subcategory")
      .sort([[sort, order]])
      .limit(perPage)
      .exec();
    res.json(products);
  } catch (err) {
    console.log(err);
  }
};

exports.productsCount = async (req, res) => {
  let total = await Product.find({}).estimatedDocumentCount().exec();
  console.log(total);
  res.json(total);
};

exports.productStar = async (req, res) => {
  const product = await Product.findById(req.params.productId).exec();
  const user = await User.findOne({ email: req.user.email }).exec();

  const { star } = req.body;
  let existingRatingObject = product.ratings.find(
    (e) => e.postedBy.toString() === user._id.toString()
  );
  if (existingRatingObject === undefined) {
    let ratingAdded = await Product.findByIdAndUpdate(
      product._id,
      {
        $push: { ratings: { star: star, postedBy: user._id } },
      },
      { new: true }
    ).exec();
    res.json(ratingAdded);
  } else {
    const ratingUpdated = await Product.updateOne(
      {
        ratings: { $elemMatch: existingRatingObject },
      },
      { $set: { "ratings.$.star": star } },
      { new: true }
    ).exec();
    res.json(ratingUpdated);
  }
};

exports.listRelated = async (req, res) => {
  const product = await Product.findById(req.params.productId).exec();

  const related = await Product.find({
    _id: { $ne: product._id }, // ne=not equal
    category: product.category,
  })
    .limit(3)
    .populate("category")
    .populate("subcategory")
    .populate("postedBy")
    .exec();
  res.json(related);
};

const handlePrice = async (req, res, price) => {
  try {
    let products = await Product.find({
      price: {
        $gte: price[0],
        $lte: price[1],
      },
    })
      .populate("cagegory", "_id name")
      .populate("subcategory", "_id name")
      .populate("postedBy", "_id name")
      .exec();
    res.json(products);
  } catch (err) {
    console.log(err);
  }
};

const handleQuery = async (req, res, query) => {
  const products = await Product.find({ $text: { $search: query } })
    .populate("cagegory", "_id name")
    .populate("subcategory", "_id name")
    .populate("postedBy", "_id name")
    .exec();
  res.json(products);
};

const handleCategory = async (req, res, category) => {
  try {
    console.log(category);
    if (category.length > 0) {
      const products = await Product.find({ category })
        .populate("cagegory", "_id name")
        .populate("subcategory", "_id name")
        .populate("postedBy", "_id name")
        .exec();
      res.json(products);
    } else {
      console.log("hola");
      const products = await Product.find({})
        .populate("cagegory", "_id name")
        .populate("subcategory", "_id name")
        .populate("postedBy", "_id name")
        .exec();
      res.json(products);
    }
  } catch (err) {
    console.log(err);
  }
};

const handleStars = (req, res, stars) => {
  Product.aggregate([
    {
      $project: {
        document: "$$ROOT",
        floorAverage: { $floor: { $avg: "$ratings.star" } },
      },
    },
    { $match: { floorAverage: stars } },
  ])
    .limit(12)
    .exec((err, aggregates) => {
      if (err) console.log(err);
      Product.find({ _id: aggregates })
        .populate("cagegory", "_id name")
        .populate("subcategory", "_id name")
        .populate("postedBy", "_id name")
        .exec((err, products) => {
          console.log(err);
          res.json(products);
        });
    });
};

const handleSubCategories = async (req, res, subcategory) => {
  const products = await Product.find({ subcategory: subcategory })
    .populate("cagegory", "_id name")
    .populate("subcategory", "_id name")
    .populate("postedBy", "_id name")
    .exec();
  res.json(products);
};

const handleShipping = async (req, res, shipping) => {
  const products = await Product.find({ shipping: shipping })
    .populate("cagegory", "_id name")
    .populate("subcategory", "_id name")
    .populate("postedBy", "_id name")
    .exec();
  res.json(products);
};
const handleColor = async (req, res, color) => {
  const products = await Product.find({ color: color })
    .populate("cagegory", "_id name")
    .populate("subcategory", "_id name")
    .populate("postedBy", "_id name")
    .exec();
  res.json(products);
};
const handleBrand = async (req, res, brand) => {
  const products = await Product.find({ brand: brand })
    .populate("cagegory", "_id name")
    .populate("subcategory", "_id name")
    .populate("postedBy", "_id name")
    .exec();
  res.json(products);
};

exports.searchFilters = async (req, res) => {
  const { query, price, category, stars, subcategory, shipping, color, brand } =
    req.body;

  if (query) {
    await handleQuery(req, res, query);
  }
  if (price !== undefined) {
    await handlePrice(req, res, price);
  }

  if (category) {
    await handleCategory(req, res, category);
  }

  if (stars) {
    console.log(stars);
    await handleStars(req, res, stars);
  }

  if (subcategory) {
    await handleSubCategories(req, res, subcategory);
  }

  if (shipping) {
    await handleShipping(req, res, shipping);
  }

  if (color) {
    await handleColor(req, res, color);
  }

  if (brand) {
    await handleBrand(req, res, brand);
  }
};
