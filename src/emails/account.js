const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'namankumar821310@gmail.com',
        subject: 'Welcome to the Task-App!',
        text: `Thanks ${name} for joining in.Let me know how you get along with the app.`
    })
}

const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'namankumar821310@gmail.com',
        subject: 'Thanks for using our Task-App!',
        text: `Thanks ${name} for using our app.But we will surely want to know your reasons for cancellation and is there any way we can improve our services.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}