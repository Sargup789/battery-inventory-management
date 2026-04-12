import Layout from '@/components/general/Layout';
import CheckoutEquipment from '@/components/CheckoutEquipment';
import withLogin from '@/components/general/withLogin';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const CheckoutPage = () => (
  <Layout>
    <CheckoutEquipment />
  </Layout>
);

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

export default withLogin(CheckoutPage);
