// components/products/fields.tsx
/* ----------  generic field  ---------- */
import React from "react";

interface InputProps {
  register: any;
  name: string;
  label: string;
  error?: string;
  type?: string;
}
export const Input: React.FC<InputProps> = ({
  register,
  name,
  label,
  error,
  type = "text",
}) => {
  return (
    <label className="block mb-2">
      <span className="text-sm font-medium">{label}</span>
      <input
        {...register(name)}
        type={type}
        className="mt-1 block w-full rounded border px-2 py-1"
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </label>
  );
};

/* ----------  array helpers  ---------- */
export const FieldArrayButtons = ({
  append,
  remove,
  index,
  length,
}: {
  append: () => void;
  remove: (i: number) => void;
  index: number;
  length: number;
}) => (
  <div className="flex gap-2 mt-2">
    {length - 1 === index && (
      <button
        type="button"
        onClick={append}
        className="text-sm px-3 py-1 rounded bg-blue-600 text-white"
      >
        + Add
      </button>
    )}
    {length > 1 && (
      <button
        type="button"
        onClick={() => remove(index)}
        className="text-sm px-3 py-1 rounded bg-red-600 text-white"
      >
        Remove
      </button>
    )}
  </div>
);
