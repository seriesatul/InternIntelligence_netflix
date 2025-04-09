import { ENV_VARS } from "../Config/envVars.js";
import { fetchFromTMDB } from "../Services/tmdb.service.js";

export async function getTrendingtv(req, res) {
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/trending/tv/day?language=en-US&api_key=${ENV_VARS.TMDB_API_KEY}`);

       const randomtv = data.results[Math.floor(Math.random() * data.results?.length)]

       res.json({success:true,content:randomtv})
    } catch (error) {
        res.status(500).json({success: false, message: error.message})
        console.log(error.message)
    }
}

export async function gettvTrailers(req,res){
    const { id } = req.params;

    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}/videos?api_key=${ENV_VARS.TMDB_API_KEY}`);
        res.json({success:true, trailers: data.results})
    } catch (error) {
        if(error.message.includes("404")){
            res.status(404).json({success: false, message: "tv not found"})
        }

        else{
            res.status(500).json({success: false, message: error.message})
        }
    }
}

export async function gettvDetails(req, res){
    const { id } = req.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}?api_key=${ENV_VARS.TMDB_API_KEY}`);
        res.status(200).json({success:true, content: data})
    } catch (error) {
        if(error.message.includes("404")){
            res.status(404).json({success: false, message: "tv shows not found"})
        }
        else{
            res.status(500).json({success: false, message: error.message})
        }

    }
}

export async function getSimilartvs(req, res){
    const { id } = req.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}/similar?api_key=${ENV_VARS.TMDB_API_KEY}`);
        res.status(200).json({success:true, content: data.results})
    } catch (error) {
        if(error.message.includes("404")){
        res.status(404).json({success: false, message: "tv not found"})
        }
        else{
            res.status(500).json({success: false, message: error.message})
        }
    }
}

export async function gettvsByCategory(req, res){
    const { category } = req.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/discover/tv?api_key=${ENV_VARS.TMDB_API_KEY}&with_genres=${category}`);
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




