pragma solidity >= 0.4.22 < 0.9.0;

contract FeEx {
	// For convenience of the demo, some default values are set as follows:
	// _fbscore is set as uint between 1 and 1024
	// default expValue is 32768 (2^15)
	// maximum exp value is 1048576 (2^20)
	// alpha = 2^12 = 4096

	struct FeExStrut {
    	uint expValue;
		uint prev_expValue;
		uint perCount; // counter indicating the number of times a trustor can give feedback toward a trustee
	}

	// public ledger storing related information about Experience and Feedback permission
	mapping (address => mapping (address => FeExStrut)) public FeExInfo;
    
    // enable feedback for trustor toward the trustee event
    event enFeedbackEvent (
		address _trustor,
		address _trustee
    );

	event expCalculationEvent (
		address _trustor,
		address _trustee,
		uint expValue
    );

	// function to enable feedback for trustor toward the trustee
	function enFeedback (address _trustor, address _trustee ) internal { //can only be called in this SC or in derived SCs
		require(msg.sender == _trustor);

		if (FeExInfo[_trustor][_trustee].expValue > 0) { //the Exp between two entities has already initialized.
			FeExInfo[_trustor][_trustee].perCount++;
		} else { //first transaction betweeh the two, initialize the FeExInfo
			// default expValue, pre_expValue are 1024
			FeExInfo[_trustor][_trustee] = FeExStrut(32768, 32768, 1);
		}
		emit enFeedbackEvent(_trustor, _trustee);
  	}

	// submit feedback and calculate the Experience relationship accordingly
	function expCalculation (address _trustor, address _trustee, uint8 _fbscore ) public {	
		require(msg.sender == _trustor);
		require(FeExInfo[_trustor][_trustee].perCount > 0); //trustor is allowed to give feedback toward trustee
		// for convenience, _fbscore is set as uint between 1 and 16

		uint updatedExpValue;

		if (_fbscore >= 700) { // cooperative feedback
			// increase model
			updatedExpValue = FeExInfo[_trustor][_trustee].expValue + ((_fbscore*4096)/1024)/(1048576 - FeExInfo[_trustor][_trustee].expValue);
			FeExInfo[_trustor][_trustee].prev_expValue = FeExInfo[_trustor][_trustee].expValue;
			FeExInfo[_trustor][_trustee].expValue = updatedExpValue;
		}
		if (_fbscore <= 512) { //un-cooperative feedback
			// decrease model
			updatedExpValue = FeExInfo[_trustor][_trustee].expValue - (((1024-_fbscore)*4096)/1024)/(1048576 - FeExInfo[_trustor][_trustee].expValue);
			FeExInfo[_trustor][_trustee].prev_expValue = FeExInfo[_trustor][_trustee].expValue;
			FeExInfo[_trustor][_trustee].expValue = updatedExpValue;
		}
		if ((_fbscore > 512) && (_fbscore < 700)) { //decay
			// decay model
			updatedExpValue = FeExInfo[_trustor][_trustee].expValue - (1024 - 1024*FeExInfo[_trustor][_trustee].prev_expValue/1048576);
			FeExInfo[_trustor][_trustee].prev_expValue = FeExInfo[_trustor][_trustee].expValue;
			FeExInfo[_trustor][_trustee].expValue = updatedExpValue;
		}

		//decrease the perCount by 1
		FeExInfo[_trustor][_trustee].perCount--;

		//trigger uploadData event
		emit expCalculationEvent(_trustor, _trustee, updatedExpValue);
  	}

}
