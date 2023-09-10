import { XMarkIcon } from "@heroicons/react/20/solid";
import InputDialogContent from "./InputDialogContent";

interface DialogProps {
  closeMethod: (value: boolean) => void;
  prevPasswords: boolean;
}

function FormDialog({ closeMethod, prevPasswords }: DialogProps) {
  return (
    <div className="backdrop flex items-center justify-center">
      <div className="bg-white md:w-[568px] rounded-xl">
        <div className="flex justify-between items-center p-4 pb-2">
          <h2 className="text-lg font-semibold">
            {prevPasswords
              ? "Your previous passwords"
              : "We need some input from you"}
          </h2>
          <div
            onClick={() => closeMethod(false)}
            className="rounded-full hover:bg-gray-100 flex cursor-pointer h-6 w-6 items-center justify-center"
          >
            <XMarkIcon className="h-5 w-5 rounded-full" />
          </div>
        </div>
        <hr />
        {prevPasswords ? null : (
          <InputDialogContent closeMethod={closeMethod} />
        )}
      </div>
    </div>
  );
}

export default FormDialog;
