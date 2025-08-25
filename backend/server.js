require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const sessionRoutes = require('./routes/sessionRoutes')
const questionRoutes = require('./routes/questionRoutes')
const { protect } = require('./middlewares/authMiddleware')
const { generateInterviewQuestions, generateConceptExplanation } = require('./controllers/aiController')


const app = express()
const port = process.env.PORT || 3000


app.use(
    cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }
))
 
connectDB()

app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/sessions', sessionRoutes)
app.use('/api/questions', questionRoutes)

app.use('/api/ai/generate-questions', protect, generateInterviewQuestions)
app.use('/api/ai/generate-explanation', protect, generateConceptExplanation)

app.use("/uploads", express.static(path.join(__dirname, 'uploads'),{}))
 
app.get('/', (req, res) => {
    res.send('This is get request')
})
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
}) 