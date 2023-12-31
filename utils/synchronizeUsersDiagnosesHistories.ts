export const synchronizeUsersDiagnosesHistories = () => {
  fetch(`${process.env.APP_URL}/api/regenerateUsersDiagnosesHistories`, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((res) => {
      console.log("Synchronize Users Diagnoses Histories Success");
    })
    .catch((err) => {
      console.error("Synchronize Users Diagnoses Histories Failed", err);
    });
};
