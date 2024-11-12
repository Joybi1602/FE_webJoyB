import styled from "styled-components";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";

export const WrapperTypeProduct = styled.div`
      display: flex;
      align-item: center;
      gap: 24px;
      font-size: 18px;
      justify-content: flex-start;
      padding: 20px 0px;
      
`

export const WrapperButtonMore = styled(ButtonComponent)`
  &:hover {
    color: #fff;
    background: rgb(13, 92, 182);

    span {
      color: #fff;
    }
  }
  width: 100%;
  text-align: center;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
`;


export const WrapperProducts = styled.div`
     display: flex;
     flex-wrap: wrap;
     margin-top: 20px;
     gap: 14px;
     
`