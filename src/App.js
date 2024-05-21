import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom';


import './App.css';
import AddressSearch from './AddressSearch'; // Ensure the path is correct


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

function Home() {
  const [blockNumber, setBlockNumber] = useState();
  const [block, setBlock] = useState();
  const [gasPrice, setGasPrice] = useState();
  const [address, setAddress] = useState('');

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
      // console.log(response);
    }

    getBlock();
  }, []);

  useEffect(() => {
    async function fetchGasPrice() {
      let response = await alchemy.core.getGasPrice();
      setGasPrice(response._hex);
    }

    fetchGasPrice();
  }, []);

  const formatGasPrice = (priceHex) => {
    const priceInGwei = parseInt(priceHex, 16) / 1e9;
    return priceInGwei.toFixed(1); // Rounds to one decimal place
  };

  const history = useHistory();

  const handleSearch = () => {
    if (address) {
      history.push(`/address/${address}`);
    }
  };

  return (
    <div className="App">
      <div className="m-5">
        <p className="text-3xl font-bold">Block Explorer</p>
      </div>
      <div className="text-xl m-5 flex flex-row justify-center">
        <h2 className='mr-1'>Gas Price: </h2>
        <p className='font-bold'>{formatGasPrice(gasPrice)}</p>
        <h2 className='ml-1'> Gwei</h2>
      </div>
      <h2>Most-Recently Mined Block Number: {blockNumber}</h2>
      <h2>Block Hash: {block?.hash}</h2>
      <div className="mt-6 w-full max-w-4xl">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="p-2 border rounded w-full"
          placeholder="Enter Ethereum address"
        />
        <button
          onClick={handleSearch}
          className="mt-2 p-2 bg-blue-500 text-white rounded w-full"
        >
          Search
        </button>
      </div>
    </div>
  );
}


function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/address/:address" component={AddressSearch} />
      </Switch>
    </Router>
  );
}

export default App;
