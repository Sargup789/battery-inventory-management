import Layout from '@/components/general/Layout'
import withLogin from '@/components/general/withLogin'
import QRCodeIndex from '@/components/QRCodeComponents'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react'

type Props = {}

const GenerateQR = (props: Props) => {
    return (
        <Layout>
            <QRCodeIndex />
        </Layout>
    )
}

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

export default withLogin(GenerateQR)