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
}: SearchableComboboxProps<T>) => {
  const [open, setOpen] = useState(false);

  const selectedOption = Array.isArray(options)
    ? options.find((option) => option[valueKey] === value)
    : undefined;

  const displayValue = selectedOption
    ? (selectedOption[displayKey] as string)
    : placeholder;

  return (
    <FormItem>
      {label && <RequiredLabel>{label}</RequiredLabel>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              className={cn(
                "w-full justify-between overflow-hidden text-ellipsis whitespace-nowrap cursor-pointe",
                !value && "text-muted-foreground",
                isInvalid
                  ? "border-red-500 focus:ring-red-500"
                  : "focus:ring-blue-500",
                "focus:ring-2 focus:ring-offset-2 transition-all duration-300"
              )}
              disabled={disabled}
            >
              {displayValue}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-[350px] p-0">
          <Command>
            <CommandInput
              placeholder={`Buscar ${label ? label.toLowerCase() : ""}...`}
            />
            <CommandList className="max-h-[300px] overflow-y-auto">
              <CommandEmpty>
                No se encontró {label ? label.toLowerCase() : ""}
              </CommandEmpty>
              <CommandGroup className="max-h-[300px] overflow-y-auto bg-gray-400">
                {Array.isArray(options) &&
                  options.map((option) => {
                    // Generar un valor de búsqueda que combine los campos especificados en `searchKeys`
                    const searchValue = searchKeys
                      .map((key) => option[key])
                      .join(" ")
                      .toLowerCase();

                    return (
                      <CommandItem
                        key={option[valueKey] as string}
                        value={searchValue}
                        onSelect={() => {
                          onChange(option[valueKey] as string);
                          setOpen(false);
                        }}
                        // onSelect={(currentValue) => {
                        //   const selectedItem = options.find(
                        //     (item) =>
                        //       (item[displayKey] as string).toLowerCase() ===
                        //       currentValue.toLowerCase()
                        //   );

                        //   const selectedItemValue = selectedItem?.[
                        //     valueKey
                        //   ] as string;

                        //   onChange(
                        //     selectedItemValue === value ? "" : selectedItemValue
                        //   );

                        //   setOpen(false);
                        // }}
                        className="
                          cursor-pointer
                          px-3
                          py-2
                          text-sm
                          transition-colors
                          duration-150
                          ease-in-out
                        hover:bg-gray-100"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === option[valueKey]
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {option[displayKey] as string}
                      </CommandItem>
                    );
                  })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </FormItem>
  );
};

export default SearchableCombobox;
