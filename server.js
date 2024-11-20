const express = require('express'), 
  dotenv = require('dotenv'),
  cors = require('cors'),
  { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

const app = express();
let PORT = 8000;

app.use(express.static('public'))

//enable CORS
app.use(cors())
app.use(express.json())

//init Gemini's API
let genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

app.post('/api/generate', async (req, res) => {
  let userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({error: "Message is required"})
  }

  try {
    let model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash'})
    let result = await model.generateContent([userMessage])
    res.json({ reply: result.response.text() })
  } catch (error) {
    console.error("Gemini API error: ", error)
    res.status(500).json({ error: error.message })
  }
})

//server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})

