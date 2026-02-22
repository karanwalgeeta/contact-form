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
  port: parseInt(process.env.SMTP_PORT),
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Startup pe SMTP verify karo
transporter.verify((error, success) => {
  if (error) {
    console.log("SMTP Connection Error:", error.message);
  } else {
    console.log("SMTP Connected Successfully ✓");
  }
});

app.get("/", (req, res) => {
  res.send("Server Running");
});

app.post("/contact", async (req, res) => {
  try {
    const { full_name, email, phone, message } = req.body;

    // Basic validation
    if (!full_name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "full_name, email aur message required hain"
      });
    }

    const mailOptions = {
      from: `"Website Contact" <${process.env.SMTP_FROM_EMAIL}>`,
      to: process.env.RECIPIENT_EMAIL,
      subject: "New Contact Form Submission",
      html: `
        <h2>New Message</h2>
        <p><b>Name:</b> ${full_name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone || "N/A"}</p>
        <p><b>Message:</b> ${message}</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);

    res.json({
      success: true,
      message: "Email Sent Successfully"
    });

  } catch (error) {
    console.log("Email Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Email Failed",
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
