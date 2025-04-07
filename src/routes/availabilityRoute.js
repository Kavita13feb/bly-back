const express = require('express');
const { calculateAvailableTimes } = require('../tests/test1');

const availabilityRouter = express.Router();

availabilityRouter.post('/', async(req,res)=>{
    try {
        const  {existingBookings, startTime, endTime, bufferTime} = req.body

   let   timeSlots=  await calculateAvailableTimes(existingBookings, startTime, endTime, bufferTime)   
        res.status(200).send(timeSlots)
    } catch (error) {
       console.log(error) 
    }
 
    
});



module.exports = availabilityRouter;
