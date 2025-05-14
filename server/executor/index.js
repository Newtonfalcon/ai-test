import express from 'express'
import cors from 'cors'



async function evalandcapture(code) {
    const oldlog = console.log;
    const olderror= console.error;
    

    const output = []
    const  erroroutput =[]

    console.log =  (...args) =>  output.push(args.join(' '))
    console.error =  (...args) =>  erroroutput.push(args.join(' '))
    

    try {
        await eval(code)
    } catch (error) {
        erroroutput.push(error.message)
    }
    
    console.log = oldlog;
    console.log= olderror;

    return { stdout : output.join('\n'), stderr: erroroutput.join('\n')}
    
    
}




const app = express()

const port = 3301

app.use(express.json())
app.use(cors({origin: '*'}))

app.post('/', async(req, res)=>{
    const {code} = req.body
    const result = await evalandcapture(code)
    console.log(code);
    

    res.json(result)
})

app.listen(port,()=>console.log('listening on ' + port)
)