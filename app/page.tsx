"use client";
import { ConnectButton, connectorsForWallets } from "@rainbow-me/rainbowkit";
import { useState, useEffect } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useDeployContract,
  useWatchContractEvent,
} from "wagmi";
import { stringToBytes32 } from "viem/utils";
import {
  parseEther,
  sha256,
  keccak256,
  encodePacked,
  createPublicClient,
  Contract,
} from "viem";
import { mainnet } from "viem/chains";
import RockImage from "../public/Images/rock.png";
import Paper from "../public/Images/paper.jpeg";
import Scissor from "../public/Images/scissor.jpg";
import Lizard from "../public/Images/lizard.jpeg";
import Spock from "../public/Images/spock.jpeg";
import RevealModal from "@/components/RevealModal";
import EthValueSelector from "@/components/EthValueSelector";
// import Image from "next/image";

const gameContractABI = [
  {
    constant: true,
    inputs: [
      {
        name: "_c1",
        type: "uint8",
      },
      {
        name: "_c2",
        type: "uint8",
      },
    ],
    name: "win",
    outputs: [
      {
        name: "w",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "j2Timeout",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "stake",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "c2",
    outputs: [
      {
        name: "",
        type: "uint8",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "c1Hash",
    outputs: [
      {
        name: "",
        type: "bytes32",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_c2",
        type: "uint8",
      },
    ],
    name: "play",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "j2",
    outputs: [
      {
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "lastAction",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_c1",
        type: "uint8",
      },
      {
        name: "_salt",
        type: "uint256",
      },
    ],
    name: "solve",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "j1",
    outputs: [
      {
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "j1Timeout",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "TIMEOUT",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        name: "_c1Hash",
        type: "bytes32",
      },
      {
        name: "_j2",
        type: "address",
      },
    ],
    payable: true,
    stateMutability: "payable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "gameAddress",
        type: "address",
      },
      {
        indexed: true,
        name: "player1",
        type: "address",
      },
      {
        indexed: true,
        name: "player2",
        type: "address",
      },
    ],
    name: "GameCreated",
    type: "event",
  },
];
const moveMap = {
  Rock: 1,
  Paper: 2,
  Scissor: 3,
  Spock: 4,
  Lizard: 5,
};
// Replace with your contract address
const gameByteCode =
  "608060405261012c600555604051604080610b63833981018060405281019080805190602001909291908051906020019092919050505034600481905550336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550816002816000191690555042600681905550600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163073ffffffffffffffffffffffffffffffffffffffff167fd3432ff5c78a4cfac45492c26900080695bc03e553bf581d99afdee4869c3e7160405160405180910390a450506109ce806101956000396000f3006080604052600436106100ba576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680630c4395b9146100bf578063294914a4146101145780633a4b66f11461012b57806348e257cb146101565780634d03e3d21461018f57806353a04b05146101c257806380985af9146101e557806389f71d531461023c578063a5ddec7c14610267578063c37597c6146102a1578063c8391142146102f8578063f56f48f21461030f575b600080fd5b3480156100cb57600080fd5b506100fa600480360381019080803560ff169060200190929190803560ff16906020019092919050505061033a565b604051808215151515815260200191505060405180910390f35b34801561012057600080fd5b50610129610403565b005b34801561013757600080fd5b506101406104ae565b6040518082815260200191505060405180910390f35b34801561016257600080fd5b5061016b6104b4565b6040518082600581111561017b57fe5b60ff16815260200191505060405180910390f35b34801561019b57600080fd5b506101a46104c7565b60405180826000191660001916815260200191505060405180910390f35b6101e3600480360381019080803560ff1690602001909291905050506104cd565b005b3480156101f157600080fd5b506101fa6105c0565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561024857600080fd5b506102516105e6565b6040518082815260200191505060405180910390f35b34801561027357600080fd5b5061029f600480360381019080803560ff169060200190929190803590602001909291905050506105ec565b005b3480156102ad57600080fd5b506102b66108c7565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561030457600080fd5b5061030d6108ec565b005b34801561031b57600080fd5b5061032461099c565b6040518082815260200191505060405180910390f35b600081600581111561034857fe5b83600581111561035457fe5b141561036357600090506103fd565b6000600581111561037057fe5b83600581111561037c57fe5b141561038b57600090506103fd565b600282600581111561039957fe5b8115156103a257fe5b0660028460058111156103b157fe5b8115156103ba57fe5b0614156103e1578160058111156103cd57fe5b8360058111156103d957fe5b1090506103fd565b8160058111156103ed57fe5b8360058111156103f957fe5b1190505b92915050565b6000600581111561041057fe5b600360009054906101000a900460ff16600581111561042b57fe5b14151561043757600080fd5b600554600654014211151561044b57600080fd5b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc6004549081150290604051600060405180830381858888f19350505050506000600481905550565b60045481565b600360009054906101000a900460ff1681565b60025481565b600060058111156104da57fe5b600360009054906101000a900460ff1660058111156104f557fe5b14151561050157600080fd5b6000600581111561050e57fe5b81600581111561051a57fe5b1415151561052757600080fd5b6004543414151561053757600080fd5b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561059357600080fd5b80600360006101000a81548160ff021916908360058111156105b157fe5b02179055504260068190555050565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60065481565b600060058111156105f957fe5b82600581111561060557fe5b1415151561061257600080fd5b6000600581111561061f57fe5b600360009054906101000a900460ff16600581111561063a57fe5b1415151561064757600080fd5b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156106a257600080fd5b600254600019168282604051808360058111156106bb57fe5b60ff167f01000000000000000000000000000000000000000000000000000000000000000281526001018281526020019250505060405180910390206000191614151561070757600080fd5b61072082600360009054906101000a900460ff1661033a565b15610786576000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc6004546002029081150290604051600060405180830381858888f19350505050506108bb565b61079f600360009054906101000a900460ff168361033a565b1561080657600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc6004546002029081150290604051600060405180830381858888f19350505050506108ba565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc6004549081150290604051600060405180830381858888f1935050505050600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc6004549081150290604051600060405180830381858888f19350505050505b5b60006004819055505050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600060058111156108f957fe5b600360009054906101000a900460ff16600581111561091457fe5b1415151561092157600080fd5b600554600654014211151561093557600080fd5b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc6004546002029081150290604051600060405180830381858888f19350505050506000600481905550565b600554815600a165627a7a7230582034680c1a8fe24e0f07c6c6ac15e0c383a9be7d87e0b906e811bb6c034c7d6b4a0029";

const LoaderOverlay = () => (
  <div className="absolute inset-0  backdrop-blur-[2px] flex items-center justify-center z-50">
    <div className="spinner" />
  </div>
);

const Clock = ({ isRunning, onComplete }: ClockProps) => {
  const [time, setTime] = useState(300); // 5 minutes in seconds

  useEffect(() => {
    if (!isRunning || time <= 0) return;

    const interval = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onComplete?.(); // call onComplete if provided
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, time, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <div className="text-xl font-mono text-teal-700">⏱ {formatTime(time)}</div>
  );
};

const GameInvite = () => {
  const { address, isConnected } = useAccount();
  const [isClient, setIsClient] = useState(false);
  const [opponentAddress, setOpponentAddress] = useState<string>("");
  const [selectedMoves, setSelectedMoves] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { writeContractAsync } = useWriteContract();
  const [isLoading, setIsLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [played, setPlayed] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const { deployContractAsync } = useDeployContract();
  const [gameContractAddress, setGameContractAddress] = useState<string>("");
  const [passPhrase, setPassPhrase] = useState<string>("");
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [incomingGame, setIncomingGame] = useState<{
    gameAddress: string;
    player1: string;
    player2: string;
  } | null>(null);
  const [isClockRunning, setClockRunning] = useState<boolean>(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [sendInvite, setSendInvite] = useState(false);
  const [showRevealModal, setShowRevealModal] = useState(false);
  const [value, onValueChange] = useState(0.01);

  useEffect(() => {
    // This will run only on the client side
    setIsClient(true);
  }, []);

  const moves: string[] = ["Rock", "Paper", "Scissor", "Lizard", "Spock"];

  useWatchContractEvent({
    abi: gameContractABI,
    eventName: "GameCreated",
    onLogs(logs) {
      console.log("New GameCreated event logs:", logs);

      // Loop through logs and check if it's the correct game for Player 2
      if (logs && logs.length > 0) {
        const { gameAddress, player1, player2 } = logs[0].args;
        setGameContractAddress(gameAddress);
        setIncomingGame({
          gameAddress: gameAddress,
          player1: player1,
          player2: player2,
        });
        if (player2 === address) {
          setOpponentAddress(player1);
          setShowAcceptModal(true);
        } else {
          setOpponentAddress(player2);
        }
      }
    },
    pollingInterval: 1_000, // Poll every second for new logs
  });

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
    if (selectedMoves == move) {
      setSelectedMoves("");
    } else {
      setSelectedMoves(move);
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
      // const encrMove = sha256(encodePacked(["string"], [selectedMoves[0]]));
      // console.log(encrMove);

      const tx = await writeContractAsync({
        address: gameContractAddress,
        abi: gameContractABI,
        functionName: "play",
        args: [moveMap[selectedMoves]],
        value: parseEther("0.01"), // Replace with the actual value
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

    if (!opponentAddress) {
      setErrorMessage("Please enter an opponent address.");
      return;
    }
    if (!passPhrase) {
      setErrorMessage("Please enter a pass phrase.");
      return;
    }
    if (!selectedMoves) {
      setErrorMessage("Please select at least one move.");
      return;
    }
    setIsLoading(true);
    try {
      console.log("Registering...");
      // Call the `register` function on the smart contract
      const passPhraseHash = sha256(encodePacked(["string"], [passPhrase]));
      const encrMove = keccak256(
        encodePacked(
          ["uint8", "uint256"], // data types must match exactly
          [moveMap[selectedMoves], passPhraseHash] // ensure salt is BigInt
        )
      );
      console.log(encrMove);
      const tx = await deployContractAsync({
        abi: gameContractABI,
        args: [encrMove, opponentAddress],
        bytecode: gameByteCode,
        value: parseEther(`${value}`), // Replace with the actual value
      });

      console.log("Transaction sent:", tx);
      // setGameContractAddress(tx.contractAddress);
      // setIncomingGame({ gameAddress:"0xCotract", player1:"0xPlayer1", player2:"0xPlayer2" });
      // setShowAcceptModal(true);
      setSendInvite(true);
      setRegistered(true);
    } catch (error: unknown) {
      const err = error as { message?: string };
      console.log(err.message);
      setErrorMessage("Transaction Failed");
    } finally {
      setIsLoading(false);
    }
  };

  const test = async () => {
    setIncomingGame({
      gameAddress: "0x1Ae8E0149E6265Cf3B9A49512A87657941A93834",
      player1: "0x2C5970AEff05dFf6Af9dB2aca2E4D595553Ca74B",
      player2: "0x912053c1983645a40Bc027ACD1B5a3c95487b55b",
    });
    setGameContractAddress("0x1Ae8E0149E6265Cf3B9A49512A87657941A93834");
    setOpponentAddress("0x912053c1983645a40Bc027ACD1B5a3c95487b55b");
    setShowAcceptModal(true);
  };

  const handleReveal = async () => {
    setErrorMessage("");
    setIsLoading(true);
    try {
      console.log("Revealing...");
      // Call the `register` function on the smart contract
      console.log("Selected Moves:", selectedMoves);
      console.log("Pass Phrase:", passPhrase);
      console.log("Game Contract Address:", gameContractAddress);

      const passPhraseHash = sha256(encodePacked(["string"], [passPhrase]));

      const tx = await writeContractAsync({
        address: gameContractAddress,
        abi: gameContractABI,
        functionName: "solve",
        args: [moveMap[selectedMoves], passPhraseHash],
        value: parseEther("0.001"), // Replace with the actual value
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
      console.log(err.message);
      setErrorMessage("Transaction Failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenInvite = () => {
    if (!selectedMoves) {
      setErrorMessage("Please select a move.");
      return;
    }
    console.log("Opening invite modal...");
    setShowInviteModal(true);
  };

  const handleTimeOut = async () => {
    if (!gameContractAddress) {
      setErrorMessage("No game contract address found.");
      return;
    }
    setErrorMessage("");
    setIsLoading(true);
    try {
      console.log("Timeout...");
      let functionName = "j2Timeout";
      if (incomingGame && incomingGame.player2 === address) {
        functionName = "j1Timeout";
      }
      // Call the `register` function on the smart contract
      const tx = await writeContractAsync({
        address: gameContractAddress,
        abi: gameContractABI,
        functionName: functionName,
      });

      console.log("Transaction sent:", tx);
    } catch (error: unknown) {
      const err = error as { message?: string };
      setErrorMessage("Transaction Failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient) {
    // Optionally render a loading state or nothing at all during SSR
    return null;
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-4">
      <div className="p-8 rounded-3xl shadow-2xl bg-white dark:bg-gray-800 max-w-xl w-full border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Rock Paper Scissors Lizard Spock
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Blockchain Edition
          </p>
        </div>

        {/* Registration & Clock */}
        <div className="mb-6 flex flex-col justify-center items-center">
          {incomingGame && incomingGame.player1 == address && (
           
            <p className="text-green-300 text-center mb-2">Invite Send Successfully to <br/> {incomingGame.player2}</p>
          )}
          {isConnected && !isClockRunning && (
            <button
              onClick={handleOpenInvite}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300"
            >
              Invite
            </button>
          )}

          {isClockRunning && <Clock isRunning={isClockRunning} />}
        </div>
        {showInviteModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
              onClick={() => setShowInviteModal(false)}
            ></div>

            {/* Modal Card */}
            <div className="relative w-96 rounded-3xl shadow-2xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 animate-fade-in-up">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-5">
                <h2 className="text-2xl font-bold text-white text-center">
                  Invite Player
                </h2>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Opponent Address Input */}
                <EthValueSelector onValueChange={onValueChange} />
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Opponent's Address
                  </label>
                  <input
                    type="text"
                    placeholder="Enter opponent's ETH address"
                    value={opponentAddress}
                    onChange={(e) => setOpponentAddress(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-500 bg-gray-50 dark:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>

                {/* Pass Phrase Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Pass Phrase
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Pass Phrase"
                    value={passPhrase}
                    onChange={(e) => setPassPhrase(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-500 bg-gray-50 dark:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setShowInviteModal(false)}
                    className="px-6 py-3 rounded-xl font-medium bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 shadow-sm transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handleRegister();
                      setShowInviteModal(false);
                    }}
                    className="px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    Send Invite
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Wallet Connection */}
        {!isConnected && (
          <div className="flex-col justify-center">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300 text-center">
              Connect Your Wallet
            </h2>
            <div className="flex justify-center mb-6">
              <ConnectButton />
            </div>
          </div>
        )}

        {/* Connected Wallet Info */}
        {isConnected && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/30 dark:to-blue-900/30 border border-green-100 dark:border-green-800">
              <p className="text-green-700 dark:text-green-400 flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                Connected as{" "}
                <span className="font-mono font-medium">
                  {address?.substring(0, 6)}...
                  {address?.substring(address?.length - 4)}
                </span>
              </p>
              <p className="text-green-700 dark:text-green-400 mt-2 text-sm text-center">
                Contract Address:{" "}
                <span className="font-mono">{gameContractAddress}</span>
              </p>
            </div>

            {/* Move Selection */}
            <div className="p-6 rounded-xl bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                Select Your Move
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
                {moves.map((move) => (
                  <div key={move} className="flex flex-col items-center">
                    <button
                      onClick={() => handleMoveToggle(move)}
                      className={`w-full p-2 rounded-lg font-medium transition-all duration-300 ${
                        selectedMoves.includes(move)
                          ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md"
                          : "bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {move}
                    </button>
                    <div className="mt-2 relative">
                      <img
                        src={
                          move === "Rock"
                            ? RockImage.src
                            : move === "Paper"
                            ? Paper.src
                            : move === "Scissor"
                            ? Scissor.src
                            : move === "Lizard"
                            ? Lizard.src
                            : Spock.src
                        }
                        alt={move}
                        className={`w-12 h-12 rounded-full object-cover border-2 ${
                          selectedMoves.includes(move)
                            ? "border-blue-500 shadow-lg opacity-100 scale-110"
                            : "border-gray-200 dark:border-gray-600 opacity-80"
                        } transition-all duration-300`}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-600">
                <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
                  Selected:{" "}
                  <span className="font-medium">
                    {selectedMoves.length > 0 ? selectedMoves : "None"}
                  </span>
                </p>
              </div>
            </div>

            {/* Error Display */}
            {errorMessage && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-center">
                {errorMessage}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-center mt-6">
              {incomingGame && incomingGame.player2 == address && (
                <button
                  onClick={handlePlay}
                  // disabled={!registered || played}
                  className="px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg hover:translate-y-[-2px] disabled:from-gray-400 disabled:to-gray-500 disabled:shadow-none disabled:hover:translate-y-0 disabled:opacity-60 transition-all duration-300"
                >
                  Play
                </button>
              )}

              <button
                onClick={handleTimeOut}
                // disabled={}
                className="px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md hover:shadow-lg hover:translate-y-[-2px] disabled:from-gray-400 disabled:to-gray-500 disabled:shadow-none disabled:hover:translate-y-0 disabled:opacity-60 transition-all duration-300"
              >
                Call Time Out
              </button>
              <button
                onClick={() => setShowRevealModal(true)}
                // disabled={!revealed}
                className="px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-md hover:shadow-lg hover:translate-y-[-2px] disabled:from-gray-400 disabled:to-gray-500 disabled:shadow-none disabled:hover:translate-y-0 disabled:opacity-60 transition-all duration-300"
              >
                Outcome
              </button>
            </div>

            {/* Test Button */}
            {/* <div className="mt-4 text-center">
              <button
                onClick={test}
                className="px-4 py-2 rounded-lg font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
              >
                Test
              </button>
            </div> */}

            {/* Confirmation Message */}
            {isConfirmed && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-400 flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                Invitation sent successfully!
              </div>
            )}
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && <LoaderOverlay />}

        {/* Game Invitation Modal */}
        {showAcceptModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"></div>

            {/* Modal Card */}
            <div className="relative w-96 rounded-3xl shadow-2xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 animate-fade-in-up">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-5">
                <h2 className="text-2xl font-bold text-white text-center">
                  Game Invitation
                </h2>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-6 flex justify-center">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-blue-600 dark:text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 11l5-5m0 0l5 5m-5-5v12"
                      ></path>
                    </svg>
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 text-lg text-center mb-6">
                  You have been invited to a game!
                </p>

                <div className="mb-6">
                  <p className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2 font-medium">
                    Challenger:
                  </p>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg break-all font-mono text-sm border border-gray-200 dark:border-gray-600">
                    {incomingGame?.player1 ||
                      "0x2C5970AEff05dFf6Af9dB2aca2E4D595553Ca74B"}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => {
                      setShowAcceptModal(false);
                      setIncomingGame(null);
                    }}
                    className="px-6 py-3 rounded-xl font-medium bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 shadow-sm transition-all duration-300"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => {
                      setShowAcceptModal(false);
                      setClockRunning(true);
                      console.log("Accepted game:", incomingGame?.gameAddress);
                    }}
                    className="px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    Accept
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* {showRevealModal &&} */}
        {showRevealModal && (
          <RevealModal
            showRevealModal={showRevealModal}
            setShowRevealModal={setShowRevealModal}
            selectedMoves={selectedMoves}
            setSelectedMoves={setSelectedMoves}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
            passPhrase={passPhrase}
            setPassPhrase={setPassPhrase}
            handleRegister={handleRegister}
            handleRevealOutcome={handleReveal}
          />
        )}
      </div>
    </main>
  );
};

export default GameInvite;
