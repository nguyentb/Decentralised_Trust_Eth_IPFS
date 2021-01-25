import FeExSc from '../../ethereum-core/build/contracts/FeEx.json';
import Web3 from 'web3';
import Tx from 'ethereumjs-tx';
import fs from 'fs';
import HDWalletProvider from "@truffle/hdwallet-provider";
const mnemonic = "atom green circle false illness morning humor comic ethics token dice legend";

//const ropsten_provider = new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/4d7d8f04493b458ab022a68b571ccb7a");
//const rinkeby_provider = new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/4d7d8f04493b458ab022a68b571ccb7a");
//const kovan_provider = new HDWalletProvider(mnemonic, "https://kovan.infura.io/v3/4d7d8f04493b458ab022a68b571ccb7a");
const goerli_provider = new HDWalletProvider(mnemonic, "https://goerli.infura.io/v3/4d7d8f04493b458ab022a68b571ccb7a");

const web3 = new Web3(goerli_provider);

const accountAddr = await web3.eth.getAccounts();
const accountAddr_sk = Buffer.from('e2a50ba4e6eb28aaa83ff03c99209f305df0f9ca02baceca09adcf1a6798996c', 'hex');
const trustee = '0xfcBa3eeC255501542c764d42847ba517Ed1814F3'.toLowerCase();
const trustee_2 = '0x6D5Ac591Ec603391B615035f333B7Fe85d2d5d94'.toLowerCase();

const abi = FeExSc.abi;
//const contract_Address = FeExSc.networks[3].address; //ropsten smart contract address
//const contract_Address = FeExSc.networks[4].address; //rinkeby smart contract address
//const contract_Address = FeExSc.networks[42].address; //kovan smart contract address
const contract_Address = FeExSc.networks[5].address; //Goerli smart contract address

const contract = new web3.eth.Contract(abi, contract_Address); 

// for (let i=0; i<100; i++) {
//     let startreadingTime = Date.now();
//     await contract.methods.FeExInfo(accountAddr[0], trustee).call(web3.eth.defaultAccount, (error, info) => {
//     if (!error){
//         const timeElappsed = Date.now() - startreadingTime;        
//         fs.appendFile('goerli_readingLatency_result.txt', timeElappsed.toString() + '\n', function(err) {
//             if (err) {
//                return console.error(err);
//             }
//         });
//         console.log('Reading timeElappsed:', timeElappsed);
//     } else {
//         console.log("Error in calling function: ", error);
//     }
//     });
// }

const writeData = contract.methods.enFeedback(accountAddr[0], trustee).encodeABI();
//for (let i=0; i<10; i++) {
    await web3.eth.getTransactionCount(accountAddr[0], async (err, txCount) => {
        // Build the transaction
        const txObject = {
            nonce:    web3.utils.toHex(txCount),
            to:       contract_Address,
            value:    web3.utils.toHex(web3.utils.toWei('0', 'ether')),
            gasLimit: web3.utils.toHex(2100000),
            gasPrice: web3.utils.toHex(web3.utils.toWei('6', 'gwei')),
            data: writeData  
        }
        // Sign the transaction
        const tx = new Tx.Transaction(txObject, {chain:'goerli'});
        tx.sign(accountAddr_sk);
        const serializedTx = tx.serialize();
        const raw = '0x' + serializedTx.toString('hex');

        console.log('Starting to broadcast the transaction to Ethereum network....');
        const startwritingTime = Date.now();
        const currBlock = await web3.eth.getBlockNumber();
        console.log("Current blockNumber: ", currBlock);
        
        // Broadcast the transaction 100 times
        await web3.eth.sendSignedTransaction(raw, (error, txHash) => {
            if (!error){
                console.log('Transaction Hash:', txHash);
            } else {
                return console.log("Error in transaction: ", error);
            }        
        }).then((receipts) => {
            const timeElappsed = Date.now() - startwritingTime;
            const writingResult = timeElappsed.toString() + '\t' + (receipts.blockNumber - currBlock).toString() + '\n';
            fs.appendFile('goerli_writingLatency_result.txt', writingResult, function(err) {
                if (err) {
                    return console.error(err);
                }
            });
            //console.log("Transaction receipt: ", JSON.stringify(receipts));            
            console.log("Time elappsed (in millisecond): ", timeElappsed);        
            console.log("Receipt BlockNumber: ", receipts.blockNumber);
            console.log("Block Latency: ", receipts.blockNumber - currBlock);
        });
    });
//}