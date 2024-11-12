import { Menu, Switch } from 'antd'
import React, { useState } from 'react'
import { AppstoreOutlined, UserOutlined, ShoppingCartOutlined ,BarChartOutlined} from '@ant-design/icons';
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent';
import AdminUser from '../../components/AdminUser/AdminUser';
import AdminProduct from '../../components/AdminProduct/AdminProduct';
import OrderAdmin from '../../components/OrderAdmin/OrderAdmin';

const AdminPage = () => {
    const items = [
      {
        key: 'Total',
        label: 'Doanh thu',
        icon: <BarChartOutlined style={{fontSize: '20px'}}/> 
      },
        {
          key: 'user',
          label: 'Người dùng',
          icon: <UserOutlined style={{fontSize: '20px'}}/>,
        },
        {
          key: 'product',
          label: 'Sản phẩm',
          icon: <AppstoreOutlined style={{fontSize: '20px'}}/>,
          
        },
        {
          key: 'order',
          label: 'Đơn hàng',
          icon: <ShoppingCartOutlined style={{fontSize: '20px'}}/> 
        
        },
      ];
    const [theme, setTheme] = useState('dark');
    const [keySelected, setKeySelected] = useState('');

    const renderPage = (key) => {
        switch(key) {
            case 'user':
            return (
                <AdminUser />
            )
            case 'product':
            return (
                <AdminProduct />
            )
            case 'order':
              return (
                  <OrderAdmin />
              )
            default:
                return <></>
        }
    }
    const handleOnClick = ({key}) => {
        setKeySelected(key);
    };

    const changeTheme = (value) => {
        setTheme(value ? 'dark' : 'light');
        };
  return (
    <>
    <HeaderComponent isHiddenSearch isHiddenCart/>
      <Switch style={{ marginTop: '5px '}}
        checked={theme === 'dark'}
        onChange={changeTheme}
        checkedChildren="Dark"
        unCheckedChildren="Light"
      />
      <br />
      <br />
      <div style={{display: 'flex', borderTop: '2px solid #ccc'}}>
      <Menu 
        theme={theme}
        onClick={handleOnClick}
        style={{
          width: 256, 
          boxShadow: '1px 1px 2px #ccc',
          height: '100vh',
          fontSize: '15px'
        }}
        mode="inline"
        items={items}
       />
       <div style={{ flex: 1, padding: '15px'}}>
          {renderPage(keySelected)}
       </div>
       </div>  
  </>
  )
}

export default AdminPage
