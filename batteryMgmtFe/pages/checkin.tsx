import Layout from "@/components/general/Layout";
import CheckinEquipment from "@/components/CheckinEquipment";
import withLogin from "@/components/general/withLogin";

const CheckinPage = () => (
  <Layout>
    <CheckinEquipment />
  </Layout>
);

export default withLogin(CheckinPage);
