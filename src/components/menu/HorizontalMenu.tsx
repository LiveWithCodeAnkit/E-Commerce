"use client";
import React, { ReactNode, useContext } from "react";
//@ts-ignore
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";

import "react-horizontal-scrolling-menu/dist/styles.css";

import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";

export function LeftArrow() {
  //@ts-ignore
  const { isFirstItemVisible, scrollPrev } = useContext(VisibilityContext);

  return (
    <button
      className="px-2 transition"
      disabled={isFirstItemVisible}
      style={{ opacity: isFirstItemVisible ? "0" : "1" }}
      onClick={() => scrollPrev()}
    >
      <ChevronLeftIcon className="w-4 h-4" />
    </button>
  );
}

export function RightArrow() {
  //@ts-ignore
  const { isLastItemVisible, scrollNext } = useContext(VisibilityContext);

  return (
    <button
      className="px-2 transition"
      style={{ opacity: isLastItemVisible ? "0" : "1" }}
      disabled={isLastItemVisible}
      onClick={() => scrollNext()}
    >
      <ChevronRightIcon className="w-4 h-4" />
    </button>
  );
}

interface Props {
  children: JSX.Element | JSX.Element[];
}

export default function HorizontalMenu({ children }: Props) {
  return (
    <div>
      <ScrollMenu
        wrapperClassName="w-full"
        LeftArrow={LeftArrow}
        RightArrow={RightArrow}
      >
        {children}
      </ScrollMenu>
    </div>
  );
}
