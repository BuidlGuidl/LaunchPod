import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { LabFlaskIcon } from "./LabFlaskIcon";
import { SettingsIcon } from "./SettingsIcon";
import { Bars3Icon, BugAntIcon } from "@heroicons/react/24/outline";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick } from "~~/hooks/scaffold-eth";
import { useIsAdmin } from "~~/hooks/useIsAdmin";
import { useIsCreator } from "~~/hooks/useIsCreator";

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <Link
      href={href}
      passHref
      className={`${
        isActive ? "bg-secondary shadow-md" : ""
      } hover:bg-secondary hover:shadow-md focus:bg-secondary py-1.5 px-3 text-sm rounded-full gap-2`}
    >
      {children}
    </Link>
  );
};

/**
 * Site header
 */
export const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { isCreator } = useIsCreator();
  const { isAdmin } = useIsAdmin();
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );

  const navLinks = (
    <>
      <li>
        <NavLink href="/">Home</NavLink>
      </li>
      {isCreator && (
        <li>
          <NavLink href="/creator">
            <LabFlaskIcon />
            Creator
          </NavLink>
        </li>
      )}
      {isAdmin && (
        <>
          <li>
            <NavLink href="/admin">
              <SettingsIcon />
              Admin
            </NavLink>
          </li>
          <li>
            <NavLink href="/debug">
              <BugAntIcon className="h-4 w-4" />
              Debug Contracts
            </NavLink>
          </li>
        </>
      )}
    </>
  );

  return (
    <div className="sticky top-[2rem] mx-auto place-self-center navbar bg-base-100 min-h-0 flex-shrink-0 justify-between z-20 shadow-sm drop-shadow-[0_25px_25px_hsl(var(--s))] w-3/4 rounded-full">
      <div className="navbar-start w-[75%] lg:w-1/2">
        <div className="lg:hidden dropdown" ref={burgerMenuRef}>
          <button
            className={`ml-1 btn btn-ghost ${isDrawerOpen ? "hover:bg-secondary" : "hover:bg-transparent"}`}
            onClick={() => {
              setIsDrawerOpen(prevIsOpenState => !prevIsOpenState);
            }}
          >
            <Bars3Icon className="h-1/2" />
          </button>
          {isDrawerOpen && (
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
              onClick={() => {
                setIsDrawerOpen(false);
              }}
            >
              {navLinks}
            </ul>
          )}
        </div>
        <Link href="/" passHref className="hidden lg:flex items-center gap-2 ml-4 mr-6">
          <div className="flex relative w-10 h-10">
            <Image alt="SE2 logo" className="cursor-pointer" fill src="/launchpod-logo.svg" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold leading-tight">LaunchPod&#8482;</span>
            <span className="text-xs">Public Good</span>
          </div>
        </Link>
        <ul className="hidden lg:flex lg:flex-nowrap menu menu-horizontal px-1 gap-2">{navLinks}</ul>
      </div>
      <div className="navbar-end flex-grow mr-4">
        <RainbowKitCustomConnectButton />
        <FaucetButton />
      </div>
    </div>
  );
};
