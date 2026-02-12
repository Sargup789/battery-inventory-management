import Layout from '@/components/general/Layout'
import withLogin from '@/components/general/withLogin'
import QRCodeIndex from '@/components/QRCodeComponents'
import React from 'react'

type Props = {}

const GenerateQR = (props: Props) => {
    return (
        <Layout>
            <QRCodeIndex />
        </Layout>
    )
}

export default withLogin(GenerateQR)