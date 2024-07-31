import nodemailer  from 'nodemailer'
import { objectConfig } from '../Config/db.js';
import { logger } from './logger.js';

const {gmail_user, gmail_pass} = objectConfig

const transport = nodemailer.createTransport({
    service:'gmail',
    port:587,
    auth:{
        user: gmail_user,
        pass: gmail_pass
    }
})

export const sendPasswordRecoveryEmail = async({email, subject, html}) => {
    try {
        const sendEmail =  await transport.sendMail({
            from: '',
            to: email,
            subject,
            html,
        })
        console.info("Email enviado: ", sendEmail.response)
    } catch (error) {
        console.error("Error al enviar el email: ", error)
        
    }
}