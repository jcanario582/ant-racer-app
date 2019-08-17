import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [ants, setAnts] = useState({});
  const [updatedAnts, setUpdatedAnts] = useState({});
  const [buttonText, setButtonText] = useState('Begin Calculations');
  const [search, setSearch] = useState();

  function calculateOdds() {
    setButtonText("Recalculate Odds");

    Object.keys(ants).map((index) => {
      const updatedAnts = Object.assign({}, {ants});
      updatedAnts.ants[index].likelihoodOfAntWinning = "";
      updatedAnts.ants[index].calculatingOdds = "Calculating Odds...";
      setUpdatedAnts(updatedAnts);

      const callback = (likelihoodOfAntWinning) => {
        const updatedAnts = Object.assign({}, {ants});
        updatedAnts.ants[index].likelihoodOfAntWinning = likelihoodOfAntWinning;
        updatedAnts.ants[index].calculatingOdds = "";
        setUpdatedAnts(updatedAnts);
      };

      generateAntWinLikelihoodCalculator()(callback);
    });
  }

  function generateAntWinLikelihoodCalculator() {
    var delay = 7000 + Math.random() * 7000;
    var likelihoodOfAntWinning = Math.random();

    return function(callback) {
      setTimeout(function() {
        callback(likelihoodOfAntWinning);
      }, delay);
    };
  }

  function Ants() {
    //TODO: Refactor. No need to have a component for the sole purpose of retrieving data from a seperate function.
    return antFactory();
  }

  function antFactory() {
    let ant;

    ant = Object.keys(ants).map((index)=>{
      let racerId = "racer" + index;
      let odds = Math.round(ants[index].likelihoodOfAntWinning * 100) + "%";

      return (
        <div id="racers" className={racerId}>
          <div>Name: <span style={{color: 'black'}}>{ants[index].name}</span></div>
          <div>Length: {ants[index].length}cm</div>
          <div>Weight: {ants[index].weight}mg</div>
          <div>Odds of winning: {ants[index].calculatingOdds}{ants[index].likelihoodOfAntWinning}</div>
          <div>{ants[index].name} has a <span className="odds">{odds}</span> chance of winning</div>
        </div>
      );
    })

    return ant;
  }

  useEffect(() => {
    const ants = {};
    const fetchData = async () => {
      const result = await axios(
        `https://antserver-blocjgjbpw.now.sh/graphql?query={ants{name,length, color, weight}}`,
      );
      result.data.data.ants.forEach((ant, index) => {
        ants[index] = ant;
        ants[index].likelihoodOfAntWinning = "";
        ants[index].calculatingOdds = "";
      });      
      setAnts(ants);
    };

    fetchData();
  }, [search]);

  return ( 
    <div className="container">
      <h1 className="display-1 text-center">Ant Racer</h1>
      <button type="button" className="btn btn-secondary btn-lg btn-block" onClick={calculateOdds}>{buttonText}</button>
      <Ants />
    </div>
  );
};

export default App;