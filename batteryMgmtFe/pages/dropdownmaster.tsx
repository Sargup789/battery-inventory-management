import Layout from "@/components/general/Layout";
import DropdownMasterIndex from "@/components/DropdownMaster";
import withLogin from "@/components/general/withLogin";

const DropdownMasterPage = () => (
  <Layout>
    <DropdownMasterIndex />
  </Layout>
);

export default withLogin(DropdownMasterPage);
