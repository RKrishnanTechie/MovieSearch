import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { searchMovies, getMovieDetails, fetchGenres } from '../controllers/movie.controller.js';

const router = Router();

router.route("/search").get(verifyJWT, searchMovies); // Protect with verifyJWT if needed
router.route("/genres").get(verifyJWT, fetchGenres);  // New route to fetch genres
router.route('/:id').get(verifyJWT, getMovieDetails);

export default router;
