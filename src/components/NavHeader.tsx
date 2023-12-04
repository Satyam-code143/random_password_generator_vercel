import { enqueueSnackbar } from "notistack";

export default function NavHeader() {
  const signInAction = () => {
    // Get the logic for t he google signUp work here
    enqueueSnackbar("Coming Soon!!", {
      autoHideDuration: 3000,
      anchorOrigin: { horizontal: "center", vertical: "top" },
    });
  };

  return (
    <div className="flex justify-between items-center p-4 px-6 static w-full shadow-lg bg-white">
      {/* This is the Log Container */}
      <div className="relative">
        <h1 className="text-lg text-black font-bold">PassGen</h1>
      </div>

      {/* This is the menu bar for Mobile Navigation */}
      <div className="relative">
        <button
          className="p-1 text-sm rounded-lg px-4 font-semibold border border-black"
          onClick={() => signInAction()}
        >
          SignIn
        </button>
      </div>
    </div>
  );
}
