import { Router } from "express";
import { addReview, editReview, deleteReview, getReviewsByMovie } from "../controllers/review.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/add", verifyJWT, addReview);
router.put("/edit", verifyJWT, editReview);
router.delete("/delete", verifyJWT, deleteReview);
router.get("/movie/:movieId", getReviewsByMovie);

export default router;
    