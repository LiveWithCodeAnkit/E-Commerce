import VerifyPage from "@/components/verify-page/VerifyPage";
import React from "react";

interface Props {
  searchParams: {
    token: string;
    userId: string;
  };
}

const page = (props: Props) => {
  return (
    <>
      <VerifyPage {...props} />
    </>
  );
};

export default page;
