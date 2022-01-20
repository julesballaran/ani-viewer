import { atom } from "recoil"

export const resultState = atom({
  key: "results",
  default: [],
})

export const favoriteState = atom({
  key: "favorites",
  default: [],
})
