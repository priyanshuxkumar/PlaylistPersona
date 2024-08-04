import { AlertTriangle, X } from "lucide-react";
import React from "react";

const ErrorAlert = ({ error }: { error: string }) => {
  return (
    <div className="rounded-md border-red-500 bg-red-100 p-4">
      <div className="flex items-center justify-between space-x-4">
        <div>
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-red-600">{error}</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorAlert;
