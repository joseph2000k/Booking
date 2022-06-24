import React, { Fragment, useState, useEffect } from "react";
import { connect } from "react-redux";
import ForApprovalofAdmin from "./ForApprovalofAdmin";

const Admin = ({}) => {
  return <Fragment>{<ForApprovalofAdmin />}</Fragment>;
};

export default connect(null, {})(Admin);
