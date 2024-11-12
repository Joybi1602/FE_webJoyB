import React, { useMemo } from 'react'
import { WrapperAllPrice, WrapperContentInfo, WrapperHeaderUser, WrapperInfoUser, WrapperItem, WrapperItemLabel, WrapperLabel, WrapperProduct, WrapperProductName, WrapperStyleContent } from './style'
import { useLocation, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import * as OrderService from '../../services/OrderService'
import Loading from '../../components/LoadingComponent/Loading'
import { converPrice } from '../../utils'
import { OrderContant } from '../../contant'

const DetailsOrderPage = () => {
    const params = useParams()
    const location = useLocation()
    const { state } = location
    const { id } = params

    const fetchDetailsOrder = async () => {
        const res = await OrderService.getDetailsOrder(id, state?.token)
        return res.data
    }
  
    const queryOrder = useQuery({
      queryKey: ['orders-details'],
      queryFn: fetchDetailsOrder,
      enabled:  state?.id && state?.access_token
    })
    
    const { isLoading, data} = queryOrder

    const priceMeno = useMemo(() => {
        const result = data?.orderItems?.reduce((total, cur) => {
          return total + ((cur.price*cur.amount))
        },0)
        return result
      }, [data])

  return (
    <Loading isPending={isLoading}>
    <div style={{background: '#f5f5fa', width: '100%', height: '100vh'}}>
      <div style={{ height: '100%', width: '1270px', margin:'0 auto'}}>
      <h4 style={{display: 'inline-block', fontSize: '18px',}}>Chi tiết đơn hàng</h4>
      <WrapperHeaderUser>
        <WrapperInfoUser>
          <WrapperLabel>Địa chỉ người nhận</WrapperLabel>
          <WrapperContentInfo>
            <div style={{ display: 'flex', marginBottom: '5px', fontWeight: 'bold', fontSize: '17px'}}  className='name-info'>{data?.shippingAddress?.fullName}</div>
            <div  style={{ display: 'flex', marginBottom: '5px'}} className='address-info'><span>Địa chỉ: </span> {`${data?.shippingAddress?.address} ${data?.shippingAddress?.city}`}</div>
            <div className='phone-info'><span>Điện thoại: </span>{data?.shippingAddress?.phone}</div>
          </WrapperContentInfo>
        </WrapperInfoUser>
        <WrapperInfoUser>
          <WrapperLabel>Hình thức giao hàng</WrapperLabel>
          <WrapperContentInfo>
            <div  style={{ display: 'flex', marginBottom: '5px'}} className='delivery-info'><span style={{marginRight: '10px' ,color: 'rgb(234, 133, 0)', fontWeight: 'bold'}}>Grab</span>Giao hàng tiết kiệm</div>
            <div className='delivery-fee'><span>Phí giao hàng: </span>{converPrice(data?.shippingPrice)}</div>
          </WrapperContentInfo>
        </WrapperInfoUser>
        <WrapperInfoUser>
          <WrapperLabel>Hình thức thanh toán</WrapperLabel>
          <WrapperContentInfo>
            <div style={{ display: 'flex', marginBottom: '5px'}} className='delivery-info'>{OrderContant.payment[data?.paymentMethod]}</div>
            <div style={{ color: 'red'}} className='delivery-fee'>{data?.isPaid? 'Đã thanh toán' : 'chưa thanh toán'}</div>
          </WrapperContentInfo>
        </WrapperInfoUser>
        </WrapperHeaderUser>
        <WrapperStyleContent>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <div style={{width: '668px', fontWeight: 'bold', fontSize: '15px'}}>Sản phẩm</div>
                <WrapperItemLabel>Giá:</WrapperItemLabel>
                <WrapperItemLabel>Số lượng:</WrapperItemLabel>
                <WrapperItemLabel>Giảm giá:</WrapperItemLabel>
            </div>
            {data?.orderItems?.map((order) => {
                return (
                    <WrapperProduct>
                    <WrapperProductName>
                    <img
                        src={order?.image}
                        style={{
                          width: '70px',
                          height: '70px',
                          objectFit: 'cover',
                          border: '1px solid rgb(238, 238, 238)',
                          padding: '5px'
                        }}
                        alt="Order item"
                      />
                      <div style={{
                        width: 260,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        marginLeft: '10px'
                      }}>{order?.name}</div>
                    </WrapperProductName>
                    <WrapperItem>{converPrice(order?.price)}</WrapperItem>
                    <WrapperItem>{order?.amount}</WrapperItem>
                    <WrapperItem>{order?.discount ? converPrice(priceMeno * order?.discount / 100) : '0 VND'}</WrapperItem>
                </WrapperProduct>
                )
            })}
            <WrapperAllPrice>
            <WrapperItemLabel>Tạm tính:</WrapperItemLabel>
            <WrapperItem>{converPrice(priceMeno)}</WrapperItem>
            </WrapperAllPrice>
            <WrapperAllPrice>
            <WrapperItemLabel>Phí vận chuyển:</WrapperItemLabel>
            <WrapperItem>{converPrice(data?.shippingPrice)}</WrapperItem>
            </WrapperAllPrice>
            <WrapperAllPrice>
            <WrapperItemLabel>Tổng cộng:</WrapperItemLabel>
            <WrapperItem>{converPrice(data?.totalPrice)}</WrapperItem>
            </WrapperAllPrice>
        </WrapperStyleContent>
      </div>
    </div>
    </Loading>
  )
}

export default DetailsOrderPage
