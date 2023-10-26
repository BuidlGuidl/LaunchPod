import { useState } from "react";
import { useGlobalState } from "~~/services/store/store";

type TPriceProps = {
  value: number;
};

export const Price: React.FC<TPriceProps> = ({ value }: TPriceProps) => {
  const [dollarMode, setDollarMode] = useState(true);
  const price = useGlobalState(state => state.nativeCurrencyPrice);

  const isValueNaN = isNaN(value);
  let displayBalance = isValueNaN ? NaN : value.toFixed(4);

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
