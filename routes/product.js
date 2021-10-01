const express = require("express");
const router = express.Router();

//middleware

const { authCheck, adminCheck } = require("../middleware/auth");

//controller

const {
  create,
  listAll,
  read,
  update,
  remove,
  list,
  productsCount,
  productStar,
  listRelated,
  searchFilters,
} = require("../controllers/product");

router.post("/product", authCheck, adminCheck, create);
router.get("/products/:count", listAll);
router.get("/product/:slug", read);
router.put("/product/:slug", authCheck, adminCheck, update);
router.delete("/product/:slug", authCheck, adminCheck, remove);
router.post("/products", list);
router.get("/productstotal", productsCount);
router.put("/product/star/:productId", authCheck, productStar);
router.get("/product/related/:productId", listRelated);
router.post("/search/filters", searchFilters);

module.exports = router;
