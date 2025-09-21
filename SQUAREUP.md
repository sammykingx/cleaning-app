# SQUARE UP RESOURCES
- [Square Up dev console](https://developer.squareup.com/console/en/apps)
- [dev essentials](https://developer.squareup.com/docs/development-essentials)
- 

## Takes
- Personal access token are recommended for single apps, oauth for multi-tenant apps
- Production requests use the https://connect.squareup.com/v2 base URL with an access token that's valid for the production environment.

```curl
curl https://connect.squareup.com/v2/locations \
  -H 'Square-Version: 2024-07-17' \
  -H 'Authorization: Bearer {PRODUCTION_ACCESS_TOKEN}' \
  -H 'Content-Type: application/json'

```
- Sandbox requests use the https://connect.squareupsandbox.com/v2 base URL with an access token that's valid for the Sandbox environment
```
curl https://connect.squareupsandbox.com/v2/locations \
  -H 'Square-Version: 2024-07-17' \
  -H 'Authorization: Bearer {SANDBOX_ACCESS_TOKEN}' \
  -H 'Content-Type: application/json'

```

- Payments API
```
https://developer.squareup.com/reference/square/payments-api
```

## Using access tokens with Square SDKs
When using a backend Square SDK, the client is initialized with an access token and target environment.
```
from square.client import Client

client = Client(
    access_token=""
    environment="" [sndbox | production]
)
```

## Web Payments SDK
The Web Payments SDK enables the client implementation of the client/server Square online payment solution. The SDK produces a secure single-use payment token that your application web client sends to your backend, where it's processed as a payment with the Payments API. 

### Web Payments SDK Overview

To accept a card payment from a buyer, you need a web client where the buyer enters payment card information and a backend that takes a payment with the card. The SDK produces a secure single-use payment token based on the card. Your web client sends the payment token to your backend where the payment is taken. In summary, a payment is taken with these steps:

- **Generate a payment token** - Use the Web Payments SDK client library to render a card entry form and generate a payment token that your web client sends to your backend server.
- **Create a payment with the token** - On your backend, use the Square Payments API to create a payment.

url for payments.
```
"https://web.squarecdn.com/v1/square.js" - Production

"https://sandbox.web.squarecdn.com/v1/square.js" - Sandbox
```

> The Web Payments SDK doesn't create a new customer in the Square account where a payment is credited. If you want to create a new customer along with a payment on a Square account, you need to collect at least one of the following pieces of information about a buyer:

    First name
    Family name
    Company name
    Buyer email address
    Buyer phone number

> The backend of your application can take this information and [create a customer profile](https://developer.squareup.com/docs/customers-api/use-the-api/keep-records#create-a-customer-profile)
using the Customers API. When your backend creates a Payment object using the CreatePayment
endpoint, it includes the Web Payments SDK-provided payment token and the new customer ID.

## Payment tokens

The Web Payments SDK produces payment tokens from these supported payment methods: credit card, gift card, digital wallets, ACH bank transfer, Afterpay, and Cash App Pay.

The payment tokens produced by these payment methods share a common format and are all accepted by the Payments API as source_id values. The server-side Payments API code that you write for one of these tokens works seamlessly for all the other methods. You can write unique client logic for each payment method, but you only need one payment process flow on the server.

You can also get a payment token to use with the Cards API
if you need to store a card on file with a customer. This is useful when your application must support recurring card-not-present payments.

## Payment session timeout
The payment session times out after 24 hours. If the buyer hasn't completed the payment form, the buyer must refresh the browser to complete the payment. Fields that generate based on the issuing country of the credit card might not save input that the buyer entered.

```
create payament 
https://developer.squareup.com/reference/square/payments-api/create-payment

sandbox payment
"https://developer.squareup.com/docs/devtools/sandbox/payments#web-and-mobile-client-testing"
```