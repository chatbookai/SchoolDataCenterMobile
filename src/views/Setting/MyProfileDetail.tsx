
// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

import { useAuth } from 'src/hooks/useAuth'

interface ColorsType {
  [key: string]: ThemeColor
}

const roleColors: ColorsType = {
  admin: 'error',
  editor: 'info',
  author: 'warning',
  maintainer: 'success',
  subscriber: 'primary'
}

const MyProfileDetail = ({authConfig}: any) => {
  // ** States
  const auth = useAuth()

  const data: any = auth.user

  console.log("MyProfileDetail authConfig", authConfig, data)

  if (data) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ pt: 10, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              {data.avatar.length ? (
                <CustomAvatar
                  src={data.avatar}
                  variant='rounded'
                  alt={data.USER_NAME}
                  sx={{ width: 120, height: 120, fontWeight: 600, mb: 4, fontSize: '3rem' }}
                />
              ) : (
                <CustomAvatar
                  skin='light'
                  variant='rounded'
                  color={'info' as ThemeColor}
                  sx={{ width: 120, height: 120, fontWeight: 600, mb: 4, fontSize: '3rem' }}
                >
                  {getInitials(data.USER_NAME)}
                </CustomAvatar>
              )}
              <Typography variant='h6' sx={{ mb: 4 }}>
                {data.USER_NAME}
              </Typography>
              <CustomChip
                skin='light'
                size='small'
                label={data.role}
                color={roleColors[data.role] ?? 'info'}
                sx={{ textTransform: 'capitalize' }}
              />
            </CardContent>

            <CardContent>
              <Typography variant='h6'>我的资料</Typography>
              <Divider sx={{ my: theme => `${theme.spacing(4)} !important` }} />
              <Box sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>类型:</Typography>
                  <Typography variant='body2' sx={{ textTransform: 'capitalize' }}>
                    {data.type}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>用户名:</Typography>
                  <Typography variant='body2'>{data.USER_ID}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>姓名:</Typography>
                  <Typography variant='body2'>{data.USER_NAME}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>部门:</Typography>
                  <Typography variant='body2' sx={{ textTransform: 'capitalize' }}>
                    {data.DEPT_NAME}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>电子邮件:</Typography>
                  <Typography variant='body2'>{data.EMAIL}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        </Grid>
    )
  }
}

export default MyProfileDetail
