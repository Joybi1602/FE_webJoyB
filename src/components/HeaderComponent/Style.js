import { Row } from "antd";
import styled from "styled-components";

export const WrapperHeader = styled(Row)`
    background-color: rgb(26, 148, 255);
    align-item: center;
    gap: 16px;
    flex-wrap: nowrap;
    width: 1270px;
    padding: 15px 0;

`

export const WrapperTextHeader = styled.span`
    display: block;
    margin-top: 5px;
    font-size: 22px;
    color: #fff;
    font-weight: bold;
    text-align: left;
    font-style: italic;
    flex-wrap: nowrap;
`

export const WrapperHeaderAccount = styled.div`
    display: flex;
    color: #fff;
    align-item: center;
    gap: 10px;

`

export const WrapperTextHeaderSmall = styled.span`
    font-size: 12px;
    color: #fff;
    white-space: nowrap;
      
`

export const WrapperContentPopup = styled.p`
    cursor: pointer;
    &:hover {
        color: rgb(26, 148, 255);
    }

`


    
