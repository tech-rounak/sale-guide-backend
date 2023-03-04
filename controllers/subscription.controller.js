const Subscriber = require('../models/subscription');
const cheerio = require('cheerio');
const axios = require('axios');

const { sendEmail } = require('../service/email.service');

const { priceTriggered } = require('../templates/offer');

const addSubscriber = async( req, res )=>{
    let statusCode = 201;
    try{
        const  {email ,productLink,price} = req.body;
    
        const data = await webScrap(productLink);

        if(data.price == '' || data.productName === ''){
            statusCode = 400;
            throw new Error('Invalid Flipkart Product Link, Add a valid one!!');
        }
        let currPrice = data.price;
        currPrice = currPrice.replaceAll(',','');
        currPrice = Number(currPrice.substring(1));
   
        if(Number(currPrice) < Number(price)){
            statusCode = 400;
            throw new Error('Please add a price less then current Price');
        }

        const subscriber = new Subscriber({
            email:email,
            productLink:productLink,
            price,
            productName:data.productName
        });
        
        await subscriber.save();
        // const mailTemplate = priceTriggered(subscriber.productName, currPrice, subscriber.productLink);
        // await sendEmail(subscriber.email,"price","price",mailTemplate);
        res.status(200).send({result:subscriber,msg:"Newsletter Subscribed Successfully"});
    }
    catch(err){
        console.log(err.message);
        res.status(statusCode).send({msg:err.message});
    }
}

const webScrap = async(url) => {
    try{
    // console.log(url);
        const response = await axios({
            method:'get',
            url:url,
            headers:{
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "en-GB,en;q=0.6"
            },
            gzip:true
        })

        let $ = cheerio.load(response.data);
        let price = $('div[class="_30jeq3 _16Jk6d"]').text();
        let productName = $('span[class="B_NuCI"]').text();
        if(price==null){
            throw new Error('')
        }
        return ({price,productName});
    }
    catch(error){
        // console.log(error.message);
        return error.message;
    }
}

const discountChecker = async()=>{
    const subscriber = await Subscriber.find({isActive:true});

    for(let i = 0 ; i < subscriber.length; i++){
        const data = await webScrap(subscriber[i].productLink);
        let currPrice = data.price;
        currPrice = currPrice.replaceAll(',','');
        currPrice = Number(currPrice.substring(1));

        if( Number(currPrice) <= Number(subscriber[i].price)){
            
            subscriber[i].isActive = false;
            const subject = 'Price Triggered';
            const text = `Price Triggered`
            await sendEmail(subscriber[i].email,subject,text,priceTriggered(subscriber[i].productName, currPrice, subscriber[i].productLink));
            
            await subscriber[i].save();
        }
    }
}
module.exports = {
    addSubscriber,
    discountChecker
}