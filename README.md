# Minter Backend for Tokenized ballot smart contract

## Why need a backned? 
We need a functionality, where voters can request for minting the tokens for themselves. While building a dApp, we should be careful about the token supply as malicious party might mess up the network and voting results. 
So, contract intercations that require MINTER_ROLE should be made form a centralized place and also be automated.

## Usage
Clone the repo and install dependencies. `yarn install` `yarn start:dev` for development. 
The app by default will start running on port 5001.

`http://localhost:5001/api`

It is a swagger document so one can simply start making the requests. 

## Endpoints (Connected to Front End): 

Endpoint | Functionality | Request Body | Returns
--- | --- | --- | ---
/payment-order | Creates a payment request for given amount of MTKs | {"value": number, "secret": string} | id: number
/request-payment | Mints tokens as a MINTER_ROLE for provided receiver address | {"id": number, "secret": string, "receiverAddress": 0xaddress as string} | Success or Failure
