import AssignToolsForm from "@/components/AssignTools";
import Layout from "@/components/general/Layout";
import withLogin from "@/components/general/withLogin";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from "react";

const AssignToolsPage = () => {
  return (
    <Layout>
      <AssignToolsForm />
    </Layout>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

export default withLogin(AssignToolsPage);
