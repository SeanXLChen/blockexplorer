import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';

import './App.css';

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const config = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};


// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(config);

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [block, setBlock] = useState();

  useEffect(() => {
    async function getBlockNumber() {
      setBlockNumber(await alchemy.core.getBlockNumber());
    }

    getBlockNumber();
  }, []);

  useEffect(() => {
    async function getBlock() {
      let blockTagOrHash = "latest";
      // calling the getBlock method to get the latest block
      let response = await alchemy.core.getBlock(blockTagOrHash);
      setBlock(response);
      console.log(response);
    }

    getBlock();
  }, []);

  return (
    <div className="App">
        <h1 className="text-3xl font-bold underline">Block Explorer</h1>
        <h2>Block Number: {blockNumber}</h2>
        <h2>Block Hash: {block?.hash}</h2>
    </div>
  ) ;
}

export default App;
