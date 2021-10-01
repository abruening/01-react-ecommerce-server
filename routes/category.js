const express = require("express");
const router = express.Router();

//middleware

const { authCheck, adminCheck } = require("../middleware/auth");

//controller

const {
  create,
  read,
  update,
  remove,
  list,
  getSubCategory,
} = require("../controllers/category");

router.post("/category", authCheck, adminCheck, create);
router.get("/categories", list);
router.get("/category/:slug", read);
router.put("/category/:slug", authCheck, adminCheck, update);
router.delete("/category/:slug", authCheck, adminCheck, remove);
router.get("/category/subcategory/:_id", getSubCategory);

module.exports = router;
