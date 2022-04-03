import "./App.css";
import { useState } from "react";
import { ethers } from "ethers";
import Motivation from "./artifacts/contracts/Motivation.sol/Motivation.json";

const motivationAddress = "0xFEc6CDeF9227370e4eF48D101774015977c5af75";

function App() {
  //store motivation locally
  const [motivation, setMotivation] = useState();

  //request metamask access
  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  //call contract and read motivation val
  async function fetchMotivation() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        motivationAddress,
        Motivation.abi,
        provider
      );
      try {
        let rand = getRandom();

        //call contract motivate func and store returned val
        const data = await contract.motivate(rand);
        console.log("data : ", data);
        setMotivation(data);
      } catch (error) {
        console.log("error : ", error);
      }
    }
  }

  //call contract to set motivation
  async function addMotivation() {
    if (!motivation) return;
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        motivationAddress,
        Motivation.abi,
        signer
      );
      const transaction = await contract.addMotivation(motivation);
      await transaction.wait();
      fetchMotivation();
    }
  }

  async function getRandom() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        motivationAddress,
        Motivation.abi,
        provider
      );
      try {
        //call contract motivate func and store returned val
        const size = await contract.size();
        console.log("size : ", size);

        //returns random index in motivations array
        return Math.floor(Math.random() * size);
      } catch (error) {
        console.log("error : ", error);
      }
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>{motivation}</h1>
        <h4>Add Your Motivational Quote to The Blockchain!</h4>
        <h5>Get a Random Motivation:</h5>
        <button onClick={fetchMotivation}>Random Motivation</button>
        <p>Add a Motivational Quote:</p>
        <button onClick={addMotivation}>Add Motivation</button>
        <input
          onChange={(e) => setMotivation(e.target.value)}
          placeholder="your motivation here"
        ></input>
      </header>
    </div>
  );
}

export default App;
