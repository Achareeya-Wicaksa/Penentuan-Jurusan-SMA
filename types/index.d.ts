export type loggedInUserDataType = {
  id: string;
  role: string;
  email: string;
  fullname: string;
  authToken: string;
};

export type getServerSidePropsType = {
  req: NextApiRequest;
  res: NextApiResponse;
};
