import sgMail, { MailDataRequired } from "@sendgrid/mail";
type Props = {
  to: string;
  templateName: "SignupConfirmation" | "ContactSubmission" | "ForgotPassword";
  dynamicTemplateData?: Record<string, string>;
};

export const sendEmail = async ({
  to,
  templateName,
  dynamicTemplateData,
}: Props) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg: MailDataRequired = {
    to,
    from: {
      email: "donotreply@cakedenim.com", // Use the email address or domain you verified above
      name: "Cake Denim Email Flow",
    },
    templateId: templates[templateName],
    dynamicTemplateData,
  };
  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to send email");
  }
};

const templates = {
  SignupConfirmation: "d-d76fbe57fcf74bb1abbf07852a4230bf",
  ForgotPassword: "test",
};
