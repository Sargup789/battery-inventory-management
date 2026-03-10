import CheckinForm from '@/components/CheckInTools'
import Layout from '@/components/general/Layout'
import withLogin from '@/components/general/withLogin'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react'

type Props = {}

const checkin = (props: Props) => {
  return (
    <Layout><CheckinForm /></Layout>
  )
}

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

export default withLogin(checkin)