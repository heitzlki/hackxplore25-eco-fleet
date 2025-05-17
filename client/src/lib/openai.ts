import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://litellm.sph-prod.ethz.ch/v1",
  apiKey: process.env.OPENAI_API_KEY
});

export default client;

