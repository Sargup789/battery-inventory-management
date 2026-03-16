import Layout from "@/components/general/Layout";
import QRCodeComponents from "@/components/QRCodeComponents";
import withLogin from "@/components/general/withLogin";

const GenerateQRPage = () => (
  <Layout>
    <QRCodeComponents />
  </Layout>
);

export default withLogin(GenerateQRPage);
