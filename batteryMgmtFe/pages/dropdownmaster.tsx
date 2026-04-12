import Layout from '@/components/general/Layout';
import DropdownMasterIndex from '@/components/DropdownMaster';
import withLogin from '@/components/general/withLogin';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const DropdownMasterPage = () => (
  <Layout>
    <DropdownMasterIndex />
  </Layout>
);

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

export default withLogin(DropdownMasterPage);
