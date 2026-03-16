import Layout from "@/components/general/Layout";
import UserIndex from "@/components/UserComponents";
import withLogin from "@/components/general/withLogin";

const UserPage = () => (
  <Layout>
    <UserIndex />
  </Layout>
);

export default withLogin(UserPage);
