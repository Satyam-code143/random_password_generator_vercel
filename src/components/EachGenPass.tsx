import { motion } from "framer-motion";
import { useContext, useState } from "react";
import {
  EyeIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/solid";
import { enqueueSnackbar } from "notistack";
import { PassGenerateContext } from "../App";

interface EachGenPassProps {
  items: PassResult[];
  saveState: boolean;
}

interface PassResult {
  id: string;
  password: string;
}

function EachGenPass({ items, saveState }: EachGenPassProps) {
  const [toggleView, setToggleView] = useState<string[]>([]);
  const valueContext = useContext(PassGenerateContext);

  const copyToClipboard = (copyItem: string) => {
    navigator.clipboard.writeText(copyItem);
    enqueueSnackbar("Copied to clipboard!", {
      autoHideDuration: 3000,
      anchorOrigin: { horizontal: "center", vertical: "top" },
    });
  };

  const saveToLocalStorage = (item: PassResult) => {
    var allList: PassResult[] = JSON.parse(
      localStorage.getItem("Previous_Pass") || "[]"
    );
    var filteredItem = allList.filter((value) => value.id === item.id);
    if (filteredItem.length !== 0) {
      enqueueSnackbar("Password already saved!", {
        autoHideDuration: 3000,
        anchorOrigin: { horizontal: "center", vertical: "top" },
      });
    } else {
      allList.push(item);
      localStorage.setItem("Previous_Pass", JSON.stringify(allList));
      enqueueSnackbar("Password saved successfully!", {
        autoHideDuration: 3000,
        anchorOrigin: { horizontal: "center", vertical: "top" },
      });
      valueContext?.setStorageSaved(item);
    }
  };

  const setToggleMethod = (value: string) => {
    if (toggleView.includes(value)) {
      setToggleView(toggleView.filter((id) => id !== value));
    } else {
      setToggleView([...toggleView, value]);
    }
  };

  return (
    <div className="w-[80%] md:w-[40%] lg:w-[25%]">
      {items.map((item) => (
        <motion.div
          key={item.id}
          whileHover={{ scale: 1.05 }}
          className="flex flex-row justify-between items-center px-4 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-lg hover:bg-gray-50 focus:outline-none mt-4"
        >
          <input
            type={toggleView.includes(item.id) ? "text" : "password"}
            value={item.password}
            readOnly
            className="w-fit hover:bg-gray-50 bg-inherit focus:outline-0"
          />
          <div className="flex flex-row items-center justify-end">
            <div className="group relative flex justify-center items-center">
              <div
                onClick={() => copyToClipboard(item.password)}
                className="rounded-full hover:bg-gray-100 flex cursor-pointer h-6 w-6 items-center justify-center"
              >
                <DocumentDuplicateIcon className="h-5 w-5 rounded-full" />
              </div>
              <span className="pointer-events-none absolute -bottom-8 left-0 w-max opacity-0 transition-opacity group-hover:opacity-100 bg-gray-800 text-white text-xs rounded-md shadow-md p-1">
                Copy
              </span>
            </div>
            {!saveState && (
              <div className="group relative flex justify-center items-center ml-2 ">
                <div
                  onClick={() => saveToLocalStorage(item)}
                  className="rounded-full hover:bg-gray-100 flex cursor-pointer h-6 w-6 items-center justify-center"
                >
                  <FolderIcon className="h-5 w-5 rounded-full" />
                </div>
                <span className="pointer-events-none absolute -bottom-8 left-0 w-max opacity-0 transition-opacity group-hover:opacity-100 bg-gray-800 text-white text-xs rounded-md shadow-md p-1">
                  Save
                </span>
              </div>
            )}
            <button
              type="button"
              onClick={() => setToggleMethod(item.id)}
              className="group relative ml-2 focus:outline-none bg-inherit inline-flex justify-center items-center "
            >
              {toggleView.includes(item.id) ? (
                <>
                  <EyeSlashIcon className="w-5 h-5 text-gray-600" />
                  <span className="pointer-events-none absolute -bottom-8 left-0 w-max opacity-0 transition-opacity group-hover:opacity-100 bg-gray-800 text-white text-xs rounded-md shadow-md p-1">
                    Hide
                  </span>
                </>
              ) : (
                <>
                  <EyeIcon className="w-5 h-5 text-gray-600" />
                  <span className="pointer-events-none absolute -bottom-8 left-0 w-max opacity-0 transition-opacity group-hover:opacity-100 bg-gray-800 text-white text-xs rounded-md shadow-md p-1">
                    Show
                  </span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default EachGenPass;
