import { ShoppingListItems, ShoppingLists } from '@prisma/client'
import { Dispatch, FC, SetStateAction, useState } from 'react'
import { api } from '../utils/api';

interface ItemModalProps {
  setModalOpen: Dispatch<SetStateAction<boolean>>
  setShoppingLists: Dispatch<SetStateAction<ShoppingLists[]>>
  setCurrentShoppingListId: Dispatch<SetStateAction<string>>
  userId: string
}

const ListModal: FC<ItemModalProps> = ({ setModalOpen, setShoppingLists, setCurrentShoppingListId, userId }) => {
    const [nameInput, setNameInput] = useState("");

    const { mutate: createList } = api.shoppingList.createShoppingList.useMutation(
      {
        onSuccess: (data) => {
          setShoppingLists((prev) => prev.concat(data));
          setCurrentShoppingListId(data.id);
        }
      }
    );

    return (
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-sm">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
              <h3 className="text-3xl font-semibold">
                New shopping list
              </h3>
            </div>
            {/*body*/}
            <div className="relative p-6 flex-auto">
              <p className="my-4 text-slate-500 text-lg leading-relaxed">
                Give your shopping list a name and start adding items.
              </p>

              <div className="mb-3 pt-0">
                <input type="text" value={nameInput} onChange={(e) => setNameInput(e.target.value)} placeholder="Shopping list name" className="px-2 py-3 placeholder-slate-500 text-slate-600 relative bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"/>
              </div>
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
              <button
                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-purple-500 text-white active:bg-purple-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => {
                  createList({ name: nameInput, userId: userId })
                  setModalOpen(false)
                }}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
    )
};

export default ListModal;