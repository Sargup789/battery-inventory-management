import Layout from "@/components/general/Layout";
import UserIndex from "@/components/UserComponents";
import withLogin from "@/components/general/withLogin";

export type UserData = {
  id: string;
  username: string;
  password?: string;
  role: string;
};

export type UserApiResponse = {
  data: UserData[];
  totalCount: number;
};

const UserPage = () => (
  <Layout>
    <UserIndex />
  </Layout>
);

export default withLogin(UserPage);
