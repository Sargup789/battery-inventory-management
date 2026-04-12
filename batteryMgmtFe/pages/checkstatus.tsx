import Layout from '@/components/general/Layout';
import CheckStatusEquipment from '@/components/CheckStatusEquipment';
import withLogin from '@/components/general/withLogin';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const CheckStatusPage = () => (
  <Layout>
    <CheckStatusEquipment />
  </Layout>
);

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

export default withLogin(CheckStatusPage);
