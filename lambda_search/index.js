import express from "express";
import { Client } from "@opensearch-project/opensearch";
import serverless from "serverless-http";

const app = express();

// Route for handling search requests
app.get('/search', async (req, res) => {
  try {
    console.log('Inside Search Query');

    // Extract query parameters from the request
    const searchTerm = req.query.q || '';

    console.log('Search Term is: ', searchTerm);
    // Example Search Query

    // var host = `https://${process.env.USERNAME}:${process.env.PASSWORD}@search-youtube-search-service-yxvorouksotjgr6xbeprgtveaq.us-east-1.es.amazonaws.com`;
		var host_aiven = process.env.AIVEN_OS;

		var client = new Client({
			node: host_aiven
		});

    const { body } = await client.search({
      index: 'video',
      body: {
        query: {
          "simple_query_string": {
            "query": searchTerm,
            "fields": ["title", "author", "description", "videoUrl"]
          }
        }
      }
    });

    const hits = body.hits.hits;
    console.log(hits);
    res.status(200).json(hits);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

const wrappedApp = serverless(app);

export const handler = wrappedApp;