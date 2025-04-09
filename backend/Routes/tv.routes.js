import express from 'express';
import { getSimilartvs, getTrendingtv, gettvDetails, gettvsByCategory, gettvTrailers } from '../Controllers/tv.controller.js';


const router = express.Router();


router.get('/trending', getTrendingtv);
router.get('/tv/:id/trailers',gettvTrailers);
router.get('/tv/:id/details', gettvDetails);
router.get('/tv/:id/similar', getSimilartvs);
router.get('/tv/:category', gettvsByCategory);


export default router;
