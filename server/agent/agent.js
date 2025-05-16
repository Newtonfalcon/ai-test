import {ChatGroq} from '@langchain/groq'
import {createReactAgent}  from '@langchain/langgraph/prebuilt'
import {tool} from '@langchain/core/tools'
import z from 'zod'
import {MemorySaver} from '@langchain/langgraph'

import dotenv from 'dotenv'
dotenv.config()


const mathTool = tool(async ({query})=>{

    console.log('query', query);
    return `30 + 30 = 60`
    

}, {name:'math', 
    description:'this is a tool that can solve mathematics',
    
    schema:z.object({
        query: z.string().describe("to use in search")
    })
})









const jsExecutor = tool(async ({code})=>{
    
    const responce = await fetch(
        process.env.EXECUTOR_URL, {
            method:'POST',
            headers:{
                'content-type':'application/json'
            },
            body: JSON.stringify({code})
        }
    )

    return await responce.json()
    

},{
    name: 'code executor',
    description:`run general purpose javascript code.
      this can be used to access internet or do any needed computation. 
    the output will be composed of stdout and stderr.
     the code  should be written in  way that itcan be excuted with javascript eval in node environment`,
     schema: z.object({
        code: z.string().describe('the code to run'),
     })
})

const llm = new ChatGroq({
    apiKey: process.env.GROQ_API,
    model:"mixtral-8x7b",
})

const checkpointsaver = new MemorySaver()

export const agent = createReactAgent({
    llm,
    tools:[mathTool, jsExecutor],
    checkpointSaver:checkpointsaver
})

