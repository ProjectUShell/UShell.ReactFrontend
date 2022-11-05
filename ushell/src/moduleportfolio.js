const { useEffect } = require("react");

export const getModulePortfolio = () => {
  return fetch("moduleportfolio.json", {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  }).then(function (response) {    
    return response.json();
  });
};

export const getModulePortfolio2 = () => {  
  return fetch("moduleportfolio2.json", {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  }).then(function (response) {
    const result = response.json();
    return result;
  });
};

// module.exports = readModulePortfolio;
