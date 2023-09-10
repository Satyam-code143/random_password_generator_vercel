import { motion } from "framer-motion";
import { useContext, useEffect, useRef, useState } from "react";
import {
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/20/solid";
import { PassGenerateContext } from "../App";

interface PassGenMethod {
  length: number;
  useUppercase: boolean;
  useLowercase: boolean;
  useNumbers: boolean;
  useSpecialChars: boolean;
}

interface InputDialogContentProps {
  closeMethod: (value: boolean) => void;
}

interface Option {
  id: number;
  label: string;
  symbol: string;
}

const generateRandomPassword = ({
  length,
  useUppercase,
  useLowercase,
  useNumbers,
  useSpecialChars,
}: PassGenMethod): string => {
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const numberChars = "0123456789";
  const specialChars = "!@#$%^&*()-_=+[]{}|;:'\",.<>/?";

  let availableChars = "";
  if (useUppercase) availableChars += uppercaseChars;
  if (useLowercase) availableChars += lowercaseChars;
  if (useNumbers) availableChars += numberChars;
  if (useSpecialChars) availableChars += specialChars;

  if (!availableChars) {
    throw new Error("At least one character type must be selected.");
  }

  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * availableChars.length);
    password += availableChars.charAt(randomIndex);
  }

  return password;
};

function InputDialogContent({ closeMethod }: InputDialogContentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [number, setNumber] = useState<number | string>("");
  const [error, setError] = useState<string | null>(null);
  const [errorSelected, setErrorSelected] = useState<string | null>(null);

  const valueContext = useContext(PassGenerateContext);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dialogDiv = document.getElementById("buttonControl");

      if (dialogDiv && !dialogDiv.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Parse the input as a number or keep it as a string if it's not a valid number
    const parsedValue = isNaN(Number(value)) ? Number(value) : Number(value);

    if (parsedValue < 8 || parsedValue > 25) {
      setError("Number must be between 8 and 25");
    } else {
      setError(null);
    }

    setNumber(parsedValue);
  };
  const options: Option[] = [
    { id: 1, label: "Uppercase Alphabets", symbol: "[A-Z]" },
    { id: 2, label: "Lowercase Alphabets", symbol: "[a-z]" },
    { id: 3, label: "Numbers", symbol: "[0-9]" },
    { id: 4, label: "Special Characters", symbol: "[!@$..]" },
  ];

  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (buttonRef.current && panelRef.current) {
      const buttonWidth = buttonRef.current.offsetWidth;
      panelRef.current.style.width = `${buttonWidth}px`;
    }
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionChange = (optionId: number) => {
    setErrorSelected("");
    if (selectedOptions.includes(optionId)) {
      setSelectedOptions(selectedOptions.filter((id) => id !== optionId));
    } else {
      setSelectedOptions([...selectedOptions, optionId]);
    }
  };

  const validateAndGenerate = () => {
    if (number === "") {
      setError("Please provide the length!");
      return false;
    }
    if (selectedOptions.length < 3) {
      setErrorSelected("Please Select minimum 3 choices!");
      return false;
    }
    closeMethod(false);
    valueContext?.setPassword(
      generateRandomPassword({
        length: Number(number),
        useUppercase: selectedOptions.includes(1),
        useLowercase: selectedOptions.includes(2),
        useNumbers: selectedOptions.includes(3),
        useSpecialChars: selectedOptions.includes(4),
      })
    );
  };

  return (
    <div className="p-6 flex flex-col">
      <label className="text-md font-weight-normal mb-2">
        Length of your password
      </label>
      <input
        type="number"
        id="length"
        value={number}
        onChange={handleChange}
        className={`px-4 py-2 text-sm font-medium w-full border rounded-lg shadow-sm focus:ring focus:ring-indigo-400 focus:outline-none  ${
          error ? "focus:ring-red-400 " : "focus:ring-indigo-400"
        }`}
        placeholder="Please enter a number between 8-25"
        min={8}
        max={24}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      <label className="text-md font-weight-normal mb-2 mt-2">
        Your password should include
      </label>

      <div id="buttonControl">
        <div>
          <button
            type="button"
            onClick={toggleDropdown}
            ref={buttonRef}
            className={`inline-flex justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring ${
              errorSelected ? "focus:ring-red-400 " : "focus:ring-indigo-400"
            }`}
          >
            {selectedOptions.length !== 0 ? (
              <>
                {options.map((value: Option) => {
                  if (selectedOptions.includes(value.id)) {
                    return (
                      <motion.div
                        key={value.id}
                        initial={false}
                        whileHover={{ scale: 1.05 }}
                        transition={{ delay: 0.05, ease: "linear" }}
                        className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white mr-1 shadow-sm flex flex-row flex-grow p-1 justify-between items-center rounded-full"
                      >
                        <div></div>
                        <p className="text-sm">{value.symbol}</p>
                        <div
                          onClick={() => handleOptionChange(value.id)}
                          className="rounded-full flex cursor-pointer h-6 w-6 items-center justify-center"
                        >
                          <XMarkIcon className="h-5 w-5 rounded-full" />
                        </div>
                      </motion.div>
                    );
                  }
                })}
              </>
            ) : (
              "Select Options"
            )}
            {isOpen ? (
              <ChevronUpIcon className="h-5 w-5 rounded-full self-center" />
            ) : (
              <ChevronDownIcon className="h-5 w-5 rounded-full self-center" />
            )}
          </button>
          {errorSelected && (
            <p className="text-red-500 text-xs mt-1">{errorSelected}</p>
          )}
        </div>
        {isOpen && (
          <div
            className="absolute z-10 bg-white border border-gray-300 rounded-lg shadow-lg"
            ref={panelRef}
          >
            <ul>
              {options.map((option) => (
                <li
                  key={option.id}
                  onClick={() => handleOptionChange(option.id)}
                  className="flex cursor-pointer items-center py-2 pl-2 pr-2 hover:bg-gray-100 border-b border-gray-200"
                >
                  <input
                    type="checkbox"
                    id={`option-${option.id}`}
                    checked={selectedOptions.includes(option.id)}
                    onChange={() => handleOptionChange(option.id)}
                    className="h-5 w-5 text-blue-600 cursor-pointer mr-2"
                  />
                  <h6 className="cursor-pointer flex items-center">
                    {option.label}
                  </h6>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="flex flex-col justify-center items-center mt-8">
        <button
          onClick={validateAndGenerate}
          className="p-2 px-6 text-white shadow-sm rounded-lg bg-indigo-500"
        >
          Generate
        </button>
      </div>
    </div>
  );
}

export default InputDialogContent;
