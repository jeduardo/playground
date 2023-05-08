import axios from 'axios'
import { SignatureV4 } from '@aws-sdk/signature-v4'
import { Sha256 } from '@aws-crypto/sha256-js'

const {
  LAMBDA_URL,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_SESSION_TOKEN,
  AWS_REGION
} = process.env

const lambdaURL = new URL(LAMBDA_URL)

const sigV4 = new SignatureV4({
  service: 'lambda',
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    sessionToken: AWS_SESSION_TOKEN,
  },
  sha256: Sha256,
})

const signed = await sigV4.sign({
  method: 'GET',
  hostname: lambdaURL.host,
  path: lambdaURL.pathname,
  protocol: lambdaURL.protocol,
  headers: {
    'Content-Type': 'application/json',
    host: lambdaURL.hostname,
  },
})

try {
  const { data } = await axios({
    ...signed,
    url: LAMBDA_URL,
  })
  console.log(`Data received: ${data}`)
} catch (error) {
  console.log(`Error: ${error}`)
}

