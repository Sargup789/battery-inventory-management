import Layout from '@/components/general/Layout';
import UserIndex from '@/components/UserComponents';
import withLogin from '@/components/general/withLogin';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

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

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

export default withLogin(UserPage);
