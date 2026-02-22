// import express from "express";
// import nodemailer from "nodemailer";
// import cors from "cors";
// import dotenv from "dotenv";

// dotenv.config();

// const app = express();

// app.use(cors());
// app.use(express.json());

// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: parseInt(process.env.SMTP_PORT),
//   secure: false,
//   requireTLS: true,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS
//   },
//   tls: {
//     rejectUnauthorized: false
//   }
// });

// // Startup pe SMTP verify karo
// transporter.verify((error, success) => {
//   if (error) {
//     console.log("SMTP Connection Error:", error.message);
//   } else {
//     console.log("SMTP Connected Successfully ✓");
//   }
// });

// app.get("/", (req, res) => {
//   res.send("Server Running");
// });

// app.post("/contact", async (req, res) => {
//   try {
//     const { full_name, email, phone, message } = req.body;

//     // Basic validation
//     if (!full_name || !email || !message) {
//       return res.status(400).json({
//         success: false,
//         message: "full_name, email aur message required hain"
//       });
//     }

//     const mailOptions = {
//       from: `"Website Contact" <${process.env.SMTP_FROM_EMAIL}>`,
//       to: process.env.RECIPIENT_EMAIL,
//       subject: "New Contact Form Submission",
//       html: `
//         <h2>New Message</h2>
//         <p><b>Name:</b> ${full_name}</p>
//         <p><b>Email:</b> ${email}</p>
//         <p><b>Phone:</b> ${phone || "N/A"}</p>
//         <p><b>Message:</b> ${message}</p>
//       `
//     };

//     const info = await transporter.sendMail(mailOptions);
//     console.log("Email sent:", info.messageId);

//     res.json({
//       success: true,
//       message: "Email Sent Successfully"
//     });

//   } catch (error) {
//     console.log("Email Error:", error.message);
//     res.status(500).json({
//       success: false,
//       message: "Email Failed",
//       error: error.message
//     });
//   }
// });

// const PORT = process.env.PORT || 3001;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });



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

    if (!full_name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "full_name, email aur message required hain"
      });
    }

    const adminMailOptions = {
      from: `"Website Contact" <${process.env.SMTP_FROM_EMAIL}>`,
      to: process.env.RECIPIENT_EMAIL,
      subject: "New Contact Form Submission",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">New Enquiry Received</h2>
          <p><b>Name:</b> ${full_name}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Phone:</b> ${phone || "N/A"}</p>
          <p><b>Message:</b></p>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; border-left: 4px solid #4CAF50;">
            ${message}
          </div>
        </div>
      `
    };

    const clientMailOptions = {
      from: `"Your Company Name" <${process.env.SMTP_FROM_EMAIL}>`,
      to: email,
      subject: "Thank You for Your Enquiry!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #4CAF50;">Thank You, ${full_name}! 🙏</h2>
          <p>We have received your enquiry and appreciate you reaching out to us.</p>
          <p>Our team will get back to you as soon as possible, usually within <b>24 hours</b>.</p>
          
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Your Enquiry Summary:</h3>
            <p><b>Name:</b> ${full_name}</p>
            <p><b>Phone:</b> ${phone || "N/A"}</p>
            <p><b>Message:</b> ${message}</p>
          </div>

          <p style="color: #888; font-size: 13px;">
            If you have any urgent queries, feel free to reply to this email.
          </p>

          <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0e0e0; color: #888; font-size: 12px;">
            <p>Best Regards,<br/><b>Your Company Name</b></p>
          </div>
        </div>
      `
    };

    const [adminInfo, clientInfo] = await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(clientMailOptions)
    ]);

    console.log("Admin email sent:", adminInfo.messageId);
    console.log("Client email sent:", clientInfo.messageId);

    res.json({
      success: true,
      message: "Emails Sent Successfully"
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
