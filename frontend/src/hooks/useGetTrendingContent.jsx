import { useEffect, useState } from "react";
import { useContentStore } from "../store/content";
import axios from "axios";

const useGetTrendingContent = () => {
	const [trendingContent, setTrendingContent] = useState(null);
	const [error, setError] = useState(null);
	const { contentType } = useContentStore();

	useEffect(() => {
		const getTrendingContent = async () => {
			try {
				const res = await axios.get(`/api/v1/${contentType}/trending`);
				console.log(res.data); // Log the response data
				setTrendingContent(res.data.content);
			} catch (err) {
				setError(err.response?.data?.message || "Failed to load trending content");
				console.error(err);
			}
		};

		getTrendingContent();
	}, [contentType]);

	return { trendingContent, error };
};
export default useGetTrendingContent;