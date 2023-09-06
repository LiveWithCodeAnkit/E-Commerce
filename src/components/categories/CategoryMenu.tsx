"use client";
import React from "react";
import HorizontalMenu from "../menu/HorizontalMenu";

// import categories from "@utils/categories";
import Link from "next/link";
import { Chip } from "@material-tailwind/react";
import { categories } from "../constants/categories";

export default function CategoryMenu() {
  return (
    <HorizontalMenu>
      {categories.map((c) => (
        <Link key={c} href={`/browse-products/${c}`}>
          <Chip color="teal" className="mr-2" variant="outlined" value={c} />
        </Link>
      ))}
    </HorizontalMenu>
  );
}
