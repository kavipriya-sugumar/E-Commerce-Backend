import { sendFeedbackMail } from '../utils/nodemailer.js';
 
 
export const sendFeedback=async (req, res, next) => {
    const { name, email, phone, feedback_text } = req.body;
 
    try {
        await sendFeedbackMail({ name, email, phone, feedback_text });
        res.status(200).json({ message: 'Feedback sent successfully' });
    } catch (error) {
        next(error);
    }
};