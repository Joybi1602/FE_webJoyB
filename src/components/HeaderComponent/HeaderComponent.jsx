import { Badge, Button, Col, Popover } from 'antd'
import React, { useEffect, useState } from 'react'
import { WrapperContentPopup, WrapperHeader, WrapperHeaderAccount, WrapperTextHeader, WrapperTextHeaderSmall } from './Style'
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch';
import {
    UserOutlined,
    CaretDownOutlined,
    ShoppingCartOutlined,
  }from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as UserService from '../../services/UserService'
import { resetUser } from '../../redux/slides/UserSlide'
import Loading from '../LoadingComponent/Loading';
import { searchProduct } from '../../redux/slides/ProductSlide';




const HeaderComponent = ({isHiddenSearch = false, isHiddenCart = false}) => {
  const navigate = useNavigate()
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch();
  const [userName, setUserName] = useState('')
  const [userAvatar, setUserAvatar] = useState('')
  const [search,setSearch] = useState('')
  const [isOpenPopup,setIsOpenPopup] = useState(false)
  const order = useSelector((state) => state.order)
  const [loading, serLoading] = useState(false)
  const handleNavigateLogin = () => {
    navigate('/sign-in')
  }

  const handleLogout = async () => {
    serLoading(true)
    await UserService.logoutUser()
    dispatch(resetUser())
    serLoading(false)
  }

  useEffect(() => {
    serLoading(true)
    setUserName(user?.name)
    setUserAvatar(user?.avatar)
    serLoading(false)
  }, [user?.name, user?.avatar])


  const content = (
    <div>
      <WrapperContentPopup onClick={() => handleClickNavigate('profile')}>Thông tin người dùng</WrapperContentPopup>
      {user?.isAdmin && (
        <WrapperContentPopup onClick={() => handleClickNavigate('admin')}>Quản lý hệ thống</WrapperContentPopup>
      )}
      <WrapperContentPopup onClick={() => handleClickNavigate('myOrder')}>Đơn hàng</WrapperContentPopup>
      <WrapperContentPopup onClick={() => handleClickNavigate()}>Đăng xuất</WrapperContentPopup>
    </div>
  )

  const handleClickNavigate = (type) => {
    if(type === 'profile') {
      navigate('/profile-use')
    }else if(type === 'admin') {
      navigate('/system/admin')
    }else if(type === 'myOrder') {
      navigate('/myOrder' , {
          state: {
          id: user?.id,
          token: user?.access_token
        }
      })
    }else {
      handleLogout()
    }
       setIsOpenPopup(false)
  }

  const onSearch = (e) => {
    setSearch(e.target.value)
    dispatch(searchProduct(e.target.value))
  }
  return (
    <div style={{ width: '100%', background: 'rgb(26, 148, 255', display: 'flex', justifyContent: 'center'}}>
    <WrapperHeader style={{ justifyContent: isHiddenSearch && isHiddenCart ? 'space-between': 'unset' }}>
      <Col span={5} >
      <WrapperTextHeader ><span style={{cursor: 'pointer'}} onClick={() => {navigate('/')}} >MẮT KÍNH JOYB</span></WrapperTextHeader>
      </Col> 
      {!isHiddenSearch && (
      <Col span={13}>
      <ButtonInputSearch 
       size='large'
       bordered={false}
       textbutton='Tìm Kiếm'
       placeholder="Tìm kiếm tại đây" 
        onChange={onSearch} 
         />
      </Col>
        
      )}
      <Col span={6} style={{display: 'flex', gap: '54px', alignItems: 'center'}} >
      <Loading isPending={loading}>
       <WrapperHeaderAccount>
        {userAvatar ? (
          <img src={userAvatar} alt="avatar" style={{
            height: '40px',
            width: '40px',
            borderRadius: '50%',
            objectFit: 'cover',
        }}/>
        ) : (
          <UserOutlined style={{fontSize: '30px',}}/>
        )}
       {user?.access_token ? (
        <>
          <Popover content={content} trigger="click" open={isOpenPopup}>
            <div style={{ cursor: 'pointer', marginTop: '8px' }} onClick={() => setIsOpenPopup((prev) => !prev)}>
              {userName?.length ? userName : user?.email}
            </div>
          </Popover>
        </>
      ) : (
        <div onClick={handleNavigateLogin} style={{ cursor: 'pointer' }}>
          <WrapperTextHeaderSmall>Đăng ký/Đăng nhập</WrapperTextHeaderSmall>
          <div>
            <WrapperTextHeaderSmall>Tài Khoản</WrapperTextHeaderSmall>
            <CaretDownOutlined />
          </div>
        </div>
      )}
       </WrapperHeaderAccount>
       </Loading>
       {!isHiddenCart && (
       <div onClick={() => navigate('/order')} style={{cursor: 'pointer'}}>
        <Badge count={order?.orderItems?.length} size='smaill'>
         <ShoppingCartOutlined style={{fontSize: '30px', color: '#fff'}}/>
        </Badge>
         <WrapperTextHeaderSmall>Giỏ hàng</WrapperTextHeaderSmall>
       </div>

       )}
      </Col>
    </WrapperHeader>
    </div>
  )
}

export default HeaderComponent

