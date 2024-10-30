import nodemailer from "nodemailer";
export const send = async (cuerpo) => {
    try {

        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            auth: {
                user: "olman.acuque02@gmail.com",
                pass: "bvlfuilibuohndid"
            },
            secure: true,
        });


        const mailOptions = {
            from: "olman.acuque02@gmail.com",
            to: "o.acuque@gmail.com",
            subject: "alerta",
            text: cuerpo
        };

        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully!");
    } catch (error) {
        console.log("Error sending email:", error);
    }
};