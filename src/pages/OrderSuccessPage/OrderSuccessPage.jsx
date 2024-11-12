
import { React } from 'react'
import { useSelector } from 'react-redux'
import { WrapperContainer, Lable, WrapperValue, WrapperInfo, WrapperItemOrder, WrapperCountOrder, WrapperItemOrderInfo } from './style'
import Loading from '../../components/LoadingComponent/Loading'
import { useLocation } from 'react-router-dom'
import { OrderContant } from '../../contant'
import { converPrice } from '../../utils'





const OrderSuccessPage = () => {
  const order = useSelector((state) => state.order) 
  const location = useLocation()
  const {state} = location
  return (
    <div style={{background: '#f5f5fa', width: '100%', height: '100vh'}}>
      <Loading isPending={false}>
      <div style={{ height: '100%', width: '1270px', margin:'0 auto'}}>
      <h3 style={{display: 'inline-block', fontSize: '18px',}}>Đơn hàng đặt thành công</h3>
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <WrapperContainer>
          <WrapperInfo>
            <div>
              <Lable>Phương thức giao hàng</Lable>
                <WrapperValue>
                <span style={{color: '#ea8500', fontWeight: 'bold'}}>{OrderContant.delivery[state?.delivery]}</span> Giao hàng tiết kiệm
                </WrapperValue>
            </div>
          </WrapperInfo>
          <WrapperInfo>
              <div>
                <Lable>Phương thức thanh toán </Lable>
                <WrapperValue>
                {OrderContant.payment[state?.payment]}
                </WrapperValue>
              </div>
            </WrapperInfo>
            <WrapperItemOrderInfo>
              {state.order?.map((order) => {
                return (
                  <WrapperItemOrder key={order?.name}>
                  <div style={{width: '500px', display: 'flex', alignItems: 'center', gap: 4}}>
                  <img src={order.image} style={{width: '77px', height: '79px', objectFit: 'cover'}} ></img>
                  <div style={{ fontSize: '15px', width: '260px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{order?.name}</div>
                  </div>
                  <div style={{flex: 1, display: 'flex', alignItems: 'center', gap: '20px'}}>
                    <span>
                      <span style={{ fontSize: '15px', color: '#242424'}}>Giá tiền: {converPrice(order?.price)}</span>
                    </span>
                    <span>
                      <span style={{ fontSize: '15px', color: '#242424'}}>Số lượng: {order?.amount}</span>
                    </span>
                  </div>
                </WrapperItemOrder>
                )
              })}
            </WrapperItemOrderInfo>
              <span>
                <span style={{ fontSize: '20px', color: 'red'}}>Tổng tiền: {converPrice(state?.toTalpriceMeno)}</span>
              </span>
        </WrapperContainer>
       </div>
      </div>
      </Loading>
    </div>
  )
}

export default OrderSuccessPage
