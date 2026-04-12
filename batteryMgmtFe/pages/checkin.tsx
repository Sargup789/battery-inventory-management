import Layout from '@/components/general/Layout';
import CheckinEquipment from '@/components/CheckinEquipment';
import withLogin from '@/components/general/withLogin';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const CheckinPage = () => (
  <Layout>
    <CheckinEquipment />
  </Layout>
);

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

export default withLogin(CheckinPage);
