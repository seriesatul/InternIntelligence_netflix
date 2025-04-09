import axios from 'axios';
import { ENV_VARS } from '../Config/envVars.js';

const url = 'https://api.themoviedb.org/3/account/21869496/lists?page=1';



export const fetchFromTMDB = async (url) => {
    const options = {
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer ' + ENV_VARS.TMDB_API_KEY
        }
      };

      const response = await axios.get(url, options)

      if (response.status!==200) {
        throw new Error(`Failed to fetch data from TMDB, status: ${response.status}`);
      }

      return response.data;
}