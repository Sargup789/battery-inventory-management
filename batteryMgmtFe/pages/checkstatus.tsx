import Layout from "@/components/general/Layout";
import CheckStatusEquipment from "@/components/CheckStatusEquipment";
import withLogin from "@/components/general/withLogin";

const CheckStatusPage = () => (
  <Layout>
    <CheckStatusEquipment />
  </Layout>
);

export default withLogin(CheckStatusPage);
