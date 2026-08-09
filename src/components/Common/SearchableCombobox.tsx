import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../components/ui/command";
import { Button } from "../../components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "../../lib/utils";
import { FormControl, FormItem } from "../../components/ui/form";
import { RequiredLabel } from "./RequiredLabel";

interface SearchableComboboxProps<T extends { [key: string]: any }> {
  label?: string;
  placeholder: string;
  options: T[];
  value: string;
  onChange: (value: string) => void;
  displayKey: keyof T;
  valueKey: keyof T;
  searchKeys: (keyof T)[];
  disabled?: boolean;
  isInvalid?: boolean;
  errorMessage?: string; // Prop opcional para personalizar el mensaje
  className?: string;
  renderOption?: (option: T) => React.ReactNode;
}

const SearchableCombobox = <T extends { [key: string]: any }>({
  label,
  placeholder,
  options,
  value,
  onChange,
  displayKey,
  valueKey,
  searchKeys,
  disabled,
  isInvalid,
  errorMessage,
  className,
  renderOption,
}: SearchableComboboxProps<T>) => {
  const [open, setOpen] = useState(false);

  const selectedOption = Array.isArray(options)
    ? options.find((option) => option[valueKey] === value)
    : undefined;

  const displayValue = selectedOption
    ? (selectedOption[displayKey] as string)
    : placeholder;

  // Evaluamos si el campo está en estado de error
  const hasError = isInvalid || (!value && isInvalid);
  // const finalErrorMessage = errorMessage || "Debe seleccionar un colaborador";

  return (
    <FormItem className="w-full">
      {label && (
        <RequiredLabel className="text-xs font-semibold text-gray-700">
          {label}
        </RequiredLabel>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              className={cn(
                "w-full justify-between cursor-pointer h-8 px-2.5 text-xs text-left font-normal",
                !value && "text-muted-foreground",
                hasError
                  ? "border-red-500 focus:ring-red-500 focus-visible:ring-red-500"
                  : "focus:ring-blue-500",
                "focus:ring-1 transition-all duration-200",
                className,
              )}
              disabled={disabled}
            >
              <span className="block truncate pr-2">{displayValue}</span>
              <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 opacity-50 self-center" />
            </Button>
          </FormControl>
        </PopoverTrigger>

        <PopoverContent
          className="w-(--radix-popover-trigger-width) min-w-[280px] p-0 bg-white"
          align="start"
        >
          <Command className="w-full">
            <CommandInput
              placeholder={`Buscar ${label ? label.toLowerCase() : ""}...`}
              className="h-8 px-2.5 text-xs border-b border-gray-200 focus:ring-0 w-full"
            />
            <CommandList className="max-h-[250px] overflow-y-auto w-full">
              <CommandEmpty className="py-4 text-center text-xs text-gray-500">
                No se encontraron resultados {label ? label.toLowerCase() : ""}
              </CommandEmpty>
              <CommandGroup className="p-1 w-full">
                {Array.isArray(options) &&
                  options.map((option) => {
                    const optionValue = String(option[valueKey]);

                    const searchValue = searchKeys
                      .map((key) => option[key])
                      .join(" ")
                      .toLowerCase();

                    return (
                      <CommandItem
                        key={optionValue}
                        value={String(searchValue)}
                        onSelect={() => {
                          onChange(optionValue);
                          setOpen(false);
                        }}
                        className={cn(
                          "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1 text-xs outline-none",
                          "hover:bg-blue-50 hover:text-blue-700",
                          value === option[valueKey] &&
                            "bg-blue-50 font-medium text-blue-700",
                        )}
                      >
                        <Check
                          className={cn(
                            "mr-1.5 h-3.5 w-3.5 shrink-0",
                            value === option[valueKey]
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        <div className="flex flex-col w-full whitespace-normal wrap-break-word">
                          {renderOption ? (
                            renderOption(option)
                          ) : (
                            <span className="block line-clamp-2">
                              {option[displayKey] as string}
                            </span>
                          )}
                        </div>
                      </CommandItem>
                    );
                  })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Muestra el mensaje de error si no hay valor seleccionado o si isInvalid es true */}
      {/* {hasError && (
        <p className="text-[11px] text-red-500 mt-1 font-medium">
          {finalErrorMessage}
        </p>
      )} */}
    </FormItem>
  );
};

export default SearchableCombobox;
