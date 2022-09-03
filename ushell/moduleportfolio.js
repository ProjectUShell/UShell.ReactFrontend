const { useEffect } = require("react");

export const getData = () => {
  fetch("moduleportfolio.json", {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (myJson) {
      console.log(myJson);
    });
};

const readModulePortfolio = () => {
  getData();
  // console.log(modulePortfolio);
  // const reader = new FileReader();
  // reader.onload = (e) => {
  //   const text = e.target.result;
  //   console.log(text);
  // };
  // reader.readAsText("./moduleportfolio.json");

  return {
    workspaces: [
      {
        name: "Fondsakzessorik",
        useCases: [
          { name: "Depots", component: "xxx" },
          { name: "Fonds", component: "yyy" },
        ],
      },
    ],
  };
};

export default readModulePortfolio;
// module.exports = readModulePortfolio;
