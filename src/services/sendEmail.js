import dotenv from 'dotenv';
import { createTransport } from 'nodemailer';
import { existsSync, readFileSync } from 'fs';
import { render } from 'ejs';
import juice from 'juice';

dotenv.config();

const config = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.GMAIL,
    pass: process.env.GMAIL_PASSWORD,
  },
};

const transporter = createTransport(config);

const sendMail = ({
  template: templateName,
  templateVars,
  ...restOfOptions // to & subject
}) => {
  const templatePath = `public/${templateName}.html`;
  const options = {
    from: config.auth.user,
    ...restOfOptions, // to & subject
  };

  if (templateName && existsSync(templatePath)) {
    const template = readFileSync(templatePath, 'utf-8');
    const html = render(template, templateVars);
    const htmlWithStylesInlined = juice(html);

    options.html = htmlWithStylesInlined;
  }

  return transporter.sendMail(options);
};

export default sendMail;
