const FeEx = artifacts.require("FeEx");

contract('FeEx', async (accounts) => {

    let instance;
    
    before(async () => {
        instance = await FeEx.new();
    })

    console.log('FeEx test');

    it('FeEx balance should starts with 0 ETH', async () => {
        let balance = await web3.eth.getBalance(instance.address);
        console.log('FeEx test: checking balance');
        assert.equal(balance, 0);
    })

    it('Latency Analysis', async () => {
        console.log('FeEx test: Latency Analysis');
        console.log(instance.accounts);
        const trustor = '0xd39b7Acb45f751e03fB1865576F65F3f1C20c5b9'.toLowerCase();
        const trustee = '0xfcBa3eeC255501542c764d42847ba517Ed1814F3'.toLowerCase();

        const startTime = Date.now();

        await instance.enFeedback({trustor, trustee}, (error, result) => {
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
    })

})