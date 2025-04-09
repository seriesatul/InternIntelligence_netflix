import { ENV_VARS } from "../Config/envVars.js";
import { fetchFromTMDB } from "../Services/tmdb.service.js";

export async function getTrendingMovie(req, res) {
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/trending/movie/day?language=en-US&api_key=${ENV_VARS.TMDB_API_KEY}`);

       const randomMovie = data.results[Math.floor(Math.random() * data.results?.length)]

       res.json({success:true,content:randomMovie})
    } catch (error) {
        res.status(500).json({success: false, message: error.message})
        console.log(error.message)
    }
}

export async function getMovieTrailers(req,res){
    const { id } = req.params;

    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${ENV_VARS.TMDB_API_KEY}`);
        res.json({success:true, trailers: data.results})
    } catch (error) {
        if(error.message.includes("404")){
            res.status(404).json({success: false, message: "Movie not found"})
        }

        else{
            res.status(500).json({success: false, message: error.message})
        }
    }
}

export async function getMovieDetails(req, res){
    const { id } = req.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}?api_key=${ENV_VARS.TMDB_API_KEY}`);
        res.status(200).json({success:true, content: data})
    } catch (error) {
        if(error.message.includes("404")){
            res.status(404).json({success: false, message: "Movie not found"})
        }
        else{
            res.status(500).json({success: false, message: error.message})
        }

    }
}

export async function getSimilarMovies(req, res){
    const { id } = req.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}/similar?api_key=${ENV_VARS.TMDB_API_KEY}`);
        res.status(200).json({success:true, content: data.results})
    } catch (error) {
        if(error.message.includes("404")){
        res.status(404).json({success: false, message: "Movie not found"})
        }
        else{
            res.status(500).json({success: false, message: error.message})
        }
    }
}

export async function getMoviesByCategory(req, res){
    const { category } = req.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/movie?api_key=${ENV_VARS.TMDB_API_KEY}&with_genres=${category}`);
        res.status(200).json({success:true, content: data.results})
    } catch (error) {
        if(error.message.includes("404")){
            res.status(404).json({success: false, message: "Category not found"})
        }
        else{
            res.status(500).json({success: false, message: error.message})
        }
    }
}




