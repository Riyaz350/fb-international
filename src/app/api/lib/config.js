const config = {
  mongodb: {
    uri:
      process.env.MONGODB_URI ||
      "mongodb://localhost:27017/fb-international",
  },
};

export default config; 