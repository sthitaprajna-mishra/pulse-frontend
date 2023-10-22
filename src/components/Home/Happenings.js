import { Box, Typography, IconButton } from "@mui/material";
import React, { useState, useEffect } from "react";
import { axiosPrivate } from "../../api/axios";
import { v4 as uuidv4 } from "uuid";
import fallback from "../../assets/fallback.jpg";
import CachedOutlinedIcon from "@mui/icons-material/CachedOutlined";
import SkeletonNews from "../Utility/SkeletonNews";
import "../../styles.css";
import HappeningItem from "./HappeningItem";

// Helper component for image preloading and error handling
const ImagePreloader = ({ src, onLoad, onError }) => {
  useEffect(() => {
    const img = new Image();
    img.src = src;

    img.onload = onLoad;
    img.onerror = onError;
  }, [src, onLoad, onError]);

  return <></>;
};

const Happenings = () => {
  const [news, setNews] = useState();
  const [allNews, setAllNews] = useState();
  const [showMoreNews, setShowMoreNews] = useState(false);
  const [isNewsLoading, setIsNewsLoading] = useState(false);

  const skeletonArray = Array.from({ length: 5 });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setIsNewsLoading(true);
    setNews(null);
    setAllNews(null);
    const responseIN = await axiosPrivate.get(`api/News/GetNews`);
    const responseUS = await axiosPrivate.get(`api/News/GetNews/?countries=us`);

    console.log(responseIN);

    if (
      responseIN.status === 200 &&
      responseUS.status === 200 &&
      responseIN.data.statusCode === 200 &&
      responseUS.data.statusCode === 200
    ) {
      const jsonDataIN = JSON.parse(responseIN.data.content);
      const jsonDataUS = JSON.parse(responseUS.data.content);

      const filteredDataIN = jsonDataIN.data.filter(
        (item) => item && item.title !== null && item.image !== null
      );
      const filteredDataUS = jsonDataUS.data.filter(
        (item) =>
          item &&
          item.title !== null &&
          item.image !== null &&
          item.source !== "dvidshub"
      );

      const shuffledIN = getRandomNews(filteredDataIN, 5);
      const shuffledUS = getRandomNews(filteredDataUS, 5);

      // Concatenate both shuffled arrays
      const combinedShuffled = [...shuffledIN, ...shuffledUS];

      // Shuffle the combined array again to get a mix of both IN and US news
      const finalShuffledNews = getRandomNews(
        combinedShuffled,
        combinedShuffled.length
      );

      const postsWithKeys = finalShuffledNews.map((post) => ({
        ...post,
        id: uuidv4(),
      }));

      setAllNews(postsWithKeys);
      setNews(postsWithKeys.slice(0, 5));
      setShowMoreNews(!(postsWithKeys.length > 5));
      setIsNewsLoading(false);
    }

    if (
      responseIN.status === 200 &&
      responseUS.status === 200 &&
      responseIN.data.statusCode === 429 &&
      responseUS.data.statusCode === 429
    ) {
      const jsonData = JSON.parse(responseIN.data.content);

      const filteredData = jsonData.data.filter(
        (item) =>
          item &&
          item.title !== null &&
          item.image !== null &&
          item.source !== "dvidshub"
      );

      // const shuffledIN = getRandomNews(filteredDataIN, 5);
      const shuffled = getRandomNews(filteredData, 5);

      // Concatenate both shuffled arrays
      const combinedShuffled = [...shuffled];

      // Shuffle the combined array again to get a mix of both IN and US news
      const finalShuffledNews = getRandomNews(
        combinedShuffled,
        combinedShuffled.length
      );

      const postsWithKeys = finalShuffledNews.map((post) => ({
        ...post,
        id: uuidv4(),
      }));

      setAllNews(postsWithKeys);
      setNews(postsWithKeys.slice(0, 5));
      setShowMoreNews(!(postsWithKeys.length > 5));
      setIsNewsLoading(false);
    }
  };

  const getRandomNews = (array, count) => {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const handleImageLoad = () => {
    // Image loaded successfully, do nothing as the image is already preloaded
  };

  const handleImageError = (index) => {
    // Image failed to load or returned a 404 error, replace the invalid image URL with the fallback image URL
    setNews((prevNews) => {
      const updatedNews = [...prevNews];
      updatedNews[index].image = fallback;
      return updatedNews;
    });
  };

  const handleShowNews = () => {
    if (showMoreNews) {
      setNews([...allNews].slice(0, 5));
      setShowMoreNews(false);
    } else {
      setNews([...allNews]);
      setShowMoreNews(true);
    }
  };

  return (
    <Box
      sx={{
        height: "auto",
        bgcolor: "#EFF3F4",
        mt: "3rem",
        ml: "0.5rem",
        pt: "1rem",
        borderRadius: "20px",
        width: "350px",
        // display: "flex",
        // flexDirection: "column",
        // alignItems: "start",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          pb: "1rem",
          pl: "1rem",
        }}
      >
        <Typography textAlign="left" fontSize="1.4rem" fontWeight="700">
          What's happening
        </Typography>
        <IconButton
          sx={{ mr: "1rem" }}
          color="primary"
          title="Refresh"
          onClick={() => fetchNews()}
          className={isNewsLoading ? "rotating-icon" : ""}
        >
          <CachedOutlinedIcon />
        </IconButton>
      </Box>

      {news
        ? news.map((newsItem, index) => {
            console.log(newsItem);
            return (
              <Box key={newsItem.id}>
                <ImagePreloader
                  src={newsItem.image}
                  onLoad={handleImageLoad}
                  onError={() => handleImageError(index)}
                />
                <HappeningItem newsItem={newsItem} />
              </Box>
            );
          })
        : skeletonArray.map((_, index) => {
            return <SkeletonNews key={index} />;
          })}
      <Box
        sx={{
          pt: "0.5rem",
          pb: "1rem",
          px: "1rem",
          display: "flex",
          justifyContent: "space-between",
          "&:hover": {
            bgcolor: "#E1E8EA",
            cursor: "pointer",
            borderBottomLeftRadius: "20px",
            borderBottomRightRadius: "20px",
            transition: "background-color 0.3s",
          },
        }}
      >
        <Box
          sx={{ display: "flex", flexDirection: "column", alignItems: "start" }}
          onClick={() => handleShowNews()}
        >
          <Typography fontSize="1rem" fontWeight="200" color="#1D9BF0">
            {showMoreNews ? "Show less" : "Show more"}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Happenings;
