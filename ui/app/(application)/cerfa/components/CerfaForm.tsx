"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import { Box, Grid, Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { usePlausible } from "next-plausible";
import { FC, useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import { omitDeep } from "shared/helpers/cerfa/utils/omitDeep";
import { apiPostRaw } from "utils/api.utils";
import { EVENTS, getTrackingPropsFromParams } from "utils/tracking";

import { activeStepState } from "../atoms/activeStep.atom";
import { downloadOptionsState } from "../atoms/downloadOptions.atom";
import { informationMessagesState } from "../atoms/informationMessages.atom";
import { showOverlayState } from "../atoms/showOverlay.atom";
import { getFormStatus } from "../completion";
import { CERFA_STEPS, CerfaStep } from "../utils/cerfa.utils";
import { downloadFile } from "../utils/form.utils";
import InputController from "./blocks/inputs/InputController";
import CerfaAccordionItem from "./CerfaAccordionItem";
import InformationMessages from "./CerfaInformationMessages";
import DownloadModal, { modal } from "./DownloadModal";
import LoadingOverlay from "./LoadingOverlay";
import Stepper from "./stepper/Stepper";

const scrollToSection = () => {
  const employeurElement = document.getElementById(`${CERFA_STEPS.EMPLOYEUR.id}-collapse`)?.parentNode;
  // @ts-expect-error TODO
  const top = employeurElement?.offsetTop;

  setTimeout(() => {
    window.scrollTo({ top: top, behavior: "smooth" });
  }, 200);
};

const CerfaForm: FC = () => {
  const plausible = usePlausible();
  const searchParams = useSearchParams();

  const [activeStep, setActiveStep] = useRecoilState(activeStepState);
  const [showOverlay] = useRecoilState(showOverlayState);
  const [_, setInformationMessage] = useRecoilState(informationMessagesState);
  const [downloadOptions] = useRecoilState(downloadOptionsState);
  const handleExpandChange = (step: CerfaStep) => {
    setActiveStep(step);
  };

  useEffect(() => {
    scrollToSection();
  }, [activeStep]);

  useEffect(() => {
    setInformationMessage(activeStep?.messages);
  }, [activeStep, setInformationMessage]);

  const methods = useForm({
    mode: "all",
    defaultValues: {
      employeur: {
        siret: "",
        privePublic: "prive",
        adresse: {
          departement: "",
        },
      },
      contrat: {
        dateSignature: "",
        dateDebutContrat: "",
        dateDebutFormationPratique: "",
        dateFinContrat: "",
        dureeTravailHebdoMinutes: "00",
      },
      apprenti: {
        nom: "",
        prenom: "",
        dateNaissance: "",
      },
    },
  });

  const values = methods.watch();
  const errors = methods.formState.errors;

  const onSubmit: SubmitHandler<any> = (values) => {
    console.log("submitted", { values, errors });
  };

  const download = async () => {
    const formStatus = getFormStatus({ values, errors });

    plausible(EVENTS.DOWNLOAD_CERFA, {
      props: {
        includeErrors: downloadOptions.includeErrors,
        includeGuide: downloadOptions.includeGuide,
        tauxCompletion: formStatus.completion,
        ...getTrackingPropsFromParams(searchParams),
      },
    });
    // remove ref from errors
    const err = omitDeep(errors, "ref");
    const data = await apiPostRaw("/cerfa", {
      body: {
        values,
        errors: err,
        output: {
          include_errors: downloadOptions.includeErrors,
          include_guide: downloadOptions.includeGuide,
        },
      },
    });

    let filename = "cerfa_10103*12.pdf";

    if (data.headers.get("Content-Type") === "application/zip") {
      filename = "cerfa_10103*12.zip";
    }

    if (values.apprenti.nom && values.apprenti.prenom) {
      filename = `${values.apprenti.nom}-${values.apprenti.prenom}-${filename}`;
    }

    const content = await data.blob();

    downloadFile(content, filename);
  };

  return (
    <FormProvider {...methods}>
      <DownloadModal onDownload={download} />
      <Grid container spacing={2}>
        <Grid
          item
          xs={3}
          sx={{
            borderRight: `1px solid ${fr.colors.decisions.border.default.grey.default}`,
          }}
        >
          <Box mb={2} p={2} pt={0} position="sticky" top={24}>
            <Stepper />

            <Box mt={12}>
              <Typography gutterBottom>Téléchargez le Cerfa à tout moment - même incomplet.</Typography>
              <Button priority="primary" type="button" onClick={() => modal.open()}>
                Télécharger
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  style={{ width: "16px", height: "16px", marginLeft: "8px" }}
                >
                  <path d="M3 19H21V21H3V19ZM13 13.1716L19.0711 7.1005L20.4853 8.51472L12 17L3.51472 8.51472L4.92893 7.1005L11 13.1716V2H13V13.1716Z" />
                </svg>
              </Button>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h1" mb={2}>
            Cerfa 10103*12 (FA13)
          </Typography>
          <Alert
            closable
            description={
              <Typography>
                Utilisez{" "}
                <a href="https://celia.emploi.gouv.fr/" target="_blank">
                  CELIA
                </a>
                , votre plateforme de saisie en ligne des contrats d'apprentissage pour les employeurs publics.
              </Typography>
            }
            onClose={function noRefCheck() {}}
            severity="warning"
            title="Un apprenti en contrat chez un employeur public ?"
          />
          <Box mx={1} mt={2}>
            <InputController name="contrat.modeContractuel" />
          </Box>
          <div className={fr.cx("fr-accordions-group")}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              {Object.entries(CERFA_STEPS).map(([key, cerfaStep]) => {
                const Component = cerfaStep.component;
                return (
                  <CerfaAccordionItem
                    key={key}
                    id={cerfaStep.id}
                    label={cerfaStep.label}
                    completion={0} // TODO : compute completion
                    expanded={cerfaStep.id === activeStep?.id}
                    onExpandedChange={() => handleExpandChange(cerfaStep)}
                  >
                    <Box pl={2}>
                      <Component />
                    </Box>
                  </CerfaAccordionItem>
                );
              })}
            </form>
          </div>
          <Box mt={2} mb={6}>
            <Typography color={fr.colors.decisions.text.mention.grey.default}>
              L’encart “Cadre réservé à l’organisme en charge du dépôt du contrat” est à la charge de l’administration
              qui traitera votre document.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={3}>
          <InformationMessages />
        </Grid>
      </Grid>
      {showOverlay && <LoadingOverlay />}
    </FormProvider>
  );
};

export default CerfaForm;
