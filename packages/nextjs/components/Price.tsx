import { useState } from "react";
import { useErc20 } from "~~/hooks/useErc20";
import { useTokenPrice } from "~~/hooks/useTokenPrice";
import { useGlobalState } from "~~/services/store/store";

type TPriceProps = {
  value: number;
};

export const Price: React.FC<TPriceProps> = ({ value }: TPriceProps) => {
  const [dollarMode, setDollarMode] = useState(false);
  const { isErc20, isEns, isOp } = useErc20();
  const { ensPrice, opPrice } = useTokenPrice();
  const nativePrice = useGlobalState(state => state.nativeCurrencyPrice);

  let price = 0;

  if (isErc20) {
    if (isEns) price = ensPrice;
    if (isOp) price = opPrice;
  } else if (isErc20 == false) {
    price = nativePrice;
  }

  const isValueNaN = isNaN(value);
  let displayBalance = isValueNaN ? NaN : "Ξ " + value.toFixed(4);

  if (!isValueNaN && dollarMode && price > 0) {
    displayBalance = "$" + (value * price).toFixed(2);
  }

  return (
    <span
      style={{
        cursor: "pointer",
      }}
      onClick={() => {
        if (price > 0) {
          setDollarMode(!dollarMode);
        }
      }}
    >
      {displayBalance}
    </span>
  );
};
