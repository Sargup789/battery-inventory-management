import Layout from '@/components/general/Layout';
import QRCodeComponents from '@/components/QRCodeComponents';
import withLogin from '@/components/general/withLogin';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const GenerateQRPage = () => (
  <Layout>
    <QRCodeComponents />
  </Layout>
);

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

export default withLogin(GenerateQRPage);
