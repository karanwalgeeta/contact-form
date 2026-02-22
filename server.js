import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

app.get("/", (req, res) => {
  res.send("Server Running");
});

app.post("/contact", async (req, res) => {
  try {
    const { full_name, email, phone, message } = req.body;

    // const mailOptions = {
    //   from: `"Website Contact" <${process.env.SMTP_USER}>`,
    // //   to: process.env.ADMIN_EMAIL,
    //   to: process.env.RECIPIENT_EMAIL,
    //   subject: "New Contact Form Submission",
    //   html: `
    //   <h2>New Message</h2>
    //   <p><b>Name:</b> ${full_name}</p>
    //   <p><b>Email:</b> ${email}</p>
    //   <p><b>Phone:</b> ${phone}</p>
    //   <p><b>Message:</b> ${message}</p>
    //   `
    // };


    const mailOptions = {
  from: `"Website Contact" <${process.env.SMTP_FROM_EMAIL}>`,
  to: process.env.RECIPIENT_EMAIL,
  subject: "New Contact Form Submission",
  html: `
  <h2>New Message</h2>
  <p><b>Name:</b> ${full_name}</p>
  <p><b>Email:</b> ${email}</p>
  <p><b>Phone:</b> ${phone}</p>
  <p><b>Message:</b> ${message}</p>
  `
};

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: "Email Sent Successfully"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Email Failed"
    });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
