require("dotenv").config();
const { resolve } = require("path");

module.exports = {
    TOKEN: process.env.TOKEN || "YOUR_TOKEN",  // your bot token
    EMBED_COLOR: process.env.EMBED_COLOR || "#FF7100", //<= default is "#000001"

    SEARCH_DEFAULT: ["gustixa", "mockingbird", "justin bieber", "post malone", "anime song"],

    OWNER_ID: process.env.OWNER_ID || "989430735561715712", //your owner discord id example: "515490955801919488"

    NP_REALTIME: process.env.NP_REALTIME || "BOOLEAN", // "true" = realtime, "false" = not realtime :3 // WARNING: on set to "true" = laggy and bot will ratelimit if you have a lot of servers
    LEAVE_TIMEOUT: parseInt(process.env.LEAVE_TIMEOUT || "120000"), // leave timeout default  "120000" = 2 minutes // 1000 = 1 seconds

    LANGUAGE: {
      defaultLocale: process.env.LANGUAGE || "en", // "en" = default language
      directory: resolve("languages"), // <= location of language
    },

    DEV_ID: [], // if you want to use command bot only, you can put your id here example: ["123456789", "123456789"]

    MONGO_URI: process.env.MONGO_URI || "mongodb+srv://mango1:mango1@ytdatabase.erk5d9e.mongodb.net/?retryWrites=true&w=majority", // your mongo uri
    LIMIT_TRACK: parseInt(process.env.LIMIT_TRACK || "50"),  //<= dafault is "50" // limit track in playlist
    LIMIT_PLAYLIST: parseInt(process.env.LIMIT_PLAYLIST || "10"), //<= default is "10" // limit can create playlist per user

    DEFAULT_SEARCH: "ytsearch", // default search engine & "ytmsearch" / "ytsearch" / "scsearch" / "spsearch"
    NODES: [
      { 
        identifier: "NanoSpace",
        host: process.env.NODE_HOST || "lavalink.oddcoder.xyz",
        port: parseInt(process.env.NODE_PORT || "443"),
        password: process.env.NODE_PASSWORD || "oddcoder",
        retryAmount: 10,
        retryDelay: 7500,
        secure: true
      } 
    ],
}