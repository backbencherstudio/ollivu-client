export default function MessageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-[calc(100vh-80px)] md:h-[calc(100vh-100px)] overflow-hidden ">
      {children}
    </div>
  );
}