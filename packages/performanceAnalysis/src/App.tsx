import React, { useState, useEffect, useCallback } from 'react';
import style from './css/App.module.css';
import FeExSC from './Ethereum-lib/FeEx.json';
import getWeb3 from './Ethereum-lib/getWeb3';

const App: React.FC = () => {
    // setup environment to interact with the smart contract
    const [web3, setWeb3] = useState('');
    const [accountAddr, setAccountAddr] = useState('');
    const [contractAddr, setContractAddr] = useState('');
    const [contractInstance, setContractInstance] = useState('');
    const [timeElap, setTimeElap] = useState('');
    const [blockElap, setBlockElap] = useState('');

    const latencyCalculation = useCallback(() => {
        (async () => {
            try {
                const web3 = await getWeb3();
                const currBlock = web3.eth.getBlockNumber()
                const trustee = '0xfcBa3eeC255501542c764d42847ba517Ed1814F3'.toLowerCase();
        
                // Get the contract instance.
                //const networkId = await web3.eth.net.getId();       
                const deployedNetwork = FeExSC.networks[4];
                const instance = new web3.eth.Contract(
                    FeExSC.abi,
                    deployedNetwork && deployedNetwork.address,
                );
        
                const startTime = Date.now();
                
                await instance.methods.enFeedback(accountAddr[0].toLowerCase(), trustee).send({from: accountAddr[0]}, (error, result) => {
                    if (!error){
                        const timeElappsed = Date.now() - startTime;
                        console.log(timeElappsed);
                        setTimeElap(timeElappsed.toString())
                        console.log(result.blockNumber);
                    } else {
                        console.log("Error in transaction");
                        console.log(error);
                    }
                });

            } catch (error) {
                // Catch any errors for any of the above operations.
                alert(
                    `Failed to load web3, accounts, or contract. Check console for details.`,
                );
                console.error(error);
            }
        })();
    }, []);

    async function latencyCalculation2() {
        const web3 = await getWeb3();
        const currBlock = await web3.eth.getBlockNumber()
        const trustee = '0xfcBa3eeC255501542c764d42847ba517Ed1814F3'.toLowerCase();

        // Get the contract instance.
        //const networkId = await web3.eth.net.getId();        
        const deployedNetwork = FeExSC.networks[4];
        const instance = new web3.eth.Contract(
            FeExSC.abi,
            deployedNetwork && deployedNetwork.address,
        );

        const startTime = Date.now();
        await instance.methods.enFeedback(accountAddr[0].toLowerCase(), trustee).send({from: accountAddr[0]}, (error, result) => {
            if (!error){
                const timeElappsed = Date.now() - startTime;
                console.log(timeElappsed);
                console.log(result.blockNumber);
            } else {
                console.log("Error in transaction");
                console.log(error);
            }
        });
        // await Promise.all(promisesArr)
        //   .then(async (receipts) => {
        //     let elapsedTime = Date.now() - startTime
        //     let lastBlock = receipts[0].blockNumber
        //     receipts.forEach((receipt) => {
        //       lastBlock =
        //         receipt.blockNumber > lastBlock ? receipt.blockNumber : lastBlock
        //     })
        //     let blockLatency = lastBlock - currBlock
        //   })
    }
      

    useEffect(() => {
        (async () => {
            try {
                // Get network provider and web3 instance.
                const web3 = await getWeb3();
            
                // Use web3 to get the user's accounts.
                const accountAddr = await web3.eth.getAccounts();
            
                // Get the contract instance.
                //const networkId = await web3.eth.net.getId();
                const deployedNetwork = FeExSC.networks[3];
                const instance = new web3.eth.Contract(
                    FeExSC.abi,
                    deployedNetwork && deployedNetwork.address,
                );
            
                // Set web3, accounts, and contract to the state
                setWeb3(web3);
                setAccountAddr(accountAddr);
                setContractAddr(deployedNetwork.address);
                setContractInstance(instance);

                const currBlock = await web3.eth.getBlockNumber()
                const trustor = '0xd39b7Acb45f751e03fB1865576F65F3f1C20c5b9'.toLowerCase();
                const trustor_privkey = 'e2a50ba4e6eb28aaa83ff03c99209f305df0f9ca02baceca09adcf1a6798996c';                
                const trustee = '0xfcBa3eeC255501542c764d42847ba517Ed1814F3'.toLowerCase();
        
                const startTime = Date.now();

                await instance.methods.enFeedback(accountAddr[0].toLowerCase(), trustee).send({from: accountAddr[0]}, (error, result) => {
                    if (!error){
                        const timeElappsed = Date.now() - startTime;
                        console.log(timeElappsed);
                        console.log(result.blockNumber);
                        console.log(JSON.stringify(result));
                    } else {
                        console.log("Error in transaction");
                        console.log(error);
                    }
                });


            } catch (error) {
                // Catch any errors for any of the above operations.
                alert(
                    `Failed to load web3, accounts, or contract. Check console for details.`,
                );
                console.error(error);
            }
        })();
    }, [web3, accountAddr, contractAddr, contractInstance]);

    return (
        <div className={style.dashboard} >
            <header className={style.header} >
                <h2>Personal Data Management based on Blockchain and Proxy Re-encryption (PRE)</h2>
                <h4>Smart Contract Address: <span className={style.textinfo}>{contractAddr}</span></h4>
                <h4>Account Address: <span className={style.textinfo}>{accountAddr}</span></h4>
                <hr />
            </header>
            <div>
                <p>Time elappsed for 100 tests: {timeElap} </p>
                <p>Number of Blocks elappsed for 100 tests: {blockElap} </p>
            </div>
            
            <div className={style.userinfo}>            
                <span><button onClick={() => latencyCalculation2()}>Calculate Latency</button></span>
                <br />
            </div>

        </div>
    );
}

export default App;
