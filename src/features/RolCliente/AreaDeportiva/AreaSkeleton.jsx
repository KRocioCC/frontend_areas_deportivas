// src/features/RolCliente/Areadeportiva/AreaSkeleton.jsx
export default function AreaSkeleton() {
  return (
    <div className="flex-shrink-0 w-[340px] h-[440px] bg-gray-200 animate-pulse rounded-sm">
      <div className="w-full h-3/4 bg-gray-300"></div>
      <div className="p-5 space-y-3">
        <div className="h-6 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>
  );
}