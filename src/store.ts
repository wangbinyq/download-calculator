import { DownloadItem, makeDownalodItem } from "./download-item";
import { Reducer } from "react";

export const initialState = [] as DownloadItem[]

type State = typeof initialState

type Action =
  | { type: 'new' }
  | { type: 'remove', idx: number }
  | { type: 'edit', idx: number, edit: boolean }
  | { type: 'update-edit', idx: number, key: string, value: any, }
  | { type: 'update', idx: number }
  | { type: 'clear' }

export const reducer: Reducer<State, Action> = (items: State, action: Action) => {
  switch(action.type) {
    case 'new':
      const newItem = makeDownalodItem();
      return [ newItem, ...items ]
    case 'remove': {
      return [
        ...items.slice(0, action.idx),
        ...items.slice(action.idx + 1)
      ]
    }
    case 'edit': {
      const editItem = {
        ...items[action.idx],
        edit: null,
      };

      return [
        ...items.slice(0, action.idx),
        {
          ...items[action.idx],
          edit: action.edit ? editItem : null
        },
        ...items.slice(action.idx + 1)
      ]
    }
    case 'update-edit':
      const item = {
        ...items[action.idx],
        edit: {
          ...items[action.idx].edit,
          [action.key]: action.value,
        } as DownloadItem
      }
      return [
        ...items.slice(0, action.idx),
        item,
        ...items.slice(action.idx + 1)
      ]
    case 'update': {
      const item = {
        ...items[action.idx].edit as DownloadItem,
        edit: null,
      }
      return [
        ...items.slice(0, action.idx),
        item,
        ...items.slice(action.idx + 1)
      ]
    }
    case 'clear':
      return []
  }    
}
