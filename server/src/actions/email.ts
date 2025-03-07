//client/src/actions/email.ts
"use server";

import { sendEmail } from "../../lib/sendgrid";

export const sendContactEmailAction = async (formData: FormData) => {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    await sendEmail({
      to: "darrel@cakedenim.com",
      templateName: "ContactSubmission",
      dynamicTemplateData: {
        name,
        email,
        message,
      },
    });
    return { errorMessage: null };
  } catch (error) {
    console.error(error);
    return { errorMessage: "Something went wrong" };
  }
};

export const sendSignupConfirmationEmail = async (
  email: string,
  firstName: string
) => {
  try {
    await sendEmail({
      to: email,
      templateName: "SignupConfirmation",
      dynamicTemplateData: {
        firstName,
      },
    });
    return { errorMessage: null };
  } catch (error) {
    console.error(error);
    return { errorMessage: "Failed to send signup confirmation email." };
  }
};
