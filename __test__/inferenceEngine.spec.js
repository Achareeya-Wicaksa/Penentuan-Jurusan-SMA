import CertaintyFactor from "../utils/certaintyFactor";

test("knowledge base ", async () => {
  const expectedPestDeseaseDataLength = 8;
  const expectedPestsDeseaseRelationRuleLength = {
    HP1: 5,
    HP2: 4,
    HP3: 6,
    HP4: 2,
    HP5: 6,
    HP6: 3,
    HP7: 4,
    HP8: 5,
  };
  const userInput = {};

  const instance = new CertaintyFactor(userInput);
  const { knowledgeBase } = await instance.generateKnowledgeBase();

  expect(knowledgeBase).not.toBeNull();
  expect(knowledgeBase).toBeInstanceOf(Array);
  expect(knowledgeBase).toHaveLength(expectedPestDeseaseDataLength);
  knowledgeBase.forEach((item, index) => {
    expect(item).toHaveProperty("PestsAndDeseasesHasSymptoms");
    expect(item.PestsAndDeseasesHasSymptoms).toHaveLength(
      expectedPestsDeseaseRelationRuleLength[`HP${++index}`]
    );
  });
});

test("", async () => {
  const expectation = {
    name: "",
    finalCF: 0.976,
  };
  const userInput = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0,
    11: 0,
    12: 0,
    13: 0,
    14: 0,
    15: 0,
    16: 0,
    17: 0,
    18: 0,
    19: 0,
    20: 0,
    21: 0,
    22: 0,
    23: 0,
    24: 0,
    25: 0.4,
    26: 0,
    27: 0.8,
    28: 0.8,
  };

  const instance = new CertaintyFactor(userInput);
  const { conclusion } = await instance.generateConclusion();

  expect(conclusion).not.toBeNull();
  expect(conclusion.name).toBe(expectation.name);
  expect(conclusion.finalCF.toFixed(4)).toBe(expectation.finalCF.toFixed(4));
});
