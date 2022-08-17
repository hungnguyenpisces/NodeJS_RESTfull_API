import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import { createHmac } from 'crypto';
import { request } from 'https';
import AppError from '../middlewares/error/AppError';
import Payment from '../models/payment.model';

const myEnv = dotenv.config();
dotenvExpand(myEnv);

const payWithMomo = async (data) => {
  // https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
  // parameters
  const partnerCode = process.env.MOMO_PARTNER_CODE;
  const accessKey = process.env.MOMO_ACCESS_KEY;
  const secretkey = process.env.MOMO_SECRET_KEY;
  const requestId = partnerCode + new Date().getTime();
  const orderId = `${data.orderNumber}-${new Date().getTime()}`;
  const orderInfo = `Payment for order ${data.orderNumber}`;
  const redirectUrl = process.env.MOMO_RETURN_URL;
  const ipnUrl = 'https://callback.url/notify';
  // var ipnUrl = redirectUrl = "https://webhook.site/454e7b77-f177-4ece-8236-ddf1c26ba7f8";
  const amount = data.amount.toString();
  const requestType = 'captureWallet';
  const extraData = ''; // pass empty value if your merchant does not have stores

  // before sign HMAC SHA256 with format
  // accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
  const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
  // puts raw signature
  // signature
  const signature = createHmac('sha256', secretkey)
    .update(rawSignature)
    .digest('hex');

  await Payment.update(
    { orderNumber: data.orderNumber },
    { secureHash: signature },
  );

  // json object send to MoMo endpoint
  const requestBody = JSON.stringify({
    partnerCode,
    accessKey,
    requestId,
    amount,
    orderId,
    orderInfo,
    redirectUrl,
    ipnUrl,
    extraData,
    requestType,
    signature,
    lang: 'en',
  });
  // Create the HTTPS objects
  const options = {
    hostname: 'test-payment.momo.vn',
    port: 443,
    path: '/v2/gateway/api/create',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(requestBody),
    },
  };

  // Send the request and get the response

  return new Promise((resolve, reject) => {
    const req = request(options, (res) => {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(
          new AppError(
            `ERROR @payWithMomo: Momo response statusCode=${res.statusCode}`,
            res.statusCode,
          ),
        );
      }
      let body = [];
      res.on('data', (chunk) => {
        body.push(chunk);
      });
      res.on('end', () => {
        try {
          body = JSON.parse(Buffer.concat(body).toString());
        } catch (error) {
          reject(new AppError(`ERROR @payWithMomo: ${error.message}`, 500));
        }
        resolve(body);
      });
    });
    req.on('error', (error) => {
      reject(new AppError(`ERROR @payWithMomo: ${error.message}`, 500));
    });
    // Send the request
    req.write(requestBody);
    req.end();
  });
};

export default payWithMomo;
