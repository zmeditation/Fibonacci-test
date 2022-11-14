const express = require('express');
const bodyParser = require('body-parser');
const util = require("util");
const dotenv = require("dotenv");
const Queue = require('bull');
const { v4: uuidv4 } = require('uuid');
const morgan = require('morgan');

dotenv.config({ path: './config.env' });

const taskQueue = new Queue('task queue', process.env.REDIS_URL);

const app = express();

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const results = new Map();

async function getFibonacci(num) {
    let m = BigInt(num);
    if(m) m -= 1n;
    if (m == 0) return 0n;
    if (m <= 2) return 1n;
    
    let a = BigInt(1), b = BigInt(1);
    for(let i = 3n; i <= m; i++) {
        let c = a + b;
        a = b;
        b = c;
    }
    return b.toString();
}
taskQueue.on("global:completed", function (job, result) {
    console.log(`Job ${job} is completed. The result is: ${result}`)  
    results.set(job, result);
});

taskQueue.process(async function (job, done) {
    let result = await getFibonacci(job.data.num);
    done(null, result);
});

let jobId="0";
app.post('/input', async (req, res) => {
    const { number } = req.body;
    let jobId_res = BigInt(jobId) + 1n;
    jobId = jobId_res.toString();
    const job = await taskQueue.add({ num: +number }, {id: jobId} );
    res.status(200).json({ ticket: jobId })
});

app.get('/output', async (req, res) => {
    const { ticket } = req.query;
    let job = await taskQueue.getJob(ticket);
    if(results.has(job.id)) {
        res.status(200).json({ Fibonacci: results.get(job.id) });
    }
    else {
        res.status(404).json({ error: "not found" });    
    }
});

let port = +process.env.PORT;

app.listen(port, () => {
    console.log("Server is running on port", port)
})