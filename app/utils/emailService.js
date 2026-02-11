const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

exports.sendOrderConfirmation = (userEmail, orderDetails) => {
    const mailOptions = {
        from: '"BrewFlow Coffee" <noreply@brewflow.com>',
        to: userEmail,
        subject: "☕ Your Coffee Order is Confirmed!",
        html: `
      <h1>Thanks for your order!</h1>
      <p>We are starting to brew your coffee right now.</p>
      <p><strong>Total Amount:</strong> $${orderDetails.totalAmount}</p>
      <p><strong>Status:</strong> ${orderDetails.status}</p>
      <br>
      <p>See you at the counter!</p>
    `,
    };

    return transporter.sendMail(mailOptions);
};