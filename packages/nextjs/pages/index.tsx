import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
// import ContractEvents from "~~/components/contractEvents";
import Contributions from "~~/components/homepage/Contributions";
import StreamData from "~~/components/homepage/StreamData";
import Welcome from "~~/components/homepage/Welcome";

const Home: NextPage = () => {
  return (
    <>
      <MetaHeader />
      <div className="flex flex-col gap-4 xs:w-4/5 lg:max-w-5xl w-11/12">
        <Welcome />
        <StreamData creatorPage={false} />
        <Contributions creatorPage={false} />
        {/* <ContractEvents /> */}
      </div>
    </>
  );
};

export default Home;
