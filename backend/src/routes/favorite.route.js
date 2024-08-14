import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { 
    addFavoriteMovie, 
    removeFavoriteMovie, 
    getFavoriteMovies 
} from "../controllers/favorite.controller.js";

const router = Router();

router.use(verifyJWT); // Apply JWT verification middleware to all routes

router.route("/add").post(addFavoriteMovie);
router.route("/remove").post(removeFavoriteMovie);
router.route("/").get(getFavoriteMovies);

export default router;
