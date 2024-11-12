import React, { useEffect, useState } from 'react'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLine } from './style'
import InputFrom from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import imagelogo from '../../assets/images/logoJoyB.jpg'
import { Image } from 'antd'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import * as message from '../../components/Message/Message'



const SignUpPage = () => {
    const navigate = useNavigate()
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const handleOnchangeEmail = (value) => {
      setEmail(value)
    }

    const mutation = useMutationHooks(
      data => UserService.signupUser(data)
   )

    const { data, isPending, isSuccess, isError} = mutation

    useEffect(() => {
      if (isSuccess) {
        message.success()
        handleNavigiSignIn()
      } else if (isError) {
        message.error()
      }
    }, [isSuccess, isError])

    const handleOnchangePassword = (value) => {
      setPassword(value)
    }

    const handleOnchangeConfirmPassword = (value) => {
      setConfirmPassword(value)
    }

    const handleNavigiSignIn = () => {
      navigate('/sign-in')
    }

    const handleSignUp = () => {
      mutation.mutate({
        email,
        password,
        confirmPassword
      })
    }
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgb(0, 0, 0, 0.50)', height: '100vh'}}>
    <div style={{ width: '800px', height: '445px', borderRadius: '6px', background: '#fff', display: 'flex'}}>
     <WrapperContainerLeft>
        <h1>Đăng ký</h1>
        <p>Xin chào, mời nhập vào để tạo tài khoản</p>
        <InputFrom style={{ marginBottom: '10px'}} placeholder="abc@gmail.com" value={email} onChange={handleOnchangeEmail}></InputFrom>
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
         <InputFrom placeholder="Password" style={{ marginBottom: '10px'}} type={isShowPassword ? "text" : "password"} 
         value={password} onChange={handleOnchangePassword}></InputFrom>
         </div>
        <div style={{ position: 'relative'}}>
          <span
          onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
          style={{
            zIndex: 10,
            position: 'absolute',
            top: '10px',
            right: '8px',
          }}
          >{
            isShowConfirmPassword ? (
              <EyeFilled />
            ) : (
              <EyeInvisibleFilled />
            )
          }
          </span>
          <InputFrom placeholder="Comfirm password" type={isShowConfirmPassword ? "text" : "password"} 
          value={confirmPassword} onChange={handleOnchangeConfirmPassword}></InputFrom>
         </div>
         {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}
         <Loading isPending={isPending}>
        <ButtonComponent
            disabled={!email.length || !password.length || !confirmPassword}
            onClick={handleSignUp}
            size={40}
            styleButton={{
               background: 'rgb(255, 57, 69)',
               height: '48px',
               width: '100%',
               border: 'none',
               margin: '26px 0 10px'
             }} 
            textbutton={'Đăng ký'}
            styletextbutton={{ color: '#fff', fontSize: '17px', fontWeight: '700' }}
            ></ButtonComponent>
            </Loading>
            <p>Bạn đã có tài khoản? <WrapperTextLine onClick={handleNavigiSignIn}>Đăng nhập</WrapperTextLine></p>
     </WrapperContainerLeft>
     <WrapperContainerRight>
       <Image src={imagelogo} preview={false} alt='image-logo' height="100%" width="400px"></Image>

     </WrapperContainerRight>
    </div>
   </div>
  )
}

export default SignUpPage
