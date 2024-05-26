import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Client } from "@opensearch-project/opensearch";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors({
  allowedHeaders: ["*"],
  origin: "*"
}));
app.use(express.json());

// Route for uploading a video
app.post('/upload', async (req, res) => {
  try {
    console.log('Inside Upload Call');

    // Process video upload and extract metadata
    const { title, description, author, videoUrl } = req.body;

    var host =
			`https://${process.env.USERNAME}:${process.env.PASSWORD}@search-youtube-search-service-yxvorouksotjgr6xbeprgtveaq.us-east-1.es.amazonaws.com`;
    var host_aiven = process.env.AIVEN_OS;

    var client = new Client({
      node : host
    });

    var index_name = "video";
    var document = {
      title: title,
      author: author,
      description: description,
      videoUrl: videoUrl
    };

    var response = await client.index({
      id: title,
      index: index_name,
      body: document,
      refresh: true
    });

    console.log("Adding Document");
    console.log(response.body);

    // Respond with Success Message
    res.status(200).json({ message: 'Video Uploaded Successfully'})

  } catch (error) {
    
    // Respond with error message
    console.log(error.message);
    res.status(500).json({ error: 'Internal Server Error'})
  }
});

app.get('/', (req, res) => {
  res.send('OpenSearch Server')
});

app.listen(PORT, () => {
  console.log(`OpenSearch Server Listening on http://localhost:${PORT}`);
})