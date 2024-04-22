import nodemailer from "nodemailer";
 
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