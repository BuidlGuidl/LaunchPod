type Props = {
  address: string;
  creators: string[];
}


export function useCreator(props: Props) {

  const isCreator = props.creators ? props.creators.includes(props.address) : false;


  return {
    isCreator
  };
}
