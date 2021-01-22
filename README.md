# Decentralised Trust Platform with Personal Data Management

This is the Proof-of-Concept and the demonstration for a decentralised Trust Platform with personal data management system based on the Ethereum blockchain and the IPFS network.

## Getting ready

#### MetaMask
To try out the system you need an Ethereum address on the Rinkeby TestNet through MetaMask installed on your preferred browser. You can install MetaMask by going to [this page](https://metamask.io/).

#### Understand the Decentralised Trust Platform
- Source code of the Smart Contracts is located at `./packages/ethereum-core`.
- `FeEx` SC is for managing feedback and calculating Experience relationship between two entities (Ethereum addresses)
- `Reputation` SC for calculating reputation of a requested address by calling outside calculation function using Oraclize.
- `provableAPI` SC is the API for enabling the Oraclize feature. Reputation SC is leveraging this API to conduct the Oraclize feature.

#### Addresses to interact with the SCs.
All deployment information including the addresses of the SCs can be found at `./packages/ethereum-core/build/contracts/*.json`.
For instance, the FeEx SC deployment address in Kovan test-net can be found in the file `./packages/ethereum-core/build/contracts/FeEx.json` as follows:

```
"networks": {
    "5": {
      "events": {
        "0x6c485cd32aab61ae40cb1ca90173795a264f05f55acb63425455ccd1b3803771": {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "name": "_trustor",
              "type": "address"
            },
            {
              "indexed": false,
              "name": "_trustee",
              "type": "address"
            }
          ],
          "name": "enFeedbackEvent",
          "type": "event"
        },
        "0x207170214763f6c2c61bbfd0383b1c2488bd0c3e4f4dcaa70ce58aa3f9ecde16": {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "name": "_trustor",
              "type": "address"
            },
            {
              "indexed": false,
              "name": "_trustee",
              "type": "address"
            },
            {
              "indexed": false,
              "name": "expValue",
              "type": "uint256"
            }
          ],
          "name": "expCalculationEvent",
          "type": "event"
        }
      },
      "links": {},
      "address": "0xcBEF28e258a5C56a67b40e64d00eED8d2eCfe22D",
      "transactionHash": "0x00f327ecbf74a2c902969e0181a93633e8237f8952a5fde24890b6a4a3c7857e"
    },
```


#### Connect your browser to your IPFS node
Install IPFS on your computer with NodeJS by running
`npm install ipfs` and change the config file located in `~/.ipfs/config` (if not initialized yet, run `ipfs init`).
In the `Addresses` part of the document, add the `/ip4/127.0.0.1/tcp/4003/ws` entry as shown below:

```
"Addresses": {
  "Swarm": [
    "/ip4/0.0.0.0/tcp/4002",
    "/ip4/127.0.0.1/tcp/4003/ws"
  ],
  "API": "/ip4/127.0.0.1/tcp/5002",
  "Gateway": "/ip4/127.0.0.1/tcp/9090"
}
```

Then, run `ipfs daemon` in a terminal to start your IPFS node, and `ipfs id` in another terminal to find your peer ID.

When everything is ready, go to https://tfeltin.github.io to access the system interface.

## Detailed sections

The web application functions interact with an IPFS client, and the Rinkeby TestNet through MetaMask by exchanging with a Smart Contract. Here are a few explanations on the different parts of the page:

#### Your connection

Before interacting with the system, remember to copy your peer ID in the *IPFS peer* box, in order to connect with you external node.

#### Add Personal Data

- If you are a user adding you own personal data, you can select a file on the left part of the box, and simply add your data to the system.
- If you are a service provider and have generated user data, you can add it on the right part of the box, along with the Ethereum address of the data owner.

#### Your Personal data

This box shows all of the data owned by you (Ethereum address on MetaMask).

When you add a file in the *Add Personal Data* box, or one is added on your behalf, and once the transactions are confirmed, the file will be shown here, as a file ID.

#### Access Control

Here you can grant or revoke permissions on the data you own, by precising the file ID and the Ethereum address of the user from whom to give/revoke access. You also have to precise a permission type (Create, Read, Update, Delete).

#### Request a token

Reference a file ID and permission type to ask for an access token.

#### Use token

By giving the appropriate file ID, token and permission type, you can receive files from the system.

## Try it out

Here are a sample few steps that you can follow to try out the system.

- Enter your external peer ID in the *Your connection* box to start.
- Add any file to the system by selecting anything on the user side of the *Add personal data* box. A MetaMask pop up window will appear and ask you to confirm the transaction.
- Wait until the transaction is confirmed, then reload the page. When reloaded, re-enter your external peer ID.
- Copy the file ID form the *Your personal data* box.
- Paste it in the *Request a token* box and confirm the transaction. Wait until the token appears (can take a while).
- In the *Use token* box, fill out the information based on the token you used, click *Get Data*, and confirm the transaction. After a while, the file you added to the system will be available again at the bottom of the page.

To try it out with someone else, remember to grant access to your files to someone before they ask for a token.
