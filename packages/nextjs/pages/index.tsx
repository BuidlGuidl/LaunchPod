import type { NextPage } from "next";
import Welcome from "~~/components/homepage/Welcome";
import PodContract from "~~/components/pod/PodContract";


const Home: NextPage = () => {
  return (
    <>
      <div className="flex flex-col mx-auto leading-relaxed gap-4 w-[80%]">
        <p className="font-bold font-typo-round md:text-3xl text-2xl tracking-wide">
          Your Hacker House
        </p>

        <Welcome />

        <PodContract home={true} />

      </div>
    </>
  );
};

export default Home;
