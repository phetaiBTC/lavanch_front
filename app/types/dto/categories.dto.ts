import { date, z } from "zod";
import { CategoryEntity } from "../entities/category.entity";

export const CreateCategoriesDto = CategoryEntity.pick({
  name: true,
  description: true,
  parent: true,
  children: true,
});
export type CreateCategoriesDto = z.infer<typeof CreateCategoriesDto>;

export const UpdateCategoriesDto = CategoryEntity.pick({
  id: true,
  name: true,
  description: true,
  parent: true,
  children: true,
}).partial();
export type UpdateCategoriesDto = z.infer<typeof UpdateCategoriesDto>;
