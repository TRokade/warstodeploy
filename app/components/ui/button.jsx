export function Button({ children, ...props }) {
  return (
    <button className="px-4 flex items-center py-2 bg-black text-white rounded" {...props}>
      {children}
    </button>
  );
}
