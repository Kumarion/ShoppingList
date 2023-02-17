import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { api } from "../utils/api";
import { HiCheckCircle, HiX } from "react-icons/hi";
import { useState } from "react";
import { ShoppingListItems, ShoppingLists } from "@prisma/client";
import ItemModal from "../components/itemModal";
import ListModal from "../components/listModal";

const ShoppingList: NextPage = () => {
  const { data: sessionData } = useSession();

  // Current list state (containing all the items in the list)
  const [currentShoppingListId, setCurrentShoppingListId] = useState<string>("");
  const [currentList, setCurrentList] = useState<ShoppingListItems[]>([]);

  // Shopping lists state and shopping lists items state
  const [shoppingLists, setShoppingLists] = useState<ShoppingLists[]>([]);
  
  // Handling modal state
  const [isItemModalOpen, setItemModalOpen] = useState<boolean>(false);
  const [isListModalOpen, setListModalOpen] = useState<boolean>(false);

  // Checked items state
  const [checkedItems, setCheckedItems] = useState<ShoppingListItems[]>([]);

  const { data: shoppingListsData, isLoading } = api.shoppingList.getUserShoppingLists.useQuery({ userId: sessionData?.user?.id ?? "" },
    {
      onSuccess(data) {
        setShoppingLists(data);        

        // If there is no current list, set the first list as the current list
        if (currentShoppingListId === "") {
+          setCurrentShoppingListId(data[0] && data[0].id || "");
        };
      },
    }
  );

  const { mutate: deleteShoppingItem } = api.shoppingList.deleteShoppingListItem.useMutation({
    onSuccess(data) {
      setCurrentList((currentList) => currentList.filter((item) => item.id !== data.id));
    }
  });

  const { mutate: deleteShoppingList } = api.shoppingList.deleteShoppingList.useMutation({
    onSuccess(data) {
      setShoppingLists((shoppingLists) => shoppingLists.filter((shoppingList) => shoppingList.id !== data.id));
    }
  });

  const { mutate: toggleShoppingItem } = api.shoppingList.toggleShoppingListItem.useMutation({
    onSuccess(shoppingItem) {
      // check if this item is already checked
      if (checkedItems.some((item) => item.id === shoppingItem.id)) {
        // remove it from the checked items
        setCheckedItems((prev) => prev.filter((item) => item.id !== shoppingItem.id))
      } else {
        // add it to the checked items
        setCheckedItems((prev) => [...prev, shoppingItem])
      };
    }
  });

  const {} = api.shoppingList.getShoppingListItems.useQuery({ shoppingListId: currentShoppingListId },
    {
      onSuccess(data) {
        setCurrentList(data);
        const checked = data.filter((item) => item.checked);
        setCheckedItems(checked);
      },
    }
  );

  function handleShoppingListClick(shoppingListId: string) {
    setCurrentShoppingListId(shoppingListId);
  };

  function getShoppingListNameFromId() {
    const shoppingList = shoppingLists.find((shoppingList) => shoppingList.id === currentShoppingListId);
    const shoppingListName = shoppingList?.name
    return shoppingListName || "No list selected";
  };

  function checkedChanged() {

  };
  
  return (
    <>
      <Head>
        <title>Shopping List</title>
        <meta name="description" content="Shopping list project" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {isItemModalOpen && <ItemModal setModalOpen={setItemModalOpen} setItems={setCurrentList} currentShoppingListId={currentShoppingListId} />}
      {isListModalOpen && <ListModal setModalOpen={setListModalOpen} setShoppingLists={setShoppingLists} setCurrentShoppingListId={setCurrentShoppingListId} userId={sessionData?.user?.id ?? ""} />}

      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">

          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            <span className="text-[hsl(280,100%,70%)]">Shopping</span> list
          </h1>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">

            <div className="h-80 flex max-w-xl flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
              <h3 className="text-2xl font-bold">Shopping lists:</h3>
              <div className="text-lg">
                <div className = "h-auto">
                  <ul className = "overflow-y-scroll h-56">
                    {shoppingLists.length == 0 && <p className="text-white">No shopping lists</p>}
                    {shoppingListsData == null && <p className="text-white">No shopping lists</p>}
                    {shoppingLists.map((shoppingList) => {
                      const { id, name, createdAt } = shoppingList;

                      return (
                        <div title={"Created: " + createdAt.toDateString()} key={id}>
                          <button onClick={() => handleShoppingListClick(id)} className = "align-middle hover:underline">{name}</button>
                          <button className = "p-2 align-middle">
                            <HiX onClick={() => deleteShoppingList({id})} className = "text-lg text-red-500" />
                          </button>
                        </div>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex max-w-xl flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
              <h3 className="text-2xl font-bold">{getShoppingListNameFromId()}:</h3>
              <div className="text-lg">
                <ul className = "">
                  {currentList.length == 0 && <p className="text-white">No items</p>}
                  {currentList == null && <p className="text-white">No items</p>}
                  {currentList.map((item) => {
                    const { id, name, quantity, checked } = item;

                    return (
                      <div key={id}>
                        <input 
                          type="checkbox"
                          checked={checkedItems.some((item) => item.id === id)}
                          onChange={() => checkedChanged()}
                          onClick={() => toggleShoppingItem({id, checked: checkedItems.some((item) => item.id === id) ? false : true, })} 
                          className="form-checkbox h-5 w-9 align-middle text-[hsl(280,100%,70%)]" 
                        />
                        <a className={checkedItems.some((item) => item.id === id) ? "align-middle line-through" : "align-middle"}>{name} - {quantity}x</a>
                        <button className = "p-2 align-middle">
                          <HiX onClick={() => deleteShoppingItem({id})} className = "text-lg text-red-500" />
                        </button>
                      </div>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <div className="flex max-w-xl flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
              <button 
                onClick={() => setListModalOpen(true)} 
                className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
              >
                Add shopping list
              </button>
            </div>

            <div className="flex max-w-xl flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
              <button 
                onClick={() => setItemModalOpen(true)} 
                className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
              >
                Add item
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white">
              <Link href="/">
                <button className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20">
                  Home
                </button>
              </Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default ShoppingList;