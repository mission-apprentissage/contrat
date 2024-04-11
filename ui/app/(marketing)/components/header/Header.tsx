"use client";

import { Badge } from "@codegouvfr/react-dsfr/Badge";
import Button from "@codegouvfr/react-dsfr/Button";
import { Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { usePlausible } from "next-plausible";
import { FC } from "react";
import { EVENTS } from "utils/tracking";

import { PAGES } from "../../../(application)/components/breadcrumb/Breadcrumb";
import { StyledHeader, StyledHeaderTitleContainer } from "./Header.styled";

const Header: FC = () => {
  const plausible = usePlausible();
  const { push } = useRouter();

  const onCerfaNavigate = () => {
    plausible(EVENTS.COMMENCER_CERFA, {
      props: {
        position_bouton: "header",
      },
    });
    push(PAGES.cerfa().path);
  };

  return (
    <StyledHeader>
      <Badge severity="new" noIcon>
        Vous êtes un employeur privé ?
      </Badge>
      <StyledHeaderTitleContainer>
        <Typography variant="h1">
          Optimisez la création de vos contrats d’apprentissage :<br /> simple, rapide et sans erreur !
        </Typography>
      </StyledHeaderTitleContainer>
      <Button iconId="fr-icon-arrow-right-line" iconPosition="right" onClick={onCerfaNavigate}>
        Commencer
      </Button>
    </StyledHeader>
  );
};

export default Header;
