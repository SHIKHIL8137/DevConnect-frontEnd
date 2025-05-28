import React from "react";
import { useLocation } from "react-router-dom";
import SignUp from "../../../pages/common/SignUp";
import SignupChoosing from "../../../pages/common/signupChoosing";

const UnifiedSignUp = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const role = query.get("role");

  if (["freelancer", "client"].includes(role)) return <SignUp />;
  return <SignupChoosing />;
};

export default UnifiedSignUp;
