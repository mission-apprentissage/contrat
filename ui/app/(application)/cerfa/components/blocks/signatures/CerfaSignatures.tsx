import { Box, Typography } from "@mui/material";
import { FC } from "react";

import InputController from "../inputs/InputController";

const CerfaSignatures: FC = () => {
  return (
    <Box>
      <Box mb={2}>
        <Typography gutterBottom>
          Si vous représentez un CFA, vous devez ajouter votre visa ou tampon sur le document final (après
          téléchargement).
        </Typography>
        <Typography gutterBottom>
          Si vous représentez une entreprise, veuillez vérifier le point suivant (et le cocher si valide) :
        </Typography>
      </Box>
      <InputController name="signatures.attestationPiecesJustificatives" />
      <InputController name="signatures.lieu" />
    </Box>
  );
};

export default CerfaSignatures;
