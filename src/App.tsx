import { createContext, useEffect, useState } from "react";
import FormDialog from "./components/FormDialog";
import "./App.css";
import EachGenPass from "./components/EachGenPass";
import { AnimatePresence } from "framer-motion";
import { v4 as uuid4 } from "uuid";
import Loading from "./components/Loading";
import { enqueueSnackbar } from "notistack";

interface ItemsList {
  id: string;
  password: string;
}

interface PassGenInterface {
  setStorageSaved: (value: any) => void;
  setPassword: (value: string) => void;
}

export const PassGenerateContext = createContext<PassGenInterface | null>(null);

function App() {
  const [openFormDialog, setOpenFormDialog] = useState<boolean>(false);
  const [passwords, setPasswords] = useState<ItemsList[]>([]);
  const [savedItems, setSavedItems] = useState<ItemsList[]>([]);
  const [newPassword, setNewPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [savedBoolean, setSavedBoolean] = useState<boolean>(false);
  const [storageSaved, setStorageSaved] = useState();
  //? Only to close the Dialog!
  const closeDialog = () => {
    setOpenFormDialog(false);
  };

  useEffect(() => {
    const ItemListAry = JSON.parse(
      localStorage.getItem("Previous_Pass") || "[]"
    );
    setSavedItems([...ItemListAry]);
  }, [newPassword, savedBoolean, storageSaved]);

  useEffect(() => {
    if (newPassword !== "" && newPassword !== undefined) {
      setLoading(true);
      const setTimer = setTimeout(() => {
        setPasswords([
          {
            id: uuid4(),
            password: newPassword,
          },
        ]);
        setLoading(false);
      }, 3500);

      return () => clearTimeout(setTimer);
    }
  }, [newPassword]);

  useEffect(() => {
    if (savedBoolean) {
      if (savedItems.length !== 0) {
        setPasswords([...savedItems]);
      }
    } else {
      if (savedItems.length !== 0) {
        setPasswords([savedItems[savedItems.length - 1]]);
      } else {
        if (newPassword !== "" && newPassword !== undefined) {
          setPasswords([
            {
              id: uuid4(),
              password: newPassword,
            },
          ]);
        }
      }
    }
  }, [savedBoolean]);

  const clearStorage = () => {
    localStorage.clear();
    setPasswords([]);
    setStorageSaved(undefined);
    enqueueSnackbar("Store has been cleared successfully!", {
      autoHideDuration: 3000,
      anchorOrigin: { horizontal: "center", vertical: "top" },
    });
  };

  const handelGenButton = () => {
    setSavedBoolean(false);
    setOpenFormDialog((prevState: boolean) => !prevState);
  };

  return (
    <AnimatePresence initial={false}>
      <PassGenerateContext.Provider
        value={{
          setStorageSaved: setStorageSaved,
          setPassword: setNewPassword,
        }}
      >
        <div className="flex flex-col w-full mt-6 items-center">
          <h1 className="text-xl text-center">
            Welcome to Random Password generator!
          </h1>
          <p className="text-center text-sm text-gray-600 text center">
            You can generate random passwords of you choice!
          </p>

          {loading ? (
            <>
              <Loading />
            </>
          ) : (
            <>
              <>
                {savedBoolean ? (
                  <h1 className="text-center text-md font-semibold text-black mt-4 ">
                    Saved Passwords
                  </h1>
                ) : (
                  <>
                    {passwords.length !== 0 && (
                      <h1 className="text-center text-md font-semibold text-black mt-4 ">
                        Hurray!! Your password is generated!
                      </h1>
                    )}
                  </>
                )}
                <EachGenPass items={passwords} saveState={savedBoolean} />
              </>

              <div className="flex flex-row items-center">
                {savedItems.length === 5 ? (
                  <button
                    onClick={() => clearStorage()}
                    className="mt-6 rounded-lg shadow-lg p-2 text-xs md:text-sm md:px-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white"
                  >
                    Clear Storage
                  </button>
                ) : (
                  <button
                    onClick={() => handelGenButton()}
                    className="mt-6 rounded-lg shadow-lg p-2 text-xs md:text-sm md:px-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white"
                  >
                    {passwords.length !== 0 || savedItems.length !== 0
                      ? "Generate more password"
                      : "Generate Password"}
                  </button>
                )}
                {savedItems.length !== 0 && (
                  <>
                    {savedBoolean ? (
                      <button
                        onClick={() => setSavedBoolean(false)}
                        className="mt-6 ml-4 rounded-lg shadow-lg p-2 text-xs md:text-sm md:px-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white"
                      >
                        Close
                      </button>
                    ) : (
                      <button
                        onClick={() => setSavedBoolean(true)}
                        className="mt-6 ml-4 rounded-lg shadow-lg p-2 text-xs md:text-sm md:px-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white"
                      >
                        Saved Passwords
                      </button>
                    )}
                  </>
                )}
              </div>
            </>
          )}

          {openFormDialog ? (
            <FormDialog closeMethod={closeDialog} prevPasswords={false} />
          ) : null}
        </div>
      </PassGenerateContext.Provider>
    </AnimatePresence>
  );
}

export default App;
