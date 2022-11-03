const { useEffect } = require("react");

export const getModulePortfolio = () => {
  return fetch("moduleportfolio.json", {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  }).then(function (response) {
    console.log(response);
    return response.json();
  });
};

export const getModulePortfolio2 = () => {
  console.log("fetching module portfolio");
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
