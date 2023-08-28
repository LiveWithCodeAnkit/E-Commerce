import React from "react";
import VerifyPage from "@/components/verify-page/VerifyPage";

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
