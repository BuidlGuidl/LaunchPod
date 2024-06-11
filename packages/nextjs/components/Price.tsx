import { useEffect, useState } from "react";
import Image from "next/image";
//import { useErc20 } from "~~/hooks/useErc20";
import { useGlobalState } from "~~/services/store/store";

type TPriceProps = {
  value: number;
};

export const Price: React.FC<TPriceProps> = ({ value }: TPriceProps) => {
  const [dollarMode, setDollarMode] = useState(false);
  //const { isErc20 } = useErc20();
  const nativePrice = useGlobalState(state => state.nativeCurrencyPrice);
  //eslint-disable-next-line
  const [nativePrice_, setNativePrice] = useState(0);

  useEffect(() => {
    setNativePrice(nativePrice);
  }, [nativePrice]);

  console.log("value:", value);

  const price = nativePrice;

  console.log("price:", price);
  console.log("dollarMode:", dollarMode);

  const isValueNaN = isNaN(value);
  let displayBalance = isValueNaN ? (
    NaN
  ) : (
    <span style={{ display: "inline-flex", alignItems: "center" }}>
      <Image
        src="/the-graph-svg.png" // Path to the image in the public folder
        alt="GRT Token"
        width={16} // Set the desired width
        height={16} // Set the desired height
        style={{ marginRight: 4 }} // Adjust margin as needed
      />
      {value.toFixed(2)}
    </span>
  );

  if (!isValueNaN && dollarMode && price > 0) {
    displayBalance = (
      <span style={{ display: "inline-flex", alignItems: "center" }}>
        <span
          style={{
            fontWeight: "bold",
            marginRight: 4,
          }}
        >
          $
        </span>
        {(value * price).toFixed(2)}
      </span>
    );
  }

  return (
    <span
      style={{
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
      }}
      onClick={() => {
        if (price > 0) {
          console.log("Toggling dollarMode");
          setDollarMode(prevMode => !prevMode);
        }
      }}
    >
      {displayBalance}
    </span>
  );
};
