import Layout from "@/components/general/Layout";
import CheckoutEquipment from "@/components/CheckoutEquipment";
import withLogin from "@/components/general/withLogin";

const CheckoutPage = () => (
  <Layout>
    <CheckoutEquipment />
  </Layout>
);

export default withLogin(CheckoutPage);
