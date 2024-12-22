import {Video} from "../models/video.models.js";


export const performSearch = async (query) => {
    if (!query) {
      return [];
    }
  
    try {
      const results = await Video.find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } }
        ]
      }).populate('owner', 'username avatar fullname ');
      console.log(results);
      return results
    } catch (error) {
      console.error('Error performing search:', error);
      throw error;
    }
  };