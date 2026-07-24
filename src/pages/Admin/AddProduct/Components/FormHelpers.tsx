import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { ChevronDown, Check } from "lucide-react";

interface InputProps {
  register: any;
  name: string;
  label: string;
  error?: string;
  type?: string;
  placeholder?: string;
}

export const Input: React.FC<InputProps> = ({
  register,
  name,
  label,
  error,
  type = "text",
  placeholder,
}) => {
  return (
    <label className="block mb-2">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
      <input
        {...register(name)}
        type={type}
        placeholder={placeholder}
        className="mt-1 block w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
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
        className="text-sm px-3 py-1.5 font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
      >
        + Add
      </button>
    )}
    {length > 1 && (
      <button
        type="button"
        onClick={() => remove(index)}
        className="text-sm px-3 py-1.5 font-medium rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
      >
        Remove
      </button>
    )}
  </div>
);

/* ----------  custom popover select  ---------- */
interface PopoverSelectProps {
  name: string;
  control: any;
  options: any[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

export const PopoverSelect: React.FC<PopoverSelectProps> = ({
  name,
  control,
  options,
  placeholder = "Select an option",
  error,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange } }) => {
        const selectedOption = options.find((opt) => {
          const optVal = typeof opt === "string" ? opt : opt.value;
          return optVal === value;
        });

        const displayLabel = selectedOption
          ? (typeof selectedOption === "string" ? selectedOption : selectedOption.label)
          : placeholder;

        return (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                disabled={disabled}
                className={`flex items-center justify-between w-full px-3 py-2 border rounded-lg text-sm text-left transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:border-blue-500 cursor-pointer disabled:opacity-50 disabled:pointer-events-none h-10 ${
                  error ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : ""
                }`}
              >
                <span className="truncate">{displayLabel}</span>
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
              </button>
            </PopoverTrigger>
            <PopoverContent 
              align="start"
              className="w-[var(--radix-popover-trigger-width)] p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-none z-50"
            >
              <div className="py-0.5 max-h-60 overflow-y-auto">
                {options.length === 0 ? (
                  <div className="px-3 py-2 text-xs text-slate-400 dark:text-slate-500 text-center">
                    No options available
                  </div>
                ) : (
                  options.map((opt) => {
                    const optValue = typeof opt === "string" ? opt : opt.value;
                    const optLabel = typeof opt === "string" ? opt : opt.label;
                    const isSelected = value === optValue;
                    
                    return (
                      <button
                        key={optValue}
                        type="button"
                        onClick={() => {
                          onChange(optValue);
                          setOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? "bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        }`}
                      >
                        <span className="truncate">{optLabel}</span>
                        {isSelected && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                      </button>
                    );
                  })
                )}
              </div>
            </PopoverContent>
          </Popover>
        );
      }}
    />
  );
};
