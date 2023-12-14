import React from "react";

const Welcome = () => {
  return (
    <div className="md:text-base text-[0.8rem] border rounded-xl p-4 text-center">
      <h1 className="font-bold font-typo-round md:text-2xl text-xl tracking-wide ">Welcome to LaunchPod!</h1>
      <p>
        🚀 LaunchPod is on a mission to fund open-source work by providing a monthly stream of ETH to Ethereum
        developers! For new and existing builders alike, LaunchPod acts as the home base of the normal BuidlGuidl
        streams. Contribute to the ecosystem in a meaningful way and get paid for it!
      </p>
      <p>
        👷‍♂️ Builders submit their contributions (stored in a Smart Contract), automatically claim grant streams, and
        showcase their work to the public.
      </p>
      <p>
        🌎 Builders are also encouraged to check out our other, more focused cohorts. If you find something interesting
        and contribute, we can move your stream to that cohort. Check out all the cohorts at
        <a className="" href="https://buidlguidl.com/" target="_blank" rel="noreferrer">
          {" "}
          🏰 <span className="link">buidlguidl.com</span>
        </a>
      </p>
    </div>
  );
};

export default Welcome;
