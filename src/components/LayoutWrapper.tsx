import Footer from "./Footer";
import NavHeader from "./NavHeader";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavHeader />
      {children}
      <Footer />
    </>
  );
}
