import React, { Fragment, useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import {routes} from './routes'
import DefaultComponent from './components/DefaultComponent/DefaultComponent'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { isJsonString } from './utils'
import { jwtDecode } from "jwt-decode";
import * as UserService from './services/UserService'
import { useDispatch, useSelector,  } from 'react-redux'
import { resetUser, updateUser } from './redux/slides/UserSlide'
import { current,  } from '@reduxjs/toolkit'
import Loading from './components/LoadingComponent/Loading'




function App() {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const user = useSelector((state) => state.user)

  useEffect(() => {
    setIsLoading(true)
    const {storageData, decoded} = handleDecoded()
      if(decoded?.id){
        handleGetDetailsUser(decoded?.id, storageData)
    }  
    setIsLoading(false)
  }, [])

  const handleDecoded = () => {
    let storageData =  user?.access_token || localStorage.getItem('access_token')
    let decoded = {}
    if(storageData && isJsonString(storageData) && !user?.access_token) {
      storageData = JSON.parse(storageData)
      decoded = jwtDecode(storageData);
    }
    return { decoded, storageData}
  }

  UserService.axiosJWT.interceptors.request.use(async (config) => {
    const currentTime = new Date()
    const { decoded } = handleDecoded()
    let storageRefreshToken = localStorage.getItem('refresh_token')
    const refreshToken = JSON.parse(storageRefreshToken)
    const decodeRefreshToken = jwtDecode(refreshToken)
    if (decoded?.exp < currentTime.getTime() / 1000) {
      if (decodeRefreshToken?.exp > currentTime.getTime() / 1000) {
        const data = await UserService.refreshToken(refreshToken)
        config.headers['token'] = `Bearer ${data?.access_token}`
      } else {
        dispatch(resetUser())
      }
    }
    return config;
  },  (err) => {
    return Promise.reject(err);
  });
  
  const handleGetDetailsUser = async (id, token) => {
    let storageRefreshToken = localStorage.getItem('refresh_token')
    const refreshToken = JSON.parse(storageRefreshToken)
    const res = await UserService.getDetailsUser(id, token)
    dispatch(updateUser({ ...res?.data, access_token: token, refreshToken: refreshToken }))
  }

  return (
    <div>
      <Loading isPending={isLoading}>
       <Router>
        <Routes>
          {routes.map((route) => {
            const Page = route.page
            const ischeckAuth = !route.isPrivate || user.isAdmin
            const Layout = route.isShowHeader ? DefaultComponent: Fragment
            return (
              <Route key={route.path} path={ischeckAuth ? route.path : undefined} element={
                <Layout>
                  <Page />
                </Layout>
                
              } />
            )
          })}
        </Routes>
       </Router>   
      </Loading>
    </div>
  )
}

export default App