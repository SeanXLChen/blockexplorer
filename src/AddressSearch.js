// src/AddressSearch.js
import React, { useEffect, useState } from 'react';
import { Alchemy, Network, Utils } from 'alchemy-sdk';

// Configures the Alchemy SDK
const config = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY, // Make sure to set this in your environment variables
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(config);

function AddressSearch({ match }) {
  const { address } = match.params;
  const [balance, setBalance] = useState(null);
  const [transactionCount, setTransactionCount] = useState(null);
  const [transfers, setTransfers] = useState([]);

  useEffect(() => {
    async function fetchAddressDetails() {
      try {
        // Fetch the balance of the address
        const balanceResponse = await alchemy.core.getBalance(address);
        setBalance(balanceResponse.toString());

        // Fetch the transaction count of the address
        const txCountResponse = await alchemy.core.getTransactionCount(address);
        setTransactionCount(txCountResponse);

        // Fetch the transaction history of the address
        const transfersResponse = await alchemy.core.getAssetTransfers({
          fromBlock: "0x0",
          toAddress: address,
          excludeZeroValue: true,
          category: ["external", "internal", "erc20", "erc721", "erc1155"],
        });
        setTransfers(transfersResponse.transfers);
      } catch (error) {
        console.error('Error fetching address details:', error);
      }
    }

    fetchAddressDetails();
  }, [address]);

  const formatBalance = (wei) => {
    const eth = Utils.formatUnits(wei, 'ether');
    return eth
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center p-4">
      <header className="w-full bg-white shadow-md p-4 mb-4">
        <h1 className="text-3xl font-bold text-center">Address: {address}</h1>
      </header>
      <div className="bg-white shadow-md p-6 rounded-lg w-full max-w-4xl">
        <h2 className="text-xl font-semibold mb-2">Address Details</h2>
        <p className="text-lg"><strong>Balance:</strong> {balance ? `${formatBalance(balance)} ETH` : 'Loading...'}</p>
        <p className="text-lg"><strong>Transaction Count:</strong> {transactionCount !== null ? transactionCount : 'Loading...'}</p>
        <h2 className="text-xl font-semibold mt-4 mb-2">Transaction History</h2>
        {transfers.length > 0 ? (
          <ul className="">
            {transfers.map((transfer, index) => (
              <li key={index} className="m-2 p-2 border rounded-md">
                <p><strong>Hash:</strong> {transfer.hash}</p>
                <p><strong>From:</strong> {transfer.from}</p>
                <p><strong>To:</strong> {transfer.to}</p>
                <p><strong>Value:</strong> {transfer.value ? `${transfer.value} ETH` : 'N/A'}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No transactions found.</p>
        )}
      </div>
    </div>
  );
}

export default AddressSearch;
