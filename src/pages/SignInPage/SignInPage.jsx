import React, { useEffect, useState } from 'react'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLine } from './style'
import InputFrom from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import imagelogo from '../../assets/images/logoJoyB.jpg'
import { Image } from 'antd'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import { jwtDecode } from "jwt-decode";
import { useDispatch } from 'react-redux'
import { updateUser } from '../../redux/slides/UserSlide'


const SignInPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch();

  const navigate = useNavigate()

  const mutation = useMutationHooks(
     data => UserService.loginUser(data)
  )
  const { data, isPending, isSuccess} = mutation

  useEffect(() => {
    if (isSuccess) {
      if (isSuccess) {
        if(location?.state) {
          navigate(location?.state)
        } else {
          navigate('/')
      }
    }
     localStorage.setItem('access_token', JSON.stringify(data?.access_token))
     localStorage.setItem('refresh_token', JSON.stringify(data?.refresh_token))
     if (data?.access_token) {
      const decoded = jwtDecode(data?.access_token);
      if(decoded?.id){
        handleGetDetailsUser(decoded?.id, data?.access_token)
      }
     }
    }
  }, [isSuccess])
  
  const handleGetDetailsUser = async (id, token) => {
    const storage = localStorage.getItem('refresh_token')
    const refreshToken = JSON.parse(storage)
    const res = await UserService.getDetailsUser(id, token)
    dispatch(updateUser({ ...res?.data, access_token: token,refreshToken
    })) 
  }

  const handleNavigeSignUp = () => {
    navigate('/sign-up')
  }
  const handleOnchangeEmail = (value) => {
    setEmail(value)
  }

  const handleOnchangePassword = (value) => {
    setPassword(value)
  }

  const handleSignIn = () => {
    mutation.mutate({
      email,
      password
    })
 }
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgb(0, 0, 0, 0.50)', height: '100vh'}}>
     <div style={{ width: '800px', height: '445px', borderRadius: '6px', background: '#fff', display: 'flex'}}>
      <WrapperContainerLeft>
         <h1>Đăng Nhập</h1>
         <p>Xin chào, mời nhập để vào tài khoản</p>
         <InputFrom style={{ marginBottom: '10px'}} placeholder="abc@gmail.com" 
         value={email} onChange={handleOnchangeEmail}></InputFrom>
         <div style={{ position: 'relative'}}>
          <span
          onClick={() => setIsShowPassword(!isShowPassword)}
          style={{
            zIndex: 10,
            position: 'absolute',
            top: '10px',
            right: '8px',
          }}
          >{
            isShowPassword ? (
              <EyeFilled />
            ) : (
              <EyeInvisibleFilled />
            )
          }
          </span>
          <InputFrom placeholder="Password" type={isShowPassword ? "text" : "password"} 
          value={password} onChange={handleOnchangePassword}></InputFrom>
         </div>
         {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}
         <Loading isPending={isPending}>
           <ButtonComponent
             disabled={!email.length || !password.length}
             onClick={handleSignIn}
             size={40}
             styleButton={{
               background: 'rgb(255, 57, 69)',
               height: '48px',
               width: '100%',
               border: 'none',
               margin: '26px 0 10px',
             }}
             textbutton={'Đăng nhập'}
             styletextbutton={{ color: '#fff', fontSize: '17px', fontWeight: '700' }}
           />
           </Loading>
          <WrapperTextLine style={{margin: '12px 0 '}}>Quên mật khẩu</WrapperTextLine>
          <p>Chưa có tài khoản? <WrapperTextLine onClick={handleNavigeSignUp}>Tạo tài khoản</WrapperTextLine></p>
        </WrapperContainerLeft>
      <WrapperContainerRight>
        <Image src={imagelogo} preview={false} alt='image-logo' height="100%" width="400px"></Image>

      </WrapperContainerRight>
     </div>
    </div>
  )
}

export default SignInPage
