# redis_bull_fibonacci

To start up with the project run the following command in terminal:
`docker system prune`
`docker compose build`
`docker compose up`

This will start 2 containers running, after that you can execute requests in Postman application:

1. POST request to **localhost:5000/input**
with body

`{
   "number": "1000"
 }`

The answer will look like:

`{
   "ticket": "1"
}`

2. GET request to **localhost:5000/output?ticket=1**,
where ticket is equal to ticket number received as answer to first request.

To run the tests with **autocannon** execute command:

`node test.js`

Test with Postman


<img width="941" alt="Screenshot 2022-11-08 122759" src="https://user-images.githubusercontent.com/81529705/201786706-618bce94-e841-4aeb-b299-8432a93cdc65.png">
<img width="941" alt="Screenshot 2022-11-08 122759" src="https://user-images.githubusercontent.com/81529705/201786844-38f8cba8-7fb0-4de3-be8a-77a53d06f852.png">
