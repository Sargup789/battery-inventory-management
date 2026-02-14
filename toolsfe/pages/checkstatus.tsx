import CheckToolStatusForm from "@/components/ToolStatus";
import Layout from "@/components/general/Layout";
import withLogin from "@/components/general/withLogin";
import React from "react";

const CheckStatusPage = () => {
  return (
    <Layout>
      <CheckToolStatusForm />
    </Layout>
  );
};

export default withLogin(CheckStatusPage);
