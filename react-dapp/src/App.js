import "./App.css";
import { useState } from "react";
import { ethers } from "ethers";
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json";

const greeterAddress = "0x5c3412DC194B7467A2BECcDD41d21ab9665791F8";

function App() {
  //store greeting locally
  const [greeting, setGreetingValue] = useState();

  //request metamask access
  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  //call contract and read greeting val
  async function fetchGreeting() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        greeterAddress,
        Greeter.abi,
        provider
      );
      try {
        //call contract greet func and store returned val
        const data = await contract.greet();
        console.log("data : ", data);
      } catch (error) {
        console.log("error : ", error);
      }
    }
  }

  //call contract to set greeting
  async function setGreeting() {
    if (!greeting) return;
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
      const transaction = await contract.setGreeting(greeting);
      await transaction.wait();
      fetchGreeting();
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={setGreeting}>Set Greeting</button>
        <input
          onChange={(e) => setGreetingValue(e.target.value)}
          placeholder="Set greeting"
        ></input>
      </header>
    </div>
  );
}

export default App;
