import CheckoutForm from '@/components/CheckoutTools'
import Layout from '@/components/general/Layout'
import withLogin from '@/components/general/withLogin'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react'

type Props = {}

const checkout = (props: Props) => {
  return (
    <Layout><CheckoutForm /></Layout>
  )
}

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

export default withLogin(checkout)