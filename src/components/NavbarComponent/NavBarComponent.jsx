import React from 'react'
import { WrapperContent, WrapperLableText, WrapperPriceText, WrapperTextValue } from './style'
import { Checkbox, Rate } from 'antd'

const NavBarComponent = () => {
    const onChange = () => { }
    const renderContent = (type, options) => {
        switch (type) {
            case 'text':
               return options.map((option) => {
                     return (
                         <WrapperTextValue>{option}</WrapperTextValue>
                     )
               })
            case 'checkbox':
                return (
                    <Checkbox.Group style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }} onChange={onChange}>
                        {options.map((option) => {
                            return (
                                <Checkbox style={{ marginLeft: 0}} value={option.value}>{option.label}</Checkbox>
                            )
                        })}
                    </Checkbox.Group>
                )
            case 'star':
                return options.map((option) =>{
                    return (
                        <div style={{ display: 'flex', gap: '4px'}}>
                        <Rate style={{fontSize: '12px '}} disabled defaultValue={option} />
                        <span>{`từ ${option} sao`}</span>
                        </div>
                    )
                })
                case 'price':
                    return options.map((option) =>{
                        return (
                           < WrapperPriceText>{option}</WrapperPriceText>
                        )
                    })
            default:
               return {}
        }
    }
  return (
    <div style={{ backgroundColor: '#fff'}}>
      <WrapperLableText>Danh mục</WrapperLableText>
      <WrapperContent>
         {renderContent('text', ['kính mát', 'kính cận', 'kính'])}
      </WrapperContent>
      
    </div>
  )
}

export default NavBarComponent
