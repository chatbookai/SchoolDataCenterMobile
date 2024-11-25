// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import ApexLineChart from './apex-charts/ApexLineChart'
import ApexDonutChart from './apex-charts/ApexDonutChart'
import ApexRadialBarChart from './apex-charts/ApexRadialBarChart'

import AnalyticsTrophy from './analytics/AnalyticsTrophy'
import AnalyticsSalesByCountries from './analytics/AnalyticsSalesByCountries'
import AnalyticsDepositWithdraw from './analytics/AnalyticsDepositWithdraw'
import AnalyticsTransactionsCard from './analytics/AnalyticsTransactionsCard'

import AnalyticsWeeklyOverview from './analytics/AnalyticsWeeklyOverview'
import AnalyticsPerformance from './analytics/AnalyticsPerformance'

import axios from 'axios'

// ** Config
import { defaultConfig } from 'src/configs/auth'
import { useAuth } from 'src/hooks/useAuth'


const AnalyticsStudent = ({authConfig}: any) => {

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const dataDefault:{[key:string]:any} = {}
  const [dashboardData, setDashboardData] = useState(dataDefault)
  const [className, setClassName] = useState<string>("")
  const [optionsMenuItem, setOptionsMenuItem] = useState<string>("")
  const auth = useAuth()

  const toggleSetClassName = (classNameTemp: string) => {
    setClassName(classNameTemp)
  }

  const handleOptionsMenuItemClick = (Item: string) => {
    setOptionsMenuItem(Item)
  }

  //console.log("auth",auth)

  useEffect(() => {
    if (auth.user && auth.user.type=="Student") {
      const backEndApi = "charts/dashboard_deyu_geren_student.php"
      axios.get(authConfig.backEndApiHost + backEndApi, { headers: { Authorization: storedToken }, params: { className, optionsMenuItem } })
      .then(res => {
          setDashboardData(res.data.charts);
          setIsLoading(false)
          setClassName(res.data.defaultValue)
      })
    }
    else if (auth.user && auth.user.type=="User") {
      const backEndApi = "charts/dashboard_deyu_geren_banji.php"
      axios.get(authConfig.backEndApiHost + backEndApi, { headers: { Authorization: storedToken }, params: { className, optionsMenuItem } })
      .then(res => {
          setDashboardData(res.data.charts);
          setIsLoading(false)
          setClassName(res.data.defaultValue)
      })
    }
  }, [className, auth, optionsMenuItem])

  const storedToken = window.localStorage.getItem(defaultConfig.storageTokenKeyName)!

  console.log("dashboardData",dashboardData)

  return (
    <ApexChartWrapper>
      {isLoading ? (
                    <Grid item xs={12} sm={12} container justifyContent="space-around">
                        <Box sx={{ mt: 6, mb: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                            <CircularProgress />
                            <Typography sx={{pt:5, pb:5}}>加载中...</Typography>
                        </Box>
                    </Grid>
                ) : (
                  <Grid container spacing={3}>
                    {dashboardData && dashboardData.map( (item: any, index: number)=> {
                      if(item.type=="AnalyticsTrophy") {
                        return (
                          <Grid item xs={12} md={item.grid} key={index}>
                            <AnalyticsTrophy data={item} toggleSetClassName={toggleSetClassName} className={className} />
                          </Grid>
                        )
                      }
                      else if(item.type=="AnalyticsTransactionsCard") {
                        return (
                          <Grid item xs={12} md={item.grid} key={index}>
                            <AnalyticsTransactionsCard data={item} handleOptionsMenuItemClick={handleOptionsMenuItemClick} />
                          </Grid>
                        )
                      }
                      else if(item.type=="AnalyticsSalesByCountries") {
                        return (
                          <Grid item xs={12} md={item.grid} key={index}>
                            <AnalyticsSalesByCountries authConfig={authConfig} data={item} handleOptionsMenuItemClick={handleOptionsMenuItemClick} />
                          </Grid>
                        )
                      }
                      else if(item.type=="AnalyticsDepositWithdraw") {
                        return (
                          <Grid item xs={12} md={item.grid} key={index}>
                            <AnalyticsDepositWithdraw data={item} handleOptionsMenuItemClick={handleOptionsMenuItemClick} />
                          </Grid>
                        )
                      }
                      else if(item.type=="AnalyticsWeeklyOverview") {
                        return (
                          <Grid item xs={12} md={item.grid} key={index}>
                            <AnalyticsWeeklyOverview data={item} handleOptionsMenuItemClick={handleOptionsMenuItemClick} />
                          </Grid>
                        )
                      }
                      else if(item.type=="ApexLineChart") {
                        return (
                          <Grid item xs={12} md={item.grid} key={index}>
                            <ApexLineChart data={item} handleOptionsMenuItemClick={handleOptionsMenuItemClick} />
                          </Grid>
                        )
                      }
                      else if(item.type=="ApexDonutChart") {
                        return (
                          <Grid item xs={12} md={item.grid} key={index}>
                            <ApexDonutChart data={item} handleOptionsMenuItemClick={handleOptionsMenuItemClick} />
                          </Grid>
                        )
                      }
                      else if(item.type=="ApexRadialBarChart") {
                        return (
                          <Grid item xs={12} md={item.grid} key={index}>
                            <ApexRadialBarChart data={item} handleOptionsMenuItemClick={handleOptionsMenuItemClick} />
                          </Grid>
                        )
                      }
                      else if(item.type=="AnalyticsPerformance") {
                        return (
                          <Grid item xs={12} md={item.grid} key={index}>
                            <AnalyticsPerformance data={item} handleOptionsMenuItemClick={handleOptionsMenuItemClick} />
                          </Grid>
                        )
                      }
                      else  {
                        console.log("Unknown Chart Type")
                      }

                    })}

                  </Grid>
                )}

    </ApexChartWrapper>
  )
}

export default AnalyticsStudent
