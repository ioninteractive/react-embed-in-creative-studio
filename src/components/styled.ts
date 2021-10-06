import styled from 'styled-components';

export const CodeWrapper = styled.div`
  background-color: #444;
  color: white;
  height: 100vh;
`;

export const CheckBoxWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const TitleWrapper = styled.h1`
  text-align: left;
  color: white;
  font-size: 12px;
  font-weight: normal;
`;

export const ButtonsSectionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row-reverse;
`;

export const Button = styled.button`
  background-color: blue;
  color: white;
  padding: 6px 8px;
  border-radius: 6px;
  border: none;
  margin: 8px;
  cursor: pointer;
`;
