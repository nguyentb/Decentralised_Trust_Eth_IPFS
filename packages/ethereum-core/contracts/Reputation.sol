pragma solidity >= 0.5.0 < 0.6.0;
import "./provableAPI.sol";

contract Reputation is usingProvable {
    mapping (address => uint) public RepPosInfo;
    mapping (address => uint) public RepNegInfo;

    event LogNewProvableQuery(string description);
    event LogResult(string result);

    constructor()
        public
    {
        provable_setProof(proofType_Android | proofStorage_IPFS);
    }

    // callback function for Oraclize getting results from the APIs. Update the ledger accordingly
    function __callback(
        bytes32 _myid,
        string memory _result,
        bytes memory _proof
    )
        public
    {
        require(msg.sender == provable_cbAddress());        
        emit LogResult(_result);

        // update RepPosInfo & RepNegInfo
        RepPosInfo[addr] = getRepPos(_result, addr);
        RepPosInfo[addr] = getRepNeg(_result, addr);
    }

    // request result of Reputation from outside world (by calling APIs) using Oracalize    
    function request(
        string memory _query,
        string memory _method,
        string memory _url,
        string memory _kwargs
    )
        public
        payable
    {
        if (provable_getPrice("computation") > address(this).balance) {
            emit LogNewProvableQuery("Provable query was NOT sent, please add some ETH to cover for the query fee");
        } else {
            emit LogNewProvableQuery("Provable query was sent, standing by for the answer...");
            provable_query("computation",
                [_query,
                _method,
                _url,
                _kwargs]
            );
        }
    }
    /**
     * @dev Sends a custom content-type in header and returns the header used
     * as result. Wrap first argument of computation ds with helper needed,
     * such as json in this case
     */
    function requestCustomHeaders()
        public
        payable
    {
        request("json(QmdKK319Veha83h6AYgQqhx9YRsJ9MJE7y33oCXyZ4MqHE).headers",
                "GET",
                "http://httpbin.org/headers",
                "{'headers': {'content-type': 'json'}}"
                );
    }

    function requestBasicAuth()
        public
        payable
    {
        request("QmdKK319Veha83h6AYgQqhx9YRsJ9MJE7y33oCXyZ4MqHE",
                "GET",
                "http://httpbin.org/basic-auth/myuser/secretpass",
                "{'auth': ('myuser','secretpass'), 'headers': {'content-type': 'json'}}"
                );
    }

    function requestPost()
        public
        payable
    {
        request("QmdKK319Veha83h6AYgQqhx9YRsJ9MJE7y33oCXyZ4MqHE",
                "POST",
                "https://api.postcodes.io/postcodes",
                '{"json": {"postcodes" : ["OX49 5NU"]}}'
                );
    }

    function requestPut()
        public
        payable
    {
        request("QmdKK319Veha83h6AYgQqhx9YRsJ9MJE7y33oCXyZ4MqHE",
                "PUT",
                "http://httpbin.org/anything",
                "{'json' : {'testing':'it works'}}"
                );
    }

    function requestCookies()
        public
        payable
    {
        request("QmdKK319Veha83h6AYgQqhx9YRsJ9MJE7y33oCXyZ4MqHE",
                "GET",
                "http://httpbin.org/cookies",
                "{'cookies' : {'thiscookie':'should be saved and visible :)'}}"
                );
    }

}
