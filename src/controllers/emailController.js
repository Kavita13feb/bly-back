

const { sendVerificationEmail, sendContactEmail } = require("../services/emailService");

exports.sendVerification = async (req, res) => {
  try {
    const { email, userId } = req.body;
    const response = await sendVerificationEmail(email, userId);
    
    if (response.success) {
      res.status(200).json({ message: response.message });
    } else {
      res.status(500).json({ message: response.message, error: response.error });
    }
  } catch (error) {
    res.status(500).json({ message: "Error sending verification email", error });
  }
};

exports.contactUs = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const response = await sendContactEmail(name, email, message);

    if (response.success) {
      res.status(200).json({ message: response.message });
    } else {
      res.status(500).json({ message: response.message, error: response.error });
    }
  } catch (error) {
    res.status(500).json({ message: "Error sending contact form email", error });
  }
};
