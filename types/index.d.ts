export type loggedInUserDataType = {
  id: string;
  nim: string;
  role: string;
  email: string;
  nama: string;
  fullname: string;
  authToken: string;
};

export type getServerSidePropsType = {
  req: NextApiRequest;
  res: NextApiResponse;
};
