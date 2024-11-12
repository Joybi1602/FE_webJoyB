import {  Form, Radio } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { WrapperTotal, WrapperInfo, WrapperLeft,  WrapperRight, WapperRadio, Lable, WrapperTotalOrder,  } from './style'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { converPrice } from '../../utils'
import ModalComponent from '../../components/ModalComponent/ModalComponent'
import InputComponent from '../../components/InputComponent/InputComponent'
import { useMutationHooks } from '../../hooks/useMutationHook'
import * as UserService from '../../services/UserService'
import Loading from '../../components/LoadingComponent/Loading'
import * as message from '../../components/Message/Message'
import { updateUser } from '../../redux/slides/UserSlide'
import { removeAllOrderProduct } from '../../redux/slides/OrderSlide'
import * as OrderService from '../../services/OrderService'
import { Navigate, useNavigate } from 'react-router-dom'
import { PayPalButton } from 'react-paypal-button-v2'
import * as PaymentService from '../../services/PaymentService'




const PaymentPage = () => {
  const order = useSelector((state) => state.order) 
  const user = useSelector((state) => state.user) 
  const navigate = useNavigate()
  const [sdkReady , setSdkReady] = useState(false)

  const [delivery, setDelivery] = useState('grab')
  const [payment, setPayment] = useState('later_money')

  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
  const [stateUserDetails, setStateUserDetails] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    
  })
  const [form] = Form.useForm();
  
  const [listChecked, setListChecked] = useState([])

  const dispatch = useDispatch()

  

  useEffect(() => {
    form.setFieldsValue(stateUserDetails)
  }, [form, stateUserDetails])  

  useEffect(() => {
    if(isOpenModalUpdateInfo) {
      setStateUserDetails({
        city: user?.city,
        name: user?.name,
        phone: user?.phone,
        address: user?.address
      })
    }
  }, [isOpenModalUpdateInfo])

  const handleChangeAddress = () => {
    setIsOpenModalUpdateInfo(true)
  }


  const priceMeno = useMemo(() => {
    const result = order?.orderItemsSelected?.reduce((total, cur) => {
      return total + ((cur.price*cur.amount))
    },0)
    return result
  }, [order])

  const diliverypriceMeno = useMemo(() => {
   if (priceMeno > 250000 ) {
    return 15000
   } else if(priceMeno === 0) {
     return 0
   } 
    else { 
    return 30000
   }
  }, [priceMeno])

  const priceDiscountMeno = useMemo(() => {
    const result = order?.orderItemsSelected?.reduce((total, cur) => {
      const totalDiscount = cur.discount ? cur.discount: 0
      return total + (priceMeno * (totalDiscount + cur.amount) / 100)
    },0)
    if(Number(result)) {
      return result
    }
    return 0
  }, [order])

  const toTalpriceMeno = useMemo(() => {
    return Number(priceMeno) - Number(priceDiscountMeno) + Number(diliverypriceMeno) 
  }, [priceMeno, priceDiscountMeno, diliverypriceMeno])

  const handleAddOrder = () => {
    if(user?.access_token && order?.orderItemsSelected && user?.name 
      && user?.address && user?.phone && user?.city && priceMeno && user?.id
    ) {
      // eslint-disable-next-line no-unused-expressions
      mutationAddOrder.mutate({
        token: user?.access_token,
        orderItems: order?.orderItemsSelected, 
        fullName: user?.name,
        address: user?.address,
        phone: user?.phone,
        city: user?.city,
        paymentMethod: payment,
        itemsPrice: priceMeno,
        shippingPrice: diliverypriceMeno,
        totalPrice: toTalpriceMeno,
        user: user?.id,
        }
      )
    }
  }

  const handleRemoveAllOrder = () => {
    if(listChecked?.length > 1) {
      dispatch(removeAllOrderProduct({listChecked}))
    }
  }

  const mutationUpdate = useMutationHooks(
    (data) => {
        const { id, 
          token,
          ...rests } = data
        const res = UserService.updateUser(
          id, 
          {...rests}, token)
        return res
     }
   )

   const mutationAddOrder = useMutationHooks(
    (data) => {
        const {  
          token,
          ...rests } = data
        const res = OrderService.createOrder(
          {...rests}, token)
        return res
     }
   )

  const {isPending, data} = mutationUpdate
  const {isPending: isLoadingAddOrder, data: dataAddOrder,isSuccess, isError} = mutationAddOrder

  useEffect(() => {
    if(isSuccess && dataAddOrder?.status === 'OK') {
      const arrayOrder = []
      order?.orderItemsSelected?.forEach(element => {
        arrayOrder.push(element.product)
      });
      dispatch(removeAllOrderProduct({listChecked: arrayOrder}))
      message.success('Đặt hàng thành công')
      navigate('/orderSuccess', {
        state: {
          delivery,
          payment,
          order: order?.orderItemsSelected,
          toTalpriceMeno: toTalpriceMeno
        }
      })
    } else if(isError){
      message.error()
    }
  }, [isSuccess, isError]) 

  const handleCancelUpdate = () => {
    setStateUserDetails({
      name: '',
      email: '',
      phone: '',
      isAdmin: false,
    })
    form.resetFields()
    setIsOpenModalUpdateInfo(false)
  }
  
  const onSuccessPaypal = (details, data) => {
    mutationAddOrder.mutate({
      token: user?.access_token,
      orderItems: order?.orderItemsSelected, 
      fullName: user?.name,
      address: user?.address,
      phone: user?.phone,
      city: user?.city,
      paymentMethod: payment,
      itemsPrice: priceMeno,
      shippingPrice: diliverypriceMeno,
      totalPrice: toTalpriceMeno,
      user: user?.id,
      isPaid: true,
      paidAt: details.update_time
      }
    )
  }

  const handleUpdateInfoUser = () => {
    const {name, phone, address, city} = stateUserDetails
    if (name && address && phone && city) {
      mutationUpdate.mutate({
        id: user?.id,
        token: user?.access_token,
        ...stateUserDetails}, {
          onSuccess: () => {
            dispatch(updateUser({name, phone, address, city}))   
            setIsOpenModalUpdateInfo(false)
          }
        })
    }
  }

  const handleOnChangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value
    })
  }

  const handleDilivery = (e) => {
    setDelivery(e.target.value)

  }

  const handlePayment = (e) => {
    setPayment(e.target.value)

  }

  const addPaypalScript = async () => {
    const { data } = await PaymentService.getConfig()
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = `https://sandbox.paypal.com/sdk/js?client-id=${data}`
    script.async = true
    script.onload = () => {
      setSdkReady(true)

    }
    document.body.appendChild(script) 
  }

  useEffect(() => {
    if(!window.paypal) {
      addPaypalScript()
    } else {
      setSdkReady(true)
    }
  }, [])

  return (
    <div style={{background: '#f5f5fa', width: '100%', height: '100vh'}}>
      <Loading isPending={isLoadingAddOrder}>
      <div style={{ height: '100%', width: '1270px', margin:'0 auto'}}>
      <h3 style={{display: 'inline-block', fontSize: '18px',}}>Thanh Toán</h3>
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <WrapperLeft>
          <WrapperTotalOrder>
            <div>
              <Lable>Chọn phương thức giao hàng</Lable>
              <WapperRadio onChange={handleDilivery} value={delivery} >
                <Radio value="grab"><span style={{color: '#ea8500', fontWeight: 'bold'}}>Grab</span> Giao hàng tiết kiệm</Radio>
                <Radio value="gojek"><span style={{color: '#ea8500', fontWeight: 'bold'}}>Gojek</span> Giao hàng tiết kiệm</Radio>
              </WapperRadio>
            </div>
          </WrapperTotalOrder>
          <WrapperTotalOrder>
              <div>
                <Lable>Chọn phương thức thanh toán </Lable>
                <WapperRadio onChange={handlePayment} value={payment}> 
                  <Radio value="later_money"> Thanh toán khi nhận hàng</Radio>
                  <Radio value="paypal"> Thanh toán bằng ví Paypal</Radio>
                </WapperRadio>
              </div>
            </WrapperTotalOrder>
        </WrapperLeft>
        <WrapperRight>
          <div style={{width: '100%'}}>
          <WrapperInfo>
            <div>
              <span style={{ fontSize: '15px', fontWeight: 'bold',}}>Địa chỉ giao hàng:</span>
              <span style={{ fontSize: '14px', fontWeight: 500, paddingLeft: '15px'}}>{`${user?.address} , ${user?.city}`}</span>
              <span onClick={handleChangeAddress} style={{ cursor: 'pointer'  ,color: 'blue', fontSize: '13px', fontWeight: 500, paddingLeft: '22px'}}>Thay đổi</span>
            </div>
            </WrapperInfo>
            <WrapperInfo>
              <div style={{ padding: '10px 0'}}>
              <div style={{ fontSize: '13px',display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <span style={{ fontSize: '15px', fontWeight: 'bold', paddingBottom: '8px'}}>Tạm tính :</span>
                <span style={{color: '#000', fontSize: '14px', fontWeight: 500}}>{converPrice(priceMeno)}</span>
              </div>
              <div style={{ fontSize: '13px',display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <span style={{ fontSize: '15px', fontWeight: 'bold', paddingBottom: '8px'}}>Giảm giá :</span>
                <span style={{color: '#000', fontSize: '14px', fontWeight: 500}}>{converPrice(priceDiscountMeno)}</span>
              </div>
              <div style={{ fontSize: '13px',display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <span style={{ fontSize: '15px', fontWeight: 'bold', paddingBottom: '8px'}}>Phí giao hàng :</span>
                <span style={{color: '#000', fontSize: '14px', fontWeight: 500}}>{converPrice(diliverypriceMeno)}</span>
              </div>
              </div>
            </WrapperInfo>
            <WrapperTotal>
              <span style={{fontSize: '18px', fontWeight: 'bold',}}>Tổng tiền:</span>
              <span style={{display: 'flex', flexDirection: 'column'}}>
                <span style={{color: 'rgb(254, 56, 52', fontSize: '24px', fontWeight: 'bold'}}>{converPrice(toTalpriceMeno)}</span>
                <span style={{color: '#000', fontSize: '11px'}}>(Đã bao gồm giảm giá)</span>
              </span>
            </WrapperTotal>
          </div>
          {payment === 'paypal' && sdkReady ? (
            <div style={{ width: '360px'}}>
            <PayPalButton
            amount={toTalpriceMeno}
            // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
            onSuccess={onSuccessPaypal}
            onError={() => {
              alert('ERROR')

            }
            }
          />
          </div> 
          ) : (
            <ButtonComponent 
               onClick={() => handleAddOrder()}
               size={40}
               styleButton={{
                background: 'rgb(255, 57, 69  ',
                height: '48px',
                width: '360px',
                border: 'none',
                borderRadius: '4px'
               
               }}
               textbutton={'Đặt hàng'}
               styletextbutton={{ color: '#fff', fontSize: '20px', fontWeight: 700}}
              ></ButtonComponent>

          )}
        </WrapperRight>
       </div>
      </div>
      <ModalComponent forceRender title="Cập nhật thông tin giao hàng" open={isOpenModalUpdateInfo} onCancel={handleCancelUpdate} onOk={handleUpdateInfoUser}>
        <Loading isPending={isPending}>
        <Form
          name="basic"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 20 }}
          // onFinish={onUpdateUser}
          autoComplete="on"
          form={form}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <InputComponent value={stateUserDetails['name']} onChange={handleOnChangeDetails} name='name'/>
          </Form.Item>

          <Form.Item
            label="City"
            name="city"
            rules={[{ required: true, message: 'Please input your city!' }]}
          >
            <InputComponent value={stateUserDetails['city']} onChange={handleOnChangeDetails} name='city'/>
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: 'Please input your phone!' }]}
          >
            <InputComponent value={stateUserDetails.phone} onChange={handleOnChangeDetails} name='phone'/>
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: 'Please input your address!' }]}
          >
            <InputComponent value={stateUserDetails.address} onChange={handleOnChangeDetails} name='address'/>
          </Form.Item>
        </Form>
        </Loading>
      </ModalComponent>
      </Loading>
    </div>
  )
}

export default PaymentPage
