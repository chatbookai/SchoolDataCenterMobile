import React, { ReactNode } from 'react';

import BlankLayout from 'src/@core/layouts/BlankLayout'

import PrivacyPolicyModel from '../views/Setting/PrivacyPolicy'
import { getConfig } from 'src/configs/auth'

const PrivacyPolicy = () => {

  const authConfig = getConfig('@dandian.net')

  return <PrivacyPolicyModel authConfig={authConfig} />
}

PrivacyPolicy.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default PrivacyPolicy;
