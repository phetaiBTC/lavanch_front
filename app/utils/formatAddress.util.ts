import type { IVillageEntity } from "~/types/entities/address.entity";
export const formatAddress = (address: IVillageEntity) => {
  return `${address.name}, ${address.district.name}, ${address.district.province.name}`;
};
