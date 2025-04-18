"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther, sha256, encodePacked } from "viem";

const gameContractABI = [
  {
    inputs: [],
    name: "BET_MIN",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "REVEAL_TIMEOUT",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "bothPlayed",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "bothRevealed",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "encrMovePlayerA",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "encrMovePlayerB",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "firstReveal",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getContractBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getOutcome",
    outputs: [
      {
        internalType: "enum RockPaperScissors.Outcomes",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "initialBet",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "movePlayerA",
    outputs: [
      {
        internalType: "enum RockPaperScissors.Moves",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "movePlayerB",
    outputs: [
      {
        internalType: "enum RockPaperScissors.Moves",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "encrMove",
        type: "bytes32",
      },
    ],
    name: "play",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "register",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "clearMove",
        type: "string",
      },
    ],
    name: "reveal",
    outputs: [
      {
        internalType: "enum RockPaperScissors.Moves",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "revealTimeLeft",
    outputs: [
      {
        internalType: "int256",
        name: "",
        type: "int256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "whoAmI",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const gameContractAddress = "0x1Cc5D529C37E096F776d7f316C293982E5079FDb"; // Replace with your contract address

const LoaderOverlay = () => (
  <div className="absolute inset-0  backdrop-blur-[2px] flex items-center justify-center z-50">
    <div className="spinner" />
  </div>
);

const GameInvite = () => {
  const { address, isConnected } = useAccount();
  const [opponentAddress, setOpponentAddress] = useState<string>("");
  const [selectedMoves, setSelectedMoves] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { writeContractAsync } = useWriteContract();
  const [isLoading, setIsLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [played, setPlayed] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const moves: string[] = ["Rock", "Paper", "Scissors", "Lizard", "Spock"];

  // Replace the generic sendTransaction with contract interaction
  // const {
  //   write:register, isLoading, isSuccess, error ,
  //   data: hash,
  //   isPending: isWritePending,
  // } = writeContract({
  //   address: gameContractAddress,
  //   abi: gameContractABI,
  //   functionName: "register",
  // });

  // const {
  //   data: hash2,
  //   isPending: isWritePending2,
  // } = writeContract({
  //   address: gameContractAddress,
  //   abi: gameContractABI,
  //   functionName: "play",
  // });
  // Replace with actual transaction hash
  const isWritePending = false; // Replace with actual pending state
  // const { isLoading: isConfirming, isSuccess: isConfirmed } =
  //   useWaitForTransactionReceipt({
  //     hash,
  //   });
  const isConfirming = false;
  const isConfirmed = false;

  const isInviting = isWritePending || isConfirming;

  const handleMoveToggle = (move: string): void => {
    if (selectedMoves.includes(move)) {
      setSelectedMoves(selectedMoves.filter((m) => m !== move));
    } else if (selectedMoves.length < 5) {
      setSelectedMoves([...selectedMoves, move]);
    }
  };

  const handlePlay = async (): void => {
    setErrorMessage("");
    
    if (selectedMoves.length === 0) {
      setErrorMessage("Please select at least one move.");
      return;
    }
    setIsLoading(true);

    try {
      console.log("Playing...");
      // Hash the selected moves
      const encrMove = sha256(encodePacked(["string"], [selectedMoves[0]]));
      console.log(encrMove);

      const tx = await writeContractAsync({
        address: gameContractAddress,
        abi: gameContractABI,
        functionName: "play",
        args: [encrMove],
      });
      setPlayed(true);
    } catch (error: any) {
      setErrorMessage("Transaction Failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    setErrorMessage("");
    setIsLoading(true);
    try {
      console.log("Registering...");
      // Call the `register` function on the smart contract
      const tx = await writeContractAsync({
        address: gameContractAddress,
        abi: gameContractABI,
        functionName: "register",
        value: parseEther("0.002"),
      });

      console.log("Transaction sent:", tx);
      setRegistered(true);
    } catch (error: unknown) {
      const err = error as { message?: string };
      setErrorMessage("Transaction Failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReveal = async () => {
    setErrorMessage("");
    setIsLoading(true);
    try {
      console.log("Revealing...");
      // Call the `register` function on the smart contract
      const tx = await writeContractAsync({
        address: gameContractAddress,
        abi: gameContractABI,
        functionName: "reveal",
        args: [selectedMoves[0]],
      });

      console.log("Transaction sent:", tx);
      setRevealed(true);

      // Safely check if tx is returned
      // if (tx && tx.hash) {
      //   console.log("Transaction hash:", tx.hash);
      // } else {
      //   setErrorMessage("Failed to get transaction hash.");
      // }
    } catch (error: unknown) {
      const err = error as { message?: string };
      setErrorMessage("Transaction Failed");
    } finally {
      setIsLoading(false);
    }
  };
  const handleOutcome = async () => {
    setErrorMessage("");

    try {
      console.log("Outcome...");
      // Call the `register` function on the smart contract
      const tx = await writeContractAsync({
        address: gameContractAddress,
        abi: gameContractABI,
        functionName: "getOutcome",
      });

      console.log("Transaction sent:", tx);

      // Safely check if tx is returned
      // if (tx && tx.hash) {
      //   console.log("Transaction hash:", tx.hash);
      // } else {
      //   setErrorMessage("Failed to get transaction hash.");
      // }
    } catch (error: unknown) {
      const err = error as { message?: string };
      setErrorMessage("Transaction Failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-6 rounded-2xl shadow-xl bg-white text-center max-w-md w-full">
        <div className="mb-4">
          {isConnected && !registered &&(
            <button
              onClick={handleRegister}
              className="px-6 py-2 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition-all duration-200"
            >
              Register
            </button>
          )}
        </div>
        <h1 className="text-2xl font-bold mb-4">Connect Your Wallet</h1>
        <div className="flex justify-center">
          <ConnectButton />
        </div>
        <div className="relative">
          {isConnected && (
            <div className="mt-6">
              <p className="text-green-600 mb-6">
                Connected as{" "}
                <span className="font-mono">
                  {address?.substring(0, 6)}...
                  {address?.substring(address?.length - 4)}
                </span>
              </p>

              {/* <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Invite a Player</h2>
                <input
                  type="text"
                  placeholder="Enter opponent's ETH address"
                  value={opponentAddress}
                  onChange={(e) => setOpponentAddress(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded mb-2"
                />
              </div> */}

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">
                  Select Your Moves (up to 5)
                </h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {moves.map((move) => (
                    <button
                      key={move}
                      onClick={() => handleMoveToggle(move)}
                      className={`px-3 py-2 rounded ${
                        selectedMoves.includes(move)
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      {move}
                    </button>
                  ))}
                </div>
                <div className="mt-3">
                  <p className="text-sm text-gray-600">
                    Selected:{" "}
                    {selectedMoves.length > 0
                      ? selectedMoves.join(", ")
                      : "None"}
                  </p>
                </div>
              </div>

              {errorMessage && (
                <p className="text-red-500 mb-4">{errorMessage}</p>
              )}

              <button
                onClick={handlePlay}
                disabled={!registered || played}
                className="bg-blue-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                 Play
              </button>
              <button
                onClick={handleReveal}
                disabled={!played || revealed}
                className="ml-2 mr-2 bg-blue-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Reveal Move
              </button>

              <button
                onClick={handleOutcome}
                disabled={!revealed}
                className="mt-2 bg-blue-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Outcome
              </button>

              {isConfirmed && (
                <div className="mt-4 p-3 bg-green-100 text-green-700 rounded">
                  Invitation sent successfully!
                </div>
              )}
            </div>
          )}
          {isLoading && <LoaderOverlay />}
        </div>
      </div>
    </main>
  );
};

export default GameInvite;
