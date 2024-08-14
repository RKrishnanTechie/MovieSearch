import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { searchMovies } from '../controllers/movie.controller.js';
import { getMovieDetails } from '../controllers/movie.controller.js';

const router = Router();

router.route("/search").get(verifyJWT, searchMovies); // Protect with verifyJWT if needed
router.route('/:id').get(verifyJWT, getMovieDetails);


export default router;





