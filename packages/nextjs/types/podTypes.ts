export type CreatorInfo = {
  cap: string;
  last: string;
};

export type CreatorData = {
  [address: string]: CreatorInfo;
};

export type ContractProps = {
  home?: boolean;
  isAdmin?: boolean;
  isCreator?: boolean;
};
  