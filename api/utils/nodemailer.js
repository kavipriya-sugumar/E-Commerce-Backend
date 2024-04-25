import nodemailer from "nodemailer";
 
<<<<<<< HEAD
const transporter= nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.SMTP_USER,
        pass:process.env.SMTP_PASS
    },authMethod:"PLAIN"
    });
   
   
   
    export const sendMailOtp= async(email,otp)=>{
        const mailOptions = {
            from: process.env.SMTP_USER ?? email,
            to: email,
            subject: 'Verify OTP',
            text:  `To verify your email address, please use the following One Time Password (OTP):
            ${otp}
            Do not share this OTP with anyone. Digamend- takes your account security very seriously. Digamend Customer Service will never ask you to disclose or
            verify your Digamend password, OTP, credit card, or banking account number. If you receive a suspicious
            email with a link to update your account information, do not click on the link—instead, report the email to Digamend for investigation.
            Thank you!`
        };
   
        try {
            const info = await transporter.sendMail(mailOptions);
            console.log('OTP Email sent: ' + info.response);
            return info;
        } catch (error) {
            console.log('Error sending OTP Email: ', error);
            throw error;
        }
    };
   
   
    export const sendFeedbackMail=async (name,email,phone,feedback_text)=>{
        let mailOptions={
            from:`${email}`,
            to:process.env.RECIPIENT,
            subject:"Got a feedback from "+name,
       
            html:`<h2>Got a message</h2>
            <h3>From:${name}</h3>
            <p>${email}</p>
            <p>${phone}</p>
            <p>${feedback_text}</p>`
        };
        try {
            const info = await transporter.sendMail(mailOptions);
            console.log('Feedback Email sent: ' + info.response);
            return info;
        } catch (error) {
            console.log('Error sending Feedback Email: ', error);
            throw error;
        }
    };
   
=======
// Create a transporter object using SMTP
const sendEmail = async (email, otp) => {
    console.log(email, otp)
    let transporter = nodemailer.createTransport({
         service: 'gmail',
        auth: {
            user: "kavipriya2912002@gmail.com",
            pass: 'wtipdelrgbpoxmeg'
        }
 
    });
 
    // Define email options
    console.log(email, otp)
    let mailOptions = {
        from: "kavipriya2912002@gmail.com",
        to: email,
        subject: 'verify OTP',
        text: `
        To verify your email address, please use the following One Time Password (OTP):
        ${otp}
        Do not share this OTP with anyone. Digamend- takes your account security very seriously. Digamend Customer Service will never ask you to disclose or
        verify your Digamend password, OTP, credit card, or banking account number. If you receive a suspicious
        email with a link to update your account information, do not click on the link—instead, report the email to Digamend for investigation.
        Thank you!`
    };
 
    try {
        // Send the email
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.log('Error occurred: ', error);
    }
}
 
export default sendEmail;
>>>>>>> 38a86b5f93c26ff8c37e60353da82fb9e9a88823
