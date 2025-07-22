// domain.com/verifytoken/asaskjdskhalkhdfjhjhd        //better if doing thorugh server component
// domain.com/verifytoken?token=asdasdad               //better if i do with client component

import nodemailer from 'nodemailer';
import User from '@/models/userModel.js';
import bcryptjs from 'bcryptjs';


export const sendEmail = async({email, emailType, userId}:any) =>{
    try {
        const hashedToken = await bcryptjs.hash(userId.toString(), 10)

        if(emailType === "VERIFY"){
            await User.findByIdAndUpdate(userId,
            {
                verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000 // 1 hour
            }
        )
        }
        else if(emailType === "RESET_PASSWORD"){
            await User.findByIdAndUpdate(userId,
            {
                forgotPasswordToken: hashedToken, forgotPasswordExpiry: Date.now() + 3600000 // 1 hour
            }
        )
        }

        // Looking to send emails in production? Check out our Email API/SMTP product!
        var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "de409004e345dd",
            pass: "d40c36eb123b4d"
        }
        });

        const mailOptions = {
            from: 'kodanta@gmail.com',
            to: email,
            subject: emailType === "VERIFY" ? "Verify your account" : "Reset your password",
            html: `<p> Click <a href="${process.env.DOMAIN || 'http://localhost:3000'}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your account" : "reset your password"}.
            or copy paste this link in your browser. <br> ${process.env.DOMAIN || 'http://localhost:3000'}/verifyemail?token=${hashedToken} <br>
            </p>`

        }

        const mailresponse = await transport.sendMail(mailOptions);
        return mailresponse;

    } catch (error:any) {
        throw new Error(error.message)
    }
}