import {app} from "./app_settings";
import {Request,Response} from 'express';

const port = process.env.port || 5000;

app.get('/', (req:Request, res:Response)=>{
    res.send('DEFAULT GET REQUEST')
})

app.listen(port, ()=> {
    console.log(`Example app listening on port ${port}`)
})



