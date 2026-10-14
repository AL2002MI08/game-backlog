export default function Spinner() {
  return (
    <div className="fixed inset-0 z-100 min-h-screen w-full flex items-center justify-center bg-slate-950/80 backdrop-blur-md">
      <div className="spinner flex items-center justify-center">
        <div className="spinner1" />
      </div>
    </div>
  );
}
