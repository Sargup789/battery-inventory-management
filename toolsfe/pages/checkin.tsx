import CheckinForm from '@/components/CheckInTools'
import Layout from '@/components/general/Layout'
import withLogin from '@/components/general/withLogin'
import React from 'react'

type Props = {}

const checkin = (props: Props) => {
  return (
    <Layout><CheckinForm /></Layout>
  )
}

export default withLogin(checkin)