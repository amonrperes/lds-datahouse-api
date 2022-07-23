const nodemailer = require('nodemailer');

class EmailSender{
    #sendEmail(params){
        let ret = {
            status: 'ERROR'
        }
        let transporter = nodemailer.createTransport({
            host: params.service,
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: params.auth.user,
                pass: params.auth.pass
            }    
        });
        let sender = params.auth.user;
        let mailOptions = {
            from: sender,
            to: params.recipient,
            subject: params.subject,
            text: params.body
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              ret.message = error
            } else {
              ret.status = 'OK';
              ret.message = info.response;
            }
        });
        return ret; 
    }
    notify(email, sid, token) {
        const ret = this.#sendEmail({
            service: 'smtp.gmail.com',
            auth: {
                user: 'smartwallets7@gmail.com',
                pass: 'HelloWorld2021!'
            },
            recipient: email,
            subject: 'LDS Datahouse API Credentials',
            body: `API_SID: ${sid}  API_TOKEN: ${token}`
        });    
        return ret;
    }
}

module.exports = EmailSender;