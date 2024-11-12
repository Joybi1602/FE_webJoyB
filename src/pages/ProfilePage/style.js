import { Upload } from "antd";
import styled from "styled-components";

export const WrapperHeaderUser = styled.h1`
     color: #000;
     font-size: 18px;
     margin: 10px 0;
`

export const WrapperContentProfile = styled.div`
     display: flex;
     flex-direction: column;
     border: 1px solid #ccc;
     width: 600px;
     margin: 0 auto;
     padding: 30px;
     border-radius: 10px;
     gap: 30px;
`
export const WapperLabel = styled.label`
    color: #000;
    font-size: 12px;
    line-height: 30px;
    font-weight: 600;
    width: 50px;
    text-align: left;

`
export const WrapperInput = styled.div`
    display: flex;
    align-item: center;
    gap: 20px;
`

export const WrapperUploadFile = styled(Upload)`
    & .ant-upload.ant-upload-select.ant-upload-select-picture-card {
        width: 60px;
        height: 60px;
        border-radius: 50%;
    }
    & .ant-upload-list-item ant-upload-list-item-error {
       display: none;
    } 
     & .ant-upload-list-item-container{
       display: none;
    }
`
