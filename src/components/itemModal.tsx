import { ShoppingListItems } from '@prisma/client'
import { Dispatch, FC, SetStateAction, useState } from 'react'
import { api } from '../utils/api';
import { Button } from "@material-tailwind/react";

interface ItemModalProps {
  setModalOpen: Dispatch<SetStateAction<boolean>>
  setItems: Dispatch<SetStateAction<ShoppingListItems[]>>
  currentShoppingListId: string
}

const ItemModal: FC<ItemModalProps> = ({ setModalOpen, setItems, currentShoppingListId }) => {
    const [nameInput, setNameInput] = useState("");
    const [quantityInput, setQuantityInput] = useState(1);

    const { mutate: addItem } = api.shoppingList.addItemToShoppingList.useMutation(
      {
        onSuccess: (data) => {
          setItems((prev) => prev.concat(data))
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
                New shopping item
              </h3>
            </div>
            {/*body*/}
            <div className="relative p-6 flex-auto">
              <p className="my-4 text-slate-500 text-lg leading-relaxed">
                Give your shopping item a name and quantity and click add to add it to your shopping list.
              </p>

              <div className="mb-3 pt-0">
                <input type="text" value={nameInput} onChange={(e) => setNameInput(e.target.value)} placeholder="Item name" className="px-2 py-3 placeholder-slate-500 text-slate-600 relative bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"/>
              </div>

              <div className="mb-3 pt-0">
                <input type="number" value={quantityInput} onChange={(e) => setQuantityInput(parseInt(e.target.value))} placeholder="Item quantity" className="px-2 py-3 placeholder-slate-500 text-slate-600 relative bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"/>
              </div>
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
              <Button
                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-purple-500 text-white active:bg-purple-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => {
                  addItem({ shoppingListId: currentShoppingListId, name: nameInput, quantity: quantityInput })
                  setModalOpen(false)
                }}
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
};

export default ItemModal;