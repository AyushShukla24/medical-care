import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

export default async function sendmail(to){
    try { 
        const delayMilliseconds = 20000;
        await new Promise((resolve) => setTimeout(resolve, delayMilliseconds));
        await transporter.sendMail({
            from: 'Medical Care',
            to: to,
            subject: 'Payment Confirmation',
            html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Payment Confirmation</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f5f5f5;
                        color: #333;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 20px auto;
                        padding: 20px;
                        background-color: #fff;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    }
                    h1 {
                        color: #007bff;
                        margin-bottom: 20px;
                    }
                    p {
                        margin-bottom: 20px;
                    }
                    img {
                        display: block;
                        margin: 0 auto;
                        max-width: 100%;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Payment Confirmation</h1>
                    <p>Your payment has been successfully processed. Thank you for your purchase!</p>
                    <img src="https://img.freepik.com/premium-photo/payment-completed-successful-inscription-mobile-phone-screen-woman-using-credit-card-mobile-phone-shopping-online_526934-10.jpg" alt="Payment Done Image">
                </div>
            </body>
            </html>
            `,
        });
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};


