import { useEffect, useState } from "react";
import { useInterval } from "usehooks-ts";
import scaffoldConfig from "~~/scaffold.config";

export const useTokenPrice = () => {
  const enablePolling = false;

  const [ensPrice, setEnsPrice] = useState(0);
  const [opPrice, setOpPrice] = useState(0);

  const fetchPrice = () => {
    fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=optimism,ethereum-name-service", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then(response => response.json())
      .then(data => {
        data.map((token: object & { id: string; current_price: number }) => {
          if (token.id == "optimism") setOpPrice(token.current_price);
          if (token.id == "ethereum-name-service") setEnsPrice(token.current_price);
        });
      })
      .catch(error => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    (async () => {
      fetchPrice();
    })();
  }, []);

  useInterval(
    async () => {
      fetchPrice();
    },
    enablePolling ? scaffoldConfig.pollingInterval : null,
  );

  return {
    ensPrice,
    opPrice,
  };
};
