import express from 'express';
import { getMovieDetails, getMoviesByCategory, getMovieTrailers, getSimilarMovies, getTrendingMovie } from '../Controllers/movie.controller.js';

const router = express.Router();

router.get('/trending', getTrendingMovie);
router.get('/movie/:id/trailers',getMovieTrailers);
router.get('/movie/:id/details', getMovieDetails);
router.get('/movie/:id/similar', getSimilarMovies);
router.get('/movie/:category', getMoviesByCategory);
export default router;