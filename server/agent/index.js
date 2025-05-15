import express from 'express'
import  cors from 'cors'
import {agent} from './agent.js'
import serverless from 'serverless-http'




const app= express()
serverless(app)
app.use(express.json())
app.use(cors({origin:'*'}))


const port = 3300



app.get('/', (req, res)=>{

 res.send("hello world")
})


app.post('/generate', async (req,res)=>{

    const {prompt, thread_id} = req.body

    const result =  await agent.invoke({


        messages: [{
            role:"user",
            content : prompt
        }]
    }, {configurable: {thread_id}});

    res.json(result.messages.at(-1)?.content)

})

app.listen(port, console.log("server is running on port")
)