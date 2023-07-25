import Head from "next/head";
import type { NextPage } from "next";
import Contributions from "~~/components/homepage/Contributions";
import StreamData from "~~/components/homepage/StreamData";
import Welcome from "~~/components/homepage/Welcome";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>LaunchPod&#8482;</title>
        <meta name="description" content="LaunchPod&#8482;: Created with 🏗 scaffold-eth-2" />
      </Head>
      <div className="flex flex-col gap-4 xs:w-4/5 xl:w-1/2 w-11/12">
        <p className="text-2xl font-bold tracking-widest  ">Your Hacker House</p>

        <Welcome />

        <StreamData />

        <Contributions />
      </div>
    </>
  );
};

export default Home;
