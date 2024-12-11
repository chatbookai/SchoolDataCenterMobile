import React, { ReactNode } from 'react';

import BlankLayout from 'src/@core/layouts/BlankLayout'

import TermsofUseModel from '../views/Setting/TermsofUse'
import { getConfig } from 'src/configs/auth'

const TermsofUse = () => {

  const authConfig = getConfig('@dandian.net')

  return <TermsofUseModel authConfig={authConfig} />
}

TermsofUse.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default TermsofUse;
