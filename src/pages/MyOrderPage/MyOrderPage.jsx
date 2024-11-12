import React, { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import * as OrderService from '../../services/OrderService'
import Loading from '../../components/LoadingComponent/Loading'
import { useSelector } from 'react-redux'
import { WrapperContainer, WrapperFooterItem, WrapperHeaderItem, WrapperItemOrder, WrapperlistOrder, WrapperStatus } from './style'
import { converPrice } from '../../utils'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMutationHooks } from '../../hooks/useMutationHook'
import { message } from 'antd'


const MyOrderPage = () => {
  const location = useLocation()
  const { state } = location
  const navigate = useNavigate()
  const fetchMyOrder = async () => {
      const res = await OrderService.getAllOrderDetails(state?.id, state?.access_token)
      return res.data
  }
  
  const queryOrder = useQuery({
    queryKey: ['orders'],
    queryFn: fetchMyOrder,
    enabled: state?.id && state?.access_token
})

  
  
  const { isLoading, data } = queryOrder

  const handleDetailsOrder = (id) => {
    navigate(`/detailsOrder/${id}`, {
      state: {
        token: state?.token
      }
    })
  }
  
  const mutation = useMutationHooks(
    (data) => {
      const { id, token , orderItems } = data
      const res = OrderService.cancelDetailsOrder(id, token , orderItems)
      return res
    }
  )

  const handleCancelOrder = (order) => {
    mutation.mutate({id : order._id, token: state?.token, orderItems: order?.orderItems}, {
      onSuccess: () => {
        queryOrder.refetch()
      }
    })
  }
  const { isPending: isLoadingCancel, isSuccess: isSuccessCancel, isError: isErrorCancel,  data: dataCancel } = mutation

  useEffect(() => {
    if(isSuccessCancel && dataCancel?.status === 'OK') {
      message.success('success')
    } else if (isErrorCancel) {
      message.error('error')
    }

  }, [isSuccessCancel, isErrorCancel])

  const renderProduct = (data) => {
    return data?.map((order) => {
     return <WrapperHeaderItem key={order?._id}>
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
      <span style={{ fontSize: '13px', color: '#242424', marginLeft: 'auto' }}>{converPrice(order?.price)}</span>
    </WrapperHeaderItem>
    })
  }
  
  return (
    <Loading isPending={isLoading || isLoadingCancel}>
      <WrapperContainer>
        <div style={{ margin: '0 auto', width: '1270px', height: '100%' }}>
          <h4 style={{display: 'inline-block',fontSize: '15px'}}>Đơn hàng của tôi</h4>
          <WrapperlistOrder>
            {data?.map((order) => {
                return (
                 <WrapperItemOrder key={order?._id}>
                   <WrapperStatus>
                     <span style={{ fontSize: '13px', fontWeight: 600 }}>Trạng thái</span>
                     <div style={{ padding: '5px 0 5px 0'}}><span style={{ color: 'rgb(255, 66, 78)' ,}}>Giao hàng: </span>{`${order.isDelivered ? 'Đã giao hàng' : 'Chưa giao hàng'}`}</div>
                     <div><span style={{ color: 'rgb(255, 66, 78)' }}>Thanh toán: </span>{`${order.isPaid ? 'Đã Thanh toán' : 'Chưa thanh toán'}`}</div>
                   </WrapperStatus>
                   {renderProduct(order?.orderItems)}
                   <WrapperFooterItem>
                     <div>
                       <span style={{ color: 'rgb(255, 66, 78)' }}>Tổng tiền: </span>
                       <span style={{ fontSize: '13px', color: 'rgb(56, 56, 61)', fontWeight: 700 }}>{converPrice(order?.totalPrice)}</span>
                     </div>
                     
                     <div style={{display: 'flex', gap: '10px'}}>
                     <ButtonComponent 
                onClick={() => handleCancelOrder(order)}
                size={40}
                styleButton={{
                 height: '36px',
                 border: '2px solid rgb(26, 148, 255)',
                 borderRadius: '4px'
                
                }}
                textbutton={'Hủy đơn hàng'}
                styletextbutton={{ color: 'rgb(26, 148, 255)', fontSize: '13px', fontWeight: 600}}
               ></ButtonComponent>
                <ButtonComponent 
                onClick={() => handleDetailsOrder(order?._id)}
                size={20}
                styleButton={{
                 height: '36px',
                 border: '2px solid rgb(26, 148, 255)',
                 borderRadius: '4px'
                
                }}
                textbutton={'Xem chi tiết'}
                styletextbutton={{ color: 'rgb(26, 148, 255)', fontSize: '13px', fontWeight: 600}}
                  ></ButtonComponent>
                     </div>
                  </WrapperFooterItem>
                 </WrapperItemOrder>
               )
               })}
          </WrapperlistOrder>
        </div>
      </WrapperContainer>
    </Loading>
  )
}

export default MyOrderPage
