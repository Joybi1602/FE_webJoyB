import React, { useEffect, useState } from 'react'
import { WapperLabel, WrapperContentProfile, WrapperHeaderUser, WrapperInput, WrapperUploadFile } from './style'
import InputFrom from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { useDispatch, useSelector } from 'react-redux'
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import * as message from '../../components/Message/Message'
import { updateUser } from '../../redux/slides/UserSlide'
import { Button, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { getBase64 } from '../../utils'



const ProfilePage = () => {
    const user = useSelector((state) => state.user)
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [avatar, setAvatar] = useState('')
    const mutation = useMutationHooks(
        (data) => {
            const { id, access_token, ...rests } = data
            UserService.updateUser(id, rests, access_token)
        }
     )

    const dispatch = useDispatch()
    const { data, isPending, isSuccess, isError} = mutation

    useEffect(() => {
        setEmail(user?.email)
        setName(user?.name)
        setPhone(user?.phone)
        setAddress(user?.address)
        setAvatar(user?.avatar)
       
    }, [user])

    useEffect(() => {
        if(isSuccess) {
            message.success()
            handleGetDetailsUser(user?.id, user?.access_token)
        } else if(isError) {
            message.error()
        }
    }, [isSuccess, isError])

    const handleGetDetailsUser = async (id, token) => {
        const res = await UserService.getDetailsUser(id, token)
        dispatch(updateUser({...res?.data, access_token: token})) 
      }


    const handleOnchangeEmail = (value) => {
        setEmail(value)
    }

    const handleOnchangeName = (value) => {
        setName(value)
    }

    const handleOnchangePhone = (value) => {
        setPhone(value)
    }

    const handleOnchangeAddress = (value) => {
        setAddress(value)
    }

    const handleOnchangeAvatar = async ({fileList}) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setAvatar(file.preview)
    }
    const handleUpdate = () => {
        mutation.mutate({id: user?.id, email, name, phone, address, avatar, access_token: user?.access_token})
    }
    return (
     <div style={{ width: '1270px', margin: '0 auto', height: '500px'}}>
      <WrapperHeaderUser>Thông tin người dùng</WrapperHeaderUser>
      <Loading isPending={isPending}>
      <WrapperContentProfile>
        <WrapperInput>
            <WapperLabel htmlFor="name" >Name</WapperLabel>
        <InputFrom style={{width: '300px'}} id="name" value={name} onChange={handleOnchangeName}></InputFrom>
        <ButtonComponent
             onClick={handleUpdate}
             size={40}
             styleButton={{
               height: '30px',
               width: 'fit-content',
               border: '1px solid rgb(26, 148, 255)',
               borderRaius: '4px',
               padding: '2px 6px 6px'
             }}
             textbutton={'Cập nhật'}
             styletextbutton={{ color: 'rgb(26, 148, 255)', fontSize: '15px', fontWeight: '700' }}
           />
        </WrapperInput>
        <WrapperInput>
            <WapperLabel htmlFor="email" >Email</WapperLabel>
        <InputFrom style={{width: '300px'}} id="email" value={email} onChange={handleOnchangeEmail}></InputFrom>
        <ButtonComponent
             onClick={handleUpdate}
             size={40}
             styleButton={{
               height: '30px',
               width: 'fit-content',
               border: '1px solid rgb(26, 148, 255)',
               borderRaius: '4px',
               padding: '2px 6px 6px'
             }}
             textbutton={'Cập nhật'}
             styletextbutton={{ color: 'rgb(26, 148, 255)', fontSize: '15px', fontWeight: '700' }}
           />
        </WrapperInput>
        <WrapperInput>
            <WapperLabel htmlFor="phone" >Phone</WapperLabel>
        <InputFrom style={{width: '300px'}} id="phone" value={phone} onChange={handleOnchangePhone}></InputFrom>
        <ButtonComponent
             onClick={handleUpdate}
             size={40}
             styleButton={{
               height: '30px',
               width: 'fit-content',
               border: '1px solid rgb(26, 148, 255)',
               borderRaius: '4px',
               padding: '2px 6px 6px'
             }}
             textbutton={'Cập nhật'}
             styletextbutton={{ color: 'rgb(26, 148, 255)', fontSize: '15px', fontWeight: '700' }}
           />
        </WrapperInput>
        <WrapperInput>
            <WapperLabel htmlFor="avatar" >Avatar</WapperLabel>
            <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
                <Button icon={<UploadOutlined />}>Select File</Button>
            </WrapperUploadFile>
            {avatar && (
                <img src={avatar} style={{
                    height: '60px',
                    width: '60px',
                    borderRadius: '50%',
                    objectFit: 'cover'
                }} alt='avatar'/>
            )}
        {/* <InputFrom style={{width: '300px'}} id="avatar" value={avatar} onChange={handleOnchangeAvatar}></InputFrom> */}
        <ButtonComponent
             onClick={handleUpdate}
             size={40}
             styleButton={{
               height: '30px',
               width: 'fit-content',
               border: '1px solid rgb(26, 148, 255)',
               borderRaius: '4px',
               padding: '2px 6px 6px'
             }}
             textbutton={'Cập nhật'}
             styletextbutton={{ color: 'rgb(26, 148, 255)', fontSize: '15px', fontWeight: '700' }}
           />
        </WrapperInput>
        <WrapperInput>
            <WapperLabel htmlFor="address" >Address</WapperLabel>
        <InputFrom style={{width: '300px'}} id="address" value={address} onChange={handleOnchangeAddress}></InputFrom>
        <ButtonComponent
             onClick={handleUpdate}
             size={40}
             styleButton={{
               height: '30px',
               width: 'fit-content',
               border: '1px solid rgb(26, 148, 255)',
               borderRaius: '4px',
               padding: '2px 6px 6px'
             }}
             textbutton={'Cập nhật'}
             styletextbutton={{ color: 'rgb(26, 148, 255)', fontSize: '15px', fontWeight: '700' }}
           />
        </WrapperInput>
      </WrapperContentProfile>
      </Loading>
    </div>
  )
}

export default ProfilePage
