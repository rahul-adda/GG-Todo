import { CircularProgress } from "@mui/material";
import Typo from "./Typo";
import Grid from "@mui/material/Unstable_Grid2";
import { Box } from "@mui/system";

function View({ isLoading, data, structure = [], dataSize = 4 }) {
  if (isLoading) {
    return (
      <Grid
        sx={{
          height: "50dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={40} />
      </Grid>
    );
  }
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container columnSpacing={2} rowSpacing={2}>
        {data && structure?.length
          ? structure.map((v, i) => {
              return (
                <Grid
                  container
                  xs={12}
                  sm={dataSize ? dataSize * 2 : 6}
                  md={dataSize}
                  key={v.key}
                  {...v?.prop}
                >
                  <Grid xs={12}>
                    <Box
                      sx={{
                        p: 1,
                        bgcolor: "grey.50",
                        borderRadius: "6px",
                        borderLeft: "3px solid",
                        borderColor: "primary.main",
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "column",
                        outline: "1px solid #e2e8f0",
                        ...v?.titleSx,
                      }}
                    >
                      <Box
                        sx={{
                          width: "100%",
                          mb: 0.5,
                        }}
                        {...v?.propTitle}
                      >
                        {v?.customHeading ? (
                          v?.customHeading(data?.[v.key], data)
                        ) : (
                          <Typo
                            sx={{
                              fontWeight: "650",
                              maxWidth: "100%",
                              fontSize: "14px",
                            }}
                            {...v?.typoTitle}
                          >
                            {v?.customTitle
                              ? v?.customTitle(data?.[v.key], data)
                              : v.title || "-"}
                          </Typo>
                        )}
                      </Box>
                      <Box
                        sx={{
                          width: "100%",
                          bgcolor: "grey.100",
                          p: 0.8,
                          borderRadius: 1,
                        }}
                        {...v?.propKey}
                      >
                        {v?.custom ? (
                          v?.custom(data?.[v.key], data)
                        ) : (
                          <Typo
                            enableCopying={true}
                            sx={{
                              fontWeight: 400,
                              fontSize: "14px",
                              maxWidth: "100%",
                            }}
                            {...v?.typoKey}
                          >
                            {v?.customData
                              ? v?.customData(data?.[v.key], data)
                              : data?.[v.key]}
                          </Typo>
                        )}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              );
            })
          : ""}
      </Grid>
    </Box>
  );
}

export default View;
