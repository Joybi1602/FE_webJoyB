import React from 'react'
import { StyleNameProduct, WrapperCardStyle, WrapperDiscountText, WrapperPriceText, WrapperReportText, WrapperStyleTextSell } from './style'
import {StarFilled}from '@ant-design/icons';
import offical from '../../assets/images/offical.png'
import { useNavigate } from 'react-router-dom';
import { converPrice } from '../../utils';




const CardComponent = (props) => {
  const {countInStock, description, image, name, price, rating, type, discount, selled, id} = props
  const navigate = useNavigate()
  const handleDetailsProduct = (id) => {
    navigate(`/product-detail/${id}`)
  }
  return (
    <WrapperCardStyle
      hoverable
      headStyle={{ width: '200px', height: '200px'}}
      bodyStyle={{ padding: '10px'}}
      style={{ width: 200, boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)'}}
      cover={<img alt="example" src={image} />}
      onClick={() => handleDetailsProduct(id)}
    >
      <img src={offical} style={{ width: '75px', height: '16px', position: 'absolute', top: '2px', left: '2px', }}/>
      <StyleNameProduct>{name}</StyleNameProduct>
      <WrapperReportText>
         <span style={{ marginRight: '4px'}}>
            <span>{rating}</span><StarFilled style={{ fontSize: '12px', color: '#FFCC00'}} />
         </span>
         <WrapperStyleTextSell>| Đã bán {selled || 20}</WrapperStyleTextSell>
      </WrapperReportText>
      <WrapperPriceText>
        <span style={{ marginRight: '8px'}}>{converPrice(price)}
        </span>
        <WrapperDiscountText>
          - {discount || 20}%
        </WrapperDiscountText>
      </WrapperPriceText>
      
  </WrapperCardStyle>
  )
}

export default CardComponent
