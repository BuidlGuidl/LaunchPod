import React from "react";

const Welcome = () => {
  return (
    <div className="md:text-sm text-[0.7rem] border rounded-xl p-4">
      <h1 className="font-bold font-typo-round md:text-2xl text-xl tracking-widest ">Welcome!</h1>
      <p>
        We&lsquo;re running an experiment to retroactively fund open-source work by providing a monthly UBI to
        open-source developers, handpicked by Jessy and Jessy&lsquo;s Hacker House, and rewarding them for their ongoing
        contributions to the ecosystem.
      </p>
      <p>
        Chosen developers can submit their monthly projects, automatically claim grant streams, and showcase their work
        to the public.
      </p>
      <p>This initiative is made possible by BuidlGuidl!</p>
    </div>
  );
};

export default Welcome;
