const nodemailer = require('nodemailer');

const send_Mail = async(to, subject, text, html) => {
    // console.log(mailid);
    const transporter = await nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:'testing.rounak@gmail.com',
            pass:'vxobrmvufczjmmhr'
        }
    });
    const mailOption={
        from:'rounak.testing@gmail.com',
        to:to,
        subject:subject,
        text:text,
        html:html

    };

    await transporter.sendMail(mailOption,(err,result)=>{
        if(err)
        console.log(err);
        else
        console.log('Mail send successfully!!!');
    })
}

module.exports = {send_Mail}