import OpenAI from "openai";
import { config } from "./env.js";

const openai = config.OPENAI_API_KEY ?
    new OpenAI({
        apiKey: config.OPENAI_API_KEY,
    }) :
    null;

export default openai;