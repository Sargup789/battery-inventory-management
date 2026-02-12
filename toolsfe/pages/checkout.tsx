import CheckoutForm from '@/components/CheckoutTools'
import Layout from '@/components/general/Layout'
import withLogin from '@/components/general/withLogin'
import React from 'react'

type Props = {}

const checkout = (props: Props) => {
  return (
    <Layout><CheckoutForm /></Layout>
  )
}

export default withLogin(checkout)