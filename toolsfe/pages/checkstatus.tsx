import CheckToolStatusForm from "@/components/ToolStatus";
import Layout from "@/components/general/Layout";
import withLogin from "@/components/general/withLogin";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from "react";

const CheckStatusPage = () => {
  return (
    <Layout>
      <CheckToolStatusForm />
    </Layout>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

export default withLogin(CheckStatusPage);
