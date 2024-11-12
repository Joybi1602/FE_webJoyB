import { Col, Image,  Rate, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import imageProductSmall from '../../assets/images/test2.webp'
import { WrapperAddressProduct,  WrapperInputNumber, WrapperPriceProduct, WrapperPriceTextProduct, WrapperQualityProduct, WrapperStyleColImg, WrapperStyleImgeSmall, WrapperStyleNameProduct, WrapperStyleTextSell } from './style'
import {MinusOutlined, PlusOutlined}from '@ant-design/icons';
import ButtonComponent from '../ButtonComponent/ButtonComponent'
import * as ProductService from '../../services/ProductService'
import { useQuery } from '@tanstack/react-query'
import Loading from '../LoadingComponent/Loading'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { addOrderProduct , resetOrder} from '../../redux/slides/OrderSlide';
import { converPrice, initFacebookSDK } from '../../utils';
import * as message from '../Message/Message'
import LikeButtonComponent from '../LikeButtonComponent/LikeButtonComponent';
import CommentComponent from '../CommentComponent/CommentComponent';


const ProductDetailComponent = ({idProduct}) => {
  const [numProduct,setNumProduct] = useState(1)
  const user = useSelector((state) => state.user)
  const order = useSelector((state) => state.order)
  const [ errorLimitOrder,setErrorLimitOrder] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  
  const onChange = (value) => {
    setNumProduct(Number(value))
  }

  const fetchGetDetailsProduct = async (context) => {
    const id = context?.queryKey && context?.queryKey[1]
    if(id) {
      const res = await ProductService.getDetailsProduct(id)
      return res.data
    }
  }

  useEffect(() => {
    initFacebookSDK()
  }, [])

  useEffect(() => {
    const orderRedux = order?.orderItems?.find((item) => item.product === productsDetails?._id)
    if((orderRedux?.amount + numProduct) <= orderRedux?.countInStock || (!orderRedux && productsDetails?.countInStock > 0)){
      setErrorLimitOrder(false)
    } else if(productsDetails?.countInStock === 0) {
      setErrorLimitOrder(true)
    }
  }, [numProduct])

  useEffect(() => {
    if(order.isSuccessOrder) {
      message.success('Đã thêm vào giỏ hàng')
    }
    return () => {
      dispatch(resetOrder())
    }
  }, [order.isSuccessOrder])

  const handleChangeCount = (type, limited) => {
    if(type === 'increase') {
      if(!limited) {
        setNumProduct(numProduct + 1)
      }
    } else {
      if(!limited) {
        setNumProduct(numProduct - 1)      
      }
    }
  }

   
  const { isLoading, data: productsDetails, } = useQuery({
    queryKey: ['product-details',idProduct],
    queryFn: fetchGetDetailsProduct,
    enabled: !!idProduct
  });

  const handleAddOrderProduct = () => {
    if(!user?.id) {
      navigate('/sign-in', {state: location?.pathname})
    } else {
      // {
      //   name: {type: String, required: true},
      //   amount: {type: Number, required: true },
      //   image: {type: String, required: true },
      //   price: {type: Number, required: true},
      //   product: {
      //       type: mongoose.Schema.Types.ObjectId,
      //       ref: 'Product',
      //       required: true,
      //    },
      //  },
      const orderRedux = order?.orderItems?.find((item) => item.product === productsDetails?._id)
      if((orderRedux?.amount + numProduct) <= orderRedux?.countInStock || (!orderRedux && productsDetails?.countInStock > 0)) {
        dispatch(addOrderProduct({
          orderItems: {
            name: productsDetails?.name,
            amount: numProduct,
            image: productsDetails?.image,
            price: productsDetails?.price,
            product: productsDetails?._id,
            discount: productsDetails?.discount,
            countInStock: productsDetails?.countInStock,
          }
        }))
      } else{
        setErrorLimitOrder(true)
      }
    }
  }

  return (
    <Loading isPending={isLoading}>
      <Row style={{ padding: '15px', background: '#fff' }}>
      <Col span={10} style={{ borderRight: '1px solid #ccc', paddingRight: '15px'}}>
          <Image src={productsDetails?.image} alt="image product" preview={false} />
          <Row style={{ paddingTop: '15px', justifyContent: 'space-between' }}>
            <WrapperStyleColImg span={4}>
              <WrapperStyleImgeSmall src={imageProductSmall} alt="image small" preview={false} />
            </WrapperStyleColImg>
            <WrapperStyleColImg span={4}>
              <WrapperStyleImgeSmall src={imageProductSmall} alt="image small" preview={false} />
            </WrapperStyleColImg>
            <WrapperStyleColImg span={4}>
              <WrapperStyleImgeSmall src={imageProductSmall} alt="image small" preview={false} />
            </WrapperStyleColImg>
            <WrapperStyleColImg span={4}>
              <WrapperStyleImgeSmall src={imageProductSmall} alt="image small" preview={false} />
            </WrapperStyleColImg>
            <WrapperStyleColImg span={4}>
              <WrapperStyleImgeSmall src={imageProductSmall} alt="image small" preview={false} />
            </WrapperStyleColImg>
            <WrapperStyleColImg span={4}>
              <WrapperStyleImgeSmall src={imageProductSmall} alt="image small" preview={false} />
            </WrapperStyleColImg>
          </Row>
      </Col>
      <Col style={{paddingLeft: '15px'}} span={14}>
           <WrapperStyleNameProduct>{productsDetails?.name}</WrapperStyleNameProduct>
           <div>
             <Rate allowHalf defaultValue={productsDetails?.rating} value={productsDetails?.rating} />
             <WrapperStyleTextSell>| Đã bán 10</WrapperStyleTextSell>
           </div>
           <WrapperPriceProduct>
              <WrapperPriceTextProduct>{converPrice(productsDetails?.price)}</WrapperPriceTextProduct>
           </WrapperPriceProduct>
           <WrapperAddressProduct>
               <span>Giao đến</span> -  
                <span className='address'>{user?.address}</span> - 
               <span className='change-address'> Đổi địa chỉ</span>
           </WrapperAddressProduct>
         <LikeButtonComponent
          dataHref={process.env.REACT_APP_IS_LOCAL 
          ? "https://developers.facebook.com/docs/plugins/" 
          : window.location.href}></LikeButtonComponent>
           <div style={{ margin: '10px 0 20px', padding: '10px 0', borderBottom: '1px solid #ccc', borderTop: '1px solid #ccc'}}>
               <div style={{marginBottom: '10px'}}>Số lượng</div>
              <WrapperQualityProduct>
                  <button style={{ border: 'none', background: 'transparent', cursor: 'pointer'}} onClick={() => handleChangeCount
                    ('decrease', numProduct === 1)}>
                    <MinusOutlined  style={{ color: '#000', font: '20px' }} />
                  </button>
                  <WrapperInputNumber onChange={onChange} defaultValue={1} min={1} max={productsDetails?.countInStock} value={numProduct} size='small' />
                  <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount
                    ('increase', numProduct === productsDetails?.countInStock)}>
                    <PlusOutlined  style={{ color: '#000', font: '20px' }} />
                  </button>
              </WrapperQualityProduct>
           </div>
           <div style={{ display: 'flex', alignItems: 'center', gap: '12px'}}>
            <div>
            <ButtonComponent
             size={40}
             styleButton={{
                background: 'rgb(255, 57, 69)',
                height: '48px',
                width: '220px',
                border: 'none',
              }} 
              onClick={handleAddOrderProduct}
             textbutton={'Chọn mua'}
             styletextbutton={{ color: '#fff', fontSize: '17px', fontWeight: '600' }}
             ></ButtonComponent>
             {errorLimitOrder && <div style={{color: 'red'}}>Sản phẩm đã hết hàng</div>}
             </div>
             <ButtonComponent
             size={40}
             styleButton={{
                background: '#fff',
                height: '48px',
                width: '220px',
                border: 'none',
                border: '2px solid rgb(13, 92, 182)' 
              }} 
             textbutton={'Mua trả sau'}
             styletextbutton={{ color: 'rgb(13, 92, 182)', fontSize: '17px', fontWeight: '400' }}
             ></ButtonComponent>
           </div>
        </Col>
        <CommentComponent dataHref={process.env.REACT_APP_IS_LOCAL 
          ? "https://developers.facebook.com/docs/plugins/comments#configurator" 
          : window.location.href} width="1270" ></CommentComponent>
      </Row>
    </Loading>
  )
}

export default ProductDetailComponent
