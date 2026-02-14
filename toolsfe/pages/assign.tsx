import AssignToolsForm from "@/components/AssignTools";
import Layout from "@/components/general/Layout";
import withLogin from "@/components/general/withLogin";
import React from "react";

const AssignToolsPage = () => {
  return (
    <Layout>
      <AssignToolsForm />
    </Layout>
  );
};

export default withLogin(AssignToolsPage);
