import { serverSideAESEncrypt } from "@/utils/cryptoAES";
import {
  adminDemoAccount,
  pestsAndDeseasesHasSymptomsRawData,
  pestsAndDeseasesRawData,
  symptomsRawData,
  userDemoAccount,
} from "./data";
import prisma from ".";

const createManyPestsAndDeseases = async () => {
  await prisma.jurusan.createMany({
    data: pestsAndDeseasesRawData,
  });

  console.log("Pests and Deseases created!");
};

const createManySymptoms = async () => {
  await prisma.ketentuan.createMany({
    data: symptomsRawData,
  });

  console.log("Symptoms created!");
};

const createManyPestsAndDeseasesHasSymptoms = async () => {
  await prisma.rules.createMany({
    data: pestsAndDeseasesHasSymptomsRawData,
  });

  console.log("Pests and Deseases has Symptoms created!");
};

const createUser = async () => {
  await prisma.user.createMany({
    data: [
      {
        ...userDemoAccount,
        password: serverSideAESEncrypt(userDemoAccount.password),
      },
      {
        ...adminDemoAccount,
        password: serverSideAESEncrypt(adminDemoAccount.password),
      },
    ],
  });

  console.log("User created!");
};

const deleteUser = async () => {
  await prisma.user.delete({
    where: {
      email: userDemoAccount.email,
    },
  });
  await prisma.user.delete({
    where: {
      email: adminDemoAccount.email,
    },
  });

  console.log("User deleted!");
};

const initialSeeds = async () => {
  createManyPestsAndDeseases();
  createManySymptoms();
  createManyPestsAndDeseasesHasSymptoms();
  createUser();
};

const updatePestOrDesease = async () => {
  const code = Number(process.argv[3]);
  await prisma.jurusan.update({
    where: {
      code,
    },
    data: {
      ...pestsAndDeseasesRawData.find((_) => _.code == code),
    },
  });
};

const updateSymtomps = async () => {
  const code = Number(process.argv[3]) || null;

  if (!code) {
    symptomsRawData.forEach(async (_) => {
      await prisma.ketentuan.update({
        where: {
          code: _.code,
        },
        data: {
          ..._,
        },
      });
    });
    return;
  }

  await prisma.ketentuan.update({
    where: {
      code,
    },
    data: {
      ...symptomsRawData.find((_) => _.code == code),
    },
  });
};

async function main() {
  /* example argv usage: `yarn db:seed --init` and so on */
  process.argv.find((_) => _ == "--init") && initialSeeds();
  process.argv.find((_) => _ == "--cmpad") && createManyPestsAndDeseases();
  process.argv.find((_) => _ == "--cms") && createManySymptoms();
  process.argv.find((_) => _ == "--cmpadhs") &&
    createManyPestsAndDeseasesHasSymptoms();
  process.argv.find((_) => _ == "--cu") && createUser();
  process.argv.find((_) => _ == "--du") && deleteUser();
  // usage: yarn db:seed --upad 1 (1 is the code of the pest or desease)
  process.argv.find((_) => _ == "--upad") && updatePestOrDesease();
  // usage: yarn db:seed --us 1 (1 is the code of the pest or desease)
  process.argv.find((_) => _ == "--us") && updateSymtomps();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
