import DropdownMasterComponent from '@/components/DropdownMaster'
import Layout from '@/components/general/Layout'
import withLogin, { DecodedToken } from '@/components/general/withLogin'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { useEffect } from 'react'


const DropdownMaster = ({ roles }: DecodedToken) => {
    useEffect(() => {
        if (roles && roles !== "administrator") {
            window.open('/', '_self')
        }
    }, [roles])
    return (
        <Layout><DropdownMasterComponent /></Layout>
    )
}

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

export default withLogin(DropdownMaster)