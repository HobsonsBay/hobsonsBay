/* global fetch */
import {useState, useEffect} from 'react';
import Config from 'react-native-config'
export interface ItemData {
  additional_info: string;
  alternative_disposal: string;
  bin_type: string;
  description: string;
  disposal_guidance: string;
  last_updated_days: number;
  name: string;
  number: number;
  status: string;
  url: string;
}

const getItem = async (number: string): Promise<ItemData> => {
  const ITEM_URL = `${Config.API_URL}/items?number=${number}`;
  const res = await fetch(ITEM_URL);
  const {rows} = await res.json();
  return rows[0];
};

const useItem = (
  number: string,
): [ItemData, React.Dispatch<React.SetStateAction<ItemData>>] => {
  const [data, setData] = useState<ItemData>({} as ItemData);

  useEffect(() => {
    if (number) {
      getItem(number)
        .then((row) => {
          console.log(row);
          setData({...row});
        })
        .catch((e) => console.error('Error getting item', e));
    }
  }, [number]);

  return [data, setData];
};

export default useItem;
