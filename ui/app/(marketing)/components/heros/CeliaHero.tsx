import Button from "@codegouvfr/react-dsfr/Button";
import { Typography } from "@mui/material";
import Image from "next/image";

import { StyledButtonContainer, StyledHero, StyledImageContainer, StyledTextContainer } from "./CeliaHero.styled";

const CeliaHero = () => {
  const handleClick = () => {
    window.open("https://celia.emploi.gouv.fr/", "_blank", "noopener,noreferrer");
  };

  return (
    <StyledHero>
      <StyledTextContainer>
        <Typography variant="h6" fontWeight="bold" color="text.primary">
          Vous formez un apprenti en contrat chez un employeur public ?
        </Typography>
        <Typography mt={2}>
          Utilisez{" "}
          <a href="https://celia.emploi.gouv.fr/" target="_blank" rel="noopener noreferrer">
            CELIA
          </a>
          , votre plateforme de saisie en ligne des contrats d'apprentissage pour les employeurs publics.
        </Typography>
        <StyledButtonContainer>
          <Button priority="primary" iconId="ri-file-edit-fill" iconPosition="left" onClick={handleClick}>
            Saisir un contrat sur CELIA
          </Button>
        </StyledButtonContainer>
      </StyledTextContainer>
      <StyledImageContainer>
        <Image src="/images/celia.png" width={256} height={78} alt="Graphique tableau de bord" />
      </StyledImageContainer>
    </StyledHero>
  );
};

export default CeliaHero;
