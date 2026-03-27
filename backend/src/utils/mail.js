import Mailgen from 'mailgen'
import Nodemailer from 'nodemailer'


const sendMail = async function (mailOptions) {
    let mailgenerator = new Mailgen({
        theme : "default",
        product : {
            name : "BILL ORGANIZATION",
            link : "http://sampleproject.com"
        }
    })

    const emailHtml = mailgenerator.generate(mailOptions.mailgenContent);
    const emailText = mailgenerator.generatePlaintext(mailOptions.mailgenContent);

    let transporter = Nodemailer.createTransport({
        host: process.env.EMAIL_SMTP_HOST,
        port: process.env.EMAIL_SMTP_PORT,
        secure: false,
        family: 4,
        auth : {
            user : process.env.EMAIL_SMTP_USER,
            pass :process.env.EMAIL_SMTP_PASSWORD
        }
    });

    const mail = {
        from : "2200039073cser@gmail.com",
        to : mailOptions.email,
        subject : mailOptions.subject,
        text: emailText,
        html : emailHtml
    }

    try {
        await transporter.sendMail(mail);
        console.log("email sent successfully");
    } catch (error) {
        console.log("error while sending email", error);
    }
}



const emailVerificationMailgenContent = function(username , verificationUrl){
    return {
        body : {
           name : username,
           intro: "We come to our App! we are excited to have you on board." ,
           action : {
                instructions: "To verify your email please , click on following button",
                button : {
                    color : "#22BC66",
                    text : "verify your mail",
                    link : verificationUrl
                },
            },
            outro: "Need help, or have questions? Just reply to this email, we'd love to help."
        }
    }
}

const forgetPasswordMailgenContent = function(username , passwordResetUrl){
    return {
        body : {
            name : username,
           intro: "We got the request to reset your password! No worries, we are here to help you." ,
           action : {
                instructions: "To reset your password, click on the following button",
                button : {
                    color : "#22BC66",
                    text : "Reset Password",
                    link : passwordResetUrl
                },
            },
            outro: "Need help, or have questions? Just reply to this email, we'd love to help."
        }
    }
}

export {emailVerificationMailgenContent, forgetPasswordMailgenContent, sendMail};