"use client";
import React from "react";
import { StarIcon as RatedIcon } from "@heroicons/react/24/solid";
import { StarIcon as UnratedIcon } from "@heroicons/react/24/outline";
import { Rating } from "@material-tailwind/react";

interface Props {
  rating: number;
}

export default function ReviewStars({ rating }: Props) {
  return (
    <Rating
      ratedIcon={<RatedIcon className="h-4 w-4" />}
      unratedIcon={<UnratedIcon className="h-4 w-4" />}
      value={rating}
      readonly
    />
  );
}
