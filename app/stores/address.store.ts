import { defineStore } from "pinia";
import type { IOptionEntity } from "~/shared/entities/option.entity";
import type {
  IProvinceEntity,
  IDistrictEntity,
  IVillageEntity,
} from "~/types/entities/address.entity";

export const useAddressStore = defineStore("address", () => {
  const loading = ref(false);
  const provinceList = ref<IProvinceEntity[]>([]);
  const districtList = ref<IDistrictEntity[]>([]);
  const villageList = ref<IVillageEntity[]>([]);
  const provinceOptions = ref<IOptionEntity[]>([]);
  const districtOptions = ref<IOptionEntity[]>([]);
  const villageOptions = ref<IOptionEntity[]>([]);
  const setProvinceOptions = (value: IOptionEntity[]) => {
    provinceOptions.value = value;
  };
  const setDistrictOptions = (value: IOptionEntity[]) => {
    districtOptions.value = value;
  };
  const setVillageOptions = (value: IOptionEntity[]) => {
    villageOptions.value = value;
  };
  const setProvinceList = (value: IProvinceEntity[]) => {
    provinceList.value = value;
  };
  const setDistrictList = (value: IDistrictEntity[]) => {
    districtList.value = value;
  };
  const setVillageList = (value: IVillageEntity[]) => {
    villageList.value = value;
  };
  const setLoading = (value: boolean) => {
    loading.value = value;
  };
  return {
    loading,
    provinceList,
    districtList,
    villageList,
    provinceOptions,
    districtOptions,
    villageOptions,
    setProvinceOptions,
    setDistrictOptions,
    setVillageOptions,
    setProvinceList,
    setDistrictList,
    setVillageList,
    setLoading,
  };
});
