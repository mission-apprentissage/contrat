import styled from "@emotion/styled";

export const StyledHero = styled.section`
  display: flex;
  background-color: #f5f5fe;
  padding: 3.5rem 2.5rem;
  margin-top: 5rem;
  margin-bottom: 5rem;
  align-items: center;
  gap: 2rem;
  flex-direction: column-reverse;

  @media (min-width: 900px) {
    flex-direction: row;
  }
`;

export const StyledTextContainer = styled.div`
  flex: 6;
`;

export const StyledButtonContainer = styled.div`
  margin-top: 1rem;
`;

export const StyledImageContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`;
